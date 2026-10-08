package com.taxedge.loan.workingcapitalloan.service;

import com.taxedge.loan.workingcapitalloan.dto.WorkingCapitalDocumentDto;

public interface WorkingCapitalDocumentService {

    String saveDocuments(String workingCapitalId, WorkingCapitalDocumentDto dto);

    String updateDocuments(String workingCapitalId, WorkingCapitalDocumentDto dto);

    WorkingCapitalDocumentDto getDocuments(String workingCapitalId);
}
