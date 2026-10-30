
package com.taxedge.loan.homeloan.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.Supplier;

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
import com.taxedge.loan.homeloan.service.HomeLoanDocumentService;

import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Transactional
public class HomeLoanDocumentServiceImpl implements HomeLoanDocumentService {

    private final HomeLoanDocumentRepository documentRepository;
    private final HomeLoanRequirementApplicationRepository applicationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HomeLoanDocumentRequirementDto> getDocumentRequirements(
            HomeLoanRequirementPurpose loanPurpose) {

        if (loanPurpose == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Loan purpose is required");
        }

        List<HomeLoanDocumentRequirementDto> requirements = new ArrayList<>();

        switch (loanPurpose) {
            case PURCHASE_NEW_HOME:
            case PURCHASE_RESALE_HOME:
                addRequirement(requirements, "propertyOwnershipDocument",
                        "Property / Sale Agreement Document",
                        "Upload the property or sale agreement document.", true);
                addRequirement(requirements, "bankStatementIncomeDocument",
                        "Bank Statement / Income Document",
                        "Latest 6 months bank statement showing regular credits or operational funds.",
                        true);
                addRequirement(requirements, "propertyQuotationBuilderDocument",
                        "Property Quotation / Builder Document",
                        "Builder quotation, cost sheet or demand letter, if available.",
                        false);
                addRequirement(requirements, "additionalPropertyDocument",
                        "Additional Property Document",
                        "Any other property records, tax receipts or possession letters.",
                        false);
                break;

            case CONSTRUCT_HOUSE:
                addRequirement(requirements, "propertyOwnershipDocument",
                        "Property Ownership Document",
                        "Title deed, allotment letter or land ownership proof.", true);
                addRequirement(requirements, "constructionDocument",
                        "Construction Document (If Available)",
                        "Contractor agreement, quotation or estimate, if available.",
                        false);
                addRequirement(requirements, "sanctionedBuildingPlan",
                        "Sanctioned Building Plan",
                        "Approved architectural plan or municipal sanctioned layout.",
                        false);
                addRequirement(requirements, "constructionCostEstimate",
                        "Construction Cost Estimate",
                        "Civil work estimate or architect valuation.", false);
                addRequirement(requirements, "additionalPropertyDocument",
                        "Additional Property Document",
                        "Any additional land records or construction permits.", false);
                break;

            case HOME_RENOVATION:
                addRequirement(requirements, "propertyOwnershipDocument",
                        "Property Ownership Document",
                        "Title deed, sale deed or ownership proof.", true);
                addRequirement(requirements, "renovationCostEstimate",
                        "Renovation Cost Estimate",
                        "Estimated cost breakdown for repair or renovation work.",
                        false);
                addRequirement(requirements, "contractorQuotation",
                        "Contractor Quotation",
                        "Quotation from contractor, interior designer or architect.",
                        false);
                addRequirement(requirements, "additionalPropertyDocument",
                        "Additional Property Document",
                        "Any additional property records or layout drawings.", false);
                break;

            case BALANCE_TRANSFER:
                addRequirement(requirements, "existingLoanStatement",
                        "Existing Loan Statement / Account Document",
                        "Latest 12 months loan repayment account statement (SOA).",
                        true);
                addRequirement(requirements, "propertyDocumentCopy",
                        "Property Document Copy",
                        "Copy of sale deed, title deed or possession letter.", false);
                addRequirement(requirements, "foreclosureOutstandingStatement",
                        "Foreclosure / Outstanding Statement",
                        "Foreclosure statement or list of documents (LOD).", false);
                break;
        }

        return requirements;
    }

