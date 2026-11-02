package com.taxedge.loan.propertyloan.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.loan.propertyloan.dto.PropertyLoanDocumentItemResponse;
import com.taxedge.loan.propertyloan.entity.PropertyLoanDocument;
import com.taxedge.loan.propertyloan.enums.PropertyDocumentType;

public interface PropertyLoanDocumentService {

    PropertyLoanDocumentItemResponse uploadDocument(String loanApplicationId, PropertyDocumentType documentType, MultipartFile file);

    List<PropertyLoanDocumentItemResponse> getDocuments(String loanApplicationId);

    PropertyLoanDocument downloadDocument(String loanApplicationId, PropertyDocumentType documentType);

    void deleteDocument(String loanApplicationId, PropertyDocumentType documentType);
}
