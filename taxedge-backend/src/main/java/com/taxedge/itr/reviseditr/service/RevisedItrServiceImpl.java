package com.taxedge.itr.reviseditr.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.reviseditr.dto.RevisedItrDto;
import com.taxedge.itr.reviseditr.entity.RevisedItr;
import com.taxedge.itr.reviseditr.mapper.RevisedItrMapper;
import com.taxedge.itr.reviseditr.repository.RevisedItrRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevisedItrServiceImpl implements RevisedItrService {

	private final RevisedItrRepository revisedItrRepository;
	private final CustomerRepository customerRepository;
	private final RevisedItrMapper revisedItrMapper;

	@Override
	public String createRevisedItr(RevisedItrDto dto) {

		Customer customer = customerRepository.findById(dto.getCustomerId())
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));

		RevisedItr revisedItr = RevisedItr.builder()
				.revisedItrId("RITR" + UUID.randomUUID().toString().replace("-", ""))
				.itrAcknowledgementNumber(dto.getItrAcknowledgementNumber()).assessmentYear(dto.getAssessmentYear())
				.customer(customer).build();

		revisedItrRepository.save(revisedItr);

		return "Revised ITR details registered successfully. Revised ITR ID: " + revisedItr.getRevisedItrId();
	}

	@Override
	public RevisedItrDto getRevisedItr(String revisedItrId) {

		RevisedItr revisedItr = revisedItrRepository.findById(revisedItrId)
				.orElseThrow(() -> new ResourceNotFoundException("Revised ITR not found with ID: " + revisedItrId));

		RevisedItrDto dto = RevisedItrDto.builder().customerId(revisedItr.getCustomer().getCustId())
				.itrAcknowledgementNumber(revisedItr.getItrAcknowledgementNumber())
				.assessmentYear(revisedItr.getAssessmentYear()).build();

		return dto;
	}

	@Override
	public String updateRevisedItr(String revisedItrId, RevisedItrDto dto) {

		RevisedItr revisedItr = revisedItrRepository.findById(revisedItrId)
				.orElseThrow(() -> new ResourceNotFoundException("Revised ITR not found with ID: " + revisedItrId));

		revisedItrMapper.updateEntity(dto, revisedItr);

		revisedItrRepository.save(revisedItr);

		return "Revised ITR details updated successfully. Revised ITR ID: "
        + revisedItr.getRevisedItrId();
	}
}