    @Override
    public HomeLoanDocumentResponseDto uploadDocuments(
            String homeLoanId,
            HomeLoanDocumentRequestDto dto) throws IOException {

        if (dto == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Document request is required");
        }

        HomeLoanRequirementApplication application = getApplication(homeLoanId);

        HomeLoanDocument document = documentRepository
                .findByHomeLoanApplication_HomeLoanId(homeLoanId)
                .orElseGet(() -> HomeLoanDocument.builder()
                        .documentId("DOC" + UUID.randomUUID()
                                .toString().replace("-", ""))
                        .homeLoanApplication(application)
                        .build());

        ensureDraft(application);

        saveFile(dto.getPropertyOwnershipDocument(),
                document::setPropertyOwnershipDocument);
        saveFile(dto.getBankStatementIncomeDocument(),
                document::setBankStatementIncomeDocument);
        saveFile(dto.getPropertyQuotationBuilderDocument(),
                document::setPropertyQuotationBuilderDocument);
        saveFile(dto.getAdditionalPropertyDocument(),
                document::setAdditionalPropertyDocument);
        saveFile(dto.getConstructionDocument(),
                document::setConstructionDocument);
        saveFile(dto.getSanctionedBuildingPlan(),
                document::setSanctionedBuildingPlan);
        saveFile(dto.getConstructionCostEstimate(),
                document::setConstructionCostEstimate);
        saveFile(dto.getRenovationCostEstimate(),
                document::setRenovationCostEstimate);
        saveFile(dto.getContractorQuotation(),
                document::setContractorQuotation);
        saveFile(dto.getExistingLoanStatement(),
                document::setExistingLoanStatement);
        saveFile(dto.getPropertyDocumentCopy(),
                document::setPropertyDocumentCopy);
        saveFile(dto.getForeclosureOutstandingStatement(),
                document::setForeclosureOutstandingStatement);

        validateRequiredDocuments(application, document);

        documentRepository.save(document);

        return toResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public HomeLoanDocumentResponseDto getDocuments(String homeLoanId) {
        getApplication(homeLoanId);

        HomeLoanDocument document = documentRepository
                .findByHomeLoanApplication_HomeLoanId(homeLoanId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No documents found"));

        return toResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] viewDocument(String homeLoanId, String documentType) {
        HomeLoanDocument document = getDocument(homeLoanId);

        byte[] content = getDocumentContent(document, documentType);

        if (content == null || content.length == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Document has not been uploaded");
        }

        return content;
    }

    @Override
    public HomeLoanDocumentResponseDto replaceDocuments(
            String homeLoanId,
            Map<String, MultipartFile> files) throws IOException {

        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "At least one document must be provided");
        }

        HomeLoanRequirementApplication application =
                getApplication(homeLoanId);

        ensureDraft(application);

        HomeLoanDocument document = documentRepository
                .findByHomeLoanApplication_HomeLoanId(homeLoanId)
                .orElseGet(() -> HomeLoanDocument.builder()
                        .documentId("DOC" + UUID.randomUUID()
                                .toString().replace("-", ""))
                        .homeLoanApplication(application)
                        .build());

        Set<String> allowedTypes = Set.of(
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

        for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {

            String documentType = entry.getKey();
            MultipartFile file = entry.getValue();

            if (!allowedTypes.contains(documentType)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Unknown document type: " + documentType);
            }

            if (file == null || file.isEmpty()) {
                continue;
            }

            setDocumentContent(
                    document,
                    documentType,
                    file.getBytes());
        }

        documentRepository.save(document);

        return toResponse(document);
    }

    @Override
    public HomeLoanDocumentResponseDto removeDocument(
            String homeLoanId,
            String documentType) {

        HomeLoanRequirementApplication application = getApplication(homeLoanId);
        ensureDraft(application);

        HomeLoanDocument document = getDocument(homeLoanId);

        setDocumentContent(document, documentType, null);

        validateRequiredDocuments(application, document);

        documentRepository.save(document);

        return toResponse(document);
    }

    private HomeLoanRequirementApplication getApplication(String homeLoanId) {
        return applicationRepository.findById(homeLoanId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Home loan application not found: " + homeLoanId));
    }

    private HomeLoanDocument getDocument(String homeLoanId) {
        return documentRepository
                .findByHomeLoanApplication_HomeLoanId(homeLoanId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No documents found for home loan: " + homeLoanId));
    }

    private void ensureDraft(HomeLoanRequirementApplication application) {
        if (!"DRAFT".equalsIgnoreCase(application.getApplicationStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Documents can only be changed while the application is in DRAFT status");
        }
    }

    private void saveFile(
            MultipartFile file,
            Consumer<byte[]> setter) throws IOException {

        if (file != null && !file.isEmpty()) {
            setter.accept(file.getBytes());
        }
    }

    private void addRequirement(
            List<HomeLoanDocumentRequirementDto> requirements,
            String documentType,
            String documentName,
            String description,
            boolean required) {

        requirements.add(HomeLoanDocumentRequirementDto.builder()
                .documentType(documentType)
                .documentName(documentName)
                .description(description)
                .required(required)
                .uploaded(false)
                .build());
    }

    private void validateRequiredDocuments(
            HomeLoanRequirementApplication application,
            HomeLoanDocument document) {

        HomeLoanRequirementPurpose purpose =
                application.getLoanPurpose();

        switch (purpose) {
            case PURCHASE_NEW_HOME:
            case PURCHASE_RESALE_HOME:
                requireFile(document.getPropertyOwnershipDocument(),
                        "Property / Sale Agreement Document");
                requireFile(document.getBankStatementIncomeDocument(),
                        "Bank Statement / Income Document");
                break;

            case CONSTRUCT_HOUSE:
            case HOME_RENOVATION:
                requireFile(document.getPropertyOwnershipDocument(),
                        "Property Ownership Document");
                break;

            case BALANCE_TRANSFER:
                requireFile(document.getExistingLoanStatement(),
                        "Existing Loan Statement / Account Document");
                break;
        }
    }

    private void requireFile(byte[] content, String documentName) {
        if (content == null || content.length == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    documentName + " is required");
        }
    }

    private byte[] getDocumentContent(
            HomeLoanDocument document,
            String documentType) {

        return switch (documentType) {
            case "propertyOwnershipDocument" ->
                    document.getPropertyOwnershipDocument();
            case "bankStatementIncomeDocument" ->
                    document.getBankStatementIncomeDocument();
            case "propertyQuotationBuilderDocument" ->
                    document.getPropertyQuotationBuilderDocument();
            case "additionalPropertyDocument" ->
                    document.getAdditionalPropertyDocument();
            case "constructionDocument" ->
                    document.getConstructionDocument();
            case "sanctionedBuildingPlan" ->
                    document.getSanctionedBuildingPlan();
            case "constructionCostEstimate" ->
                    document.getConstructionCostEstimate();
            case "renovationCostEstimate" ->
                    document.getRenovationCostEstimate();
            case "contractorQuotation" ->
                    document.getContractorQuotation();
            case "existingLoanStatement" ->
                    document.getExistingLoanStatement();
            case "propertyDocumentCopy" ->
                    document.getPropertyDocumentCopy();
            case "foreclosureOutstandingStatement" ->
                    document.getForeclosureOutstandingStatement();
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unknown document type: " + documentType);
        };
    }

    private void setDocumentContent(
            HomeLoanDocument document,
            String documentType,
            byte[] content) {

        switch (documentType) {
            case "propertyOwnershipDocument" ->
                    document.setPropertyOwnershipDocument(content);
            case "bankStatementIncomeDocument" ->
                    document.setBankStatementIncomeDocument(content);
            case "propertyQuotationBuilderDocument" ->
                    document.setPropertyQuotationBuilderDocument(content);
            case "additionalPropertyDocument" ->
                    document.setAdditionalPropertyDocument(content);
            case "constructionDocument" ->
                    document.setConstructionDocument(content);
            case "sanctionedBuildingPlan" ->
                    document.setSanctionedBuildingPlan(content);
            case "constructionCostEstimate" ->
                    document.setConstructionCostEstimate(content);
            case "renovationCostEstimate" ->
                    document.setRenovationCostEstimate(content);
            case "contractorQuotation" ->
                    document.setContractorQuotation(content);
            case "existingLoanStatement" ->
                    document.setExistingLoanStatement(content);
            case "propertyDocumentCopy" ->
                    document.setPropertyDocumentCopy(content);
            case "foreclosureOutstandingStatement" ->
                    document.setForeclosureOutstandingStatement(content);
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unknown document type: " + documentType);
        }
    }

    private HomeLoanDocumentResponseDto toResponse(
            HomeLoanDocument document) {

        HomeLoanRequirementPurpose purpose =
                document.getHomeLoanApplication().getLoanPurpose();

        List<HomeLoanDocumentRequirementDto> requirements =
                getDocumentRequirements(purpose);

        for (HomeLoanDocumentRequirementDto requirement : requirements) {

            byte[] content = getDocumentContent(
                    document,
                    requirement.getDocumentType()
            );

            requirement.setUploaded(hasContent(content));
        }

        return HomeLoanDocumentResponseDto.builder()
                .documentId(document.getDocumentId())
                .homeLoanId(document.getHomeLoanApplication()
                        .getHomeLoanId())
                .documents(requirements)
                .build();
    }

    private boolean hasContent(byte[] content) {
        return content != null && content.length > 0;
    }


}
