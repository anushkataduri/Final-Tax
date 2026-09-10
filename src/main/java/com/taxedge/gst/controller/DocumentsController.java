package com.taxedge.gst.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.service.DocumentsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/gst/documents")
public class DocumentsController {

    private final DocumentsService documentsService;

    public DocumentsController(DocumentsService documentsService) {
        this.documentsService = documentsService;
    }

    @Operation(summary = "Upload a document file (PDF/image)")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(
            @RequestParam("businessId") String businessId,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "addressProofType", required = false) String addressProofType,
            @Parameter(description = "Select the file to upload")
            @RequestParam("image") MultipartFile file) throws IOException {

        String result = documentsService.uploadFile(businessId, documentType, addressProofType, file);

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing document file")
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateFile(
            @PathVariable Long id,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "addressProofType", required = false) String addressProofType,
            @Parameter(description = "Select the replacement file")
            @RequestParam("image") MultipartFile file) throws IOException {

        String result = documentsService.updateFile(id, documentType, addressProofType, file);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) {

        String result = documentsService.deleteFile(id);

        return ResponseEntity.ok(result);
    }
}