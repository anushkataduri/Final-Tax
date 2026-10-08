package com.taxedge.gst.cancellation.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.cancellation.dto.GstCancellationDto;
import com.taxedge.gst.cancellation.dto.GstCancellationResponseDto;

public interface GstCancellationService {

    GstCancellationResponseDto createCancellation(
            GstCancellationDto gstCancellationDto,
            MultipartFile supportingProofDocument) throws IOException;

    GstCancellationResponseDto updateCancellation(
            String cancellationId,
            GstCancellationDto gstCancellationDto,
            MultipartFile supportingProofDocument) throws IOException;

    GstCancellationDto getCancellation(String cancellationId);
}