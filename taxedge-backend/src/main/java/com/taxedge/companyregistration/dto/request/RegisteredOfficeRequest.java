package com.taxedge.companyregistration.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisteredOfficeRequest(
		@NotBlank @Size(max = 255) String addressLine,
		@NotBlank @Size(max = 255) String city,
		@Size(max = 255) String district,
		@NotBlank @Size(max = 255) String state,
		@NotBlank @Pattern(regexp = "[1-9][0-9]{5}") String pincode,
		@Size(max = 255) String premisesOwnership,

		@Size(max = 255) String officeAddressProofName,
		@Size(max = 255) String officeAddressProofUri,

		@Size(max = 255) String ownershipDocName,
		@Size(max = 255) String ownershipDocUri,
		@Size(max = 255) String ownerNocName,
		@Size(max = 255) String ownerNocUri) {
	
		}