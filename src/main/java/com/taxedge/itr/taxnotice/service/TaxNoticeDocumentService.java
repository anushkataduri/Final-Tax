package com.taxedge.itr.taxnotice.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.itr.taxnotice.dto.TaxNoticeDocumentDto;

public interface TaxNoticeDocumentService {

	String registerDocuments(String noticeId, TaxNoticeDocumentDto dto, MultipartFile taxNotice,
			MultipartFile previousItr, MultipartFile itrAcknowledgement, MultipartFile form1616a, MultipartFile aisAy,
			MultipartFile tis, MultipartFile bankStatement, MultipartFile supportingIncomeDocuments,
			MultipartFile supportingExpenseDocuments, MultipartFile previousTaxResponses,
			MultipartFile otherNoticeSpecificDocuments) throws IOException;

	TaxNoticeDocumentDto getDocuments(String documentId);

	String updateDocuments(String documentId, TaxNoticeDocumentDto dto, MultipartFile taxNotice,
			MultipartFile previousItr, MultipartFile itrAcknowledgement, MultipartFile form1616a, MultipartFile aisAy,
			MultipartFile tis, MultipartFile bankStatement, MultipartFile supportingIncomeDocuments,
			MultipartFile supportingExpenseDocuments, MultipartFile previousTaxResponses,
			MultipartFile otherNoticeSpecificDocuments) throws IOException;

	String deleteDocuments(String documentId);
}