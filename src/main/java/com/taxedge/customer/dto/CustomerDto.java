package com.taxedge.customer.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private String customerType;
    private String address;
    private String password;
    private LocalDateTime createdAt;
}




