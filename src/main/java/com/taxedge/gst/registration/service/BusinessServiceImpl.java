package com.taxedge.gst.registration.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.registration.dto.BusinessRequest;
import com.taxedge.gst.registration.dto.BusinessResponse;
import com.taxedge.gst.registration.dto.BusinessUpdateRequest;
import com.taxedge.gst.registration.entity.Business;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.registration.mapper.BusinessMapper;
import com.taxedge.gst.registration.repository.BusinessRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BusinessServiceImpl implements BusinessService {

	private final BusinessRepository businessRepository;

	private final CustomerRepository customerRepository;

	private final BusinessMapper businessMapper;

	@Override
	public String registerBusiness(BusinessRequest businessRequest) {

		Customer customer = customerRepository.findById(businessRequest.getCustomerId()).orElseThrow(
				() -> new ResourceNotFoundException("Customer not found with ID: " + businessRequest.getCustomerId()));

		String gstId = "GST" + UUID.randomUUID().toString().replace("-", "");

		Business business = Business.builder().gstId(gstId).customer(customer).legalName(businessRequest.getLegalName())
				.tradeName(businessRequest.getTradeName())
				.constitutionOfBusiness(businessRequest.getConstitutionOfBusiness())
				.natureOfBusiness(businessRequest.getNatureOfBusiness())
				.dateOfCommencement(businessRequest.getDateOfCommencement())
				.reasonForRegistration(businessRequest.getReasonForRegistration())
				.compositionScheme(businessRequest.getCompositionScheme())
				.placeOfBusiness(businessRequest.getPlaceOfBusiness())
				.businessAddress(businessRequest.getBusinessAddress()).city(businessRequest.getCity())
				.district(businessRequest.getDistrict()).state(businessRequest.getState())
				.pinCode(businessRequest.getPinCode()).hsnSac(businessRequest.getHsnSac())
				.accountHolderName(businessRequest.getAccountHolderName())
				.bankAccountNumber(businessRequest.getBankAccountNumber()).ifscCode(businessRequest.getIfscCode())
				.bankName(businessRequest.getBankName()).branchName(businessRequest.getBranchName())
				.accountType(businessRequest.getAccountType())
				.authorisedSignatory(businessRequest.getAuthorisedSignatory())
				.signatoryName(businessRequest.getSignatoryName()).signatoryPan(businessRequest.getSignatoryPan())
				.signatoryDob(businessRequest.getSignatoryDob()).designation(businessRequest.getDesignation())
				.signatoryMobile(businessRequest.getSignatoryMobile())
				.signatoryEmail(businessRequest.getSignatoryEmail()).build();

		businessRepository.save(business);

		return "Business details registered successfully. Business ID: " + gstId;
	}

	@Override
	@Transactional(readOnly = true)
	public BusinessResponse getBusiness(String gstId) {

		Business business = businessRepository.findById(gstId)
				.orElseThrow(() -> new ResourceNotFoundException("Business not found with gstId: " + gstId));

		return businessMapper.toResponse(business);
	}

	@Override
	public String updateBusiness(String gstId, BusinessUpdateRequest businessUpdateRequest) {

		Business business = businessRepository.findById(gstId)
				.orElseThrow(() -> new ResourceNotFoundException("Business not found with gstId: " + gstId));

		businessMapper.updateEntity(businessUpdateRequest, business);

		businessRepository.save(business);

		return "Business details updated successfully";
	}

	@Override
	public String deleteBusiness(String gstId) {

		Business business = businessRepository.findById(gstId)
				.orElseThrow(() -> new ResourceNotFoundException("Business not found with gstId: " + gstId));

		businessRepository.delete(business);

		return "Business details deleted successfully";
	}
}