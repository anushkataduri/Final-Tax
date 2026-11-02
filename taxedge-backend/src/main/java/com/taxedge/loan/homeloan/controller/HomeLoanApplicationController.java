
package com.taxedge.loan.homeloan.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.taxedge.loan.homeloan.dto.*;
import com.taxedge.loan.homeloan.enums.HomeLoanRequirementPurpose;
import com.taxedge.loan.homeloan.requirement.HomeLoanDocumentRequirementDto;
import com.taxedge.loan.homeloan.service.HomeLoanDocumentService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.taxedge.loan.homeloan.service.HomeLoanApplicationService;
import com.taxedge.loan.homeloan.service.HomeLoanRequirementApplicationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/loan/homeloan")
@RequiredArgsConstructor
public class HomeLoanApplicationController {

    private final HomeLoanApplicationService homeLoanApplicationService;
    private final HomeLoanRequirementApplicationService homeLoanRequirementApplicationService;
    private final HomeLoanDocumentService homeLoanDocumentService;

    @GetMapping("/kyc/{customerId}")
    public HomeLoanApplicationKycDto getCustomerKycDetails(
            @PathVariable String customerId) {

        return homeLoanApplicationService.getCustomerKycDetails(customerId);
    }

    @PostMapping("/requirements")
    public ResponseEntity<HomeLoanRequirementApplicationDto> createApplication(
            @Valid @RequestBody HomeLoanRequirementApplicationDto dto) {

        HomeLoanRequirementApplicationDto response =
                homeLoanRequirementApplicationService.createApplication(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/requirements/{homeLoanId}")
    public ResponseEntity<HomeLoanRequirementApplicationDto> getApplication(
            @PathVariable String homeLoanId) {

        HomeLoanRequirementApplicationDto response =
                homeLoanRequirementApplicationService.getApplication(homeLoanId);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/requirements")
    public ResponseEntity<List<HomeLoanRequirementApplicationDto>>
    getAllApplications() {

        List<HomeLoanRequirementApplicationDto> response =
                homeLoanRequirementApplicationService.getAllApplications();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/requirements/{homeLoanId}")
    public ResponseEntity<HomeLoanRequirementApplicationDto> updateApplication(
            @PathVariable String homeLoanId,
            @Valid @RequestBody HomeLoanRequirementApplicationDto dto) {

        HomeLoanRequirementApplicationDto response =
                homeLoanRequirementApplicationService.updateApplication(
                        homeLoanId, dto);

        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/requirements/{homeLoanId}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable String homeLoanId) {

        homeLoanRequirementApplicationService.deleteApplication(homeLoanId);

        return ResponseEntity.noContent().build();
    }


    @PostMapping(value = "/{homeLoanId}/documents",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HomeLoanDocumentResponseDto uploadDocuments(
            @PathVariable String homeLoanId,
            @ModelAttribute HomeLoanDocumentRequestDto dto) throws IOException {

        return homeLoanDocumentService.uploadDocuments(homeLoanId, dto);
    }


    @GetMapping("/requirements/documents")
    public List<HomeLoanDocumentRequirementDto> getDocumentRequirements(
            @RequestParam HomeLoanRequirementPurpose loanPurpose) {

        return homeLoanDocumentService.getDocumentRequirements(loanPurpose);
    }

    @GetMapping("/{homeLoanId}/documents")
    public HomeLoanDocumentResponseDto getDocuments(
            @PathVariable String homeLoanId) {

        return homeLoanDocumentService.getDocuments(homeLoanId);
    }

    @PutMapping(value = "/{homeLoanId}/documents",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public HomeLoanDocumentResponseDto replaceDocuments(
            @PathVariable String homeLoanId,
            @RequestParam Map<String, MultipartFile> files
    ) throws IOException {

        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "At least one document must be provided"
            );
        }

        return homeLoanDocumentService.replaceDocuments(
                homeLoanId, files
        );
    }

    @DeleteMapping("/{homeLoanId}/documents/{documentType}")
    public HomeLoanDocumentResponseDto removeDocument(
            @PathVariable String homeLoanId,
            @PathVariable String documentType) {

        return homeLoanDocumentService.removeDocument(
                homeLoanId, documentType);
    }
    private MediaType detectMediaType(byte[] content) {

        if (content.length >= 5
                && content[0] == '%'
                && content[1] == 'P'
                && content[2] == 'D'
                && content[3] == 'F'
                && content[4] == '-') {
            return MediaType.APPLICATION_PDF;
        }

        if (content.length >= 8
                && content[0] == (byte) 0x89
                && content[1] == 'P'
                && content[2] == 'N'
                && content[3] == 'G'
                && content[4] == 0x0D
                && content[5] == 0x0A
                && content[6] == 0x1A
                && content[7] == 0x0A) {
            return MediaType.IMAGE_PNG;
        }

        if (content.length >= 3
                && content[0] == (byte) 0xFF
                && content[1] == (byte) 0xD8
                && content[2] == (byte) 0xFF) {
            return MediaType.IMAGE_JPEG;
        }

        return MediaType.APPLICATION_OCTET_STREAM;
    }

}
