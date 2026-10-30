package com.taxedge.loan.propertyloan.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.exception.ResourceNotFoundException;
import com.taxedge.loan.personalloan.enums.LoanApplicationStatus;
import com.taxedge.loan.propertyloan.dto.PropertyLoanDocumentItemResponse;
import com.taxedge.loan.propertyloan.entity.PropertyLoanApplication;
import com.taxedge.loan.propertyloan.entity.PropertyLoanDocument;
import com.taxedge.loan.propertyloan.enums.PropertyDocumentType;
import com.taxedge.loan.propertyloan.helper.PropertyLoanHelper;
import com.taxedge.loan.propertyloan.repository.PropertyLoanApplicationRepository;
import com.taxedge.loan.propertyloan.repository.PropertyLoanDocumentRepository;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PropertyLoanDocumentServiceImpl implements PropertyLoanDocumentService {

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png"
    );

    private final PropertyLoanDocumentRepository documentRepository;
    private final PropertyLoanApplicationRepository applicationRepository;
    private final PropertyDocumentRequirementResolver requirementResolver;

    @Override
    @Transactional
    public PropertyLoanDocumentItemResponse uploadDocument(String loanApplicationId,
                                                          PropertyDocumentType documentType,
                                                          MultipartFile file) {
        if (documentType == null) {
            throw new IllegalArgumentException("Document type is required");
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file format. Allowed: PDF, JPG, PNG");
        }

        PropertyLoanApplication application = findApplicationForCurrentCustomer(loanApplicationId);

        if (application.getStatus() == LoanApplicationStatus.SUBMITTED) {
            throw new IllegalStateException("Submitted property loan applications cannot be edited or have documents modified");
        }

        List<PropertyDocumentRequirementResolver.DocumentRequirementSpec> applicableSpecs =
                requirementResolver.resolve(application.getPurposeOfLoan());

        PropertyDocumentRequirementResolver.DocumentRequirementSpec matchedSpec = applicableSpecs.stream()
                .filter(spec -> spec.documentType() == documentType)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Document type is not applicable for the selected loan purpose"));

        try {
            PropertyLoanDocument document = documentRepository
                    .findByLoanApplication_Id(loanApplicationId)
                    .orElseGet(() -> PropertyLoanDocument.builder()
                            .id(PropertyLoanHelper.generateDocumentId())
                            .loanApplication(application)
                            .build());

            document.setFileContent(documentType, file.getBytes(), file.getOriginalFilename());

            PropertyLoanDocument saved = documentRepository.save(document);
            log.info("Document {} uploaded successfully for property loan {}", documentType, loanApplicationId);

            return PropertyLoanDocumentItemResponse.builder()
                    .documentType(documentType)
                    .displayName(documentType.getDisplayName())
                    .description(documentType.getDescription())
                    .mandatory(matchedSpec.mandatory())
                    .uploaded(true)
                    .fileName(saved.getFileName(documentType))
                    .fileSize(file.getSize())
                    .uploadedAt(saved.getUpdatedAt())
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Failed to read file contents: " + e.getMessage(), e);
        }
    }

    @Override
    public List<PropertyLoanDocumentItemResponse> getDocuments(String loanApplicationId) {
        PropertyLoanApplication application = findApplicationForCurrentCustomer(loanApplicationId);
        List<PropertyDocumentRequirementResolver.DocumentRequirementSpec> specs =
                requirementResolver.resolve(application.getPurposeOfLoan());

        Optional<PropertyLoanDocument> existingDocOpt = documentRepository.findByLoanApplication_Id(loanApplicationId);

        return specs.stream()
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
    }

    @Override
    public PropertyLoanDocument downloadDocument(String loanApplicationId, PropertyDocumentType documentType) {
        findApplicationForCurrentCustomer(loanApplicationId);
        PropertyLoanDocument doc = documentRepository.findByLoanApplication_Id(loanApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Document " + documentType + " not found for application " + loanApplicationId));

        if (!doc.hasDocument(documentType)) {
            throw new ResourceNotFoundException(
                    "Document " + documentType + " not uploaded for application " + loanApplicationId);
        }
        return doc;
    }

    @Override
    @Transactional
    public void deleteDocument(String loanApplicationId, PropertyDocumentType documentType) {
        PropertyLoanApplication application = findApplicationForCurrentCustomer(loanApplicationId);
        if (application.getStatus() == LoanApplicationStatus.SUBMITTED) {
            throw new IllegalStateException("Submitted applications cannot have documents deleted");
        }
        PropertyLoanDocument doc = documentRepository.findByLoanApplication_Id(loanApplicationId).orElse(null);
        if (doc != null && doc.hasDocument(documentType)) {
            doc.setFileContent(documentType, null, null);
            documentRepository.save(doc);
            log.info("Document {} deleted for application {}", documentType, loanApplicationId);
        }
    }

    private PropertyLoanApplication findApplicationForCurrentCustomer(String id) {
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
}
