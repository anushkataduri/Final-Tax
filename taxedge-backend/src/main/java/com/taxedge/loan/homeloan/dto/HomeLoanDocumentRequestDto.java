
package com.taxedge.loan.homeloan.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeLoanDocumentRequestDto {

    private MultipartFile propertyOwnershipDocument;

    private MultipartFile bankStatementIncomeDocument;

    private MultipartFile propertyQuotationBuilderDocument;

    private MultipartFile additionalPropertyDocument;

    private MultipartFile constructionDocument;

    private MultipartFile sanctionedBuildingPlan;

    private MultipartFile constructionCostEstimate;

    private MultipartFile renovationCostEstimate;

    private MultipartFile contractorQuotation;

    private MultipartFile existingLoanStatement;

    private MultipartFile propertyDocumentCopy;

    private MultipartFile foreclosureOutstandingStatement;
}
