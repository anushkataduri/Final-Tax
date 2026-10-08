package com.taxedge.itr.filing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItrFilingPostDto {

	@NotBlank(message = "Customer ID is required")
	private String customerId;

	@NotBlank(message = "Assessment year is required")
	private String assessmentYear;

	@NotBlank(message = "Residential status is required")
	private String residentialStatus;

	@NotBlank(message = "Filing type is required")
	private String filingType;

	@NotBlank(message = "Bank name is required")
	@Size(max = 100, message = "Bank name cannot exceed 100 characters")
	private String bankName;

	@NotBlank(message = "Account number is required")
	@Pattern(regexp = "^[0-9]{9,18}$", message = "Account number must contain 9 to 18 digits")
	private String accountNumber;

	@NotBlank(message = "IFSC code is required")
	@Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC code")
	private String ifscCode;
}