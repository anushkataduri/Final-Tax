package com.taxedge.gst.amendment.service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.amendment.dto.ContactAmendmentViewDto;
import com.taxedge.gst.registration.entity.Business;
import com.taxedge.gst.amendment.entity.ContactAmendmentEntity;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.registration.repository.BusinessRepository;
import com.taxedge.gst.amendment.mapper.ContactAmendmentMapper;
import com.taxedge.gst.amendment.repository.ContactAmendmentRepository;
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
public class ContactAmendmentServiceImpl implements ContactAmendmentService {

    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;
    private final ContactAmendmentRepository contactAmendmentRepository;
    private final ContactAmendmentMapper amendmentMapper;

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
    public ContactAmendmentViewDto getExistingContactDetails(String gstId) {
        Optional<Business> businessOpt = businessRepository.findById(gstId);
        if (businessOpt.isPresent()) {
            Business business = businessOpt.get();
            return ContactAmendmentViewDto.builder()
                    .newMobileNumber(business.getSignatoryMobile())
                    .newEmail(business.getSignatoryEmail())
                    .businessGstId(business.getGstId())
                    .gstNumber(business.getGstId())
                    .build();
        }

        return ContactAmendmentViewDto.builder()
                .businessGstId(gstId)
                .gstNumber(gstId)
                .build();
    }

    @Override
    @Transactional
    public ContactAmendmentViewDto submitContactAmendment(String gstId, String customerId, String mobileNumber, String email, MultipartFile file) throws IOException {
        Customer customer = resolveAndVerifyCustomer(customerId, gstId);
        String gstNumber = gstId != null ? gstId.trim() : "";

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting proof document is required for contact details amendment");
        }

        byte[] fileBytes = file.getBytes();

        ContactAmendmentViewDto inputDto = new ContactAmendmentViewDto();
        inputDto.setNewMobileNumber(mobileNumber);
        inputDto.setNewEmail(email);
        inputDto.setGstNumber(gstNumber);
        inputDto.setImageData(fileBytes);

        ContactAmendmentEntity amendment = amendmentMapper.toEntity(inputDto);
        amendment.setCustomer(customer);

        amendment = contactAmendmentRepository.save(amendment);

        return amendmentMapper.toDto(amendment);
    }

    @Override
    public ContactAmendmentViewDto getAmendmentById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        ContactAmendmentEntity entity = contactAmendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No contact amendment found with id: " + id));

        return amendmentMapper.toDto(entity);
    }

    @Override
    @Transactional
    public ContactAmendmentViewDto updateContactAmendment(Long id, String mobileNumber, String email, MultipartFile file) throws IOException {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        ContactAmendmentEntity entity = contactAmendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No contact amendment found with id: " + id));

        if (mobileNumber != null && !mobileNumber.trim().isEmpty()) entity.setNewMobileNumber(mobileNumber);
        if (email != null && !email.trim().isEmpty()) entity.setNewEmail(email);
        if (file != null && !file.isEmpty()) {
            entity.setImageData(file.getBytes());
        }

        entity = contactAmendmentRepository.save(entity);

        return amendmentMapper.toDto(entity);
    }
}
