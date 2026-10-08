package com.taxedge.companyregistration.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CompanyDetailsRequest(

         @Size(max = 255) String industryCategory,

         @Size(max = 1000) String businessActivityDescription,

         @Size(max = 255) String companyClass,

         @Size(max = 255) String companyCategory, @Size(max = 255) String companySubCategory,

        @NotBlank @Size(max = 255) String primaryActivity,
        @NotBlank @Pattern(regexp = "[0-9]{5}") String nicCode,
        @Size(max = 255) String secondaryActivity,

        @NotBlank @Size(max = 255) String proposedName1,
        @NotBlank @Size(max = 255) String proposedName2,
        @Size(max = 255) String proposedName3,

        @Size(max = 255) String nameSuffix,
        @Size(max = 255) String nameAvailabilityStatus,

        @Email @Size(max = 255) String companyEmail,
        @Pattern(regexp = "(?:[6-9][0-9]{9})?") @Size(max = 10) String companyMobile) {}