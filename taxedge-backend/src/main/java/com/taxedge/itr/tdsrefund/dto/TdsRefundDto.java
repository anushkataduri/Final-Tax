package com.taxedge.itr.tdsrefund.dto;

import java.time.LocalDateTime;

import com.taxedge.itr.tdsrefund.enums.AccountType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TdsRefundDto {

    private String id;



    @NotBlank(message = "Legal name of business is required")
    @Size(max = 100, message = "Legal name cannot exceed 100 characters")
    private String legalBusinessName;

    @NotBlank(message = "Business PAN is required")
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]$",
             message = "PAN must be in the format ABCDE1234F")
    private String businessPan;

    private byte[] businessPanDocument;

    @NotBlank(message = "Aadhaar number is required")
    @Pattern(regexp = "^[2-9][0-9]{11}$",
             message = "Aadhaar must be 12 digits and cannot start with 0 or 1")
    private String aadhaarNumber;

    private byte[] aadhaarDocument;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9][0-9]{9}$",
             message = "Enter a valid 10-digit Indian mobile number")
    private String mobileNumber;

   

    @NotBlank(message = "Account holder name is required")
    @Size(max = 100, message = "Account holder name cannot exceed 100 characters")
    private String accountHolderName;

    @NotBlank(message = "Account number is required")
    @Pattern(regexp = "^[0-9]{9,18}$", message = "Account number must be 9 to 18 digits")
    private String accountNumber;

    @NotBlank(message = "IFSC code is required")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$",message = "Enter a valid 11-character IFSC code, e.g. SBIN0001234")
    private String ifscCode;

    @Size(max = 100, message = "Bank name cannot exceed 100 characters")
    private String bankName;

    @Size(max = 100, message = "Branch name cannot exceed 100 characters")
    private String branchName;

    @NotNull(message = "Account type is required")
    private AccountType accountType;

  

    private LocalDateTime createdAt;
}