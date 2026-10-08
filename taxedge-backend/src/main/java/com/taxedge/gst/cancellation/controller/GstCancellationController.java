package com.taxedge.gst.cancellation.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taxedge.gst.cancellation.dto.GstCancellationDto;
import com.taxedge.gst.cancellation.dto.GstCancellationResponseDto;
import com.taxedge.gst.cancellation.service.GstCancellationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/gst/cancellation")
@RequiredArgsConstructor
public class GstCancellationController {

    private final ObjectMapper objectMapper;
    private final GstCancellationService gstCancellationService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GstCancellationResponseDto> createCancellation(
            @RequestPart("data") String data,
            @RequestPart(value = "supportingProofDocument", required = false)
            MultipartFile supportingProofDocument) throws IOException {

        GstCancellationDto gstCancellationDto =
                objectMapper.readValue(data, GstCancellationDto.class);

        GstCancellationResponseDto response =
                gstCancellationService.createCancellation(
                        gstCancellationDto,
                        supportingProofDocument);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{cancellationId}")
    public ResponseEntity<GstCancellationDto> getCancellation(
            @PathVariable String cancellationId) {

        GstCancellationDto response =
                gstCancellationService.getCancellation(cancellationId);

        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{cancellationId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GstCancellationResponseDto> updateCancellation(
            @PathVariable String cancellationId,
            @RequestPart("data") String data,
            @RequestPart(value = "supportingProofDocument", required = false)
            MultipartFile supportingProofDocument) throws IOException {

        GstCancellationDto gstCancellationDto =
                objectMapper.readValue(data, GstCancellationDto.class);

        GstCancellationResponseDto response =
                gstCancellationService.updateCancellation(
                        cancellationId,
                        gstCancellationDto,
                        supportingProofDocument);

        return ResponseEntity.ok(response);
    }
}