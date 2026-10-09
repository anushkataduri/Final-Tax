package com.taxedge.customer.service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import com.taxedge.customer.config.LoginProperties;
import com.taxedge.customer.dto.CustomerDto;
import com.taxedge.customer.dto.LoginRequest;
import com.taxedge.customer.dto.UpdatePasswordDto;
import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.exception.AccountLockedException;
import com.taxedge.customer.exception.CustomerNotFoundException;
import com.taxedge.customer.exception.DuplicateResourceException;
import com.taxedge.customer.exception.InvalidCredentialsException;
import com.taxedge.customer.helper.CustomerHelper;
import com.taxedge.customer.mapper.CustomerMapper;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.messaging.service.EmailService;
import com.taxedge.notification.service.FcmNotificationService;
import com.taxedge.security.jwt.CustomerJwt;
import com.taxedge.security.jwt.service.JwtService;
import com.taxedge.security.jwt.service.RefreshTokenService;
import com.taxedge.security.otp.proof.RegistrationProofService;
import com.taxedge.shared.concurrency.KeyedLock;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerMapper customerMapper;
    private final FcmNotificationService fcmNotificationService;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;
    private final RegistrationProofService registrationProofService;
    private final LoginProperties loginProperties;
    private final Clock clock;
    private final KeyedLock keyedLock;
    private final TransactionTemplate transactionTemplate;

    @Override
    @Transactional
    public CustomerJwt registerCustomer(CustomerDto customerDto, String registrationProof) {

        // Spend the OTP-verification proof first, in this transaction: concurrent requests with the
        // same proof serialise on it and only one proceeds, and any later failure rolls it back.
        String verifiedMobile = customerDto.getMobileNumber() == null ? "" : customerDto.getMobileNumber().trim();
        registrationProofService.consumeForRegistration(verifiedMobile, registrationProof);

        validateUniqueFields(customerDto);

        Customer customer = customerMapper.toEntity(customerDto);
        customer.setCustId(CustomerHelper.generateCustomerId());
        customer.setPassword(passwordEncoder.encode(customerDto.getPassword()));
        customer.setCreatedAt(LocalDateTime.now());

        Customer savedCustomer = customerRepository.save(customer);
        log.info("Customer registered [{}]", savedCustomer.getCustId());

        String accessToken = jwtService.generateToken(
                savedCustomer.getCustId(),
                savedCustomer.getName(),
                savedCustomer.getMobileNumber()
        );

        String refreshToken = refreshTokenService.createRefreshToken(savedCustomer);

        // Nothing is announced until the row is actually committed.
        final String custId = savedCustomer.getCustId();
        final String name = savedCustomer.getName();
        final String email = savedCustomer.getEmail();
        final String pushToken = savedCustomer.getPushToken();

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {

                        if (pushToken != null && !pushToken.isBlank()) {
                            try {
                                fcmNotificationService
                                        .sendRegistrationSuccessNotification(pushToken, name);
                            } catch (Exception ex) {
                                log.warn("Registration push failed for [{}]", custId, ex);
                            }
                        }

                        if (email != null && !email.isBlank()) {
                            emailService.sendWelcomeEmail(email, name, custId);
                        }
                    }
                });

        return new CustomerJwt(
                accessToken,
                refreshToken,
                savedCustomer.getCustId(),
                savedCustomer.getName(),
                savedCustomer.getMobileNumber()
        );
    }

    private void validateUniqueFields(CustomerDto dto) {

        if (isPresent(dto.getMobileNumber()) && customerRepository.existsByMobileNumber(dto.getMobileNumber().trim())) {
            throw new DuplicateResourceException("mobileNumber", "Mobile number already registered");
        }

        if (isPresent(dto.getEmail()) && customerRepository.existsByEmail(dto.getEmail().trim())) {
            throw new DuplicateResourceException("email", "Email already registered");
        }

        if (isPresent(dto.getAadhaar()) && customerRepository.existsByAadhaar(dto.getAadhaar().trim())) {
            throw new DuplicateResourceException("aadhaar", "Aadhaar already registered");
        }

        if (isPresent(dto.getPan()) && customerRepository.existsByPan(dto.getPan().trim())) {
            throw new DuplicateResourceException("pan", "PAN already registered");
        }
    }

    private boolean isPresent(String value) {
        return value != null && !value.isBlank();
    }

    /**
     * Passcode login with a server-enforced lockout. The whole check-verify-record sequence runs
     * under a per-account lock and one transaction (row-locked in the database), so parallel
     * guesses cannot exceed the attempt limit. Failures are returned as outcomes and thrown only
     * after the transaction commits, otherwise the attempt counter would roll back with them.
     */
    @Override
    public CustomerJwt loginCustomer(LoginRequest loginRequest) {
        String mobileNumber = loginRequest.getMobileNumber() != null ? loginRequest.getMobileNumber().trim() : "";

        LoginAttempt attempt = keyedLock.withLock("login:" + mobileNumber, () -> {
            try {
                return transactionTemplate.execute(status -> attemptLogin(mobileNumber, loginRequest.getPassword()));
            } catch (DataIntegrityViolationException raced) {
                return transactionTemplate.execute(status -> attemptLogin(mobileNumber, loginRequest.getPassword()));
            }
        });

        if (attempt.jwt() != null) {
            return attempt.jwt();
        }
        if (attempt.lockedForSeconds() > 0) {
            throw new AccountLockedException(
                    "Too many incorrect passcode attempts. Please try again in "
                            + describeDuration(attempt.lockedForSeconds()) + ".",
                    attempt.lockedForSeconds());
        }
        throw new InvalidCredentialsException("Invalid mobile number or password", attempt.remainingAttempts());
    }

    private LoginAttempt attemptLogin(String mobileNumber, String password) {
        Customer customer = customerRepository.findByMobileNumberForUpdate(mobileNumber).orElse(null);
        if (customer == null) {
            return LoginAttempt.failed(null);
        }

        Instant now = clock.instant();
        releaseExpiredLoginLock(customer, now);

        // Refused even for the right passcode while locked; the refusal is not counted.
        if (customer.getLoginLockedUntil() != null && now.isBefore(customer.getLoginLockedUntil())) {
            return LoginAttempt.locked(secondsUntil(customer.getLoginLockedUntil(), now));
        }

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            int failed = zeroIfNull(customer.getFailedLoginAttempts()) + 1;
            customer.setFailedLoginAttempts(failed);
            customer.setLastFailedLoginAt(now);
            if (failed >= loginProperties.getMaxFailedAttempts()) {
                customer.setLoginLockedUntil(now.plus(loginProperties.getLockoutDuration()));
                customerRepository.save(customer);
                log.warn("Passcode login locked for customer [{}] until {}", customer.getCustId(), customer.getLoginLockedUntil());
                return LoginAttempt.locked(secondsUntil(customer.getLoginLockedUntil(), now));
            }
            customerRepository.save(customer);
            return LoginAttempt.failed(loginProperties.getMaxFailedAttempts() - failed);
        }

        customer.setFailedLoginAttempts(0);
        customer.setLastFailedLoginAt(null);
        customer.setLoginLockedUntil(null);
        customerRepository.save(customer);
        return LoginAttempt.success(issueTokens(customer));
    }

    /** Clears a finished lockout, and failures old enough to no longer count. */
    private void releaseExpiredLoginLock(Customer customer, Instant now) {
        boolean lockoutOver = customer.getLoginLockedUntil() != null && !now.isBefore(customer.getLoginLockedUntil());
        boolean staleFailures = customer.getLoginLockedUntil() == null
                && zeroIfNull(customer.getFailedLoginAttempts()) > 0
                && customer.getLastFailedLoginAt() != null
                && now.isAfter(customer.getLastFailedLoginAt().plus(loginProperties.getLockoutDuration()));
        if (lockoutOver || staleFailures) {
            customer.setLoginLockedUntil(null);
            customer.setFailedLoginAttempts(0);
            customer.setLastFailedLoginAt(null);
        }
    }

    private static long secondsUntil(Instant target, Instant now) {
        long millis = Duration.between(now, target).toMillis();
        return Math.max(1, (millis + 999) / 1000);
    }

    private static int zeroIfNull(Integer value) {
        return value == null ? 0 : value;
    }

    private static String describeDuration(long seconds) {
        if (seconds >= 60) {
            long minutes = (seconds + 59) / 60;
            return minutes + (minutes == 1 ? " minute" : " minutes");
        }
        return seconds + (seconds == 1 ? " second" : " seconds");
    }

    /** Result of one login attempt: tokens on success, otherwise a lockout or the attempts left. */
    private record LoginAttempt(CustomerJwt jwt, long lockedForSeconds, Integer remainingAttempts) {
        static LoginAttempt success(CustomerJwt jwt) {
            return new LoginAttempt(jwt, 0, null);
        }

        static LoginAttempt locked(long seconds) {
            return new LoginAttempt(null, seconds, 0);
        }

        static LoginAttempt failed(Integer remainingAttempts) {
            return new LoginAttempt(null, 0, remainingAttempts);
        }
    }

    private CustomerJwt issueTokens(Customer customer) {
        String accessToken = jwtService.generateToken(
                customer.getCustId(),
                customer.getName(),
                customer.getMobileNumber()
        );

        String refreshToken = refreshTokenService.createRefreshToken(customer);

        return new CustomerJwt(
                accessToken,
                refreshToken,
                customer.getCustId(),
                customer.getName(),
                customer.getMobileNumber()
        );
    }

    @Override
    @Transactional
    public String updatePassword(UpdatePasswordDto updatePasswordDto) {
        String mobileNumber = updatePasswordDto.getMobileNumber() != null
                ? updatePasswordDto.getMobileNumber().trim()
                : "";

        Customer customer = customerRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new InvalidCredentialsException("Customer not found"));

        if (updatePasswordDto.getPassword() == null || updatePasswordDto.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        customer.setPassword(passwordEncoder.encode(updatePasswordDto.getPassword()));
        customerRepository.save(customer);

        return "Password updated successfully";
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByMobileNumber(String mobileNumber) {
        return mobileNumber != null && customerRepository.existsByMobileNumber(mobileNumber.trim());
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDto getDetails(String custId) {
        Customer customer = (custId != null && !custId.isBlank())
                ? customerRepository.findById(custId.trim()).orElse(null)
                : null;

        if (customer == null && custId != null && !custId.isBlank()) {
            customer = customerRepository.findByMobileNumber(custId.trim()).orElse(null);
        }

        if (customer == null) {
            throw new CustomerNotFoundException("Customer not found with id or mobile: " + custId);
        }

        return customerMapper.toDto(customer);
    }

    @Override
    @Transactional
    public String updateCustomer(CustomerDto dto) {
        Customer customer = (dto.getCustId() != null && !dto.getCustId().isBlank())
                ? customerRepository.findById(dto.getCustId().trim()).orElse(null)
                : null;

        if (customer == null && dto.getMobileNumber() != null && !dto.getMobileNumber().isBlank()) {
            customer = customerRepository.findByMobileNumber(dto.getMobileNumber().trim()).orElse(null);
        }

        if (customer == null) {
            String identifier = (dto.getCustId() != null && !dto.getCustId().isBlank())
                    ? dto.getCustId().trim()
                    : (dto.getMobileNumber() != null ? dto.getMobileNumber().trim() : "unknown");
            throw new CustomerNotFoundException("Customer not found with id or mobile: " + identifier);
        }

        customerMapper.updateCustomerFromDto(dto, customer);

        customerRepository.save(customer);
        return "Updated Successfully";
    }

}