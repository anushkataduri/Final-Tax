package com.taxedge.customer.service;

import java.time.LocalDateTime;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taxedge.customer.dto.CustomerDto;
import com.taxedge.customer.dto.LoginRequest;
import com.taxedge.customer.dto.UpdatePasswordDto;
import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.exception.DuplicateResourceException;
import com.taxedge.customer.exception.InvalidCredentialsException;
import com.taxedge.customer.helper.CustomerHelper;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.notification.service.FcmNotificationService;
import com.taxedge.security.jwt.CustomerJwt;
import com.taxedge.security.jwt.service.JwtService;
import com.taxedge.security.jwt.service.RefreshTokenService;

import jakarta.transaction.Transactional;

@Service
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	private FcmNotificationService fcmNotificationService;
	
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Override
    public CustomerJwt registerCustomer(CustomerDto customerDto) {

        validateUniqueFields(customerDto);

        Customer customer = Customer.builder()
                .custId(CustomerHelper.generateCustomerId())
                .name(customerDto.getName())
                .email(customerDto.getEmail())
                .mobileNumber(customerDto.getMobileNumber())
                .aadhaar(customerDto.getAadhaar())
                .pan(customerDto.getPan())
                .dob(customerDto.getDob())
                .gender(customerDto.getGender())
                .fatherSpouseName(customerDto.getFatherSpouseName())
                .customerType(customerDto.getCustomerType())
                .addressLine1(customerDto.getAddressLine1())
                .addressLine2(customerDto.getAddressLine2())
                .city(customerDto.getCity())
                .pincode(customerDto.getPincode())
                .state(customerDto.getState())
                .address(customerDto.getAddress())
                .password(passwordEncoder.encode(customerDto.getPassword()))
                .pushToken(customerDto.getPushToken())
                .createdAt(LocalDateTime.now())
                .build();

        Customer savedCustomer = customerRepository.save(customer);
        
        if (savedCustomer.getPushToken() != null && !savedCustomer.getPushToken().isBlank()) {
            fcmNotificationService.sendRegistrationSuccessNotification(
                    savedCustomer.getPushToken(),
                    savedCustomer.getName()
            );
        }

        String accessToken = jwtService.generateToken(
                savedCustomer.getCustId(),
                savedCustomer.getName(),
                savedCustomer.getMobileNumber()
        );

        String refreshToken = refreshTokenService.createRefreshToken(savedCustomer);

        return new CustomerJwt(
                accessToken,
                refreshToken,
                savedCustomer.getCustId(),
                savedCustomer.getName(),
                savedCustomer.getMobileNumber()
        );
    }

  
    private void validateUniqueFields(CustomerDto dto) {

        if (isPresent(dto.getAadhaar()) && customerRepository.existsByAadhaar(dto.getAadhaar())) {
            throw new DuplicateResourceException("aadhaar", "Aadhaar already registered");
        }

        if (isPresent(dto.getPan()) && customerRepository.existsByPan(dto.getPan())) {
            throw new DuplicateResourceException("pan", "PAN already registered");
        }
    }

    private boolean isPresent(String value) {
        return value != null && !value.isBlank();
    }


    @Override
    public CustomerJwt loginCustomer(LoginRequest loginRequest) {

        Customer customer = customerRepository.findByMobileNumber(loginRequest.getMobileNumber())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid mobile number or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), customer.getPassword())) {
            throw new InvalidCredentialsException("Invalid mobile number or password");
        }

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

    	Optional<Customer> optionalCustomer = customerRepository.findByMobileNumber(updatePasswordDto.getMobileNumber());

    	if (optionalCustomer.isEmpty()) {
    	    return "Customer not found";
    	}

    	Customer customer = optionalCustomer.get();
    	customer.setPassword(passwordEncoder.encode(updatePasswordDto.getPassword()));
    	customerRepository.save(customer);

    	return "Password updated successfully";
    }

    @Override
    public boolean existsByMobileNumber(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.trim().isEmpty()) {
            return false;
        }
        return customerRepository.findByMobileNumber(mobileNumber.trim()).isPresent();
    }
}