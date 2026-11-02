package com.taxedge.loan.propertyloan.entity;

import java.time.LocalDateTime;

import com.taxedge.loan.propertyloan.enums.PropertyDocumentType;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "property_loan_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyLoanDocument {

    @Id
    @Column(name = "document_id", length = 36, nullable = false, updatable = false)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_application_id", nullable = false, unique = true,
                foreignKey = @ForeignKey(name = "fk_property_loan_document_app"))
    private PropertyLoanApplication loanApplication;

    // 1. Property / Sale Agreement Document
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "property_sale_agreement_document", columnDefinition = "bytea")
    private byte[] propertySaleAgreementDocument;

    @Column(name = "property_sale_agreement_file_name", length = 255)
    private String propertySaleAgreementFileName;

    // 2. Bank Statement / Income Document
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "bank_statement_income_document", columnDefinition = "bytea")
    private byte[] bankStatementIncomeDocument;

    @Column(name = "bank_statement_income_file_name", length = 255)
    private String bankStatementIncomeFileName;

    // 3. Property Quotation / Builder Document
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "property_quotation_builder_document", columnDefinition = "bytea")
    private byte[] propertyQuotationBuilderDocument;

    @Column(name = "property_quotation_builder_file_name", length = 255)
    private String propertyQuotationBuilderFileName;

    // 4. Additional Property Document
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "additional_property_document", columnDefinition = "bytea")
    private byte[] additionalPropertyDocument;

    @Column(name = "additional_property_file_name", length = 255)
    private String additionalPropertyFileName;

    // 5. Property Ownership Document
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "property_ownership_document", columnDefinition = "bytea")
    private byte[] propertyOwnershipDocument;

    @Column(name = "property_ownership_file_name", length = 255)
    private String propertyOwnershipFileName;

    // 6. Construction Document
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "construction_document", columnDefinition = "bytea")
    private byte[] constructionDocument;

    @Column(name = "construction_file_name", length = 255)
    private String constructionFileName;

    // 7. Sanctioned Building Plan
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "sanctioned_building_plan", columnDefinition = "bytea")
    private byte[] sanctionedBuildingPlan;

    @Column(name = "sanctioned_building_plan_file_name", length = 255)
    private String sanctionedBuildingPlanFileName;

    // 8. Construction Cost Estimate
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "construction_cost_estimate", columnDefinition = "bytea")
    private byte[] constructionCostEstimate;

    @Column(name = "construction_cost_estimate_file_name", length = 255)
    private String constructionCostEstimateFileName;

    // 9. Renovation Cost Estimate
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "renovation_cost_estimate", columnDefinition = "bytea")
    private byte[] renovationCostEstimate;

    @Column(name = "renovation_cost_estimate_file_name", length = 255)
    private String renovationCostEstimateFileName;

    // 10. Contractor Quotation
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "contractor_quotation", columnDefinition = "bytea")
    private byte[] contractorQuotation;

    @Column(name = "contractor_quotation_file_name", length = 255)
    private String contractorQuotationFileName;

    // 11. Plot Property Ownership Document
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "plot_property_ownership_document", columnDefinition = "bytea")
    private byte[] plotPropertyOwnershipDocument;

    @Column(name = "plot_property_ownership_file_name", length = 255)
    private String plotPropertyOwnershipFileName;

    // 12. Sale Agreement
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "sale_agreement", columnDefinition = "bytea")
    private byte[] saleAgreement;

    @Column(name = "sale_agreement_file_name", length = 255)
    private String saleAgreementFileName;

    // 13. Plot Quotation / Cost Sheet
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "plot_quotation_cost_sheet", columnDefinition = "bytea")
    private byte[] plotQuotationCostSheet;

    @Column(name = "plot_quotation_cost_sheet_file_name", length = 255)
    private String plotQuotationCostSheetFileName;

    // 14. Sale Agreement / Allotment Letter
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "sale_agreement_allotment_letter", columnDefinition = "bytea")
    private byte[] saleAgreementAllotmentLetter;

    @Column(name = "sale_agreement_allotment_letter_file_name", length = 255)
    private String saleAgreementAllotmentLetterFileName;

    // 15. Existing Loan Statement / Account Document
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "existing_loan_statement_account_document", columnDefinition = "bytea")
    private byte[] existingLoanStatementAccountDocument;

    @Column(name = "existing_loan_statement_account_file_name", length = 255)
    private String existingLoanStatementAccountFileName;

    // 16. Property Document Copy
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "property_document_copy", columnDefinition = "bytea")
    private byte[] propertyDocumentCopy;

    @Column(name = "property_document_copy_file_name", length = 255)
    private String propertyDocumentCopyFileName;

    // 17. Foreclosure / Outstanding Statement
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "foreclosure_outstanding_statement", columnDefinition = "bytea")
    private byte[] foreclosureOutstandingStatement;

    @Column(name = "foreclosure_outstanding_file_name", length = 255)
    private String foreclosureOutstandingFileName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public byte[] getFileContent(PropertyDocumentType type) {
        if (type == null) return null;
        return switch (type) {
            case PROPERTY_SALE_AGREEMENT_DOCUMENT -> propertySaleAgreementDocument;
            case BANK_STATEMENT_INCOME_DOCUMENT -> bankStatementIncomeDocument;
            case PROPERTY_QUOTATION_BUILDER_DOCUMENT -> propertyQuotationBuilderDocument;
            case ADDITIONAL_PROPERTY_DOCUMENT -> additionalPropertyDocument;
            case PROPERTY_OWNERSHIP_DOCUMENT -> propertyOwnershipDocument;
            case CONSTRUCTION_DOCUMENT -> constructionDocument;
            case SANCTIONED_BUILDING_PLAN -> sanctionedBuildingPlan;
            case CONSTRUCTION_COST_ESTIMATE -> constructionCostEstimate;
            case RENOVATION_COST_ESTIMATE -> renovationCostEstimate;
            case CONTRACTOR_QUOTATION -> contractorQuotation;
            case PLOT_PROPERTY_OWNERSHIP_DOCUMENT -> plotPropertyOwnershipDocument;
            case SALE_AGREEMENT -> saleAgreement;
            case PLOT_QUOTATION_COST_SHEET -> plotQuotationCostSheet;
            case SALE_AGREEMENT_ALLOTMENT_LETTER -> saleAgreementAllotmentLetter;
            case EXISTING_LOAN_STATEMENT_ACCOUNT_DOCUMENT -> existingLoanStatementAccountDocument;
            case PROPERTY_DOCUMENT_COPY -> propertyDocumentCopy;
            case FORECLOSURE_OUTSTANDING_STATEMENT -> foreclosureOutstandingStatement;
        };
    }

    public String getFileName(PropertyDocumentType type) {
        if (type == null) return null;
        return switch (type) {
            case PROPERTY_SALE_AGREEMENT_DOCUMENT -> propertySaleAgreementFileName;
            case BANK_STATEMENT_INCOME_DOCUMENT -> bankStatementIncomeFileName;
            case PROPERTY_QUOTATION_BUILDER_DOCUMENT -> propertyQuotationBuilderFileName;
            case ADDITIONAL_PROPERTY_DOCUMENT -> additionalPropertyFileName;
            case PROPERTY_OWNERSHIP_DOCUMENT -> propertyOwnershipFileName;
            case CONSTRUCTION_DOCUMENT -> constructionFileName;
            case SANCTIONED_BUILDING_PLAN -> sanctionedBuildingPlanFileName;
            case CONSTRUCTION_COST_ESTIMATE -> constructionCostEstimateFileName;
            case RENOVATION_COST_ESTIMATE -> renovationCostEstimateFileName;
            case CONTRACTOR_QUOTATION -> contractorQuotationFileName;
            case PLOT_PROPERTY_OWNERSHIP_DOCUMENT -> plotPropertyOwnershipFileName;
            case SALE_AGREEMENT -> saleAgreementFileName;
            case PLOT_QUOTATION_COST_SHEET -> plotQuotationCostSheetFileName;
            case SALE_AGREEMENT_ALLOTMENT_LETTER -> saleAgreementAllotmentLetterFileName;
            case EXISTING_LOAN_STATEMENT_ACCOUNT_DOCUMENT -> existingLoanStatementAccountFileName;
            case PROPERTY_DOCUMENT_COPY -> propertyDocumentCopyFileName;
            case FORECLOSURE_OUTSTANDING_STATEMENT -> foreclosureOutstandingFileName;
        };
    }

    public void setFileContent(PropertyDocumentType type, byte[] data, String fileName) {
        if (type == null) return;
        switch (type) {
            case PROPERTY_SALE_AGREEMENT_DOCUMENT -> {
                this.propertySaleAgreementDocument = data;
                this.propertySaleAgreementFileName = fileName;
            }
            case BANK_STATEMENT_INCOME_DOCUMENT -> {
                this.bankStatementIncomeDocument = data;
                this.bankStatementIncomeFileName = fileName;
            }
            case PROPERTY_QUOTATION_BUILDER_DOCUMENT -> {
                this.propertyQuotationBuilderDocument = data;
                this.propertyQuotationBuilderFileName = fileName;
            }
            case ADDITIONAL_PROPERTY_DOCUMENT -> {
                this.additionalPropertyDocument = data;
                this.additionalPropertyFileName = fileName;
            }
            case PROPERTY_OWNERSHIP_DOCUMENT -> {
                this.propertyOwnershipDocument = data;
                this.propertyOwnershipFileName = fileName;
            }
            case CONSTRUCTION_DOCUMENT -> {
                this.constructionDocument = data;
                this.constructionFileName = fileName;
            }
            case SANCTIONED_BUILDING_PLAN -> {
                this.sanctionedBuildingPlan = data;
                this.sanctionedBuildingPlanFileName = fileName;
            }
            case CONSTRUCTION_COST_ESTIMATE -> {
                this.constructionCostEstimate = data;
                this.constructionCostEstimateFileName = fileName;
            }
            case RENOVATION_COST_ESTIMATE -> {
                this.renovationCostEstimate = data;
                this.renovationCostEstimateFileName = fileName;
            }
            case CONTRACTOR_QUOTATION -> {
                this.contractorQuotation = data;
                this.contractorQuotationFileName = fileName;
            }
            case PLOT_PROPERTY_OWNERSHIP_DOCUMENT -> {
                this.plotPropertyOwnershipDocument = data;
                this.plotPropertyOwnershipFileName = fileName;
            }
            case SALE_AGREEMENT -> {
                this.saleAgreement = data;
                this.saleAgreementFileName = fileName;
            }
            case PLOT_QUOTATION_COST_SHEET -> {
                this.plotQuotationCostSheet = data;
                this.plotQuotationCostSheetFileName = fileName;
            }
            case SALE_AGREEMENT_ALLOTMENT_LETTER -> {
                this.saleAgreementAllotmentLetter = data;
                this.saleAgreementAllotmentLetterFileName = fileName;
            }
            case EXISTING_LOAN_STATEMENT_ACCOUNT_DOCUMENT -> {
                this.existingLoanStatementAccountDocument = data;
                this.existingLoanStatementAccountFileName = fileName;
            }
            case PROPERTY_DOCUMENT_COPY -> {
                this.propertyDocumentCopy = data;
                this.propertyDocumentCopyFileName = fileName;
            }
            case FORECLOSURE_OUTSTANDING_STATEMENT -> {
                this.foreclosureOutstandingStatement = data;
                this.foreclosureOutstandingFileName = fileName;
            }
        }
    }

    public boolean hasDocument(PropertyDocumentType type) {
        byte[] content = getFileContent(type);
        return content != null && content.length > 0;
    }
}
