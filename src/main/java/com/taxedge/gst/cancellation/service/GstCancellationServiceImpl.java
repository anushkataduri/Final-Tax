package com.taxedge.gst.cancellation.service;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.cancellation.dto.GstCancellationDto;
import com.taxedge.gst.cancellation.dto.GstCancellationResponseDto;
import com.taxedge.gst.cancellation.entity.GstCancellation;
import com.taxedge.gst.exception.DuplicateResourceException;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.cancellation.mapper.GstCancellationMapper;
import com.taxedge.gst.cancellation.repository.GstCancellationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GstCancellationServiceImpl implements GstCancellationService {

    private final GstCancellationRepository gstCancellationRepository;
    private final CustomerRepository customerRepository;
    private final GstCancellationMapper gstCancellationMapper;

    @Override
    public GstCancellationResponseDto createCancellation(
            GstCancellationDto gstCancellationDto,
            MultipartFile supportingProofDocument) throws IOException {

        Customer customer = customerRepository.findById(gstCancellationDto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found with ID: " + gstCancellationDto.getCustomerId()));

        String gstin = normalizeAndValidateGstin(gstCancellationDto.getGstin());

        Optional<GstCancellation> existingOpt = gstCancellationRepository.findByGstin(gstin);
        GstCancellation gstCancellation;

        if (existingOpt.isPresent()) {
            gstCancellation = existingOpt.get();
            gstCancellation.setCustomer(customer);
            gstCancellation.setReasonForCancellation(gstCancellationDto.getReasonForCancellation());
            gstCancellation.setDateCancellationIsSought(gstCancellationDto.getDateCancellationIsSought());
            gstCancellation.setClosingStockAndInputTaxReversal(
                    gstCancellationDto.getClosingStockAndInputTaxReversal());
            gstCancellation.setPendingDuesLiabilities(
                    gstCancellationDto.getPendingDuesLiabilities());
            gstCancellation.setLastGstr3bFiledArnPeriod(
                    gstCancellationDto.getLastGstr3bFiledArnPeriod());
        } else {
            gstCancellation = GstCancellation.builder()
                    .cancellationId("CAN" + UUID.randomUUID().toString().replace("-", ""))
                    .gstin(gstin)
                    .reasonForCancellation(gstCancellationDto.getReasonForCancellation())
                    .dateCancellationIsSought(gstCancellationDto.getDateCancellationIsSought())
                    .closingStockAndInputTaxReversal(
                            gstCancellationDto.getClosingStockAndInputTaxReversal())
                    .pendingDuesLiabilities(
                            gstCancellationDto.getPendingDuesLiabilities())
                    .lastGstr3bFiledArnPeriod(
                            gstCancellationDto.getLastGstr3bFiledArnPeriod())
                    .customer(customer)
                    .build();
        }

        if (supportingProofDocument != null && !supportingProofDocument.isEmpty()) {
            gstCancellation.setSupportingProofDocument(
                    supportingProofDocument.getBytes());
        }

        gstCancellationRepository.save(gstCancellation);

        return GstCancellationResponseDto.builder()
                .cancellationId(gstCancellation.getCancellationId())
                .status("REGISTERED")
                .build();
    }

    @Override
    public GstCancellationResponseDto updateCancellation(
            String cancellationId,
            GstCancellationDto gstCancellationDto,
            MultipartFile supportingProofDocument) throws IOException {

        GstCancellation gstCancellation = gstCancellationRepository.findById(cancellationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "GST cancellation details not found with ID: " + cancellationId));

        if (gstCancellationDto.getReasonForCancellation() != null) {
            gstCancellation.setReasonForCancellation(gstCancellationDto.getReasonForCancellation());
        }
        if (gstCancellationDto.getDateCancellationIsSought() != null) {
            gstCancellation.setDateCancellationIsSought(gstCancellationDto.getDateCancellationIsSought());
        }
        if (gstCancellationDto.getClosingStockAndInputTaxReversal() != null) {
            gstCancellation.setClosingStockAndInputTaxReversal(
                    gstCancellationDto.getClosingStockAndInputTaxReversal());
        }
        if (gstCancellationDto.getPendingDuesLiabilities() != null) {
            gstCancellation.setPendingDuesLiabilities(
                    gstCancellationDto.getPendingDuesLiabilities());
        }
        if (gstCancellationDto.getLastGstr3bFiledArnPeriod() != null) {
            gstCancellation.setLastGstr3bFiledArnPeriod(
                    gstCancellationDto.getLastGstr3bFiledArnPeriod());
        }

        if (supportingProofDocument != null && !supportingProofDocument.isEmpty()) {
            gstCancellation.setSupportingProofDocument(
                    supportingProofDocument.getBytes());
        }

        gstCancellationRepository.save(gstCancellation);

        return GstCancellationResponseDto.builder()
                .cancellationId(gstCancellation.getCancellationId())
                .status("UPDATED")
                .build();
    }

    @Override
    public GstCancellationDto getCancellation(String cancellationId) {

        GstCancellation gstCancellation = gstCancellationRepository.findById(cancellationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "GST cancellation details not found with ID: " + cancellationId));

        return gstCancellationMapper.toDto(gstCancellation);
    }

    private String normalizeAndValidateGstin(String gstin) {

        if (gstin == null || gstin.isBlank()) {
            throw new IllegalArgumentException("GSTIN is required");
        }

        String normalizedGstin = gstin.trim().toUpperCase();

        if (!normalizedGstin.matches(
                "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$")) {
            throw new IllegalArgumentException("Invalid GSTIN format");
        }

        return normalizedGstin;
    }
}