package com.taxedge.gst.amendment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.amendment.dto.LegalNameAmendmentViewDto;
import com.taxedge.gst.registration.entity.Business;
import com.taxedge.gst.amendment.entity.LegalNameAmendmentEntity;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.registration.repository.BusinessRepository;
import com.taxedge.gst.amendment.mapper.LegalNameAmendmentMapper;
import com.taxedge.gst.amendment.repository.LegalNameAmendmentRepository;
import com.taxedge.security.jwt.JwtPrincipal;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LegalNameAmendmentServiceImpl implements LegalNameAmendmentService {

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;
    private final LegalNameAmendmentRepository amendmentRepository;
    private final LegalNameAmendmentMapper amendmentMapper;

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
            log.error("Unable to resolve customer identity for amendment. gstId: {}", gstId);
            throw new ResourceNotFoundException("Customer ID is required to submit amendment");
        }

        final String finalCustId = resolvedCustId;
        return customerRepository.findById(finalCustId)
                .orElseThrow(() -> {
                    log.error("Customer not found with id: {}", finalCustId);
                    return new ResourceNotFoundException("Customer not found with id: " + finalCustId);
                });
    }

    private void validateDocumentFile(MultipartFile file, String contextInfo) {
        if (file == null || file.isEmpty()) {
            log.warn("Document file is missing or empty for {}", contextInfo);
            throw new IllegalArgumentException("Supporting proof document is required for legal name amendment");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            log.warn("File size {} exceeds limit of {} bytes for {}", file.getSize(), MAX_FILE_SIZE_BYTES, contextInfo);
            throw new IllegalArgumentException("Supporting proof document size must not exceed 10 MB");
        }

        String contentType = file.getContentType();
        if (contentType != null && !contentType.startsWith("image/") && !contentType.equalsIgnoreCase("application/pdf")) {
            log.warn("Invalid file content type '{}' for {}", contentType, contextInfo);
            throw new IllegalArgumentException("Supporting document must be a valid image (JPEG, PNG, WEBP) or PDF file");
        }
    }

    @Override
    public LegalNameAmendmentViewDto getExistingLegalNameDetails(String gstId) {
        if (gstId == null || gstId.trim().isEmpty()) {
            throw new IllegalArgumentException("GST Number must not be blank");
        }
        String sanitizedGstId = gstId.trim();
        Optional<Business> businessOpt = businessRepository.findById(sanitizedGstId);
        String existingName = businessOpt.map(Business::getLegalName).orElse("");

        return LegalNameAmendmentViewDto.builder()
                .newLegalName(existingName)
                .businessGstId(sanitizedGstId)
                .gstNumber(sanitizedGstId)
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LegalNameAmendmentViewDto submitLegalNameAmendment(String gstId, String customerId, String newLegalName, MultipartFile file) throws IOException {
        if (gstId == null || gstId.trim().isEmpty()) {
            log.warn("Rejecting legal name amendment: GST ID/Number is blank");
            throw new IllegalArgumentException("GST Number is required to submit legal name amendment");
        }

        if (newLegalName == null || newLegalName.trim().isEmpty()) {
            log.warn("Rejecting legal name amendment for GST {}: new legal name is blank", gstId);
            throw new IllegalArgumentException("New legal name is required for amendment");
        }

        String sanitizedGstNumber = gstId.trim();
        String sanitizedNewLegalName = newLegalName.trim();

        validateDocumentFile(file, "GST " + sanitizedGstNumber);

        Customer customer = resolveAndVerifyCustomer(customerId, sanitizedGstNumber);

        log.info("Submitting legal name amendment: GST={}, CustomerId={}, NewLegalName='{}'",
                sanitizedGstNumber, customer.getCustId(), sanitizedNewLegalName);

        byte[] fileBytes = file.getBytes();

        LegalNameAmendmentViewDto inputDto = new LegalNameAmendmentViewDto();
        inputDto.setNewLegalName(sanitizedNewLegalName);
        inputDto.setGstNumber(sanitizedGstNumber);
        inputDto.setImageData(fileBytes);

        LegalNameAmendmentEntity amendment = amendmentMapper.toEntity(inputDto);
        amendment.setCustomer(customer);

        amendment = amendmentRepository.save(amendment);
        log.info("Successfully persisted legal name amendment with ID: {} for GST: {}", amendment.getId(), sanitizedGstNumber);

        return amendmentMapper.toDto(amendment);
    }

    @Override
    public LegalNameAmendmentViewDto getAmendmentById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        LegalNameAmendmentEntity entity = amendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No legal name amendment found with id: " + id));

        return amendmentMapper.toDto(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LegalNameAmendmentViewDto updateLegalNameAmendment(Long id, String newLegalName, MultipartFile file) throws IOException {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        LegalNameAmendmentEntity entity = amendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No legal name amendment found with id: " + id));

        if (newLegalName != null && !newLegalName.trim().isEmpty()) {
            entity.setNewLegalName(newLegalName.trim());
        }

        if (file != null && !file.isEmpty()) {
            validateDocumentFile(file, "Amendment update id " + id);
            entity.setImageData(file.getBytes());
        }

        entity = amendmentRepository.save(entity);
        log.info("Successfully updated legal name amendment [id: {}]", id);

        return amendmentMapper.toDto(entity);
    }
}
