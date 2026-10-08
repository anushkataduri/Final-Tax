package com.taxedge.gst.amendment.service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.amendment.dto.PrincipalPlaceAmendmentViewDto;
import com.taxedge.gst.registration.entity.Business;
import com.taxedge.gst.amendment.entity.PrincipalPlaceAmendmentEntity;
import com.taxedge.gst.registration.enums.NatureOfPremises;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.amendment.mapper.PrincipalPlaceAmendmentMapper;
import com.taxedge.gst.amendment.repository.PrincipalPlaceAmendmentRepository;
import com.taxedge.gst.registration.repository.BusinessRepository;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PrincipalPlaceAmendmentServiceImpl implements PrincipalPlaceAmendmentService {

    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;
    private final PrincipalPlaceAmendmentRepository amendmentRepository;
    private final PrincipalPlaceAmendmentMapper amendmentMapper;

    private Customer resolveAndVerifyCustomer(String customerId, String gstId) {
        String resolvedCustId = null;

        if (customerId != null && !customerId.trim().isEmpty()) {
            resolvedCustId = customerId.trim();
        }

        if (resolvedCustId == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof JwtPrincipal principal) {
                resolvedCustId = principal.custId();
            } else if (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser")) {
                resolvedCustId = auth.getName();
            }
        }

        if (resolvedCustId == null && gstId != null && !gstId.trim().isEmpty()) {
            if (customerRepository.existsById(gstId.trim())) {
                resolvedCustId = gstId.trim();
            }
        }

        if (resolvedCustId == null || resolvedCustId.trim().isEmpty()) {
            throw new ResourceNotFoundException("Customer ID is required to submit amendment");
        }

        final String finalCustId = resolvedCustId;
        return customerRepository.findById(finalCustId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + finalCustId));
    }

    @Override
    public PrincipalPlaceAmendmentViewDto getExistingPrincipalPlaceDetails(String gstId) {
        Optional<Business> businessOpt = businessRepository.findById(gstId);
        if (businessOpt.isPresent()) {
            Business business = businessOpt.get();
            return PrincipalPlaceAmendmentViewDto.builder()
                    .newBusinessAddress(business.getBusinessAddress())
                    .newCity(business.getCity())
                    .newDistrict(business.getDistrict())
                    .newState(business.getState())
                    .newPinCode(business.getPinCode())
                    .businessGstId(business.getGstId())
                    .gstNumber(business.getGstId())
                    .build();
        }

        return PrincipalPlaceAmendmentViewDto.builder()
                .businessGstId(gstId)
                .gstNumber(gstId)
                .build();
    }

    @Override
    @Transactional
    public PrincipalPlaceAmendmentViewDto submitAmendment(String gstId, String customerId, String address, String city, String district,
                                                          String state, String pinCode, NatureOfPremises natureOfPremises,
                                                          MultipartFile file) throws IOException {

        Customer customer = resolveAndVerifyCustomer(customerId, gstId);
        String gstNumber = gstId != null ? gstId.trim() : "";

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting proof document is required for principal place amendment");
        }

        byte[] fileBytes = file.getBytes();

        PrincipalPlaceAmendmentViewDto inputDto = new PrincipalPlaceAmendmentViewDto();
        inputDto.setNewBusinessAddress(address);
        inputDto.setNewCity(city);
        inputDto.setNewDistrict(district);
        inputDto.setNewState(state);
        inputDto.setNewPinCode(pinCode);
        inputDto.setNatureOfPremises(natureOfPremises);
        inputDto.setGstNumber(gstNumber);
        inputDto.setImageData(fileBytes);

        PrincipalPlaceAmendmentEntity amendment = amendmentMapper.toEntity(inputDto);
        amendment.setCustomer(customer);

        amendment = amendmentRepository.save(amendment);

        return amendmentMapper.toDto(amendment);
    }

    @Override
    public PrincipalPlaceAmendmentViewDto getAmendmentById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        PrincipalPlaceAmendmentEntity entity = amendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No principal place amendment found with id: " + id));

        return amendmentMapper.toDto(entity);
    }

    @Override
    @Transactional
    public PrincipalPlaceAmendmentViewDto updateAmendment(Long id, String address, String city, String district,
                                                          String state, String pinCode, NatureOfPremises natureOfPremises,
                                                          MultipartFile file) throws IOException {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        PrincipalPlaceAmendmentEntity entity = amendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No principal place amendment found with id: " + id));

        if (address != null && !address.trim().isEmpty()) entity.setNewBusinessAddress(address);
        if (city != null && !city.trim().isEmpty()) entity.setNewCity(city);
        if (district != null && !district.trim().isEmpty()) entity.setNewDistrict(district);
        if (state != null && !state.trim().isEmpty()) entity.setNewState(state);
        if (pinCode != null && !pinCode.trim().isEmpty()) entity.setNewPinCode(pinCode);
        if (natureOfPremises != null) entity.setNatureOfPremises(natureOfPremises);
        if (file != null && !file.isEmpty()) {
            entity.setImageData(file.getBytes());
        }

        entity = amendmentRepository.save(entity);

        return amendmentMapper.toDto(entity);
    }
}
