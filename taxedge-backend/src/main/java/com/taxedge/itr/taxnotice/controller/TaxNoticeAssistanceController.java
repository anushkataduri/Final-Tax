package com.taxedge.itr.taxnotice.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taxedge.itr.taxnotice.dto.TaxNoticeAssistanceDto;
import com.taxedge.itr.taxnotice.dto.TaxNoticeDocumentDto;
import com.taxedge.itr.taxnotice.service.TaxNoticeAssistanceService;
import com.taxedge.itr.taxnotice.service.TaxNoticeDocumentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/itr/tax-notice")
@RequiredArgsConstructor
public class TaxNoticeAssistanceController {

	private final TaxNoticeAssistanceService taxNoticeAssistanceService;
	private final TaxNoticeDocumentService taxNoticeDocumentService;
	private final ObjectMapper objectMapper;

	@PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> createTaxNotice(@RequestPart("data") String data,
			@RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

		TaxNoticeAssistanceDto dto = objectMapper.readValue(data, TaxNoticeAssistanceDto.class);

		String result = taxNoticeAssistanceService.createTaxNotice(dto, file);

		return new ResponseEntity<>(result, HttpStatus.CREATED);
	}

	@GetMapping("/{noticeId}")
	public ResponseEntity<TaxNoticeAssistanceDto> getTaxNotice(@PathVariable String noticeId) {

		TaxNoticeAssistanceDto taxNotice = taxNoticeAssistanceService.getTaxNotice(noticeId);

		return ResponseEntity.ok(taxNotice);
	}

	@PutMapping(value = "/update/{noticeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> updateTaxNotice(@PathVariable String noticeId, @RequestPart("data") String data,
			@RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

		TaxNoticeAssistanceDto dto = objectMapper.readValue(data, TaxNoticeAssistanceDto.class);

		String result = taxNoticeAssistanceService.updateTaxNotice(noticeId, dto, file);

		return ResponseEntity.ok(result);
	}

	@PostMapping(value = "/{noticeId}/document/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> registerDocuments(@PathVariable String noticeId, @RequestPart("data") String data,
			@RequestPart(value = "taxNotice", required = false) MultipartFile taxNotice,
			@RequestPart(value = "previousItr", required = false) MultipartFile previousItr,
			@RequestPart(value = "itrAcknowledgement", required = false) MultipartFile itrAcknowledgement,
			@RequestPart(value = "form1616a", required = false) MultipartFile form1616a,
			@RequestPart(value = "aisAy", required = false) MultipartFile aisAy,
			@RequestPart(value = "tis", required = false) MultipartFile tis,
			@RequestPart(value = "bankStatement", required = false) MultipartFile bankStatement,
			@RequestPart(value = "supportingIncomeDocuments", required = false) MultipartFile supportingIncomeDocuments,
			@RequestPart(value = "supportingExpenseDocuments", required = false) MultipartFile supportingExpenseDocuments,
			@RequestPart(value = "previousTaxResponses", required = false) MultipartFile previousTaxResponses,
			@RequestPart(value = "otherNoticeSpecificDocuments", required = false) MultipartFile otherNoticeSpecificDocuments)
			throws IOException {

		TaxNoticeDocumentDto dto = objectMapper.readValue(data, TaxNoticeDocumentDto.class);

		String result = taxNoticeDocumentService.registerDocuments(noticeId, dto, taxNotice, previousItr,
				itrAcknowledgement, form1616a, aisAy, tis, bankStatement, supportingIncomeDocuments,
				supportingExpenseDocuments, previousTaxResponses, otherNoticeSpecificDocuments);

		return new ResponseEntity<>(result, HttpStatus.CREATED);
	}

	@GetMapping("/{documentId}/documents")
	public ResponseEntity<TaxNoticeDocumentDto> getDocuments(@PathVariable String documentId) {

		TaxNoticeDocumentDto documents = taxNoticeDocumentService.getDocuments(documentId);

		return ResponseEntity.ok(documents);
	}

	@PutMapping(value = "/{documentId}/documents/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> updateDocuments(@PathVariable String documentId, @RequestPart("data") String data,
			@RequestPart(value = "taxNotice", required = false) MultipartFile taxNotice,
			@RequestPart(value = "previousItr", required = false) MultipartFile previousItr,
			@RequestPart(value = "itrAcknowledgement", required = false) MultipartFile itrAcknowledgement,
			@RequestPart(value = "form1616a", required = false) MultipartFile form1616a,
			@RequestPart(value = "aisAy", required = false) MultipartFile aisAy,
			@RequestPart(value = "tis", required = false) MultipartFile tis,
			@RequestPart(value = "bankStatement", required = false) MultipartFile bankStatement,
			@RequestPart(value = "supportingIncomeDocuments", required = false) MultipartFile supportingIncomeDocuments,
			@RequestPart(value = "supportingExpenseDocuments", required = false) MultipartFile supportingExpenseDocuments,
			@RequestPart(value = "previousTaxResponses", required = false) MultipartFile previousTaxResponses,
			@RequestPart(value = "otherNoticeSpecificDocuments", required = false) MultipartFile otherNoticeSpecificDocuments)
			throws IOException {

		TaxNoticeDocumentDto dto = objectMapper.readValue(data, TaxNoticeDocumentDto.class);

		String result = taxNoticeDocumentService.updateDocuments(documentId, dto, taxNotice, previousItr,
				itrAcknowledgement, form1616a, aisAy, tis, bankStatement, supportingIncomeDocuments,
				supportingExpenseDocuments, previousTaxResponses, otherNoticeSpecificDocuments);

		return ResponseEntity.ok(result);
	}

	@DeleteMapping("/{documentId}/documents/delete")
	public ResponseEntity<String> deleteDocuments(@PathVariable String documentId) {

		String result = taxNoticeDocumentService.deleteDocuments(documentId);

		return ResponseEntity.ok(result);
	}
}