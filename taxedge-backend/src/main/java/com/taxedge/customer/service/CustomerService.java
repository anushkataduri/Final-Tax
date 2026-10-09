package com.taxedge.customer.service;

import com.taxedge.customer.dto.CustomerDto;
import com.taxedge.customer.dto.LoginRequest;
import com.taxedge.customer.dto.UpdatePasswordDto;
import com.taxedge.customer.entity.Customer;
import com.taxedge.security.jwt.CustomerJwt;

public interface CustomerService {

    /** @param registrationProof the single-use proof from OTP verification; registration is refused without a valid one */
    CustomerJwt registerCustomer(CustomerDto customerDto, String registrationProof);
    CustomerJwt loginCustomer(LoginRequest loginRequest);
    String updatePassword(UpdatePasswordDto updatePasswordDto);
    boolean existsByMobileNumber(String mobileNumber);
    CustomerDto getDetails(String custId);
    String updateCustomer(CustomerDto customerDto);
}

