package com.taxedge.companyregistration.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PersonRequest(
                @Positive Long id,
                @NotBlank @Size(max = 255) String personType,
                @NotBlank @Size(max = 255) String name,
                @NotBlank @Pattern(regexp = "(?i)[A-Z]{5}[0-9]{4}[A-Z]") @Size(min = 10, max = 10) String pan,
                @Pattern(regexp = "(?:[0-9]{12})?") @Size(max = 12) String aadhaar,
                LocalDate dob,
                String fatherName,
                String gender,
                String nationality,
                String placeOfBirth,
                String occupation,
                String educationalQualification,
                String designation, String category,

                @NotBlank @Email @Size(max = 255) String email,
                @Pattern(regexp = "(?:[6-9][0-9]{9})?") @Size(max = 10) String phone,
                Boolean hasDin,
                @Pattern(regexp = "(?:[0-9]{8})?") @Size(max = 8) String din,
                Boolean hasDsc,
                @PositiveOrZero @Max(100) @Digits(integer = 3, fraction = 2) BigDecimal sharesPercentage,
                String residentialAddress,
                Boolean isResidentInIndia,
                String addressLine1,
                String addressLine2,
                String city,
                String district,
                String state,
                @Pattern(regexp = "(?:[1-9][0-9]{5})?") @Size(max = 6) String pinCode,
                Boolean sameAsPermanentAddress,
                String presentAddressLine1,
                String presentAddressLine2,
                String presentCity,
                String presentDistrict,
                String presentState,
                @Pattern(regexp = "(?:[1-9][0-9]{5})?") @Size(max = 6) String presentPincode,
                @PositiveOrZero Long numberOfShares,
                @PositiveOrZero BigDecimal amountSubscribed,
                @PositiveOrZero BigDecimal contributionAmount,
                @PositiveOrZero @Max(100) @Digits(integer = 3, fraction = 2) BigDecimal profitSharePercentage,
                @PositiveOrZero BigDecimal capitalContribution,
                @PositiveOrZero @Max(100) @Digits(integer = 3, fraction = 2) BigDecimal profitSharingRatio,
                String relationship,
                String identityProofDocName,
                String residentialAddressProofDocName) {
}