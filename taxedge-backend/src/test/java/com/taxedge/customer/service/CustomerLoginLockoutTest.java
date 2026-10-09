package com.taxedge.customer.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.SimpleTransactionStatus;
import org.springframework.transaction.support.TransactionTemplate;

import com.taxedge.customer.config.LoginProperties;
import com.taxedge.customer.dto.LoginRequest;
import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.exception.AccountLockedException;
import com.taxedge.customer.exception.InvalidCredentialsException;
import com.taxedge.customer.mapper.CustomerMapper;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.messaging.service.EmailService;
import com.taxedge.notification.service.FcmNotificationService;
import com.taxedge.security.jwt.CustomerJwt;
import com.taxedge.security.jwt.service.JwtService;
import com.taxedge.security.jwt.service.RefreshTokenService;
import com.taxedge.security.otp.proof.RegistrationProofService;
import com.taxedge.shared.concurrency.KeyedLock;

/** Server-side passcode lockout on {@code POST /customer/login}. */
class CustomerLoginLockoutTest {

    private static final String MOBILE = "9876543210";
    private static final String PASSCODE = "246810";
    private static final String WRONG = "111111";

    private final PasswordEncoder encoder = new BCryptPasswordEncoder(4);

    private MutableClock clock;
    private Customer customer;
    private CustomerRepository repository;
    private LoginProperties properties;
    private KeyedLock keyedLock;
    private TransactionTemplate transactionTemplate;
    private CustomerServiceImpl service;

    @BeforeEach
    void setUp() {
        clock = new MutableClock(Instant.parse("2026-01-01T10:00:00Z"));
        customer = Customer.builder()
                .custId("CUST-1")
                .name("Asha")
                .mobileNumber(MOBILE)
                .password(encoder.encode(PASSCODE))
                .build();

        repository = mock(CustomerRepository.class);
        when(repository.findByMobileNumberForUpdate(anyString())).thenAnswer(inv ->
                MOBILE.equals(inv.getArgument(0)) ? Optional.of(customer) : Optional.empty());
        when(repository.save(any(Customer.class))).thenAnswer(inv -> inv.getArgument(0));

        properties = new LoginProperties();
        keyedLock = new KeyedLock();

        PlatformTransactionManager txManager = mock(PlatformTransactionManager.class);
        when(txManager.getTransaction(any())).thenAnswer(inv -> new SimpleTransactionStatus());
        transactionTemplate = new TransactionTemplate(txManager);

        service = newService();
    }

    private CustomerServiceImpl newService() {
        JwtService jwtService = mock(JwtService.class);
        when(jwtService.generateToken(anyString(), anyString(), anyString())).thenReturn("access-token");
        RefreshTokenService refreshTokenService = mock(RefreshTokenService.class);
        when(refreshTokenService.createRefreshToken(any(Customer.class))).thenReturn("refresh-token");

        return new CustomerServiceImpl(
                mock(CustomerMapper.class),
                mock(FcmNotificationService.class),
                repository,
                encoder,
                jwtService,
                refreshTokenService,
                mock(EmailService.class),
                mock(RegistrationProofService.class),
                properties,
                clock,
                keyedLock,
                transactionTemplate);
    }

    // ---- BUG-LOGIN-003: lockout lasts the configured duration --------------------------------

    @Test
    void lockoutLastsFifteenMinutes_notThirtySeconds() {
        failAttempts(5);

        clock.advance(Duration.ofSeconds(31));
        AccountLockedException afterThirtySeconds = assertThrows(AccountLockedException.class, this::loginRight);
        assertEquals(Duration.ofMinutes(15).minusSeconds(31).toSeconds(), afterThirtySeconds.getRetryAfterSeconds());

        clock.advance(Duration.ofMinutes(15).minusSeconds(31).minusSeconds(1));
        assertThrows(AccountLockedException.class, this::loginRight);

        clock.advance(Duration.ofSeconds(1));
        assertNotNull(loginRight().getAccessToken());
    }

    @Test
    void fifthWrongPasscodeLocksTheAccount_earlierOnesReportAttemptsLeft() {
        for (int expectedLeft = 4; expectedLeft >= 1; expectedLeft--) {
            InvalidCredentialsException ex = assertThrows(InvalidCredentialsException.class, () -> login(WRONG));
            assertEquals(expectedLeft, ex.getRemainingAttempts());
        }

        AccountLockedException locked = assertThrows(AccountLockedException.class, () -> login(WRONG));

        assertEquals(Duration.ofMinutes(15).toSeconds(), locked.getRetryAfterSeconds());
        assertEquals(5, customer.getFailedLoginAttempts());
    }

