package com.taxedge.gst.amendment.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.amendment.dto.SignatoryAmendmentViewDto;
import com.taxedge.gst.amendment.entity.SignatoryAmendmentEntity;
import com.taxedge.gst.amendment.mapper.SignatoryAmendmentMapper;
import com.taxedge.gst.amendment.repository.SignatoryAmendmentRepository;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.registration.entity.Business;
import com.taxedge.gst.registration.enums.RegisterationStatus;
import com.taxedge.gst.registration.repository.BusinessRepository;
import com.taxedge.messaging.service.EmailService;
import com.taxedge.notification.service.FcmNotificationService;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class SignatoryAmendmentServiceImpl implements SignatoryAmendmentService {

    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;
    private final SignatoryAmendmentRepository signatoryAmendmentRepository;
    private final SignatoryAmendmentMapper amendmentMapper;
    private final FcmNotificationService fcmNotificationService;
    private final EmailService emailService;

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
    public SignatoryAmendmentViewDto getExistingSignatoryDetails(String gstId) {
        Optional<Business> businessOpt = businessRepository.findById(gstId);
        if (businessOpt.isPresent()) {
            Business business = businessOpt.get();
            return SignatoryAmendmentViewDto.builder()
                    .newSignatoryName(business.getSignatoryName())
                    .newSignatoryPan(business.getSignatoryPan())
                    .newSignatoryDob(business.getSignatoryDob())
                    .newDesignation(business.getDesignation())
                    .newSignatoryMobile(business.getSignatoryMobile())
                    .newSignatoryEmail(business.getSignatoryEmail())
                    .businessGstId(business.getGstId())
                    .gstNumber(business.getGstId())
                    .build();
        }

        return SignatoryAmendmentViewDto.builder()
                .businessGstId(gstId)
                .gstNumber(gstId)
                .build();
    }

    @Override
    @Transactional
    public SignatoryAmendmentViewDto submitSignatoryAmendment(String gstId, String customerId, String signatoryName, String signatoryPan,
                                                              LocalDate signatoryDob, String designation, String signatoryMobile,
                                                              String signatoryEmail, MultipartFile file) throws IOException {

        Customer customer = resolveAndVerifyCustomer(customerId, gstId);
        String gstNumber = gstId != null ? gstId.trim() : "";

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting proof document is required for authorized signatory amendment");
        }

        byte[] fileBytes = file.getBytes();

        SignatoryAmendmentViewDto inputDto = new SignatoryAmendmentViewDto();
        inputDto.setNewSignatoryName(signatoryName);
        inputDto.setNewSignatoryPan(signatoryPan);
        inputDto.setNewSignatoryDob(signatoryDob);
        inputDto.setNewDesignation(designation);
        inputDto.setNewSignatoryMobile(signatoryMobile);
        inputDto.setNewSignatoryEmail(signatoryEmail);
        inputDto.setGstNumber(gstNumber);
        inputDto.setImageData(fileBytes);

        SignatoryAmendmentEntity amendment = amendmentMapper.toEntity(inputDto);
        amendment.setCustomer(customer);

        amendment = signatoryAmendmentRepository.save(amendment);

        return amendmentMapper.toDto(amendment);
    }

    @Override
    public SignatoryAmendmentViewDto getAmendmentById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        SignatoryAmendmentEntity entity = signatoryAmendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No signatory amendment found with id: " + id));

        return amendmentMapper.toDto(entity);
    }

    @Override
    @Transactional
    public SignatoryAmendmentViewDto updateSignatoryAmendment(Long id, String signatoryName, String signatoryPan,
                                                              LocalDate signatoryDob, String designation, String signatoryMobile,
                                                              String signatoryEmail, MultipartFile file) throws IOException {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        SignatoryAmendmentEntity entity = signatoryAmendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No signatory amendment found with id: " + id));

        if (signatoryName != null && !signatoryName.trim().isEmpty()) entity.setNewSignatoryName(signatoryName);
        if (signatoryPan != null && !signatoryPan.trim().isEmpty()) entity.setNewSignatoryPan(signatoryPan);
        if (signatoryDob != null) entity.setNewSignatoryDob(signatoryDob);
        if (designation != null && !designation.trim().isEmpty()) entity.setNewDesignation(designation);
        if (signatoryMobile != null && !signatoryMobile.trim().isEmpty()) entity.setNewSignatoryMobile(signatoryMobile);
        if (signatoryEmail != null && !signatoryEmail.trim().isEmpty()) entity.setNewSignatoryEmail(signatoryEmail);
        if (file != null && !file.isEmpty()) {
            entity.setImageData(file.getBytes());
        }

        entity = signatoryAmendmentRepository.save(entity);

        return amendmentMapper.toDto(entity);
    }

    @Override
    @Transactional
    public String submitAmendment(Long id, String gstId, String pushToken) {
        SignatoryAmendmentEntity amendment;

        if (id != null) {
            amendment = signatoryAmendmentRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Signatory amendment not found with id: " + id));
        } else if (gstId != null && !gstId.isBlank()) {
            String trimmedGst = gstId.trim();
            amendment = signatoryAmendmentRepository.findByGstNumber(trimmedGst)
                    .orElseThrow(() -> new ResourceNotFoundException("Signatory amendment not found for GST number: " + trimmedGst));
        } else {
            throw new IllegalArgumentException("Either id or gstId is required to submit amendment");
        }

        RegisterationStatus currentStatus = amendment.getStatus();
        if (currentStatus != null && currentStatus != RegisterationStatus.DRAFT && currentStatus != RegisterationStatus.REJECTED) {
            throw new IllegalStateException(
                    "Signatory amendment " + amendment.getId() + " cannot be submitted. Current status: " + currentStatus);
        }

        amendment.setStatus(RegisterationStatus.SUBMITTED);
        amendment.setSubmittedAt(LocalDateTime.now());
        signatoryAmendmentRepository.save(amendment);

        Customer customer = amendment.getCustomer();

        // Save token if new or changed
        if (pushToken != null && !pushToken.isBlank() && customer != null && !pushToken.equals(customer.getPushToken())) {
            customer.setPushToken(pushToken);
            customerRepository.save(customer);
        }

        String resolvedToken = (pushToken != null && !pushToken.isBlank())
                ? pushToken
                : (customer != null ? customer.getPushToken() : null);

        String applicantName = (customer != null && customer.getName() != null && !customer.getName().isBlank())
                ? customer.getName()
                : (amendment.getNewSignatoryName() != null && !amendment.getNewSignatoryName().isBlank() ? amendment.getNewSignatoryName() : amendment.getGstNumber());

        if (resolvedToken != null && !resolvedToken.isBlank() && fcmNotificationService != null) {
            try {
                fcmNotificationService.sendSuccessNotification(resolvedToken, applicantName);
            } catch (Exception ex) {
                log.error("Push notification failed for signatory amendment id {}", amendment.getId(), ex);
            }
        }

        // Confirmation email
        try {
            if (customer != null && customer.getEmail() != null && !customer.getEmail().isBlank() && emailService != null) {
                String recipientEmail = customer.getEmail();
                String recipientName = (customer.getName() != null && !customer.getName().isBlank()) ? customer.getName() : "Valued Customer";
                emailService.sendRegistrationEmail(recipientEmail, recipientName);
            }
        } catch (Exception ex) {
            log.error("Confirmation email failed for signatory amendment id {}", amendment.getId(), ex);
        }

        return "Signatory amendment submitted successfully. Amendment ID: " + amendment.getId();
    }
}
