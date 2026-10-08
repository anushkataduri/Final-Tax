package com.taxedge.companyregistration.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public final class CompanyRegistrationDto {
    private CompanyRegistrationDto() {}

    public record CreateRequest(@NotBlank @Size(max = 100) String companyType) {}
    public record DraftRequest(
            @Size(max = 100) String id,
            @NotNull @Valid DraftCompanyRequest company,
            @Valid List<DraftPersonRequest> directors,
            @Valid DraftNomineeRequest opcNominee,
            @Valid List<DraftPersonRequest> partners,
            @Valid List<DraftDocumentRequest> documents,
            @Valid LinkedRegistrationsRequest linkedRegistrations,
            @Valid FeeBreakdownRequest feeBreakdown,
            @Valid List<TrackingStageRequest> trackingStages,
            @Valid DraftReceiptRequest receipt,
            @PositiveOrZero Integer currentStep,
            @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal totalFee,
            @Size(max = 255) String paymentStatus,
            @Size(max = 40) String status,
            String createdAt) {}

    public record DraftCompanyRequest(
            @NotBlank @Size(max = 100) String companyType,
            @Size(max = 255) String industryCategory,
            @Size(max = 1000) String businessActivityDescription,
            @Size(max = 255) String companyClass,
            @Size(max = 255) String companyCategory,
            @Size(max = 255) String companySubCategory,
            @NotBlank @Size(max = 255) String primaryActivity,
            @NotBlank @Pattern(regexp = "[0-9]{5}") String nicCode,
            @Size(max = 255) String secondaryActivity,
            @NotBlank @Size(max = 255) String proposedName1,
            @NotBlank @Size(max = 255) String proposedName2,
            @Size(max = 255) String proposedName3,
            @Size(max = 255) String nameSuffix,
            @Size(max = 255) String nameAvailabilityStatus,
            @NotBlank @Size(max = 255) String registeredAddressLine,
            @NotBlank @Size(max = 255) String registeredCity,
            @Size(max = 255) String registeredDistrict,
            @NotBlank @Size(max = 255) String registeredState,
            @NotBlank @Pattern(regexp = "[1-9][0-9]{5}") String registeredPincode,
            @Size(max = 255) String premisesOwnership,
            @NotBlank @Email @Size(max = 255) String companyEmail,
            @NotBlank @Pattern(regexp = "[6-9][0-9]{9}") String companyMobile,
            @Size(max = 255) String officeAddressProofName,
            @Size(max = 255) String officeAddressProofUri,
            @Size(max = 255) String ownershipDocName,
            @Size(max = 255) String ownershipDocUri,
            @Size(max = 255) String ownerNocName,
            @Size(max = 255) String ownerNocUri,
            @NotNull @Positive @Digits(integer = 17, fraction = 2) BigDecimal authorizedCapital,
            @NotNull @Positive @Digits(integer = 17, fraction = 2) BigDecimal paidUpCapital,
            @Positive Long numberOfShares,
            @Positive @Digits(integer = 17, fraction = 2) BigDecimal faceValuePerShare) {}

    public record DraftPersonRequest(
            @Size(max = 100) String id, @Size(max = 255) String personType,
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Pattern(regexp = "(?i)[A-Z]{5}[0-9]{4}[A-Z]") @Size(min = 10, max = 10) String pan,
            @Pattern(regexp = "(?:[0-9]{12})?") @Size(max = 12) String aadhaar, LocalDate dob,
            String fatherName, String gender, String nationality, String placeOfBirth,
            String occupation, String educationalQualification, String designation, String category,
            @NotBlank @Email @Size(max = 255) String email,
            @Pattern(regexp = "(?:[6-9][0-9]{9})?") @Size(max = 10) String phone,
            Boolean hasDin, @Pattern(regexp = "(?:[0-9]{8})?") @Size(max = 8) String din, Boolean hasDsc,
            @PositiveOrZero @Max(100) @Digits(integer = 3, fraction = 2) BigDecimal sharesPercentage,
            String residentialAddress, Boolean isResidentInIndia,
            String addressLine1, String addressLine2, String city, String district, String state,
            @Pattern(regexp = "(?:[1-9][0-9]{5})?") @Size(max = 6) String pinCode,
            Boolean sameAsPermanentAddress, String presentAddressLine1,
            String presentAddressLine2, String presentCity, String presentDistrict,
            String presentState,
            @Pattern(regexp = "(?:[1-9][0-9]{5})?") @Size(max = 6) String presentPincode,
            @PositiveOrZero Long numberOfShares,
            @PositiveOrZero BigDecimal amountSubscribed, @PositiveOrZero BigDecimal contributionAmount,
            @PositiveOrZero @Max(100) @Digits(integer = 3, fraction = 2) BigDecimal profitSharePercentage,
            @PositiveOrZero BigDecimal capitalContribution,
            @PositiveOrZero @Max(100) @Digits(integer = 3, fraction = 2) BigDecimal profitSharingRatio,
            String relationship,
            String identityProofDocName, String residentialAddressProofDocName) {}

    public record DraftNomineeRequest(
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Pattern(regexp = "(?i)[A-Z]{5}[0-9]{4}[A-Z]") @Size(min = 10, max = 10) String pan,
            @Pattern(regexp = "(?:[0-9]{12})?") @Size(max = 12) String aadhaar,
            @NotBlank @Email @Size(max = 255) String email,
            @Pattern(regexp = "(?:[6-9][0-9]{9})?") @Size(max = 10) String phone,
            @Size(max = 255) String relationship) {}
    public record DraftDocumentRequest(
            @NotBlank @Size(max = 40) String id,
            @Size(max = 255) String name,
            @Size(max = 255) String category,
            boolean required,
            @Size(max = 255) String status,
            @Size(max = 2000) String fileUri,
            @Size(max = 255) String fileName,
            @Size(max = 50) String custId) {}
    public record FeeBreakdownRequest(
            @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal professionalFee,
            @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal gstAmount,
            @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal statutoryCharges,
            @NotNull @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal totalAmount) {}
    public record TrackingStageRequest(
            @Size(max = 100) String id,
            @NotBlank @Size(max = 255) String title,
            @Size(max = 1000) String description,
            @NotBlank @Size(max = 255) String status,
            String updatedAt) {}
    public record DraftReceiptRequest(String applicationId, String companyName, String companyType, String appliedDate, BigDecimal totalAmount, String paymentStatus, String paymentMethod, String transactionId) {}

    public record DetailsRequest(
            String industryCategory, String businessActivityDescription,
            String companyClass, String companyCategory, String companySubCategory,
            @NotBlank String primaryActivity,
            @NotBlank @Pattern(regexp = "[0-9]{5}") String nicCode,
            String secondaryActivity,
            @NotBlank String proposedName1, @NotBlank String proposedName2, String proposedName3,
            String nameSuffix, String nameAvailabilityStatus,
            @Email String companyEmail, @Pattern(regexp = "(?:[6-9][0-9]{9})?") String companyMobile) {}
    public record OfficeRequest(
            @NotBlank String addressLine, @NotBlank String city, String district,
            @NotBlank String state, @NotBlank @Pattern(regexp = "[1-9][0-9]{5}") String pincode,
            String premisesOwnership) {}
    public record PersonRequest(
            String id, @NotBlank String personType, @NotBlank String name,
            @NotBlank @Pattern(regexp = "(?i)[A-Z]{5}[0-9]{4}[A-Z]") String pan,
            @Pattern(regexp = "(?:[0-9]{12})?") String aadhaar, LocalDate dob,
            String fatherName, String gender, String nationality, String placeOfBirth,
            String occupation, String educationalQualification, String designation, String category,
            @NotBlank @Email String email,
            @Pattern(regexp = "(?:[6-9][0-9]{9})?") String phone,
            Boolean hasDin, @Pattern(regexp = "(?:[0-9]{8})?") String din, Boolean hasDsc,
            @PositiveOrZero @Max(100) BigDecimal sharesPercentage,
            String residentialAddress, Boolean isResidentInIndia,
            String addressLine1, String addressLine2, String city, String district, String state,
            String pinCode, Boolean sameAsPermanentAddress, String presentAddressLine1,
            String presentAddressLine2, String presentCity, String presentDistrict,
            String presentState, String presentPincode, Long numberOfShares,
            BigDecimal amountSubscribed, BigDecimal contributionAmount,
            BigDecimal profitSharePercentage, BigDecimal capitalContribution,
            BigDecimal profitSharingRatio, String relationship,
            String identityProofDocName, String residentialAddressProofDocName) {}
    public record CapitalRequest(
            @NotNull @Positive @Digits(integer = 17, fraction = 2) BigDecimal authorizedCapital,
            @NotNull @Positive @Digits(integer = 17, fraction = 2) BigDecimal paidUpCapital,
            @Positive Long numberOfShares,
            @Positive @Digits(integer = 17, fraction = 2) BigDecimal faceValuePerShare) {}
    public record ShareholdingRequest(
            String person, @PositiveOrZero Long numberOfShares,
            @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal shareValue,
            @PositiveOrZero @Max(100) @Digits(integer = 4, fraction = 3) BigDecimal percentage) {}
    public record LinkedRegistrationsRequest(boolean pan, boolean tan, boolean gst, boolean esic, boolean epfo, boolean professionalTax, boolean bankAccount) {}
    public record PaymentRequest(
            @NotNull @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal amount,
            @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal governmentFee,
            @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal professionalFee,
            @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal totalAmount,
            String paymentStatus, String transactionId, String paymentGateway, String paymentMethod) {}
        public record ApplicationSummary(Long id, String applicationNumber, String companyType, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {}
    public record SubmissionResponse(Long applicationId, String applicationNumber, String status, LocalDateTime submittedAt) {}
        public record DocumentResponse(Long id, String custId, String documentType, String name, String category, boolean required, String fileName, String fileUri, Long fileSize, String mimeType, String status, LocalDateTime uploadedAt, LocalDateTime verifiedAt, String remarks) {}
    public record ApplicationResponse(
            ApplicationSummary application, Map<String, Object> companyDetails,
            Map<String, Object> registeredOffice, List<Map<String, Object>> persons,
            Map<String, Object> capital, List<Map<String, Object>> shareholdings,
            List<DocumentResponse> documents, Map<String, Object> linkedRegistrations,
            List<Map<String, Object>> payments, List<Map<String, Object>> tracking) {}
}
