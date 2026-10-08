package com.taxedge.loan.homeloan.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.loan.homeloan.dto.HomeLoanApplicationDto;
import com.taxedge.loan.homeloan.dto.HomeLoanDocumentDto;
import com.taxedge.loan.homeloan.service.HomeLoanApplicationService;
import com.taxedge.loan.homeloan.service.HomeLoanDocumentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/loan/home")
@RequiredArgsConstructor
public class HomeLoanApplicationController {

    private final HomeLoanApplicationService service;
    private final HomeLoanDocumentService docservice;

    // ------------------------------------------------------------ application

    @PostMapping("/save/{custId}")
    public ResponseEntity<String> save(@PathVariable String custId,
                                       @RequestBody HomeLoanApplicationDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.saveApplication(custId, dto));
    }

    @PutMapping("/update/{homeLoanId}")
    public ResponseEntity<String> update(@PathVariable String homeLoanId,
                                         @RequestBody HomeLoanApplicationDto dto) {
        return ResponseEntity.ok(service.updateApplication(homeLoanId, dto));
    }

    @GetMapping("/{homeLoanId}")
    public ResponseEntity<HomeLoanApplicationDto> get(@PathVariable String homeLoanId) {
        return ResponseEntity.ok(service.getApplication(homeLoanId));
    }

    @GetMapping("/customer/{custId}")
    public ResponseEntity<List<HomeLoanApplicationDto>> listByCustomer(
            @PathVariable String custId) {
        return ResponseEntity.ok(service.getApplicationsByCustomer(custId));
    }

    // -------------------------------------------------------------- documents

    @PostMapping(value = "/documents/save/{homeLoanId}",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> saveDocuments(
            @PathVariable String homeLoanId,
            @RequestParam(required = false) MultipartFile panCardFile,
            @RequestParam(required = false) MultipartFile aadhaarCardFile,
            @RequestParam(required = false) MultipartFile passportPhotoFile,
            @RequestParam(required = false) MultipartFile addressProofFile,
            @RequestParam(required = false) MultipartFile bankStatementsFile,
            @RequestParam(required = false) MultipartFile salarySlipsFile,
            @RequestParam(required = false) MultipartFile form16ItrFile,
            @RequestParam(required = false) MultipartFile agreementToSellFile,
            @RequestParam(required = false) MultipartFile buildingPlanFile,
            @RequestParam(required = false) MultipartFile titleDeedFile,
            @RequestParam(required = false) MultipartFile encumbranceCertificateFile,
            @RequestParam(required = false) MultipartFile downPaymentProofFile)
            throws IOException {

        HomeLoanDocumentDto dto = buildDocumentDto(
                panCardFile, aadhaarCardFile, passportPhotoFile, addressProofFile,
                bankStatementsFile, salarySlipsFile, form16ItrFile,
                agreementToSellFile, buildingPlanFile, titleDeedFile,
                encumbranceCertificateFile, downPaymentProofFile);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(docservice.saveDocuments(homeLoanId, dto));
    }

    @PutMapping(value = "/documents/update/{homeLoanId}",
                consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateDocuments(
            @PathVariable String homeLoanId,
            @RequestParam(required = false) MultipartFile panCardFile,
            @RequestParam(required = false) MultipartFile aadhaarCardFile,
            @RequestParam(required = false) MultipartFile passportPhotoFile,
            @RequestParam(required = false) MultipartFile addressProofFile,
            @RequestParam(required = false) MultipartFile bankStatementsFile,
            @RequestParam(required = false) MultipartFile salarySlipsFile,
            @RequestParam(required = false) MultipartFile form16ItrFile,
            @RequestParam(required = false) MultipartFile agreementToSellFile,
            @RequestParam(required = false) MultipartFile buildingPlanFile,
            @RequestParam(required = false) MultipartFile titleDeedFile,
            @RequestParam(required = false) MultipartFile encumbranceCertificateFile,
            @RequestParam(required = false) MultipartFile downPaymentProofFile)
            throws IOException {

        HomeLoanDocumentDto dto = buildDocumentDto(
                panCardFile, aadhaarCardFile, passportPhotoFile, addressProofFile,
                bankStatementsFile, salarySlipsFile, form16ItrFile,
                agreementToSellFile, buildingPlanFile, titleDeedFile,
                encumbranceCertificateFile, downPaymentProofFile);

        return ResponseEntity.ok(docservice.updateDocuments(homeLoanId, dto));
    }

    @GetMapping("/documents/{homeLoanId}")
    public ResponseEntity<HomeLoanDocumentDto> getDocuments(
            @PathVariable String homeLoanId) {
        return ResponseEntity.ok(docservice.getDocuments(homeLoanId));
    }

    // ---------------------------------------------------------------- helpers

    private HomeLoanDocumentDto buildDocumentDto(
            MultipartFile panCardFile, MultipartFile aadhaarCardFile,
            MultipartFile passportPhotoFile, MultipartFile addressProofFile,
            MultipartFile bankStatementsFile, MultipartFile salarySlipsFile,
            MultipartFile form16ItrFile, MultipartFile agreementToSellFile,
            MultipartFile buildingPlanFile, MultipartFile titleDeedFile,
            MultipartFile encumbranceCertificateFile, MultipartFile downPaymentProofFile)
            throws IOException {

        return HomeLoanDocumentDto.builder()
                .panCardFile(bytes(panCardFile))
                .aadhaarCardFile(bytes(aadhaarCardFile))
                .passportPhotoFile(bytes(passportPhotoFile))
                .addressProofFile(bytes(addressProofFile))
                .bankStatementsFile(bytes(bankStatementsFile))
                .salarySlipsFile(bytes(salarySlipsFile))
                .form16ItrFile(bytes(form16ItrFile))
                .agreementToSellFile(bytes(agreementToSellFile))
                .buildingPlanFile(bytes(buildingPlanFile))
                .titleDeedFile(bytes(titleDeedFile))
                .encumbranceCertificateFile(bytes(encumbranceCertificateFile))
                .downPaymentProofFile(bytes(downPaymentProofFile))
                .build();
    }

    private byte[] bytes(MultipartFile file) throws IOException {
        return file == null || file.isEmpty() ? null : file.getBytes();
    }
}
