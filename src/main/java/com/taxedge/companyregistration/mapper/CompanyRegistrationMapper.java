package com.taxedge.companyregistration.mapper;

import com.taxedge.companyregistration.dto.CompanyRegistrationDto;
import com.taxedge.companyregistration.dto.request.CapitalRequest;
import com.taxedge.companyregistration.dto.request.CompanyDetailsRequest;
import com.taxedge.companyregistration.dto.request.LinkedRegistrationRequest;
import com.taxedge.companyregistration.dto.request.PaymentRequest;
import com.taxedge.companyregistration.dto.request.PersonRequest;
import com.taxedge.companyregistration.dto.request.RegisteredOfficeRequest;
import com.taxedge.companyregistration.dto.request.ShareholdingRequest;
import com.taxedge.companyregistration.dto.response.CompanyRegistrationResponse;
import com.taxedge.companyregistration.dto.response.DocumentResponse;
import com.taxedge.companyregistration.dto.response.ReceiptResponse;
import com.taxedge.companyregistration.dto.response.ReviewResponse;
import com.taxedge.companyregistration.dto.response.SubmissionResponse;
import com.taxedge.companyregistration.dto.response.TrackingResponse;
import com.taxedge.companyregistration.entity.CompanyCapital;
import com.taxedge.companyregistration.entity.CompanyDetails;
import com.taxedge.companyregistration.entity.CompanyLinkedRegistration;
import com.taxedge.companyregistration.entity.CompanyPerson;
import com.taxedge.companyregistration.entity.CompanyRegisteredOffice;
import com.taxedge.companyregistration.entity.CompanyRegistration;
import com.taxedge.companyregistration.entity.CompanyRegistrationDocument;
import com.taxedge.companyregistration.entity.CompanyRegistrationPayment;
import com.taxedge.companyregistration.entity.CompanyRegistrationTracking;
import com.taxedge.companyregistration.entity.CompanyShareholding;
import com.taxedge.companyregistration.enums.CompanyRegistrationDocumentType;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class CompanyRegistrationMapper {

    public CompanyRegistration registration(String userId, String companyType, String constitutionType, String status) {
        CompanyRegistration registration = new CompanyRegistration();
        registration.setUserId(userId);
        registration.setCompanyType(companyType);
        registration.setConstitutionType(constitutionType);
        registration.setStatus(status);
        registration.setApplicationNumber("PENDING");
        return registration;
    }

    public CompanyRegistration updateRegistration(CompanyRegistration registration, String companyType, String constitutionType) {
        registration.setCompanyType(companyType);
        registration.setConstitutionType(constitutionType);
        return registration;
    }

    public CompanyDetails draftDetails(CompanyRegistration registration, CompanyRegistrationDto.DraftCompanyRequest source) {
        CompanyDetails details = new CompanyDetails();
        details.setRegistration(registration);
        details.setIndustryCategory(source.industryCategory());
        details.setBusinessActivityDescription(source.businessActivityDescription());
        details.setCompanyClass(source.companyClass());
        details.setCompanyCategory(source.companyCategory());
        details.setCompanySubCategory(source.companySubCategory());
        details.setPrimaryActivity(source.primaryActivity());
        details.setNicCode(source.nicCode());
        details.setSecondaryActivity(source.secondaryActivity());
        details.setProposedName1(source.proposedName1());
        details.setProposedName2(source.proposedName2());
        details.setProposedName3(source.proposedName3());
        details.setNameSuffix(source.nameSuffix());
        details.setNameAvailabilityStatus(source.nameAvailabilityStatus());
        details.setCompanyEmail(source.companyEmail());
        details.setCompanyMobile(source.companyMobile());
        details.setAuthorizedCapital(source.authorizedCapital());
        details.setPaidUpCapital(source.paidUpCapital());
        details.setNumberOfShares(source.numberOfShares());
        details.setFaceValuePerShare(source.faceValuePerShare());
        return details;
    }

    public CompanyDetails details(CompanyRegistration registration, CompanyDetailsRequest source, CompanyDetails target) {
        CompanyDetails details = target == null ? new CompanyDetails() : target;
        details.setRegistration(registration);
        details.setIndustryCategory(source.industryCategory());
        details.setBusinessActivityDescription(source.businessActivityDescription());
        details.setCompanyClass(source.companyClass());
        details.setCompanyCategory(source.companyCategory());
        details.setCompanySubCategory(source.companySubCategory());
        details.setPrimaryActivity(source.primaryActivity());
        details.setNicCode(source.nicCode());
        details.setSecondaryActivity(source.secondaryActivity());
        details.setProposedName1(source.proposedName1());
        details.setProposedName2(source.proposedName2());
        details.setProposedName3(source.proposedName3());
        details.setNameSuffix(source.nameSuffix());
        details.setNameAvailabilityStatus(source.nameAvailabilityStatus());
        details.setCompanyEmail(source.companyEmail());
        details.setCompanyMobile(source.companyMobile());
        return details;
    }

    public CompanyRegisteredOffice draftOffice(CompanyRegistration registration, CompanyRegistrationDto.DraftCompanyRequest source) {
        CompanyRegisteredOffice office = new CompanyRegisteredOffice();
        office.setRegistration(registration);
        office.setAddressLine(source.registeredAddressLine());
        office.setCity(source.registeredCity());
        office.setDistrict(source.registeredDistrict());
        office.setState(source.registeredState());
        office.setPincode(source.registeredPincode());
        office.setPremisesOwnership(source.premisesOwnership());
        office.setOfficeAddressProofName(source.officeAddressProofName());
        office.setOfficeAddressProofUri(source.officeAddressProofUri());
        office.setOwnershipDocName(source.ownershipDocName());
        office.setOwnershipDocUri(source.ownershipDocUri());
        office.setOwnerNocName(source.ownerNocName());
        office.setOwnerNocUri(source.ownerNocUri());
        return office;
    }

    public CompanyRegisteredOffice office(CompanyRegistration registration, RegisteredOfficeRequest source, CompanyRegisteredOffice target) {
        CompanyRegisteredOffice office = target == null ? new CompanyRegisteredOffice() : target;
        office.setRegistration(registration);
        office.setAddressLine(source.addressLine());
        office.setCity(source.city());
        office.setDistrict(source.district());
        office.setState(source.state());
        office.setPincode(source.pincode());
        office.setPremisesOwnership(source.premisesOwnership());
        office.setOfficeAddressProofName(source.officeAddressProofName());
        office.setOfficeAddressProofUri(source.officeAddressProofUri());
        office.setOwnershipDocName(source.ownershipDocName());
        office.setOwnershipDocUri(source.ownershipDocUri());
        office.setOwnerNocName(source.ownerNocName());
        office.setOwnerNocUri(source.ownerNocUri());
        return office;
    }

    public CompanyPerson draftPerson(CompanyRegistration registration, CompanyRegistrationDto.DraftPersonRequest source, String defaultType) {
        CompanyPerson person = new CompanyPerson();
        person.setRegistration(registration);
        person.setPersonType(StringUtils.hasText(source.personType()) ? source.personType() : defaultType);
        person.setName(source.name());
        person.setPan(source.pan());
        person.setAadhaar(source.aadhaar());
        person.setDob(source.dob());
        person.setFatherName(source.fatherName());
        person.setGender(source.gender());
        person.setNationality(source.nationality());
        person.setPlaceOfBirth(source.placeOfBirth());
        person.setOccupation(source.occupation());
        person.setEducationalQualification(source.educationalQualification());
        person.setDesignation(source.designation());
        person.setCategory(source.category());
        person.setEmail(source.email());
        person.setPhone(source.phone());
        person.setHasDin(source.hasDin());
        person.setDin(source.din());
        person.setHasDsc(source.hasDsc());
        person.setSharesPercentage(source.sharesPercentage());
        person.setResidentialAddress(source.residentialAddress());
        person.setIsResidentInIndia(source.isResidentInIndia());
        person.setAddressLine1(source.addressLine1());
        person.setAddressLine2(source.addressLine2());
        person.setCity(source.city());
        person.setDistrict(source.district());
        person.setState(source.state());
        person.setPinCode(source.pinCode());
        person.setSameAsPermanentAddress(source.sameAsPermanentAddress());
        person.setPresentAddressLine1(source.presentAddressLine1());
        person.setPresentAddressLine2(source.presentAddressLine2());
        person.setPresentCity(source.presentCity());
        person.setPresentDistrict(source.presentDistrict());
        person.setPresentState(source.presentState());
        person.setPresentPincode(source.presentPincode());
        person.setNumberOfShares(source.numberOfShares());
        person.setAmountSubscribed(source.amountSubscribed());
        person.setContributionAmount(source.contributionAmount());
        person.setProfitSharePercentage(source.profitSharePercentage());
        person.setCapitalContribution(source.capitalContribution());
        person.setProfitSharingRatio(source.profitSharingRatio());
        person.setRelationship(source.relationship());
        person.setIdentityProofDocName(source.identityProofDocName());
        person.setResidentialAddressProofDocName(source.residentialAddressProofDocName());
        return person;
    }

    public CompanyPerson person(CompanyRegistration registration, PersonRequest source, CompanyPerson target) {
        CompanyPerson person = target == null ? new CompanyPerson() : target;
        person.setRegistration(registration);
        person.setPersonType(source.personType());
        person.setName(source.name());
        person.setPan(source.pan());
        person.setAadhaar(source.aadhaar());
        person.setDob(source.dob());
        person.setFatherName(source.fatherName());
        person.setGender(source.gender());
        person.setNationality(source.nationality());
        person.setPlaceOfBirth(source.placeOfBirth());
        person.setOccupation(source.occupation());
        person.setEducationalQualification(source.educationalQualification());
        person.setDesignation(source.designation());
        person.setCategory(source.category());
        person.setEmail(source.email());
        person.setPhone(source.phone());
        person.setHasDin(source.hasDin());
        person.setDin(source.din());
        person.setHasDsc(source.hasDsc());
        person.setSharesPercentage(source.sharesPercentage());
        person.setResidentialAddress(source.residentialAddress());
        person.setIsResidentInIndia(source.isResidentInIndia());
        person.setAddressLine1(source.addressLine1());
        person.setAddressLine2(source.addressLine2());
        person.setCity(source.city());
        person.setDistrict(source.district());
        person.setState(source.state());
        person.setPinCode(source.pinCode());
        person.setSameAsPermanentAddress(source.sameAsPermanentAddress());
        person.setPresentAddressLine1(source.presentAddressLine1());
        person.setPresentAddressLine2(source.presentAddressLine2());
        person.setPresentCity(source.presentCity());
        person.setPresentDistrict(source.presentDistrict());
        person.setPresentState(source.presentState());
        person.setPresentPincode(source.presentPincode());
        person.setNumberOfShares(source.numberOfShares());
        person.setAmountSubscribed(source.amountSubscribed());
        person.setContributionAmount(source.contributionAmount());
        person.setProfitSharePercentage(source.profitSharePercentage());
        person.setCapitalContribution(source.capitalContribution());
        person.setProfitSharingRatio(source.profitSharingRatio());
        person.setRelationship(source.relationship());
        person.setIdentityProofDocName(source.identityProofDocName());
        person.setResidentialAddressProofDocName(source.residentialAddressProofDocName());
        return person;
    }

    public CompanyPerson nominee(CompanyRegistration registration, CompanyRegistrationDto.DraftNomineeRequest source) {
        CompanyPerson person = new CompanyPerson();
        person.setRegistration(registration);
        person.setPersonType("NOMINEE");
        person.setName(source.name());
        person.setPan(source.pan());
        person.setAadhaar(source.aadhaar());
        person.setEmail(source.email());
        person.setPhone(source.phone());
        person.setRelationship(source.relationship());
        return person;
    }

    public CompanyCapital draftCapital(CompanyRegistration registration, CompanyRegistrationDto.DraftCompanyRequest source) {
        CompanyCapital capital = new CompanyCapital();
        capital.setRegistration(registration);
        capital.setAuthorizedCapital(source.authorizedCapital());
        capital.setPaidUpCapital(source.paidUpCapital());
        capital.setNumberOfShares(source.numberOfShares());
        capital.setFaceValuePerShare(source.faceValuePerShare());
        return capital;
    }

    public CompanyCapital capital(CompanyRegistration registration, CapitalRequest source, CompanyCapital target) {
        CompanyCapital capital = target == null ? new CompanyCapital() : target;
        capital.setRegistration(registration);
        capital.setAuthorizedCapital(source.authorizedCapital());
        capital.setPaidUpCapital(source.paidUpCapital());
        capital.setNumberOfShares(source.numberOfShares());
        capital.setFaceValuePerShare(source.faceValuePerShare());
        return capital;
    }

    public CompanyDetails updateCapitalDetails(CompanyDetails details, CapitalRequest source) {
        details.setAuthorizedCapital(source.authorizedCapital());
        details.setPaidUpCapital(source.paidUpCapital());
        details.setNumberOfShares(source.numberOfShares());
        details.setFaceValuePerShare(source.faceValuePerShare());
        return details;
    }

    public CompanyShareholding shareholding(CompanyRegistration registration, CompanyPerson person) {
        CompanyShareholding shareholding = new CompanyShareholding();
        shareholding.setRegistration(registration);
        shareholding.setPerson(person.getName());
        shareholding.setNumberOfShares(person.getNumberOfShares());
        shareholding.setShareValue(person.getAmountSubscribed());
        shareholding.setPercentage(person.getSharesPercentage());
        return shareholding;
    }

    public CompanyShareholding shareholding(CompanyRegistration registration, ShareholdingRequest source, CompanyShareholding target) {
        CompanyShareholding shareholding = target == null ? new CompanyShareholding() : target;
        shareholding.setRegistration(registration);
        shareholding.setPerson(source.person());
        shareholding.setNumberOfShares(source.numberOfShares());
        shareholding.setShareValue(source.shareValue());
        shareholding.setPercentage(source.percentage());
        return shareholding;
    }

    public CompanyLinkedRegistration draftLinked(CompanyRegistration registration, CompanyRegistrationDto.LinkedRegistrationsRequest source) {
        CompanyLinkedRegistration linked = new CompanyLinkedRegistration();
        linked.setRegistration(registration);
        linked.setPan(source.pan());
        linked.setTan(source.tan());
        linked.setGst(source.gst());
        linked.setEsic(source.esic());
        linked.setEpfo(source.epfo());
        linked.setProfessionalTax(source.professionalTax());
        linked.setBankAccount(source.bankAccount());
        return linked;
    }

    public CompanyLinkedRegistration linked(CompanyRegistration registration, LinkedRegistrationRequest source, CompanyLinkedRegistration target) {
        CompanyLinkedRegistration linked = target == null ? new CompanyLinkedRegistration() : target;
        linked.setRegistration(registration);
        linked.setPan(source.pan());
        linked.setTan(source.tan());
        linked.setGst(source.gst());
        linked.setEsic(source.esic());
        linked.setEpfo(source.epfo());
        linked.setProfessionalTax(source.professionalTax());
        linked.setBankAccount(source.bankAccount());
        return linked;
    }

    public CompanyRegistrationDocument draftDocument(CompanyRegistration registration, CompanyRegistrationDto.DraftDocumentRequest source, CompanyRegistrationDocumentType type) {
        CompanyRegistrationDocument document = new CompanyRegistrationDocument();
        document.setRegistration(registration);
        document.setCustId(registration.getUserId());
        document.setDocumentType(type);
        document.setName(source.name());
        document.setCategory(source.category());
        document.setRequired(source.required());
        document.setFileName(StringUtils.hasText(source.fileName()) ? source.fileName() : source.id());
        document.setFileUri(null);
        document.setStatus("PENDING");
        document.setUploadedAt(LocalDateTime.now());
        return document;
    }

    public CompanyRegistrationDocument uploadedDocument(CompanyRegistration registration, CompanyRegistrationDocument target,
            CompanyRegistrationDocumentType type, MultipartFile file, String fileUri) {
        CompanyRegistrationDocument document = target == null ? new CompanyRegistrationDocument() : target;
        document.setRegistration(registration);
        document.setCustId(registration.getUserId());
        document.setDocumentType(type);
        document.setName(type.name());
        document.setCategory("Company Registration");
        document.setRequired(true);
        document.setFileName(StringUtils.hasText(file.getOriginalFilename()) ? file.getOriginalFilename() : "upload");
        document.setFileUri(fileUri);
        document.setFileData(null);
        document.setFileSize(file.getSize());
        document.setMimeType(file.getContentType());
        document.setStatus("UPLOADED");
        document.setUploadedAt(LocalDateTime.now());
        return document;
    }

    public CompanyRegistrationPayment draftPayment(CompanyRegistration registration, CompanyRegistrationDto.DraftRequest request,
            CompanyRegistrationDto.FeeBreakdownRequest fee) {
        CompanyRegistrationPayment payment = new CompanyRegistrationPayment();
        payment.setRegistration(registration);
        payment.setAmount(fee.totalAmount());
        payment.setProfessionalFee(fee.professionalFee());
        payment.setGovernmentFee(fee.statutoryCharges());
        payment.setTotalAmount(fee.totalAmount());
        payment.setPaymentStatus(StringUtils.hasText(request.paymentStatus()) ? request.paymentStatus() : "PENDING");
        if (request.receipt() != null) {
            payment.setTransactionId(request.receipt().transactionId());
            payment.setPaymentMethod(request.receipt().paymentMethod());
        }
        return payment;
    }

    public CompanyRegistrationPayment payment(CompanyRegistration registration, PaymentRequest source) {
        return payment(registration, source, null);
    }

    public CompanyRegistrationPayment payment(
            CompanyRegistration registration,
            PaymentRequest source,
            CompanyRegistrationPayment existing) {
        CompanyRegistrationPayment payment = existing == null ? new CompanyRegistrationPayment() : existing;
        payment.setRegistration(registration);
        payment.setAmount(source.amount());
        payment.setGovernmentFee(source.governmentFee());
        payment.setProfessionalFee(source.professionalFee());
        payment.setTotalAmount(source.totalAmount());
        payment.setPaymentStatus(StringUtils.hasText(source.paymentStatus()) ? source.paymentStatus() : "PENDING");
        payment.setTransactionId(source.transactionId());
        payment.setPaymentGateway(source.paymentGateway());
        payment.setPaymentMethod(source.paymentMethod());
        return payment;
    }

    public CompanyRegistrationTracking tracking(CompanyRegistration registration, CompanyRegistrationDto.TrackingStageRequest source) {
        CompanyRegistrationTracking tracking = new CompanyRegistrationTracking();
        tracking.setRegistration(registration);
        tracking.setStage(source.title());
        tracking.setStatus(source.status());
        tracking.setDescription(source.description());
        return tracking;
    }

    public CompanyRegistrationResponse summary(CompanyRegistration registration, int currentStep) {
        return new CompanyRegistrationResponse(registration.getId(), registration.getApplicationNumber(), registration.getCompanyType(),
                registration.getConstitutionType(), registration.getStatus(), currentStep, registration.getCreatedAt(), registration.getUpdatedAt());
    }

    public ReviewResponse.CompanyDetailsResponse companyDetailsResponse(CompanyDetails details) {
        return new ReviewResponse.CompanyDetailsResponse(details.getId(), details.getIndustryCategory(), details.getBusinessActivityDescription(),
                details.getCompanyClass(), details.getCompanyCategory(), details.getCompanySubCategory(), details.getPrimaryActivity(), details.getNicCode(),
                details.getSecondaryActivity(), details.getProposedName1(), details.getProposedName2(), details.getProposedName3(), details.getNameSuffix(),
                details.getNameAvailabilityStatus(), details.getCompanyEmail(), details.getCompanyMobile(), details.getAuthorizedCapital(), details.getPaidUpCapital(),
                details.getNumberOfShares(), details.getFaceValuePerShare());
    }

    public ReviewResponse.RegisteredOfficeResponse registeredOfficeResponse(CompanyRegisteredOffice office) {
        return new ReviewResponse.RegisteredOfficeResponse(office.getId(), office.getAddressLine(), office.getCity(), office.getDistrict(), office.getState(),
                office.getPincode(), office.getPremisesOwnership(), office.getOfficeAddressProofName(), office.getOfficeAddressProofUri(), office.getOwnershipDocName(),
                office.getOwnershipDocUri(), office.getOwnerNocName(), office.getOwnerNocUri());
    }

    public ReviewResponse.PersonResponse personResponse(CompanyPerson person) {
        return new ReviewResponse.PersonResponse(person.getId(), person.getPersonType(), person.getName(), person.getPan(), person.getAadhaar(), person.getDob(),
                person.getFatherName(), person.getGender(), person.getNationality(), person.getPlaceOfBirth(), person.getOccupation(), person.getEducationalQualification(),
                person.getDesignation(), person.getCategory(), person.getEmail(), person.getPhone(), person.getHasDin(), person.getDin(), person.getHasDsc(),
                person.getSharesPercentage(), person.getResidentialAddress(), person.getIsResidentInIndia(), person.getAddressLine1(), person.getAddressLine2(),
                person.getCity(), person.getDistrict(), person.getState(), person.getPinCode(), person.getSameAsPermanentAddress(), person.getPresentAddressLine1(),
                person.getPresentAddressLine2(), person.getPresentCity(), person.getPresentDistrict(), person.getPresentState(), person.getPresentPincode(),
                person.getNumberOfShares(), person.getAmountSubscribed(), person.getContributionAmount(), person.getProfitSharePercentage(), person.getCapitalContribution(),
                person.getProfitSharingRatio(), person.getRelationship(), person.getIdentityProofDocName(), person.getResidentialAddressProofDocName());
    }

    public ReviewResponse.CapitalResponse capitalResponse(CompanyCapital capital) {
        return new ReviewResponse.CapitalResponse(capital.getId(), capital.getAuthorizedCapital(), capital.getPaidUpCapital(), capital.getNumberOfShares(), capital.getFaceValuePerShare());
    }

    public ReviewResponse.ShareholdingResponse shareholdingResponse(CompanyShareholding shareholding) {
        return new ReviewResponse.ShareholdingResponse(shareholding.getId(), shareholding.getPerson(), shareholding.getNumberOfShares(), shareholding.getShareValue(), shareholding.getPercentage());
    }

    public ReviewResponse.LinkedRegistrationResponse linkedRegistrationResponse(CompanyLinkedRegistration linked) {
        return new ReviewResponse.LinkedRegistrationResponse(linked.isPan(), linked.isTan(), linked.isGst(), linked.isEsic(), linked.isEpfo(), linked.isProfessionalTax(), linked.isBankAccount());
    }

    public ReviewResponse.PaymentResponse paymentResponse(CompanyRegistrationPayment payment) {
        return new ReviewResponse.PaymentResponse(payment.getId(), payment.getAmount(), payment.getGovernmentFee(), payment.getProfessionalFee(), payment.getTotalAmount(),
                payment.getPaymentStatus(), payment.getTransactionId(), payment.getPaymentGateway(), payment.getPaymentMethod(), payment.getPaidAt());
    }

    public TrackingResponse trackingResponse(CompanyRegistrationTracking tracking) {
        return new TrackingResponse(tracking.getId(), tracking.getStage(), tracking.getStatus(), Objects.toString(tracking.getDescription(), ""),
                tracking.getStartedAt(), tracking.getCompletedAt(), tracking.getRemarks());
    }

    public DocumentResponse documentResponse(CompanyRegistrationDocument document) {
        String fileUri = document.getFileUri();
        boolean hasStoredFile = StringUtils.hasText(fileUri)
                && fileUri.matches("[0-9]+/[0-9a-fA-F-]{36}(?:\\.[A-Za-z0-9]{1,10})?")
                || StringUtils.hasText(document.getFileData());
        String status = "UPLOADED".equalsIgnoreCase(document.getStatus()) && !hasStoredFile
                ? "PENDING" : document.getStatus();
        if (hasStoredFile) {
            fileUri = "/api/v1/company-registrations/" + document.getRegistration().getId()
                    + "/documents/" + document.getId() + "/content";
        } else {
            fileUri = null;
        }
        return new DocumentResponse(document.getId(), document.getCustId(), document.getDocumentType().name(), document.getName(), document.getCategory(),
                document.isRequired(), document.getFileName(), fileUri, document.getFileSize(), document.getMimeType(), status,
                document.getUploadedAt(), document.getVerifiedAt(), document.getRemarks());
    }

    public ReviewResponse reviewResponse(CompanyRegistrationResponse registration, ReviewResponse.CompanyDetailsResponse details,
            ReviewResponse.RegisteredOfficeResponse office, java.util.List<ReviewResponse.PersonResponse> persons,
            ReviewResponse.CapitalResponse capital, java.util.List<ReviewResponse.ShareholdingResponse> shareholdings,
            java.util.List<DocumentResponse> documents, ReviewResponse.LinkedRegistrationResponse linked,
            java.util.List<ReviewResponse.PaymentResponse> payments, java.util.List<TrackingResponse> tracking) {
        return new ReviewResponse(registration, details, office, persons, capital, shareholdings, documents, linked, payments, tracking);
    }

    public SubmissionResponse submissionResponse(CompanyRegistration registration, LocalDateTime submittedAt) {
        return new SubmissionResponse(registration.getId(), registration.getApplicationNumber(), registration.getStatus(), submittedAt);
    }

    public ReceiptResponse receiptResponse(ReviewResponse response, LocalDateTime submittedAt) {
        return new ReceiptResponse(response.application().id(), response.application().applicationNumber(), response.application().companyType(),
                response.application().status(), submittedAt, response.payments().stream().findFirst().orElse(null));
    }

    public Map<String, Object> detailsMap(CompanyDetails details) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", details.getId());
        result.put("industryCategory", details.getIndustryCategory());
        result.put("businessActivityDescription", details.getBusinessActivityDescription());
        result.put("companyClass", details.getCompanyClass());
        result.put("companyCategory", details.getCompanyCategory());
        result.put("companySubCategory", details.getCompanySubCategory());
        result.put("primaryActivity", details.getPrimaryActivity());
        result.put("nicCode", details.getNicCode());
        result.put("secondaryActivity", details.getSecondaryActivity());
        result.put("proposedName1", details.getProposedName1());
        result.put("proposedName2", details.getProposedName2());
        result.put("proposedName3", details.getProposedName3());
        result.put("nameSuffix", details.getNameSuffix());
        result.put("nameAvailabilityStatus", details.getNameAvailabilityStatus());
        result.put("companyEmail", details.getCompanyEmail());
        result.put("companyMobile", details.getCompanyMobile());
        return result;
    }

    public Map<String, Object> officeMap(CompanyRegisteredOffice office) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", office.getId());
        result.put("addressLine", office.getAddressLine());
        result.put("city", office.getCity());
        result.put("district", Objects.toString(office.getDistrict(), ""));
        result.put("state", office.getState());
        result.put("pincode", office.getPincode());
        result.put("premisesOwnership", Objects.toString(office.getPremisesOwnership(), ""));
        result.put("officeAddressProofName", office.getOfficeAddressProofName());
        result.put("officeAddressProofUri", office.getOfficeAddressProofUri());
        result.put("ownershipDocName", office.getOwnershipDocName());
        result.put("ownershipDocUri", office.getOwnershipDocUri());
        result.put("ownerNocName", office.getOwnerNocName());
        result.put("ownerNocUri", office.getOwnerNocUri());
        return result;
    }

    public Map<String, Object> personMap(CompanyPerson person) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", person.getId());
        result.put("personType", person.getPersonType());
        result.put("name", person.getName());
        result.put("pan", person.getPan());
        result.put("aadhaar", person.getAadhaar());
        result.put("dob", person.getDob());
        result.put("fatherName", person.getFatherName());
        result.put("gender", person.getGender());
        result.put("nationality", person.getNationality());
        result.put("placeOfBirth", person.getPlaceOfBirth());
        result.put("occupation", person.getOccupation());
        result.put("educationalQualification", person.getEducationalQualification());
        result.put("designation", person.getDesignation());
        result.put("category", person.getCategory());
        result.put("email", person.getEmail());
        result.put("phone", person.getPhone());
        result.put("hasDin", person.getHasDin());
        result.put("din", person.getDin());
        result.put("hasDsc", person.getHasDsc());
        result.put("sharesPercentage", person.getSharesPercentage());
        result.put("residentialAddress", person.getResidentialAddress());
        result.put("isResidentInIndia", person.getIsResidentInIndia());
        result.put("addressLine1", person.getAddressLine1());
        result.put("addressLine2", person.getAddressLine2());
        result.put("city", person.getCity());
        result.put("district", person.getDistrict());
        result.put("state", person.getState());
        result.put("pinCode", person.getPinCode());
        result.put("sameAsPermanentAddress", person.getSameAsPermanentAddress());
        result.put("presentAddressLine1", person.getPresentAddressLine1());
        result.put("presentAddressLine2", person.getPresentAddressLine2());
        result.put("presentCity", person.getPresentCity());
        result.put("presentDistrict", person.getPresentDistrict());
        result.put("presentState", person.getPresentState());
        result.put("presentPincode", person.getPresentPincode());
        result.put("numberOfShares", person.getNumberOfShares());
        result.put("amountSubscribed", person.getAmountSubscribed());
        result.put("contributionAmount", person.getContributionAmount());
        result.put("profitSharePercentage", person.getProfitSharePercentage());
        result.put("capitalContribution", person.getCapitalContribution());
        result.put("profitSharingRatio", person.getProfitSharingRatio());
        result.put("relationship", person.getRelationship());
        result.put("identityProofDocName", person.getIdentityProofDocName());
        result.put("residentialAddressProofDocName", person.getResidentialAddressProofDocName());
        return result;
    }

    public Map<String, Object> capitalMap(CompanyCapital capital) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", capital.getId());
        result.put("authorizedCapital", capital.getAuthorizedCapital());
        result.put("paidUpCapital", capital.getPaidUpCapital());
        result.put("numberOfShares", Objects.toString(capital.getNumberOfShares(), ""));
        result.put("faceValuePerShare", Objects.toString(capital.getFaceValuePerShare(), ""));
        return result;
    }

    public Map<String, Object> shareholdingMap(CompanyShareholding shareholding) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", shareholding.getId());
        result.put("person", Objects.toString(shareholding.getPerson(), ""));
        result.put("numberOfShares", Objects.toString(shareholding.getNumberOfShares(), ""));
        result.put("shareValue", Objects.toString(shareholding.getShareValue(), ""));
        result.put("percentage", Objects.toString(shareholding.getPercentage(), ""));
        return result;
    }

    public Map<String, Object> linkedMap(CompanyLinkedRegistration linked) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("pan", linked.isPan());
        result.put("tan", linked.isTan());
        result.put("gst", linked.isGst());
        result.put("esic", linked.isEsic());
        result.put("epfo", linked.isEpfo());
        result.put("professionalTax", linked.isProfessionalTax());
        result.put("bankAccount", linked.isBankAccount());
        return result;
    }

    public Map<String, Object> paymentMap(CompanyRegistrationPayment payment) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", payment.getId());
        result.put("amount", Objects.toString(payment.getAmount(), ""));
        result.put("governmentFee", Objects.toString(payment.getGovernmentFee(), ""));
        result.put("professionalFee", Objects.toString(payment.getProfessionalFee(), ""));
        result.put("totalAmount", Objects.toString(payment.getTotalAmount(), ""));
        result.put("paymentStatus", payment.getPaymentStatus());
        result.put("transactionId", Objects.toString(payment.getTransactionId(), ""));
        result.put("paymentGateway", Objects.toString(payment.getPaymentGateway(), ""));
        result.put("paymentMethod", Objects.toString(payment.getPaymentMethod(), ""));
        result.put("paidAt", Objects.toString(payment.getPaidAt(), ""));
        return result;
    }

    public Map<String, Object> statusMap(CompanyRegistration registration, int currentStep) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", registration.getStatus());
        result.put("currentStage", String.valueOf(currentStep));
        return result;
    }

    public Map<String, Object> nameAvailabilityMap(boolean available) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("available", available);
        result.put("similarNames", java.util.List.of());
        return result;
    }

    public Map<String, Object> emptyMap() {
        return new LinkedHashMap<>();
    }
}
