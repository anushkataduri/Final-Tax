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
public class RevisedItrDto {

	@NotBlank(message = "Customer ID is required")
	private String customerId;

	@NotBlank(message = "ITR acknowledgement number is required")
	@Size(max = 50, message = "ITR acknowledgement number cannot exceed 50 characters")
	private String itrAcknowledgementNumber;

	@NotBlank(message = "Assessment year is required")
	@Pattern(regexp = "^[0-9]{4}-[0-9]{2}$", message = "Assessment year must be in format YYYY-YY")
	private String assessmentYear;
}