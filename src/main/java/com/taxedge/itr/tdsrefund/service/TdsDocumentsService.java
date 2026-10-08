package com.taxedge.itr.tdsrefund.service;

import com.taxedge.itr.tdsrefund.dto.TdsDocumentsDto;

public interface TdsDocumentsService {

    String saveDocuments(TdsDocumentsDto dto);

    String updateDocuments(Long id, TdsDocumentsDto dto);
    
    TdsDocumentsDto      getDocuments(String tdsRefundId);
}
