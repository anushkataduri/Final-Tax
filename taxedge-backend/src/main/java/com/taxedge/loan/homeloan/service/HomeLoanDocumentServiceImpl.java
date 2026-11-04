package com.taxedge.loan.homeloan.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.taxedge.loan.homeloan.dto.HomeLoanDocumentRequestDto;
import com.taxedge.loan.homeloan.dto.HomeLoanDocumentResponseDto;
import com.taxedge.loan.homeloan.entity.HomeLoanDocument;
import com.taxedge.loan.homeloan.entity.HomeLoanRequirementApplication;
import com.taxedge.loan.homeloan.enums.HomeLoanRequirementPurpose;
import com.taxedge.loan.homeloan.repository.HomeLoanDocumentRepository;
import com.taxedge.loan.homeloan.repository.HomeLoanRequirementApplicationRepository;
import com.taxedge.loan.homeloan.requirement.HomeLoanDocumentRequirementDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HomeLoanDocumentServiceImpl implements HomeLoanDocumentService {

    private final HomeLoanDocumentRepository documentRepository;
    private final HomeLoanRequirementApplicationRepository applicationRepository;

    private static final List<String> ALL_DOCUMENT_TYPES = List.of(
            "propertyOwnershipDocument",
            "bankStatementIncomeDocument",
            "propertyQuotationBuilderDocument",
            "additionalPropertyDocument",
            "constructionDocument",
            "sanctionedBuildingPlan",
            "constructionCostEstimate",
            "renovationCostEstimate",
            "contractorQuotation",
            "existingLoanStatement",
            "propertyDocumentCopy",
            "foreclosureOutstandingStatement"
    );

    @Override
    @Transactional(readOnly = true)
    public List<HomeLoanDocumentRequirementDto> getDocumentRequirements(HomeLoanRequirementPurpose loanPurpose) {
        return ALL_DOCUMENT_TYPES.stream()
                .map(docType -> HomeLoanDocumentRequirementDto.builder()
                        .documentType(docType)
                        .documentName(docType)
                        .uploaded(false)
                        .build())
                .toList();
    }

    @Override
    public HomeLoanDocumentResponseDto uploadDocuments(String homeLoanId, HomeLoanDocumentRequestDto dto) throws IOException {
        if (dto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document request is required");
        }
        return replaceDocuments(homeLoanId, dto.toMap());
    }

    @Override
    @Transactional(readOnly = true)
    public HomeLoanDocumentResponseDto getDocuments(String homeLoanId) {
        getApplication(homeLoanId);
        HomeLoanDocument document = documentRepository.findByHomeLoanApplication_HomeLoanId(homeLoanId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No documents found"));
        return toResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] viewDocument(String homeLoanId, String documentType) {
        HomeLoanDocument document = getDocument(homeLoanId);
        byte[] content = document.getContent(documentType);
        if (content == null || content.length == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Document has not been uploaded");
        }
        return content;
    }

    @Override
    public HomeLoanDocumentResponseDto replaceDocuments(String homeLoanId, Map<String, MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one document must be provided");
        }

        HomeLoanRequirementApplication application = getApplication(homeLoanId);
        ensureDraft(application);

        HomeLoanDocument document = documentRepository.findByHomeLoanApplication_HomeLoanId(homeLoanId)
                .orElseGet(() -> HomeLoanDocument.builder()
                        .documentId("DOC" + UUID.randomUUID().toString().replace("-", ""))
                        .homeLoanApplication(application)
                        .build());

        for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
            MultipartFile file = entry.getValue();
            if (file != null && !file.isEmpty()) {
                document.setContent(entry.getKey(), file.getBytes());
            }
        }

        return toResponse(documentRepository.save(document));
    }

    @Override
    public HomeLoanDocumentResponseDto removeDocument(String homeLoanId, String documentType) {
        HomeLoanRequirementApplication application = getApplication(homeLoanId);
        ensureDraft(application);

        HomeLoanDocument document = getDocument(homeLoanId);
        document.setContent(documentType, null);

        return toResponse(documentRepository.save(document));
    }

    private HomeLoanRequirementApplication getApplication(String homeLoanId) {
        return applicationRepository.findById(homeLoanId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Home loan application not found: " + homeLoanId));
    }

    private HomeLoanDocument getDocument(String homeLoanId) {
        return documentRepository.findByHomeLoanApplication_HomeLoanId(homeLoanId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No documents found for home loan: " + homeLoanId));
    }

    private void ensureDraft(HomeLoanRequirementApplication application) {
        if (!"DRAFT".equalsIgnoreCase(application.getApplicationStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Documents can only be changed while the application is in DRAFT status");
        }
    }

    private HomeLoanDocumentResponseDto toResponse(HomeLoanDocument document) {
        List<HomeLoanDocumentRequirementDto> requirements = new ArrayList<>();
        for (String docType : ALL_DOCUMENT_TYPES) {
            byte[] content = document.getContent(docType);
            requirements.add(HomeLoanDocumentRequirementDto.builder()
                    .documentType(docType)
                    .documentName(docType)
                    .uploaded(content != null && content.length > 0)
                    .build());
        }

        return HomeLoanDocumentResponseDto.builder()
                .documentId(document.getDocumentId())
                .homeLoanId(document.getHomeLoanApplication().getHomeLoanId())
                .documents(requirements)
                .build();
    }
}
