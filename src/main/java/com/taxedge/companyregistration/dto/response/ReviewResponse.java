package com.taxedge.companyregistration.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ReviewResponse(
        CompanyRegistrationResponse application,
        CompanyDetailsResponse companyDetails,
        RegisteredOfficeResponse registeredOffice,
        List<PersonResponse> persons,
        CapitalResponse capital,
        List<ShareholdingResponse> shareholdings,
        List<DocumentResponse> documents,
        LinkedRegistrationResponse linkedRegistrations,
        List<PaymentResponse> payments,
        List<TrackingResponse> tracking) {

    public record CompanyDetailsResponse(
            Long id,
            String industryCategory,
            String businessActivityDescription,
            String companyClass,
            String companyCategory,
            String companySubCategory,
            String primaryActivity,
            String nicCode,
            String secondaryActivity,
            String proposedName1,
            String proposedName2,
            String proposedName3,
            String nameSuffix,
            String nameAvailabilityStatus,
            String companyEmail,
            String companyMobile,
            BigDecimal authorizedCapital,
            BigDecimal paidUpCapital,
            Long numberOfShares,
            BigDecimal faceValuePerShare) {}

    public record RegisteredOfficeResponse(
            Long id,
            String addressLine,
            String city,
            String district,
            String state,
            String pincode,
            String premisesOwnership,
            String officeAddressProofName,
            String officeAddressProofUri,
            String ownershipDocName,
            String ownershipDocUri,
            String ownerNocName,
            String ownerNocUri) {}

    public record PersonResponse(
            Long id,
            String personType,
            String name,
            String pan,
            String aadhaar,
            LocalDate dob,
            String fatherName,
            String gender,
            String nationality,
            String placeOfBirth,
            String occupation,
            String educationalQualification,
            String designation,
            String category,
            String email,
            String phone,
            Boolean hasDin,
            String din,
            Boolean hasDsc,
            BigDecimal sharesPercentage,
            String residentialAddress,
            Boolean isResidentInIndia,
            String addressLine1,
            String addressLine2,
            String city,
            String district,
            String state,
            String pinCode,
            Boolean sameAsPermanentAddress,
            String presentAddressLine1,
            String presentAddressLine2,
            String presentCity,
            String presentDistrict,
            String presentState,
            String presentPincode,
            Long numberOfShares,
            BigDecimal amountSubscribed,
            BigDecimal contributionAmount,
            BigDecimal profitSharePercentage,
            BigDecimal capitalContribution,
            BigDecimal profitSharingRatio,
            String relationship,
            String identityProofDocName,
            String residentialAddressProofDocName) {}

    public record CapitalResponse(
            Long id,
            BigDecimal authorizedCapital,
            BigDecimal paidUpCapital,
            Long numberOfShares,
            BigDecimal faceValuePerShare) {}

    public record ShareholdingResponse(
            Long id,
            String person,
            Long numberOfShares,
            BigDecimal shareValue,
            BigDecimal percentage) {}

    public record LinkedRegistrationResponse(
            Boolean pan,
            Boolean tan,
            Boolean gst,
            Boolean esic,
            Boolean epfo,
            Boolean professionalTax,
            Boolean bankAccount) {}

    public record PaymentResponse(
            Long id,
            BigDecimal amount,
            BigDecimal governmentFee,
            BigDecimal professionalFee,
            BigDecimal totalAmount,
            String paymentStatus,
            String transactionId,
            String paymentGateway,
            String paymentMethod,
            LocalDateTime paidAt) {}
}