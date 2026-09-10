package com.taxedge.customer.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.taxedge.customer.enums.CustomerType;
import com.taxedge.customer.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {
    
    private String custId;
    private String name;
    private String email;
    private String mobileNumber;
    private String aadhaar;
    private String pan;
    private LocalDate dob;
    private Gender gender;
    private String fatherSpouseName;
    private CustomerType customerType;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String pincode;
    private String state;
    private String address;
    private String password;
    private LocalDateTime createdAt;
    private String pushToken;
}




