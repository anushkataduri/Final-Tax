package com.taxedge.itr.reviseditr.dto;

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
public class RevisedItrDetailsDto {

	@NotBlank(message = "Revised ITR ID is required")
	private String revisedItrId;

	@NotBlank(message = "Salary/Business income is required")
	private String salaryBusinessIncome;

	@NotBlank(message = "Other income is required")
	private String otherIncome;

	@NotBlank(message = "80C deduction is required")
	private String deduction80C;

	@NotBlank(message = "80D deduction is required")
	private String deduction80D;

	@NotBlank(message = "Home loan interest is required")
	private String homeLoanInterest;

	@NotBlank(message = "Taxable income is required")
	private String taxableIncome;

	@NotBlank(message = "Bank account for refund is required")
	@Size(max = 18, message = "Bank account number cannot exceed 18 characters")
	private String bankAccountForRefund;

	@NotBlank(message = "IFSC code is required")
	@Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC code")
	private String ifscCode;
}