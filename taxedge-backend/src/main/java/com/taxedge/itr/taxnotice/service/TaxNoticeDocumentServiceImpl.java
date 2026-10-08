package com.taxedge.itr.taxnotice.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.validator.GstFileUploadValidator;
import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.taxnotice.dto.TaxNoticeDocumentDto;
import com.taxedge.itr.taxnotice.entity.TaxNoticeAssistance;
import com.taxedge.itr.taxnotice.entity.TaxNoticeDocument;
import com.taxedge.itr.taxnotice.enums.TaxNoticeDocumentType;
import com.taxedge.itr.taxnotice.mapper.TaxNoticeDocumentMapper;
import com.taxedge.itr.taxnotice.repository.TaxNoticeAssistanceRepository;
import com.taxedge.itr.taxnotice.repository.TaxNoticeDocumentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TaxNoticeDocumentServiceImpl implements TaxNoticeDocumentService {

	private final TaxNoticeDocumentRepository taxNoticeDocumentRepository;

	private final TaxNoticeAssistanceRepository taxNoticeAssistanceRepository;

	private final TaxNoticeDocumentMapper taxNoticeDocumentMapper;

	private final GstFileUploadValidator fileUploadValidator;

	@Override
	public String registerDocuments(String noticeId, TaxNoticeDocumentDto dto, MultipartFile taxNotice,
			MultipartFile previousItr, MultipartFile itrAcknowledgement, MultipartFile form1616a, MultipartFile aisAy,
			MultipartFile tis, MultipartFile bankStatement, MultipartFile supportingIncomeDocuments,
			MultipartFile supportingExpenseDocuments, MultipartFile previousTaxResponses,
			MultipartFile otherNoticeSpecificDocuments) throws IOException {

		TaxNoticeAssistance taxNoticeAssistance = taxNoticeAssistanceRepository.findById(noticeId)
				.orElseThrow(() -> new ResourceNotFoundException("Tax notice not found with noticeId: " + noticeId));

		validateAtLeastOneDocument(taxNotice, previousItr, itrAcknowledgement, form1616a, aisAy, tis, bankStatement,
				supportingIncomeDocuments, supportingExpenseDocuments, previousTaxResponses,
				otherNoticeSpecificDocuments);

		if (taxNoticeDocumentRepository.findByTaxNoticeAssistanceNoticeId(noticeId).isPresent()) {

			throw new IllegalArgumentException("Documents already exist for notice ID: " + noticeId);
		}

		TaxNoticeDocumentDto documentDto = TaxNoticeDocumentDto.builder().noticeId(noticeId)
				.taxNotice(storeFile(taxNotice, TaxNoticeDocumentType.TAX_NOTICE))
				.previousItr(storeFile(previousItr, TaxNoticeDocumentType.PREVIOUS_ITR))
				.itrAcknowledgement(storeFile(itrAcknowledgement, TaxNoticeDocumentType.ITR_ACKNOWLEDGEMENT))
				.form1616a(storeFile(form1616a, TaxNoticeDocumentType.FORM_16_16A))
				.aisAy(storeFile(aisAy, TaxNoticeDocumentType.AIS_AY)).tis(storeFile(tis, TaxNoticeDocumentType.TIS))
				.bankStatement(storeFile(bankStatement, TaxNoticeDocumentType.BANK_STATEMENT))
				.supportingIncomeDocuments(
						storeFile(supportingIncomeDocuments, TaxNoticeDocumentType.SUPPORTING_INCOME_DOCUMENTS))
				.supportingExpenseDocuments(
						storeFile(supportingExpenseDocuments, TaxNoticeDocumentType.SUPPORTING_EXPENSE_DOCUMENTS))
				.previousTaxResponses(storeFile(previousTaxResponses, TaxNoticeDocumentType.PREVIOUS_TAX_RESPONSES))
				.otherNoticeSpecificDocuments(
						storeFile(otherNoticeSpecificDocuments, TaxNoticeDocumentType.OTHER_NOTICE_SPECIFIC_DOCUMENTS))
				.message(dto.getMessage()).build();

		TaxNoticeDocument document = taxNoticeDocumentMapper.toEntity(documentDto);

		document.setDocumentId("TND" + UUID.randomUUID().toString().replace("-", ""));

		document.setTaxNoticeAssistance(taxNoticeAssistance);

		taxNoticeDocumentRepository.save(document);

		return "Tax notice documents registered successfully. Document ID: " + document.getDocumentId();
	}

	@Override
	@Transactional(readOnly = true)
	public TaxNoticeDocumentDto getDocuments(String documentId) {

		TaxNoticeDocument document = taxNoticeDocumentRepository.findById(documentId).orElseThrow(
				() -> new ResourceNotFoundException("Tax notice documents not found with document ID: " + documentId));

		return taxNoticeDocumentMapper.toDto(document);
	}

	@Override
	public String updateDocuments(String documentId, TaxNoticeDocumentDto dto, MultipartFile taxNotice,
			MultipartFile previousItr, MultipartFile itrAcknowledgement, MultipartFile form1616a, MultipartFile aisAy,
			MultipartFile tis, MultipartFile bankStatement, MultipartFile supportingIncomeDocuments,
			MultipartFile supportingExpenseDocuments, MultipartFile previousTaxResponses,
			MultipartFile otherNoticeSpecificDocuments) throws IOException {

		TaxNoticeDocument document = taxNoticeDocumentRepository.findById(documentId).orElseThrow(
				() -> new ResourceNotFoundException("Tax notice documents not found with document ID: " + documentId));

		validateAtLeastOneDocument(taxNotice, previousItr, itrAcknowledgement, form1616a, aisAy, tis, bankStatement,
				supportingIncomeDocuments, supportingExpenseDocuments, previousTaxResponses,
				otherNoticeSpecificDocuments);

		updateFile(document, taxNotice, TaxNoticeDocumentType.TAX_NOTICE);

		updateFile(document, previousItr, TaxNoticeDocumentType.PREVIOUS_ITR);

		updateFile(document, itrAcknowledgement, TaxNoticeDocumentType.ITR_ACKNOWLEDGEMENT);

		updateFile(document, form1616a, TaxNoticeDocumentType.FORM_16_16A);

		updateFile(document, aisAy, TaxNoticeDocumentType.AIS_AY);

		updateFile(document, tis, TaxNoticeDocumentType.TIS);

		updateFile(document, bankStatement, TaxNoticeDocumentType.BANK_STATEMENT);

		updateFile(document, supportingIncomeDocuments, TaxNoticeDocumentType.SUPPORTING_INCOME_DOCUMENTS);

		updateFile(document, supportingExpenseDocuments, TaxNoticeDocumentType.SUPPORTING_EXPENSE_DOCUMENTS);

		updateFile(document, previousTaxResponses, TaxNoticeDocumentType.PREVIOUS_TAX_RESPONSES);

		updateFile(document, otherNoticeSpecificDocuments, TaxNoticeDocumentType.OTHER_NOTICE_SPECIFIC_DOCUMENTS);

		if (dto != null) {
			document.setMessage(dto.getMessage());
		}

		taxNoticeDocumentRepository.save(document);

		return "Tax notice documents updated successfully. Document ID: " + document.getDocumentId();
	}

	@Override
	public String deleteDocuments(String documentId) {

		TaxNoticeDocument document = taxNoticeDocumentRepository.findById(documentId).orElseThrow(
				() -> new ResourceNotFoundException("Tax notice documents not found with documentId: " + documentId));

		taxNoticeDocumentRepository.delete(document);

		return "Tax notice documents deleted successfully";
	}

	private byte[] storeFile(MultipartFile file, TaxNoticeDocumentType documentType) throws IOException {

		if (file == null || file.isEmpty()) {
			return null;
		}

		fileUploadValidator.validate(file, documentType.name());

		return file.getBytes();
	}

	private void updateFile(TaxNoticeDocument document, MultipartFile file, TaxNoticeDocumentType documentType)
			throws IOException {

		if (file == null || file.isEmpty()) {
			return;
		}

		fileUploadValidator.validate(file, documentType.name());

		byte[] data = file.getBytes();

		switch (documentType) {

		case TAX_NOTICE -> document.setTaxNotice(data);

		case PREVIOUS_ITR -> document.setPreviousItr(data);

		case ITR_ACKNOWLEDGEMENT -> document.setItrAcknowledgement(data);

		case FORM_16_16A -> document.setForm1616a(data);

		case AIS_AY -> document.setAisAy(data);

		case TIS -> document.setTis(data);

		case BANK_STATEMENT -> document.setBankStatement(data);

		case SUPPORTING_INCOME_DOCUMENTS -> document.setSupportingIncomeDocuments(data);

		case SUPPORTING_EXPENSE_DOCUMENTS -> document.setSupportingExpenseDocuments(data);

		case PREVIOUS_TAX_RESPONSES -> document.setPreviousTaxResponses(data);

		case OTHER_NOTICE_SPECIFIC_DOCUMENTS -> document.setOtherNoticeSpecificDocuments(data);
		}
	}

	private void validateAtLeastOneDocument(MultipartFile taxNotice, MultipartFile previousItr,
			MultipartFile itrAcknowledgement, MultipartFile form1616a, MultipartFile aisAy, MultipartFile tis,
			MultipartFile bankStatement, MultipartFile supportingIncomeDocuments,
			MultipartFile supportingExpenseDocuments, MultipartFile previousTaxResponses,
			MultipartFile otherNoticeSpecificDocuments) {

		if (isEmpty(taxNotice) && isEmpty(previousItr) && isEmpty(itrAcknowledgement) && isEmpty(form1616a)
				&& isEmpty(aisAy) && isEmpty(tis) && isEmpty(bankStatement) && isEmpty(supportingIncomeDocuments)
				&& isEmpty(supportingExpenseDocuments) && isEmpty(previousTaxResponses)
				&& isEmpty(otherNoticeSpecificDocuments)) {

			throw new IllegalArgumentException("At least one document is required");
		}
	}

	private boolean isEmpty(MultipartFile file) {
		return file == null || file.isEmpty();
	}
}