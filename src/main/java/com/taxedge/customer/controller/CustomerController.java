package com.taxedge.customer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.customer.dto.CustomerDto;
import com.taxedge.customer.service.CustomerService;



@RestController
@RequestMapping("/customer")
public class CustomerController {
	
	@Autowired
	private  CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<String> registerCustomer(@RequestBody CustomerDto customerDto) {
        String result = customerService.registerCustomer(customerDto);
        return new ResponseEntity<>(result,HttpStatus.CREATED);
}
}