package com.taxedge.loan.homeloan.service;

import com.taxedge.loan.homeloan.dto.HomeLoanDocumentDto;

public interface HomeLoanDocumentService {

    String saveDocuments(String homeLoanId, HomeLoanDocumentDto dto);

    String updateDocuments(String homeLoanId, HomeLoanDocumentDto dto);

    HomeLoanDocumentDto getDocuments(String homeLoanId);
}
