package com.taxedge.companyregistration.controller;

import com.taxedge.companyregistration.dto.CompanyRegistrationDto;
import com.taxedge.companyregistration.dto.request.CreateCompanyRegistrationRequest;
import com.taxedge.companyregistration.dto.request.PaymentRequest;
import com.taxedge.companyregistration.dto.request.PersonRequest;
import com.taxedge.companyregistration.dto.request.UpdateCompanyRegistrationRequest;
import com.taxedge.companyregistration.dto.response.CompanyRegistrationResponse;
import com.taxedge.companyregistration.dto.response.DocumentResponse;
import com.taxedge.companyregistration.dto.response.DocumentContent;
import com.taxedge.companyregistration.dto.response.ReceiptResponse;
import com.taxedge.companyregistration.dto.response.ReviewResponse;
import com.taxedge.companyregistration.dto.response.SubmissionResponse;
import com.taxedge.companyregistration.dto.response.TrackingResponse;
import com.taxedge.companyregistration.enums.CompanyRegistrationDocumentType;
import com.taxedge.companyregistration.service.ApplicationTrackingService;
import com.taxedge.companyregistration.service.CompanyRegistrationService;
import com.taxedge.companyregistration.service.DocumentService;
import com.taxedge.companyregistration.service.PaymentService;
import com.taxedge.companyregistration.service.ReceiptService;
import com.taxedge.companyregistration.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ContentDisposition;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Primary controller for Company Registration lifecycle.
 *
 * <p>Consolidated endpoints reduce the number of round trips required to create and
 * populate a registration. The POST and PUT endpoints accept larger, well-structured
 * JSON payloads that combine all logically related data (company details, registered
 * office, persons, capital, shareholdings, linked registrations) in a single request.
 *
 * <p>All Company Registration endpoints are handled here while the service classes
 * remain separate.
 */
@RestController
@RequiredArgsConstructor
public class CompanyRegistrationController {

    private static final String API_BASE_PATH = "/api/v1/company-registrations";

    private final CompanyRegistrationService service;
    private final ApplicationTrackingService trackingService;
    private final DocumentService documentService;
    private final PaymentService paymentService;
    private final ReceiptService receiptService;
    private final SubmissionService submissionService;

    // -----------------------------------------------------------------------
    // CREATE – optionally accepts a full payload in one consolidated request
    // -----------------------------------------------------------------------

    /**
     * POST /api/v1/company-registrations
     * <p>
     * Minimal call: {@code { "companyType": "PRIVATE_LIMITED" }}
     * <p>
     * Full consolidated call: supply companyDetails, registeredOffice, persons,
     * capital, shareholdings, and linkedRegistrations in one request body.
     */
    @PostMapping(API_BASE_PATH)
    public ResponseEntity<ReviewResponse> create(
            @Valid @RequestBody CreateCompanyRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    // -----------------------------------------------------------------------
    // LIST / GET
    // -----------------------------------------------------------------------

    @GetMapping(API_BASE_PATH)
    public List<CompanyRegistrationResponse> list() {
        return service.list();
    }

    /**
     * GET /api/v1/company-registrations/{id}
     * <p>
     * Returns the complete application including company details, registered office,
     * persons, capital, shareholdings, linked registrations, documents, payments,
     * and tracking. This replaces the separate /review endpoint.
     */
    @GetMapping(API_BASE_PATH + "/{id}")
    public ReviewResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    // -----------------------------------------------------------------------
    // UPDATE – consolidated update of all logically-related sections
    // -----------------------------------------------------------------------

    /**
     * PUT /api/v1/company-registrations/{id}
     * <p>
     * Accepts a large, well-structured JSON payload containing any combination of:
     * companyDetails, registeredOffice, persons, capital, shareholdings, linkedRegistrations.
     * Only sections that are present (non-null) in the request body are updated.
     * Returns the full updated application.
     * <p>
     * This replaces the following individual section-update endpoints:
     * <ul>
     *   <li>PUT /api/v1/company-registrations/{id}/details</li>
     *   <li>PUT /api/v1/company-registrations/{id}/registered-office</li>
     *   <li>POST /api/v1/company-registrations/{id}/persons</li>
     *   <li>PUT  /api/v1/company-registrations/{id}/persons/{personId}</li>
     *   <li>PUT /api/v1/company-registrations/{id}/capital</li>
     *   <li>POST /api/v1/company-registrations/{id}/shareholdings</li>
     *   <li>PUT  /api/v1/company-registrations/{id}/shareholdings/{shareholdingId}</li>
     *   <li>PUT /api/v1/company-registrations/{id}/linked-registrations</li>
     * </ul>
     */
    @PutMapping(API_BASE_PATH + "/{id}")
    public ReviewResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCompanyRegistrationRequest request) {
        return service.updateRegistration(id, request);
    }

