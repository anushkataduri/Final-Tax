package com.taxedge.loan.homeloan.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.loan.homeloan.dto.HomeLoanApplicationKycDto;
import com.taxedge.loan.homeloan.service.HomeLoanApplicationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeLoanApplicationServiceImpl
        implements HomeLoanApplicationService {

    private final CustomerRepository customerRepository;

    @Override
    @Transactional(readOnly = true)
    public HomeLoanApplicationKycDto getCustomerKycDetails(
            String customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Customer not found: " + customerId
                        )
                );

        return HomeLoanApplicationKycDto.builder()
                .customerId(customer.getCustId())
                .fullLegalName(customer.getName())
                .mobileNumber(customer.getMobileNumber())
                .emailAddress(customer.getEmail())
                .panNumber(customer.getPan())
                .aadhaarNumber(customer.getAadhaar())
                .dateOfBirth(customer.getDob())
                .houseFlatBuilding(customer.getAddressLine1())
                .streetLocalityLandmark(customer.getAddressLine2())
                .city(customer.getCity())
                .pinCode(customer.getPincode())
                .state(customer.getState())
                .build();
    }
}