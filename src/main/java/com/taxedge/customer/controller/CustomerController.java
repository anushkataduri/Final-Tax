package com.taxedge.customer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.customer.dto.CustomerDto;
import com.taxedge.customer.dto.LoginRequest;
import com.taxedge.customer.dto.UpdatePasswordDto;
import com.taxedge.customer.service.CustomerService;
import com.taxedge.security.jwt.CustomerJwt;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/customer")
public class CustomerController {
	
	@Autowired
	private CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<CustomerJwt> registerCustomer(@RequestBody CustomerDto customerDto) {
        CustomerJwt customerJwt = customerService.registerCustomer(customerDto);
        return new ResponseEntity<>(customerJwt, HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<CustomerJwt> loginCustomer(@RequestBody LoginRequest loginRequest) {
        CustomerJwt customerJwt = customerService.loginCustomer(loginRequest);
        return new ResponseEntity<>(customerJwt, HttpStatus.OK);
    }
    
    @PatchMapping("/update_password")
    public ResponseEntity<String> updatePassword(@Valid @RequestBody UpdatePasswordDto updatePasswordDto) {

        String message = customerService.updatePassword(updatePasswordDto);

        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @GetMapping("/exists/{mobileNumber}")
    public ResponseEntity<java.util.Map<String, Object>> checkUserExists(@PathVariable String mobileNumber) {
        boolean exists = customerService.existsByMobileNumber(mobileNumber);
        return ResponseEntity.ok(java.util.Map.of("exists", exists, "mobileNumber", mobileNumber));
    }
}