    @Test
    void correctPasscodeIsRefusedWhileLocked() {
        failAttempts(5);

        assertThrows(AccountLockedException.class, this::loginRight);
    }

    @Test
    void refusalsWhileLockedDoNotExtendTheLockout() {
        failAttempts(5);
        Instant lockedUntil = customer.getLoginLockedUntil();

        clock.advance(Duration.ofMinutes(5));
        assertThrows(AccountLockedException.class, () -> login(WRONG));

        assertEquals(lockedUntil, customer.getLoginLockedUntil());
    }

    @Test
    void afterExpiryTheCounterStartsFresh() {
        failAttempts(5);
        clock.advance(Duration.ofMinutes(15));

        InvalidCredentialsException ex = assertThrows(InvalidCredentialsException.class, () -> login(WRONG));

        assertEquals(4, ex.getRemainingAttempts());
    }

    @Test
    void successfulLoginResetsTheCounter() {
        failAttempts(4);

        loginRight();

        assertEquals(0, customer.getFailedLoginAttempts());
        assertNull(customer.getLoginLockedUntil());
        InvalidCredentialsException ex = assertThrows(InvalidCredentialsException.class, () -> login(WRONG));
        assertEquals(4, ex.getRemainingAttempts());
    }

    @Test
    void lockoutSurvivesARestartOfTheService() {
        failAttempts(5);

        CustomerServiceImpl restarted = newService();

        assertThrows(AccountLockedException.class,
                () -> restarted.loginCustomer(request(PASSCODE)));
    }

    @Test
    void unknownNumberGetsAGenericFailureWithNoAttemptCount() {
        LoginRequest request = new LoginRequest();
        request.setMobileNumber("9000000000");
        request.setPassword(WRONG);

        InvalidCredentialsException ex = assertThrows(InvalidCredentialsException.class,
                () -> service.loginCustomer(request));

        assertNull(ex.getRemainingAttempts());
    }

    @Test
    void customersCreatedBeforeTheLockoutColumnsExistCanStillLogIn() {
        assertNull(customer.getFailedLoginAttempts());

        assertNotNull(loginRight().getAccessToken());
    }

    @Test
    void parallelWrongGuessesCannotExceedTheLimit() throws Exception {
        List<Object> outcomes = runInParallel(40, () -> {
            try {
                login(WRONG);
                return "success";
            } catch (InvalidCredentialsException e) {
                return "invalid";
            } catch (AccountLockedException e) {
                return "locked";
            }
        });

        assertEquals(4, outcomes.stream().filter("invalid"::equals).count(),
                "only four wrong guesses may be reported as plain failures before the lock");
        assertEquals(36, outcomes.stream().filter("locked"::equals).count());
        assertEquals(5, customer.getFailedLoginAttempts());
    }

    // ---- helpers -----------------------------------------------------------------------------

    private void failAttempts(int count) {
        for (int i = 0; i < count; i++) {
            try {
                login(WRONG);
            } catch (InvalidCredentialsException | AccountLockedException expected) {
                // counted by the service
            }
        }
    }

    private CustomerJwt loginRight() {
        return login(PASSCODE);
    }

    private CustomerJwt login(String passcode) {
        return service.loginCustomer(request(passcode));
    }

    private static LoginRequest request(String passcode) {
        LoginRequest request = new LoginRequest();
        request.setMobileNumber(MOBILE);
        request.setPassword(passcode);
        return request;
    }

    private static <T> List<T> runInParallel(int threads, Callable<T> task) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch ready = new CountDownLatch(threads);
        CountDownLatch go = new CountDownLatch(1);
        List<Future<T>> futures = new ArrayList<>();
        for (int i = 0; i < threads; i++) {
            futures.add(pool.submit(() -> {
                ready.countDown();
                go.await();
                return task.call();
            }));
        }
        ready.await();
        go.countDown();
        List<T> results = new ArrayList<>();
        for (Future<T> future : futures) {
            results.add(future.get());
        }
        pool.shutdownNow();
        return results;
    }

    private static final class MutableClock extends Clock {
        private volatile Instant now;

        MutableClock(Instant start) {
            this.now = start;
        }

        void advance(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return now;
        }
    }
}
