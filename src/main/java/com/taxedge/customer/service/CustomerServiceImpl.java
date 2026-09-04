package com.taxedge.customer.service;

import java.time.LocalDateTime;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.taxedge.customer.dto.CustomerDto;
import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.helper.CustomerHelper;
import com.taxedge.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private  CustomerRepository customerRepository;

    @Override
    public String registerCustomer(CustomerDto customerDto) {
    	Customer customer = Customer.builder()
                .custId(CustomerHelper.generateCustomerId())
                .name(customerDto.getName())
                .email(customerDto.getEmail())
                .mobileNumber(customerDto.getMobileNumber())
                .aadhaar(customerDto.getAadhaar())
                .pan(customerDto.getPan())
                .dob(customerDto.getDob())
                .customerType(customerDto.getCustomerType())
                .address(customerDto.getAddress())
                .password(customerDto.getPassword())
                .createdAt(LocalDateTime.now())
                .build();
    	customerRepository.save(customer);
    	
        return "Registeration Successful";
    }
}
