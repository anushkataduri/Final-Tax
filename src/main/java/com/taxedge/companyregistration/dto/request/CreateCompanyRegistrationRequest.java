package com.taxedge.companyregistration.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * Consolidated request used by POST /api/v1/company-registrations.
 * <p>
 * Only {@code companyType} is required for a minimal create.
 * All nested sections (companyDetails, registeredOffice, persons, capital,
 * shareholdings, linkedRegistrations) are optional — when provided they are
 * persisted together with the new registration in a single request, eliminating
 * the need for separate section-update API calls after creation.
 * <p>
 * {@code applicationId} + {@code currentStep} retain backward-compatibility for
 * the existing "continue from draft" flow.
 */
public record CreateCompanyRegistrationRequest(
        @NotBlank @Size(max = 100) String companyType,
        @Size(max = 100) String constitutionType,
        @Positive Long applicationId,
        @PositiveOrZero @Max(12) Integer currentStep,
        @Valid CompanyDetailsRequest companyDetails,
        @Valid RegisteredOfficeRequest registeredOffice,
        @Valid List<PersonRequest> persons,
        @Valid CapitalRequest capital,
        @Valid List<ShareholdingRequest> shareholdings,
        @Valid LinkedRegistrationRequest linkedRegistrations) {}