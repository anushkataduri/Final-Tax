package com.taxedge.loan.propertyloan.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.loan.propertyloan.dto.PropertyLoanCreateRequest;
import com.taxedge.loan.propertyloan.dto.PropertyLoanDocumentItemResponse;
import com.taxedge.loan.propertyloan.dto.PropertyLoanResponse;
import com.taxedge.loan.propertyloan.dto.PropertyLoanReviewResponse;
import com.taxedge.loan.propertyloan.dto.PropertyLoanUpdateRequest;
import com.taxedge.loan.propertyloan.entity.PropertyLoanDocument;
import com.taxedge.loan.propertyloan.enums.PropertyDocumentType;
import com.taxedge.loan.propertyloan.service.PropertyLoanApplicationService;
import com.taxedge.loan.propertyloan.service.PropertyLoanDocumentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/loan/property")
@RequiredArgsConstructor
public class PropertyLoanController {

    private final PropertyLoanApplicationService applicationService;
    private final PropertyLoanDocumentService documentService;

    @PostMapping("application")
    public ResponseEntity<PropertyLoanResponse> createApplication(@RequestBody PropertyLoanCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.createApplication(request));
    }

    @GetMapping("application/{id}")
    public ResponseEntity<PropertyLoanResponse> getApplication(@PathVariable String id) {
        return ResponseEntity.ok(applicationService.getApplication(id));
    }

    @PutMapping("application/{id}")
    public ResponseEntity<PropertyLoanResponse> updateApplication(
            @PathVariable String id,
            @RequestBody PropertyLoanUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateApplication(id, request));
    }

    @DeleteMapping("application/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable String id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("application/{id}/review")
    public ResponseEntity<PropertyLoanReviewResponse> getReview(@PathVariable String id) {
        return ResponseEntity.ok(applicationService.getReview(id));
    }

    @PostMapping("application/{id}/submit")
    public ResponseEntity<PropertyLoanResponse> submitApplication(@PathVariable String id) {
        return ResponseEntity.ok(applicationService.submitApplication(id));
    }

    @GetMapping("application/my-applications")
    public ResponseEntity<List<PropertyLoanResponse>> getMyApplications() {
        return ResponseEntity.ok(applicationService.getMyApplications());
    }

    @PostMapping(value = "application/{id}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PropertyLoanDocumentItemResponse> uploadDocument(
            @PathVariable String id,
            @RequestParam("documentType") PropertyDocumentType documentType,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentService.uploadDocument(id, documentType, file));
    }

    @GetMapping("application/{id}/documents")
    public ResponseEntity<List<PropertyLoanDocumentItemResponse>> getDocuments(@PathVariable String id) {
        return ResponseEntity.ok(documentService.getDocuments(id));
    }

    @GetMapping("application/{id}/documents/{documentType}/download")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable String id,
            @PathVariable PropertyDocumentType documentType) {
        PropertyLoanDocument doc = documentService.downloadDocument(id, documentType);
        byte[] content = doc.getFileContent(documentType);
        String fileName = doc.getFileName(documentType) != null ? doc.getFileName(documentType) : (documentType.name().toLowerCase() + ".pdf");
        String contentType = fileName.endsWith(".png") ? "image/png" : (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") ? "image/jpeg" : MediaType.APPLICATION_PDF_VALUE);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(content);
    }

    @DeleteMapping("application/{id}/documents/{documentType}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable String id,
            @PathVariable PropertyDocumentType documentType) {
        documentService.deleteDocument(id, documentType);
        return ResponseEntity.noContent().build();
    }
}
