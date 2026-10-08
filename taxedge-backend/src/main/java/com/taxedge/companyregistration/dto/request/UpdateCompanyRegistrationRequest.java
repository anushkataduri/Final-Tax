package com.taxedge.companyregistration.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * Consolidated request used by PUT /api/v1/company-registrations/{id}.
 * All nested sections are optional; only the sections that are present will be updated.
 */
public record UpdateCompanyRegistrationRequest(
        @Size(max = 100) String companyType,

        @Size(max = 100) String constitutionType,

        @PositiveOrZero @Max(12) Integer currentStep,

        @Valid CompanyDetailsRequest companyDetails,

        @Valid RegisteredOfficeRequest registeredOffice,

        @Valid List<PersonRequest> persons,

        @Valid CapitalRequest capital,

        @Valid List<ShareholdingRequest> shareholdings,
        
        @Valid LinkedRegistrationRequest linkedRegistrations) {}
