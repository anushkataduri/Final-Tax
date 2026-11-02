package com.taxedge.loan.propertyloan.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.exception.ResourceNotFoundException;
import com.taxedge.loan.personalloan.enums.LoanApplicationStatus;
import com.taxedge.loan.propertyloan.dto.PropertyLoanCreateRequest;
import com.taxedge.loan.propertyloan.dto.PropertyLoanDocumentItemResponse;
import com.taxedge.loan.propertyloan.dto.PropertyLoanResponse;
import com.taxedge.loan.propertyloan.dto.PropertyLoanReviewResponse;
import com.taxedge.loan.propertyloan.dto.PropertyLoanUpdateRequest;
import com.taxedge.loan.propertyloan.entity.PropertyLoanApplication;
import com.taxedge.loan.propertyloan.entity.PropertyLoanDocument;
import com.taxedge.loan.propertyloan.enums.PropertyDocumentType;
import com.taxedge.loan.propertyloan.enums.PropertyLoanPurpose;
import com.taxedge.loan.propertyloan.enums.PropertyOwnership;
import com.taxedge.loan.propertyloan.mapper.PropertyLoanMapper;
import com.taxedge.loan.propertyloan.repository.PropertyLoanApplicationRepository;
import com.taxedge.loan.propertyloan.repository.PropertyLoanDocumentRepository;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PropertyLoanApplicationServiceImpl implements PropertyLoanApplicationService {

    private final PropertyLoanApplicationRepository applicationRepository;
    private final PropertyLoanDocumentRepository documentRepository;
    private final CustomerRepository customerRepository;
    private final PropertyLoanMapper mapper;
    private final PropertyDocumentRequirementResolver requirementResolver;

    @Override
    @Transactional
    public PropertyLoanResponse createApplication(PropertyLoanCreateRequest request) {
        validateRequest(request.getRequestedLoanAmount(), request.getPurposeOfLoan(), request.getPurposeOther(),
                request.getPropertyStatus(), request.getConstructionStage(), request.getRenovationStatus(),
                request.getCity(), request.getState(), request.getPinCode(), request.getOwnership(), request.getPropertyType());

        String customerId = currentCustomerId();
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer not found: " + customerId));

        PropertyLoanApplication entity = mapper.toEntity(request);
        entity.setCustomer(customer);
        entity.setStatus(LoanApplicationStatus.DRAFT);
        cleanseConditionalFields(entity);

        PropertyLoanApplication saved = applicationRepository.save(entity);
        log.info("Created property loan application {} for customer {}", saved.getId(), customerId);

        return mapper.toResponse(saved);
    }

    @Override
    public PropertyLoanResponse getApplication(String id) {
        return mapper.toResponse(findForCurrentCustomer(id));
    }

    @Override
    @Transactional
    public PropertyLoanResponse updateApplication(String id, PropertyLoanUpdateRequest request) {
        validateRequest(request.getRequestedLoanAmount(), request.getPurposeOfLoan(), request.getPurposeOther(),
                request.getPropertyStatus(), request.getConstructionStage(), request.getRenovationStatus(),
                request.getCity(), request.getState(), request.getPinCode(), request.getOwnership(), request.getPropertyType());

        PropertyLoanApplication entity = findForCurrentCustomer(id);

        if (entity.getStatus() == LoanApplicationStatus.SUBMITTED) {
            throw new IllegalStateException("Submitted property loan applications cannot be edited");
        }

        mapper.updateFromRequest(request, entity);
        cleanseConditionalFields(entity);

        log.info("Updated property loan application {}", id);
        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public void deleteApplication(String id) {
        PropertyLoanApplication entity = findForCurrentCustomer(id);
        documentRepository.deleteByLoanApplication_Id(entity.getId());
        applicationRepository.delete(entity);
        log.info("Deleted property loan application {} and associated documents", id);
    }

    @Override
    public PropertyLoanReviewResponse getReview(String id) {
        PropertyLoanApplication application = findForCurrentCustomer(id);
        Customer customer = application.getCustomer();

        // 1. Applicant details from Customer
        String currentAddress = buildAddress(customer.getAddressLine1(), customer.getAddressLine2(),
                customer.getCity(), customer.getState(), customer.getPincode());
        String permanentAddress = StringUtils.hasText(customer.getAddress()) ? customer.getAddress() : currentAddress;

        PropertyLoanReviewResponse.ApplicantDetails applicantDetails = PropertyLoanReviewResponse.ApplicantDetails.builder()
                .custId(customer.getCustId())
                .fullName(customer.getName())
                .mobileNumber(customer.getMobileNumber())
                .email(customer.getEmail())
                .pan(customer.getPan())
                .aadhaar(customer.getAadhaar())
                .dob(customer.getDob())
                .currentAddress(currentAddress)
                .permanentAddress(permanentAddress)
                .build();

        // 2. Loan Requirement
        PropertyLoanReviewResponse.LoanRequirement loanRequirement = PropertyLoanReviewResponse.LoanRequirement.builder()
                .loanType("PROPERTY_LOAN")
                .requestedLoanAmount(application.getRequestedLoanAmount())
                .purposeOfLoan(application.getPurposeOfLoan())
                .purposeOther(application.getPurposeOfLoan() == PropertyLoanPurpose.OTHER ? application.getPurposeOther() : null)
                .propertyStatus(application.getPropertyStatus())
                .constructionStage(application.getConstructionStage())
                .renovationStatus(application.getRenovationStatus())
                .build();

        // 3. Property Details
        PropertyLoanReviewResponse.PropertyDetails propertyDetails = PropertyLoanReviewResponse.PropertyDetails.builder()
                .propertyType(application.getPropertyType())
                .city(application.getCity())
                .state(application.getState())
                .pinCode(application.getPinCode())
                .ownership(application.getOwnership())
                .build();

        // 4. Documents Checklist & Counts
        List<PropertyDocumentRequirementResolver.DocumentRequirementSpec> specs =
                requirementResolver.resolve(application.getPurposeOfLoan());

        Optional<PropertyLoanDocument> existingDocOpt = documentRepository.findByLoanApplication_Id(id);

        List<PropertyLoanDocumentItemResponse> checklist = specs.stream()
                .map(spec -> {
                    boolean uploaded = existingDocOpt.isPresent() && existingDocOpt.get().hasDocument(spec.documentType());
                    PropertyLoanDocument doc = existingDocOpt.orElse(null);
                    String fileName = (uploaded && doc != null) ? doc.getFileName(spec.documentType()) : null;
                    byte[] content = (uploaded && doc != null) ? doc.getFileContent(spec.documentType()) : null;
                    Long fileSize = (content != null) ? (long) content.length : null;

                    return PropertyLoanDocumentItemResponse.builder()
                            .documentType(spec.documentType())
                            .displayName(spec.documentType().getDisplayName())
                            .description(spec.documentType().getDescription())
                            .mandatory(spec.mandatory())
                            .uploaded(uploaded)
                            .fileName(fileName)
                            .fileSize(fileSize)
                            .uploadedAt(uploaded && doc != null ? doc.getUpdatedAt() : null)
                            .build();
                })
                .toList();

        int requiredCount = (int) specs.stream().filter(PropertyDocumentRequirementResolver.DocumentRequirementSpec::mandatory).count();
        int uploadedRequiredCount = (int) checklist.stream().filter(item -> item.isMandatory() && item.isUploaded()).count();

        PropertyLoanReviewResponse.DocumentSummary docSummary = PropertyLoanReviewResponse.DocumentSummary.builder()
                .requiredCount(requiredCount)
                .uploadedRequiredCount(uploadedRequiredCount)
                .checklist(checklist)
                .build();

        return PropertyLoanReviewResponse.builder()
                .id(application.getId())
                .status(application.getStatus())
                .applicantDetails(applicantDetails)
                .loanRequirement(loanRequirement)
                .propertyDetails(propertyDetails)
                .documents(docSummary)
                .declarationConfirmed(true)
                .build();
    }

    @Override
    @Transactional
    public PropertyLoanResponse submitApplication(String id) {
        PropertyLoanApplication application = findForCurrentCustomer(id);

        if (application.getStatus() == LoanApplicationStatus.SUBMITTED) {
            log.info("Application {} is already submitted", id);
            return mapper.toResponse(application);
        }

        // Validate required documents
        List<PropertyDocumentRequirementResolver.DocumentRequirementSpec> specs =
                requirementResolver.resolve(application.getPurposeOfLoan());
        Optional<PropertyLoanDocument> existingDocOpt = documentRepository.findByLoanApplication_Id(id);

        for (PropertyDocumentRequirementResolver.DocumentRequirementSpec spec : specs) {
            if (spec.mandatory()) {
                if (existingDocOpt.isEmpty() || !existingDocOpt.get().hasDocument(spec.documentType())) {
                    throw new IllegalStateException("Mandatory document " + spec.documentType().getDisplayName() + " is missing");
                }
            }
        }

        application.setStatus(LoanApplicationStatus.SUBMITTED);
        log.info("Property loan application {} submitted successfully", id);

        return mapper.toResponse(application);
    }

    @Override
    public List<PropertyLoanResponse> getMyApplications() {
        return applicationRepository.findByCustomer_CustIdOrderByCreatedAtDesc(currentCustomerId())
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    private PropertyLoanApplication findForCurrentCustomer(String id) {
        if (!StringUtils.hasText(id)) {
            throw new IllegalArgumentException("Loan application ID is required");
        }
        return applicationRepository.findByIdAndCustomer_CustId(id.trim(), currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Property loan application not found: " + id));
    }

    private String currentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof JwtPrincipal principal)
                || !StringUtils.hasText(principal.custId())
                || !authentication.getAuthorities().stream()
                        .anyMatch(authority -> "ROLE_CUSTOMER".equals(authority.getAuthority()))) {
            throw new AccessDeniedException("An authenticated customer is required");
        }
        return principal.custId();
    }

    private void validateRequest(BigDecimal requestedLoanAmount,
                                 PropertyLoanPurpose purposeOfLoan,
                                 String purposeOther,
                                 com.taxedge.loan.propertyloan.enums.PropertyStatus propertyStatus,
                                 com.taxedge.loan.propertyloan.enums.ConstructionStage constructionStage,
                                 com.taxedge.loan.propertyloan.enums.RenovationStatus renovationStatus,
                                 String city,
                                 String state,
                                 String pinCode,
                                 PropertyOwnership ownership,
                                 com.taxedge.loan.propertyloan.enums.PropertyType propertyType) {
        if (requestedLoanAmount == null || requestedLoanAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Requested loan amount is required");
        }
        if (purposeOfLoan == null) {
            throw new IllegalArgumentException("Purpose of loan is required");
        }
        if (purposeOfLoan == PropertyLoanPurpose.OTHER && !StringUtils.hasText(purposeOther)) {
            throw new IllegalArgumentException("Please specify purpose of loan when 'Other' is selected");
        }

        switch (purposeOfLoan) {
            case HOME_PURCHASE, PLOT_PURCHASE -> {
                if (propertyStatus == null) {
                    throw new IllegalArgumentException("Property status is required for " + purposeOfLoan);
                }
            }
            case HOME_CONSTRUCTION, PLOT_CONSTRUCTION -> {
                if (constructionStage == null) {
                    throw new IllegalArgumentException("Construction stage is required for " + purposeOfLoan);
                }
            }
            case HOME_RENOVATION -> {
                if (renovationStatus == null) {
                    throw new IllegalArgumentException("Renovation status is required for " + purposeOfLoan);
                }
            }
            default -> {}
        }

        if (propertyType == null) {
            throw new IllegalArgumentException("Property type is required");
        }
        if (!StringUtils.hasText(city)) {
            throw new IllegalArgumentException("City is required");
        }
        if (!StringUtils.hasText(state)) {
            throw new IllegalArgumentException("State is required");
        }
        if (!StringUtils.hasText(pinCode) || !pinCode.trim().matches("^[1-9][0-9]{5}$")) {
            throw new IllegalArgumentException("Valid 6-digit PIN code is required");
        }
        if (ownership == null) {
            throw new IllegalArgumentException("Property ownership is required");
        }
    }

    private void cleanseConditionalFields(PropertyLoanApplication entity) {
        PropertyLoanPurpose purpose = entity.getPurposeOfLoan();
        if (purpose != PropertyLoanPurpose.OTHER) {
            entity.setPurposeOther(null);
        }
        if (purpose != PropertyLoanPurpose.HOME_PURCHASE && purpose != PropertyLoanPurpose.PLOT_PURCHASE) {
            entity.setPropertyStatus(null);
        }
        if (purpose != PropertyLoanPurpose.HOME_CONSTRUCTION && purpose != PropertyLoanPurpose.PLOT_CONSTRUCTION) {
            entity.setConstructionStage(null);
        }
        if (purpose != PropertyLoanPurpose.HOME_RENOVATION) {
            entity.setRenovationStatus(null);
        }
    }

    private String buildAddress(String line1, String line2, String city, String state, String pincode) {
        StringBuilder sb = new StringBuilder();
        if (StringUtils.hasText(line1)) sb.append(line1.trim());
        if (StringUtils.hasText(line2)) {
            if (!sb.isEmpty()) sb.append(", ");
            sb.append(line2.trim());
        }
        if (StringUtils.hasText(city)) {
            if (!sb.isEmpty()) sb.append(", ");
            sb.append(city.trim());
        }
        if (StringUtils.hasText(state)) {
            if (!sb.isEmpty()) sb.append(", ");
            sb.append(state.trim());
        }
        if (StringUtils.hasText(pincode)) {
            if (!sb.isEmpty()) sb.append(" - ");
            sb.append(pincode.trim());
        }
        return sb.toString();
    }
}
