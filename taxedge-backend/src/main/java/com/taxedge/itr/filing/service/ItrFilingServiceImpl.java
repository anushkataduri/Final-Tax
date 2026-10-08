package com.taxedge.itr.filing.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.filing.dto.ItrFilingPostDto;
import com.taxedge.itr.filing.entity.ItrFiling;
import com.taxedge.itr.filing.mapper.ItrFilingMapper;
import com.taxedge.itr.filing.repository.ItrFilingRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ItrFilingServiceImpl implements ItrFilingService {

	private final ItrFilingRepository itrFilingRepository;

	private final CustomerRepository customerRepository;

	private final ItrFilingMapper itrFilingMapper;

	@Override
	public String createItrFiling(ItrFilingPostDto dto) {

		Customer customer = customerRepository.findById(dto.getCustomerId())
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));

		ItrFiling itrFiling = itrFilingMapper.toEntity(dto);

		itrFiling.setCustomer(customer);

		String itrId = "ITR" + UUID.randomUUID().toString().replace("-", "");

		itrFiling.setItrId(itrId);

		itrFilingRepository.save(itrFiling);

		return "ITR Filing details registered successfully. ITR ID: " + itrId;
	}

	@Override
	public String updateItrFiling(String itrId, ItrFilingPostDto dto) {

		ItrFiling itrFiling = itrFilingRepository.findById(itrId)
				.orElseThrow(() -> new ResourceNotFoundException("ITR Filing details not found with ITR ID: " + itrId));

		itrFilingMapper.updateEntity(dto, itrFiling);

		itrFilingRepository.save(itrFiling);

		return "ITR Filing details updated successfully. ITR ID: " + itrFiling.getItrId();
	}

	@Override
	public ItrFiling getItrFiling(String itrId) {

		return itrFilingRepository.findById(itrId)
				.orElseThrow(() -> new ResourceNotFoundException("ITR Filing details not found with ITR ID: " + itrId));
	}
}