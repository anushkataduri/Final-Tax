package com.taxedge.itr.taxnotice.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.validator.GstFileUploadValidator;
import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.taxnotice.dto.TaxNoticeAssistanceDto;
import com.taxedge.itr.taxnotice.entity.TaxNoticeAssistance;
import com.taxedge.itr.taxnotice.mapper.TaxNoticeAssistanceMapper;
import com.taxedge.itr.taxnotice.repository.TaxNoticeAssistanceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TaxNoticeAssistanceServiceImpl implements TaxNoticeAssistanceService {

	private final TaxNoticeAssistanceRepository taxNoticeAssistanceRepository;
	private final CustomerRepository customerRepository;
	private final TaxNoticeAssistanceMapper taxNoticeAssistanceMapper;
	private final GstFileUploadValidator fileUploadValidator;

	@Override
	public String createTaxNotice(TaxNoticeAssistanceDto dto, MultipartFile file) throws IOException {

		Customer customer = customerRepository.findById(dto.getCustomerId())
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));

		TaxNoticeAssistance taxNotice = TaxNoticeAssistance.builder()
				.noticeId("TNA" + UUID.randomUUID().toString().replace("-", ""))
				.permanentAccountNumber(dto.getPermanentAccountNumber()).assessmentYear(dto.getAssessmentYear())
				.noticeTypeSection(dto.getNoticeTypeSection()).noticeDate(dto.getNoticeDate())
				.noticeReferenceNumberDin(dto.getNoticeReferenceNumberDin()).responseDueDate(dto.getResponseDueDate())
				.message(dto.getMessage()).noticeDocument(storeFile(file, "taxNotice")).customer(customer).build();

		taxNoticeAssistanceRepository.save(taxNotice);

		return "Tax notice details registered successfully. Notice ID: " + taxNotice.getNoticeId();
	}

	@Override
	@Transactional(readOnly = true)
	public TaxNoticeAssistanceDto getTaxNotice(String noticeId) {

		TaxNoticeAssistance taxNotice = taxNoticeAssistanceRepository.findById(noticeId).orElseThrow(
				() -> new ResourceNotFoundException("Tax notice details not found with noticeId: " + noticeId));

		return taxNoticeAssistanceMapper.toDto(taxNotice);
	}

	@Override
	public String updateTaxNotice(String noticeId, TaxNoticeAssistanceDto dto, MultipartFile file) throws IOException {

		TaxNoticeAssistance taxNotice = taxNoticeAssistanceRepository.findById(noticeId).orElseThrow(
				() -> new ResourceNotFoundException("Tax notice details not found with noticeId: " + noticeId));

		taxNoticeAssistanceMapper.updateEntity(dto, taxNotice);

		if (file != null && !file.isEmpty()) {
			fileUploadValidator.validate(file, "taxNotice");
			taxNotice.setNoticeDocument(file.getBytes());
		}

		taxNoticeAssistanceRepository.save(taxNotice);

		return "Tax notice details updated successfully. Notice ID: " + taxNotice.getNoticeId();
	}

	private byte[] storeFile(MultipartFile file, String documentType) throws IOException {

		if (file == null || file.isEmpty()) {
			return null;
		}

		fileUploadValidator.validate(file, documentType);

		return file.getBytes();
	}
}