    @PostMapping(API_BASE_PATH + "/{id}/persons")
    public ResponseEntity<Map<String, Object>> addPerson(
            @PathVariable Long id,
            @Valid @RequestBody PersonRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addPerson(id, request));
    }

    @PutMapping(API_BASE_PATH + "/{id}/persons/{personId}")
    public Map<String, Object> updatePerson(
            @PathVariable Long id,
            @PathVariable Long personId,
            @Valid @RequestBody PersonRequest request) {
        return service.updatePerson(id, personId, request);
    }

    @DeleteMapping(API_BASE_PATH + "/{id}/persons/{personId}")
    public ResponseEntity<Void> deletePerson(
            @PathVariable Long id,
            @PathVariable Long personId) {
        service.deletePerson(id, personId);
        return ResponseEntity.noContent().build();
    }

    // -----------------------------------------------------------------------
    // UTILITY
    // -----------------------------------------------------------------------

    @GetMapping("/company-registration/check-name")
    public Map<String, Object> checkName(@RequestParam String name) {
        return service.checkName(name);
    }

    // -----------------------------------------------------------------------
    // LEGACY DRAFT APPLY (retained for backward compatibility)
    // -----------------------------------------------------------------------

    @PostMapping("/company-registration/apply")
    public SubmissionResponse apply(@Valid @RequestBody CompanyRegistrationDto.DraftRequest request) {
        return service.applyDraft(request);
    }

    @GetMapping(API_BASE_PATH + "/{id}/tracking")
    public List<TrackingResponse> tracking(@PathVariable Long id) {
        return trackingService.tracking(id);
    }

    @GetMapping("/company-registration/status/{applicationId}")
    public Map<String, Object> status(@PathVariable Long applicationId) {
        return trackingService.status(applicationId);
    }

    @PostMapping(API_BASE_PATH + "/{id}/documents")
    public ResponseEntity<DocumentResponse> uploadDocument(
            @PathVariable Long id,
            @RequestParam CompanyRegistrationDocumentType documentType,
            @RequestParam MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentService.uploadDocument(id, documentType, file));
    }

    @GetMapping(API_BASE_PATH + "/{id}/documents")
    public List<DocumentResponse> listDocuments(@PathVariable Long id) {
        return documentService.documents(id);
    }

    @GetMapping(API_BASE_PATH + "/{id}/documents/{documentId}")
    public DocumentResponse getDocument(
            @PathVariable Long id,
            @PathVariable Long documentId) {
        return documentService.document(id, documentId);
    }

    @GetMapping(API_BASE_PATH + "/{id}/documents/{documentId}/content")
    public ResponseEntity<Resource> documentContent(
            @PathVariable Long id,
            @PathVariable Long documentId) {
        DocumentContent content = service.documentContent(id, documentId);
        MediaType mediaType;
        try {
            mediaType = content.mimeType() == null
                    ? MediaType.APPLICATION_OCTET_STREAM
                    : MediaType.parseMediaType(content.mimeType());
        } catch (IllegalArgumentException exception) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(content.fileName(), StandardCharsets.UTF_8).build().toString())
                .body(content.resource());
    }

    @DeleteMapping(API_BASE_PATH + "/{id}/documents/{documentId}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long id,
            @PathVariable Long documentId) {
        documentService.deleteDocument(id, documentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(API_BASE_PATH + "/{id}/payment")
    public Map<String, Object> payment(@PathVariable Long id) {
        return paymentService.payment(id);
    }

    @PostMapping(API_BASE_PATH + "/{id}/payment")
    public Map<String, Object> savePayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request) {
        return paymentService.savePayment(id, request);
    }

    @GetMapping(API_BASE_PATH + "/{id}/receipt")
    public ReceiptResponse receipt(@PathVariable Long id) {
        return receiptService.receipt(id);
    }

    @PostMapping(API_BASE_PATH + "/{id}/submit")
    public SubmissionResponse submit(@PathVariable Long id) {
        return submissionService.submit(id);
    }
}