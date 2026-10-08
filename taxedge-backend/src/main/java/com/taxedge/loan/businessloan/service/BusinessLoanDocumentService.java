package com.taxedge.loan.businessloan.service;

import com.taxedge.loan.businessloan.dto.BusinessLoanDocumentDto;

public interface BusinessLoanDocumentService {

    String saveDocuments(BusinessLoanDocumentDto dto);

    String updateDocuments(String loanApplicationId, BusinessLoanDocumentDto dto);

    BusinessLoanDocumentDto getDocuments(String loanApplicationId);
}
