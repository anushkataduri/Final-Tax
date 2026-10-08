package com.taxedge.companyregistration.dto.request;

import com.taxedge.companyregistration.enums.CompanyRegistrationDocumentType;
import jakarta.validation.constraints.NotNull;

public record DocumentRequest(@NotNull CompanyRegistrationDocumentType documentType) {}