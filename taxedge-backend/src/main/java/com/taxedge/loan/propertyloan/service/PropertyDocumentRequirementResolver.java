package com.taxedge.loan.propertyloan.service;

import java.util.List;

import org.springframework.stereotype.Component;

import com.taxedge.loan.propertyloan.enums.PropertyDocumentType;
import com.taxedge.loan.propertyloan.enums.PropertyLoanPurpose;

@Component
public class PropertyDocumentRequirementResolver {

    public record DocumentRequirementSpec(
            PropertyDocumentType documentType,
            boolean mandatory
    ) {}

    public List<DocumentRequirementSpec> resolve(PropertyLoanPurpose purpose) {
        if (purpose == null) {
            return List.of();
        }

        return switch (purpose) {
            case HOME_PURCHASE -> List.of(
                    new DocumentRequirementSpec(PropertyDocumentType.PROPERTY_SALE_AGREEMENT_DOCUMENT, true),
                    new DocumentRequirementSpec(PropertyDocumentType.BANK_STATEMENT_INCOME_DOCUMENT, true),
                    new DocumentRequirementSpec(PropertyDocumentType.PROPERTY_QUOTATION_BUILDER_DOCUMENT, false),
                    new DocumentRequirementSpec(PropertyDocumentType.ADDITIONAL_PROPERTY_DOCUMENT, false)
            );
            case HOME_CONSTRUCTION -> List.of(
                    new DocumentRequirementSpec(PropertyDocumentType.PROPERTY_OWNERSHIP_DOCUMENT, true),
                    new DocumentRequirementSpec(PropertyDocumentType.CONSTRUCTION_DOCUMENT, false),
                    new DocumentRequirementSpec(PropertyDocumentType.SANCTIONED_BUILDING_PLAN, false),
                    new DocumentRequirementSpec(PropertyDocumentType.CONSTRUCTION_COST_ESTIMATE, false),
                    new DocumentRequirementSpec(PropertyDocumentType.ADDITIONAL_PROPERTY_DOCUMENT, false)
            );
            case HOME_RENOVATION -> List.of(
                    new DocumentRequirementSpec(PropertyDocumentType.PROPERTY_OWNERSHIP_DOCUMENT, true),
                    new DocumentRequirementSpec(PropertyDocumentType.RENOVATION_COST_ESTIMATE, false),
                    new DocumentRequirementSpec(PropertyDocumentType.CONTRACTOR_QUOTATION, false),
                    new DocumentRequirementSpec(PropertyDocumentType.ADDITIONAL_PROPERTY_DOCUMENT, false)
            );
            case PLOT_PURCHASE -> List.of(
                    new DocumentRequirementSpec(PropertyDocumentType.PLOT_PROPERTY_OWNERSHIP_DOCUMENT, true),
                    new DocumentRequirementSpec(PropertyDocumentType.SALE_AGREEMENT, false),
                    new DocumentRequirementSpec(PropertyDocumentType.PLOT_QUOTATION_COST_SHEET, false),
                    new DocumentRequirementSpec(PropertyDocumentType.ADDITIONAL_PROPERTY_DOCUMENT, false)
            );
            case PLOT_CONSTRUCTION -> List.of(
                    new DocumentRequirementSpec(PropertyDocumentType.PLOT_PROPERTY_OWNERSHIP_DOCUMENT, true),
                    new DocumentRequirementSpec(PropertyDocumentType.CONSTRUCTION_COST_ESTIMATE, false),
                    new DocumentRequirementSpec(PropertyDocumentType.SANCTIONED_BUILDING_PLAN, false),
                    new DocumentRequirementSpec(PropertyDocumentType.SALE_AGREEMENT_ALLOTMENT_LETTER, false)
            );
            case BALANCE_TRANSFER -> List.of(
                    new DocumentRequirementSpec(PropertyDocumentType.EXISTING_LOAN_STATEMENT_ACCOUNT_DOCUMENT, true),
                    new DocumentRequirementSpec(PropertyDocumentType.PROPERTY_DOCUMENT_COPY, false),
                    new DocumentRequirementSpec(PropertyDocumentType.FORECLOSURE_OUTSTANDING_STATEMENT, false)
            );
            case OTHER -> List.of(
                    new DocumentRequirementSpec(PropertyDocumentType.PROPERTY_SALE_AGREEMENT_DOCUMENT, true),
                    new DocumentRequirementSpec(PropertyDocumentType.BANK_STATEMENT_INCOME_DOCUMENT, true),
                    new DocumentRequirementSpec(PropertyDocumentType.PROPERTY_QUOTATION_BUILDER_DOCUMENT, false),
                    new DocumentRequirementSpec(PropertyDocumentType.ADDITIONAL_PROPERTY_DOCUMENT, false)
            );
        };
    }
}
