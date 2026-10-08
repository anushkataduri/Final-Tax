package com.taxedge.gst.amendment.service;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.amendment.dto.AdditionalPlaceAmendmentViewDto;
import com.taxedge.gst.amendment.entity.AdditionalPlaceAmendmentEntity;
import com.taxedge.gst.amendment.mapper.AdditionalPlaceAmendmentMapper;
import com.taxedge.gst.amendment.repository.AdditionalPlaceAmendmentRepository;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.registration.enums.NatureOfPremises;
import com.taxedge.gst.registration.repository.BusinessRepository;
import com.taxedge.security.jwt.JwtPrincipal;

@Service
@RequiredArgsConstructor
public class AdditionalPlaceAmendmentServiceImpl implements AdditionalPlaceAmendmentService {

    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;
    private final AdditionalPlaceAmendmentRepository additionalPlaceRepository;
    private final AdditionalPlaceAmendmentMapper amendmentMapper;

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
    public List<AdditionalPlaceAmendmentViewDto> getExistingAdditionalPlaces(String gstId) {
        String gstNumber = gstId != null ? gstId.trim() : "";
        List<AdditionalPlaceAmendmentEntity> entities = additionalPlaceRepository.findByGstNumber(gstNumber);

        return entities.stream().map(amendmentMapper::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdditionalPlaceAmendmentViewDto submitAdditionalPlace(String gstId, String customerId, String address, String city, String pinCode,
                                                                 NatureOfPremises natureOfPremises, MultipartFile file) throws IOException {

        Customer customer = resolveAndVerifyCustomer(customerId, gstId);
        String gstNumber = gstId != null ? gstId.trim() : "";

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting proof document is required for an additional place of business");
        }

        byte[] fileBytes = file.getBytes();

        AdditionalPlaceAmendmentViewDto inputDto = new AdditionalPlaceAmendmentViewDto();
        inputDto.setAddress(address);
        inputDto.setCity(city);
        inputDto.setPinCode(pinCode);
        inputDto.setNatureOfPremises(natureOfPremises);
        inputDto.setGstNumber(gstNumber);
        inputDto.setImageData(fileBytes);

        AdditionalPlaceAmendmentEntity entity = amendmentMapper.toEntity(inputDto);
        entity.setCustomer(customer);

        entity = additionalPlaceRepository.save(entity);

        return amendmentMapper.toDto(entity);
    }

    @Override
    public AdditionalPlaceAmendmentViewDto getAmendmentById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        AdditionalPlaceAmendmentEntity entity = additionalPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No additional place amendment found with id: " + id));

        return amendmentMapper.toDto(entity);
    }

    @Override
    @Transactional
    public AdditionalPlaceAmendmentViewDto updateAdditionalPlace(Long id, String address, String city, String pinCode,
                                                                 NatureOfPremises natureOfPremises, MultipartFile file) throws IOException {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        AdditionalPlaceAmendmentEntity entity = additionalPlaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No additional place amendment found with id: " + id));

        if (address != null && !address.trim().isEmpty()) entity.setAddress(address);
        if (city != null && !city.trim().isEmpty()) entity.setCity(city);
        if (pinCode != null && !pinCode.trim().isEmpty()) entity.setPinCode(pinCode);
        if (natureOfPremises != null) entity.setNatureOfPremises(natureOfPremises);
        if (file != null && !file.isEmpty()) {
            entity.setImageData(file.getBytes());
        }

        entity = additionalPlaceRepository.save(entity);

        return amendmentMapper.toDto(entity);
    }
}
