package com.taxedge.companyregistration.service;

import com.taxedge.companyregistration.dto.CompanyRegistrationDto;
import com.taxedge.companyregistration.dto.request.CapitalRequest;
import com.taxedge.companyregistration.dto.request.CompanyDetailsRequest;
import com.taxedge.companyregistration.dto.request.CreateCompanyRegistrationRequest;
import com.taxedge.companyregistration.dto.request.LinkedRegistrationRequest;
import com.taxedge.companyregistration.dto.request.PaymentRequest;
import com.taxedge.companyregistration.dto.request.PersonRequest;
import com.taxedge.companyregistration.dto.request.RegisteredOfficeRequest;
import com.taxedge.companyregistration.dto.request.ShareholdingRequest;
import com.taxedge.companyregistration.dto.request.UpdateCompanyRegistrationRequest;
import com.taxedge.companyregistration.dto.response.CompanyRegistrationResponse;
import com.taxedge.companyregistration.dto.response.DocumentResponse;
import com.taxedge.companyregistration.dto.response.DocumentContent;
import com.taxedge.companyregistration.dto.response.ReceiptResponse;
import com.taxedge.companyregistration.dto.response.ReviewResponse;
import com.taxedge.companyregistration.dto.response.SubmissionResponse;
import com.taxedge.companyregistration.dto.response.TrackingResponse;
import com.taxedge.companyregistration.entity.*;
import com.taxedge.companyregistration.enums.CompanyRegistrationDocumentType;
import com.taxedge.companyregistration.exception.CompanyRegistrationException;
import com.taxedge.companyregistration.exception.CompanyRegistrationNotFoundException;
import com.taxedge.companyregistration.exception.CompanyRegistrationValidationException;
import com.taxedge.companyregistration.mapper.CompanyRegistrationMapper;
import com.taxedge.companyregistration.repository.*;
import com.taxedge.security.jwt.JwtPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyRegistrationServiceImpl implements CompanyRegistrationService {
    private final CompanyRegistrationRepository registrationRepository;
    private final CompanyDetailsRepository detailsRepository;
    private final CompanyRegisteredOfficeRepository officeRepository;
    private final CompanyPersonRepository personRepository;
    private final CompanyCapitalRepository capitalRepository;
    private final CompanyShareholdingRepository shareholdingRepository;
    private final CompanyRegistrationDocumentRepository documentRepository;
    private final CompanyLinkedRegistrationRepository linkedRepository;
    private final CompanyRegistrationPaymentRepository paymentRepository;
    private final CompanyRegistrationTrackingRepository trackingRepository;
    private final CompanyRegistrationMapper mapper;
    private final CompanyRegistrationFileStorage fileStorage;

    @Override
    @Transactional
    public SubmissionResponse applyDraft(CompanyRegistrationDto.DraftRequest request) {
        validateDraft(request);
        CompanyRegistrationDto.DraftCompanyRequest company = request.company();

        CompanyRegistration registration = mapper.registration(currentUserId(), company.companyType(), null,
            toBackendStatus(request.status(), request.paymentStatus()));
        registration = registrationRepository.save(registration);
        registration.setApplicationNumber(String.format("CR%d%06d", Year.now().getValue(), registration.getId()));
        registrationRepository.save(registration);

        CompanyDetails details = mapper.draftDetails(registration, company);
        detailsRepository.save(details);

        CompanyRegisteredOffice office = mapper.draftOffice(registration, company);
        officeRepository.save(office);

        CompanyCapital capital = mapper.draftCapital(registration, company);
        capitalRepository.save(capital);

        List<CompanyPerson> people = new ArrayList<>();
        for (CompanyRegistrationDto.DraftPersonRequest person : nullSafe(request.directors())) {
            people.add(saveDraftPerson(registration, person, "DIRECTOR"));
        }
        for (CompanyRegistrationDto.DraftPersonRequest partner : nullSafe(request.partners())) {
            people.add(saveDraftPerson(registration, partner, "PARTNER"));
        }
        if (request.opcNominee() != null) {
            CompanyRegistrationDto.DraftNomineeRequest nominee = request.opcNominee();
            CompanyPerson nomineePerson = mapper.nominee(registration, nominee);
            people.add(personRepository.save(nomineePerson));
        }

        for (int index = 0; index < people.size(); index++) {
            CompanyPerson person = people.get(index);
            CompanyShareholding shareholding = mapper.shareholding(registration, person);
            shareholdingRepository.save(shareholding);
        }

        CompanyRegistrationDto.LinkedRegistrationsRequest linkedRequest = request.linkedRegistrations();
        if (linkedRequest != null) {
            CompanyLinkedRegistration linked = mapper.draftLinked(registration, linkedRequest);
            linkedRepository.save(linked);
        }

        for (CompanyRegistrationDto.DraftDocumentRequest documentRequest : nullSafe(request.documents())) {
            if ("Uploaded".equalsIgnoreCase(documentRequest.status()) || "UPLOADED".equalsIgnoreCase(documentRequest.status())) {
                continue;
            }
                CompanyRegistrationDocument document = mapper.draftDocument(registration, documentRequest,
                    parseDocumentType(documentRequest.id()));
            documentRepository.save(document);
        }

        if (request.feeBreakdown() != null) {
            CompanyRegistrationDto.FeeBreakdownRequest fee = request.feeBreakdown();
            CompanyRegistrationPayment payment = mapper.draftPayment(registration, request, fee);
            paymentRepository.save(payment);
        }

        for (CompanyRegistrationDto.TrackingStageRequest stageRequest : nullSafe(request.trackingStages())) {
            CompanyRegistrationTracking stage = mapper.tracking(registration, stageRequest);
            trackingRepository.save(stage);
        }

        LocalDateTime submittedAt = null;
        if ("SUBMITTED".equals(registration.getStatus())) {
            submittedAt = LocalDateTime.now();
            registration.setSubmittedAt(submittedAt);
            registrationRepository.save(registration);
        }
        return mapper.submissionResponse(registration, submittedAt);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> checkName(String name) {
        requireText(name, "name is required");
        boolean alreadyUsed = detailsRepository.existsByProposedName1IgnoreCaseOrProposedName2IgnoreCase(name, name);
        return mapper.nameAvailabilityMap(!alreadyUsed);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> status(Long id) {
        CompanyRegistration registration = owned(id);
        return mapper.statusMap(registration, resolveCurrentStep(registration));
    }

    private void validateDraft(CompanyRegistrationDto.DraftRequest request) {
        if (request == null || request.company() == null) throw new CompanyRegistrationValidationException("company is required");
        CompanyRegistrationDto.DraftCompanyRequest company = request.company();
        requireText(company.companyType(), "companyType is required");
        requireText(company.primaryActivity(), "primaryActivity is required");
        requireText(company.nicCode(), "nicCode is required");
        requireText(company.proposedName1(), "proposedName1 is required");
        requireText(company.proposedName2(), "proposedName2 is required");
        requireText(company.registeredAddressLine(), "registeredAddressLine is required");
        requireText(company.registeredCity(), "registeredCity is required");
        requireText(company.registeredState(), "registeredState is required");
        requireText(company.registeredPincode(), "registeredPincode is required");
        requireText(company.companyEmail(), "companyEmail is required");
        requireText(company.companyMobile(), "companyMobile is required");
        if (company.authorizedCapital() == null || company.paidUpCapital() == null) {
            throw new CompanyRegistrationValidationException("authorizedCapital and paidUpCapital are required");
        }
        if (company.paidUpCapital().compareTo(company.authorizedCapital()) > 0) {
            throw new CompanyRegistrationValidationException("paidUpCapital cannot exceed authorizedCapital");
        }
        if (nullSafe(request.directors()).isEmpty() && nullSafe(request.partners()).isEmpty()) {
            throw new CompanyRegistrationValidationException("At least one director or partner is required");
        }
        if ("SUBMITTED".equals(toBackendStatus(request.status(), request.paymentStatus()))) {
            Set<String> uploaded = nullSafe(request.documents()).stream()
                    .filter(document -> "Uploaded".equalsIgnoreCase(document.status()) || "UPLOADED".equalsIgnoreCase(document.status()))
                    .map(CompanyRegistrationDto.DraftDocumentRequest::id)
                    .collect(Collectors.toSet());
            Set<String> required = Set.of("DIRECTOR_PAN", "DIRECTOR_ID_PROOF", "REGISTERED_OFFICE_PROOF", "OFFICE_UTILITY_BILL");
            if (!uploaded.containsAll(required)) throw new CompanyRegistrationValidationException("Mandatory documents are missing");
        }
    }

    private CompanyPerson saveDraftPerson(CompanyRegistration registration, CompanyRegistrationDto.DraftPersonRequest request, String defaultType) {
        requireText(request.name(), "person name is required");
        requireText(request.pan(), "person PAN is required");
        requireText(request.email(), "person email is required");
        CompanyPerson person = mapper.draftPerson(registration, request, defaultType);
        return personRepository.save(person);
    }

    private String toBackendStatus(String status, String paymentStatus) {
        if ("Submitted".equalsIgnoreCase(status) || "Paid".equalsIgnoreCase(paymentStatus)) return "SUBMITTED";
        if (StringUtils.hasText(status)) return status.toUpperCase().replace(' ', '_');
        return "DRAFT";
    }

    private CompanyRegistrationDocumentType parseDocumentType(String id) {
        try {
            return CompanyRegistrationDocumentType.valueOf(id);
        } catch (Exception exception) {
            throw new CompanyRegistrationValidationException("Unknown document type: " + id);
        }
    }

    private <T> List<T> nullSafe(List<T> values) {
        return values == null ? List.of() : values;
    }

    private DocumentResponse documentResponse(CompanyRegistrationDocument document) {
        DocumentResponse response = mapper.documentResponse(document);
        if ("UPLOADED".equalsIgnoreCase(response.status()) && !hasStoredContent(document)) {
            return new DocumentResponse(response.id(), response.custId(), response.documentType(),
                    response.name(), response.category(), response.required(), response.fileName(),
                    null, response.fileSize(), response.mimeType(), "PENDING", response.uploadedAt(),
                    response.verifiedAt(), response.remarks());
        }
        return response;
    }

    @Override
    @Transactional
    public ReviewResponse create(CreateCompanyRegistrationRequest request) {
        if (request == null) {
            throw new CompanyRegistrationValidationException("request is required");
        }
        requireText(request.companyType(), "companyType is required");
        if (request.applicationId() != null) {
            CompanyRegistration existing = owned(request.applicationId());
            mapper.updateRegistration(existing, request.companyType(),
                    StringUtils.hasText(request.constitutionType()) ? request.constitutionType() : existing.getConstitutionType());
            if (request.currentStep() != null) {
                existing.setCurrentStep(request.currentStep());
            }
            // Apply any additionally provided sections then save
            saveRegistrationSections(existing, request.companyDetails(), request.registeredOffice(),
                    request.persons(), request.capital(), request.shareholdings(), request.linkedRegistrations());
            registrationRepository.save(existing);
            return application(existing.getId(), request.currentStep());
        }
        CompanyRegistration registration = mapper.registration(currentUserId(), request.companyType(),
            request.constitutionType(), "DRAFT");
        registration.setCurrentStep(request.currentStep() == null ? 0 : request.currentStep());
        registration = registrationRepository.save(registration);
        registration.setApplicationNumber(String.format("CR%d%06d", Year.now().getValue(), registration.getId()));
        registrationRepository.save(registration);
        // Persist optional nested sections supplied in the same request
        saveRegistrationSections(registration, request.companyDetails(), request.registeredOffice(),
                request.persons(), request.capital(), request.shareholdings(), request.linkedRegistrations());
        return application(registration.getId(), request.currentStep());
    }

    /**
     * PUT /api/v1/company-registrations/{id}
     * <p>
     * Consolidated update: accepts all logically-related sections in a single JSON
     * payload and updates each section that is present in the request.
     * Sections not provided (null) are left untouched.
     */
    @Override
    @Transactional
    public ReviewResponse updateRegistration(Long id, UpdateCompanyRegistrationRequest request) {
        CompanyRegistration registration = owned(id);
        mapper.updateRegistration(registration,
                StringUtils.hasText(request.companyType()) ? request.companyType() : registration.getCompanyType(),
                StringUtils.hasText(request.constitutionType()) ? request.constitutionType() : registration.getConstitutionType());
        if (request.currentStep() != null) {
            registration.setCurrentStep(request.currentStep());
        }
        registrationRepository.save(registration);
        saveRegistrationSections(registration, request.companyDetails(), request.registeredOffice(),
                request.persons(), request.capital(), request.shareholdings(), request.linkedRegistrations());
        return application(id, request.currentStep());
    }

    /**
     * Persists each optional nested section that is non-null.
     * Reuses existing service methods to keep all validation and business logic identical.
     */
    private void saveRegistrationSections(
            CompanyRegistration registration,
            CompanyDetailsRequest companyDetails,
            RegisteredOfficeRequest registeredOffice,
            List<PersonRequest> persons,
            CapitalRequest capital,
            List<ShareholdingRequest> shareholdings,
            LinkedRegistrationRequest linkedRegistrations) {
        Long regId = registration.getId();
        if (companyDetails != null) {
            updateDetails(regId, companyDetails);
        }
        if (registeredOffice != null) {
            updateOffice(regId, registeredOffice);
        }
        if (persons != null) {
            Set<Long> retainedPersonIds = new HashSet<>();
            for (PersonRequest personRequest : persons) {
                Map<String, Object> savedPerson;
                if (personRequest.id() != null) {
                    savedPerson = updatePerson(regId, personRequest.id(), personRequest);
                } else {
                    savedPerson = addPerson(regId, personRequest);
                }
                retainedPersonIds.add(((Number) savedPerson.get("id")).longValue());
            }
            for (CompanyPerson existingPerson : personRepository.findAllByRegistrationIdOrderByIdAsc(regId)) {
                if (!retainedPersonIds.contains(existingPerson.getId())) {
                    deletePerson(regId, existingPerson.getId());
                }
            }
        }
        if (capital != null) {
            updateCapital(regId, capital);
        }
        if (shareholdings != null) {
            Set<Long> retainedShareholdingIds = new HashSet<>();
            for (ShareholdingRequest shareholdingRequest : shareholdings) {
                Map<String, Object> savedShareholding;
                if (shareholdingRequest.id() == null) {
                    savedShareholding = addShareholding(regId, shareholdingRequest);
                } else {
                    savedShareholding = updateShareholding(regId, shareholdingRequest.id(), shareholdingRequest);
                }
                retainedShareholdingIds.add(((Number) savedShareholding.get("id")).longValue());
            }
            for (CompanyShareholding existingShareholding : shareholdingRepository.findAllByRegistrationIdOrderByIdAsc(regId)) {
                if (!retainedShareholdingIds.contains(existingShareholding.getId())) {
                    deleteShareholding(regId, existingShareholding.getId());
                }
            }
        }
        if (linkedRegistrations != null) {
            updateLinkedRegistrations(regId, linkedRegistrations);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyRegistrationResponse> list() {
        return registrationRepository.findAllByUserIdOrderByCreatedAtDesc(currentUserId()).stream().map(this::summary).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse get(Long id) {
        return application(id);
    }

    @Override
    @Transactional
    public Map<String, Object> updateDetails(Long id, CompanyDetailsRequest request) {
        CompanyRegistration registration = owned(id);
        requireText(request.primaryActivity(), "primaryActivity is required");
        requireText(request.nicCode(), "nicCode is required");
        requireText(request.proposedName1(), "proposedName1 is required");
        requireText(request.proposedName2(), "proposedName2 is required");
        CompanyDetails details = mapper.details(registration, request,
            detailsRepository.findByRegistrationId(id).orElse(null));
        detailsRepository.save(details);
        advance(registration);
        return mapper.detailsMap(details);
    }

    @Override
    @Transactional
    public Map<String, Object> updateOffice(Long id, RegisteredOfficeRequest request) {
        CompanyRegistration registration = owned(id);
        requireText(request.addressLine(), "addressLine is required");
        requireText(request.city(), "city is required");
        requireText(request.state(), "state is required");
        requireText(request.pincode(), "pincode is required");
        CompanyRegisteredOffice office = mapper.office(registration, request,
            officeRepository.findByRegistrationId(id).orElse(null));
        officeRepository.save(office);
        advance(registration);
        return mapper.officeMap(office);
    }

    @Override @Transactional(readOnly = true)
    public List<Map<String, Object>> persons(Long id) { owned(id); return personRepository.findAllByRegistrationIdOrderByIdAsc(id).stream().map(mapper::personMap).toList(); }

    @Override @Transactional
    public Map<String, Object> addPerson(Long id, PersonRequest request) {
        CompanyRegistration registration = owned(id);
        validatePerson(request);
        CompanyPerson person = personRepository.findAllByRegistrationIdOrderByIdAsc(id).stream()
            .filter(existing -> Objects.equals(existing.getPersonType(), request.personType()))
            .filter(existing -> existing.getPan().equalsIgnoreCase(request.pan()))
            .findFirst()
            .orElse(null);
        person = mapper.person(registration, request, person);
        return mapper.personMap(personRepository.save(person));
    }

    @Override @Transactional
    public Map<String, Object> updatePerson(Long id, Long personId, PersonRequest request) {
        owned(id);
        CompanyPerson person = personRepository.findById(personId).filter(p -> p.getRegistration().getId().equals(id)).orElseThrow(() -> new CompanyRegistrationNotFoundException("Person not found"));
        validatePerson(request);
        mapper.person(person.getRegistration(), request, person);
        return mapper.personMap(personRepository.save(person));
    }

    @Override @Transactional
    public void deletePerson(Long id, Long personId) { owned(id); CompanyPerson person = personRepository.findById(personId).filter(p -> p.getRegistration().getId().equals(id)).orElseThrow(() -> new CompanyRegistrationNotFoundException("Person not found")); personRepository.delete(person); }

    @Override @Transactional
    public Map<String, Object> updateCapital(Long id, CapitalRequest request) {
        CompanyRegistration registration = owned(id);
        if (request.authorizedCapital() == null || request.paidUpCapital() == null) throw new CompanyRegistrationValidationException("authorizedCapital and paidUpCapital are required");
        CompanyCapital capital = mapper.capital(registration, request,
            capitalRepository.findByRegistrationId(id).orElse(null));
        CompanyCapital savedCapital = capitalRepository.save(capital);
        detailsRepository.findByRegistrationId(id).ifPresent(details -> {
            detailsRepository.save(mapper.updateCapitalDetails(details, request));
        });
        advance(registration); return mapper.capitalMap(savedCapital);
    }

    @Override @Transactional(readOnly = true)
    public List<Map<String, Object>> shareholdings(Long id) { owned(id); return shareholdingRepository.findAllByRegistrationIdOrderByIdAsc(id).stream().map(mapper::shareholdingMap).toList(); }

    @Override @Transactional
    public Map<String, Object> addShareholding(Long id, ShareholdingRequest request) { CompanyRegistration registration = owned(id); CompanyShareholding item = shareholdingRepository.findAllByRegistrationIdOrderByIdAsc(id).stream().filter(existing -> Objects.equals(existing.getPerson(), request.person())).findFirst().orElse(null); return mapper.shareholdingMap(shareholdingRepository.save(mapper.shareholding(registration, request, item))); }

    @Override @Transactional
    public Map<String, Object> updateShareholding(Long id, Long shareholdingId, ShareholdingRequest request) { owned(id); CompanyShareholding item = shareholdingRepository.findById(shareholdingId).filter(s -> s.getRegistration().getId().equals(id)).orElseThrow(() -> new CompanyRegistrationNotFoundException("Shareholding not found")); return mapper.shareholdingMap(shareholdingRepository.save(mapper.shareholding(item.getRegistration(), request, item))); }

    @Override @Transactional
    public void deleteShareholding(Long id, Long shareholdingId) { owned(id); CompanyShareholding item = shareholdingRepository.findById(shareholdingId).filter(s -> s.getRegistration().getId().equals(id)).orElseThrow(() -> new CompanyRegistrationNotFoundException("Shareholding not found")); shareholdingRepository.delete(item); }

    @Override @Transactional(readOnly = true)
    public List<DocumentResponse> documents(Long id) {
        owned(id);
        return documentRepository.findAllByRegistrationIdOrderByIdAsc(id).stream()
                .map(this::documentResponse)
                .toList();
    }

    @Override @Transactional(readOnly = true)
    public DocumentResponse document(Long id, Long documentId) {
        owned(id);
        CompanyRegistrationDocument document = documentRepository.findById(documentId)
                .filter(item -> item.getRegistration().getId().equals(id))
                .orElseThrow(() -> new CompanyRegistrationNotFoundException("Document not found"));
        return documentResponse(document);
    }

    @Override @Transactional(readOnly = true)
    public DocumentContent documentContent(Long id, Long documentId) {
        owned(id);
        CompanyRegistrationDocument document = documentRepository.findById(documentId)
                .filter(item -> item.getRegistration().getId().equals(id))
                .orElseThrow(() -> new CompanyRegistrationNotFoundException("Document not found"));
        try {
            Resource resource;
            if (fileStorage.exists(document.getFileUri())) {
                resource = fileStorage.load(document.getFileUri());
            } else if (StringUtils.hasText(document.getFileData())) {
                resource = new ByteArrayResource(Base64.getDecoder().decode(document.getFileData()));
            } else {
                throw new CompanyRegistrationNotFoundException(
                        "This legacy document has no server-stored file. Please upload it again.");
            }
            return new DocumentContent(resource, document.getFileName(), document.getMimeType());
        } catch (IOException | IllegalArgumentException exception) {
            throw new CompanyRegistrationException("Unable to read the stored company registration document", exception);
        }
    }

    @Override @Transactional
    public DocumentResponse uploadDocument(Long id, CompanyRegistrationDocumentType documentType, MultipartFile file) {
        CompanyRegistration registration = owned(id);
        if (documentType == null) throw new CompanyRegistrationValidationException("documentType is required");
        if (file == null || file.isEmpty()) throw new CompanyRegistrationValidationException("file is required");
        String storedFileUri = null;
        try {
            List<CompanyRegistrationDocument> matchingDocuments = documentRepository.findAllByRegistrationIdOrderByIdAsc(id).stream()
                    .filter(existing -> existing.getDocumentType() == documentType)
                    .toList();
            String previousFileUri = matchingDocuments.isEmpty() ? null : matchingDocuments.get(0).getFileUri();
            storedFileUri = fileStorage.store(id, file);
            registerUploadCompletion(storedFileUri, previousFileUri);
            CompanyRegistrationDocument document = mapper.uploadedDocument(registration,
                    matchingDocuments.isEmpty() ? null : matchingDocuments.get(0), documentType, file, storedFileUri);
            document = documentRepository.saveAndFlush(document);
            if (matchingDocuments.size() > 1) {
                documentRepository.deleteAll(matchingDocuments.subList(1, matchingDocuments.size()));
            }
            return documentResponse(document);
        } catch (IOException ex) {
            deleteStoredFileAfterFailure(storedFileUri, ex);
            throw new CompanyRegistrationException("Unable to store uploaded document", ex);
        } catch (RuntimeException ex) {
            deleteStoredFileAfterFailure(storedFileUri, ex);
            throw ex;
        }
    }

    private void deleteStoredFileAfterFailure(String storedFileUri, Exception originalFailure) {
        if (!StringUtils.hasText(storedFileUri)) return;
        try {
            fileStorage.delete(storedFileUri);
        } catch (IOException cleanupFailure) {
            originalFailure.addSuppressed(cleanupFailure);
        }
    }

    private void registerUploadCompletion(String newFileUri, String previousFileUri) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) return;
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_COMMITTED) {
                    deleteStoredFileQuietly(previousFileUri);
                } else {
                    deleteStoredFileQuietly(newFileUri);
                }
            }
        });
    }

    private void deleteStoredFileQuietly(String fileUri) {
        if (!StringUtils.hasText(fileUri)) return;
        try {
            fileStorage.delete(fileUri);
        } catch (IOException exception) {
            log.warn("Unable to clean up company registration file after transaction completion");
        }
    }

    private boolean hasStoredContent(CompanyRegistrationDocument document) {
        if (fileStorage.exists(document.getFileUri())) return true;
        if (!StringUtils.hasText(document.getFileData())) return false;
        try {
            return Base64.getDecoder().decode(document.getFileData()).length > 0;
        } catch (IllegalArgumentException exception) {
            return false;
        }
    }

    @Override @Transactional
    public void deleteDocument(Long id, Long documentId) {
        owned(id);
        CompanyRegistrationDocument document = documentRepository.findById(documentId)
                .filter(item -> item.getRegistration().getId().equals(id))
                .orElseThrow(() -> new CompanyRegistrationNotFoundException("Document not found"));
        String storedFileUri = document.getFileUri();
        documentRepository.delete(document);
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCompletion(int status) {
                    if (status == STATUS_COMMITTED) deleteStoredFileQuietly(storedFileUri);
                }
            });
        }
    }

    @Override @Transactional
    public Map<String, Object> updateLinkedRegistrations(Long id, LinkedRegistrationRequest request) { CompanyRegistration registration = owned(id); CompanyLinkedRegistration linked = mapper.linked(registration, request, linkedRepository.findByRegistrationId(id).orElse(null)); advance(registration); return mapper.linkedMap(linkedRepository.save(linked)); }

    @Override @Transactional(readOnly = true)
    public Map<String, Object> linkedRegistrations(Long id) { owned(id); return linkedRepository.findByRegistrationId(id).map(mapper::linkedMap).orElseGet(mapper::emptyMap); }

    @Override @Transactional(readOnly = true)
    public Map<String, Object> payment(Long id) { owned(id); return paymentRepository.findAllByRegistrationIdOrderByCreatedAtDesc(id).stream().findFirst().map(mapper::paymentMap).orElseGet(mapper::emptyMap); }

    @Override @Transactional
    public Map<String, Object> savePayment(Long id, PaymentRequest request) {
        CompanyRegistration registration = owned(id);
        CompanyRegistrationPayment latestPayment = paymentRepository.findAllByRegistrationIdOrderByCreatedAtDesc(id)
                .stream()
                .findFirst()
                .orElse(null);
        CompanyRegistrationPayment existingPayment = latestPayment != null
                && !"PAID".equalsIgnoreCase(latestPayment.getPaymentStatus())
                ? latestPayment
                : null;
        CompanyRegistrationPayment payment = mapper.payment(registration, request, existingPayment);
        if ("PAID".equalsIgnoreCase(payment.getPaymentStatus())) {
            payment.setPaidAt(LocalDateTime.now());
            registration.setStatus("PAYMENT_SUCCESS");
        }
        return mapper.paymentMap(paymentRepository.save(payment));
    }

    @Override @Transactional(readOnly = true)
    public List<TrackingResponse> tracking(Long id) { owned(id); return trackingRepository.findAllByRegistrationIdOrderByIdAsc(id).stream().map(mapper::trackingResponse).toList(); }

    @Override @Transactional(readOnly = true)
    public ReviewResponse review(Long id) { return application(id); }

    @Override @Transactional
    public SubmissionResponse submit(Long id) {
        CompanyRegistration registration = owned(id);
        detailsRepository.findByRegistrationId(id)
            .orElseThrow(() -> new CompanyRegistrationValidationException("Company details are required"));
        officeRepository.findByRegistrationId(id)
            .orElseThrow(() -> new CompanyRegistrationValidationException("Registered office is required"));
        List<CompanyPerson> people = personRepository.findAllByRegistrationIdOrderByIdAsc(id);
        long promoters = people.stream()
                .filter(person -> !"NOMINEE".equalsIgnoreCase(person.getPersonType()))
                .count();
        boolean opc = "One Person Company (OPC)".equalsIgnoreCase(registration.getCompanyType());
        long minimumPromoters = "Public Limited".equalsIgnoreCase(registration.getCompanyType()) ? 3 : opc ? 1 : 2;
        if (promoters < minimumPromoters) {
            throw new CompanyRegistrationValidationException(
                    "At least " + minimumPromoters + " promoter(s) are required for this company type");
        }
        if (opc && people.stream().noneMatch(person -> "NOMINEE".equalsIgnoreCase(person.getPersonType()))) {
            throw new CompanyRegistrationValidationException("An OPC nominee is required");
        }
        CompanyCapital capital = capitalRepository.findByRegistrationId(id)
            .orElseThrow(() -> new CompanyRegistrationValidationException("Capital details are required"));
        if (capital.getAuthorizedCapital() == null || capital.getPaidUpCapital() == null) {
            throw new CompanyRegistrationValidationException("Capital details are incomplete");
        }

        Set<CompanyRegistrationDocumentType> required = Set.of(
            CompanyRegistrationDocumentType.DIRECTOR_PAN,
            CompanyRegistrationDocumentType.DIRECTOR_ID_PROOF,
            CompanyRegistrationDocumentType.REGISTERED_OFFICE_PROOF,
            CompanyRegistrationDocumentType.OFFICE_UTILITY_BILL);
        Set<CompanyRegistrationDocumentType> uploaded = documentRepository.findAllByRegistrationIdOrderByIdAsc(id)
            .stream()
            .filter(document -> "UPLOADED".equalsIgnoreCase(document.getStatus()) && hasStoredContent(document))
            .map(CompanyRegistrationDocument::getDocumentType)
            .collect(Collectors.toSet());
        if (!uploaded.containsAll(required)) {
            throw new CompanyRegistrationValidationException("Mandatory documents are missing");
        }

        registration.setStatus("SUBMITTED");
        registration.setSubmittedAt(LocalDateTime.now());
        registration.setCurrentStep(9);
        CompanyRegistration saved = registrationRepository.save(registration);
        boolean submissionTracked = trackingRepository.findAllByRegistrationIdOrderByIdAsc(id).stream()
            .anyMatch(stage -> "APPLICATION_SUBMITTED".equals(stage.getStage()));
        if (!submissionTracked) {
            CompanyRegistrationTracking stage = new CompanyRegistrationTracking();
            stage.setRegistration(saved);
            stage.setStage("APPLICATION_SUBMITTED");
            stage.setStatus("COMPLETED");
            stage.setDescription("Company registration submitted successfully.");
            stage.setStartedAt(saved.getSubmittedAt());
            stage.setCompletedAt(saved.getSubmittedAt());
            trackingRepository.save(stage);
        }
        return mapper.submissionResponse(saved, saved.getSubmittedAt());
    }

    @Override @Transactional(readOnly = true)
    public ReceiptResponse receipt(Long id) {
        CompanyRegistration registration = owned(id);
        return mapper.receiptResponse(application(id), registration.getSubmittedAt());
    }

    private ReviewResponse application(Long id) {
        return application(id, null);
    }

    private ReviewResponse application(Long id, Integer currentStepOverride) {
        CompanyRegistration registration = owned(id);
        return mapper.reviewResponse(
                summary(registration, currentStepOverride),
            detailsRepository.findByRegistrationId(id).map(mapper::companyDetailsResponse).orElse(null),
            officeRepository.findByRegistrationId(id).map(mapper::registeredOfficeResponse).orElse(null),
            personRepository.findAllByRegistrationIdOrderByIdAsc(id).stream().map(mapper::personResponse).toList(),
            capitalRepository.findByRegistrationId(id).map(mapper::capitalResponse).orElse(null),
            shareholdingRepository.findAllByRegistrationIdOrderByIdAsc(id).stream().map(mapper::shareholdingResponse).toList(),
            documentRepository.findAllByRegistrationIdOrderByIdAsc(id).stream().map(this::documentResponse).toList(),
            linkedRepository.findByRegistrationId(id).map(mapper::linkedRegistrationResponse).orElse(null),
            paymentRepository.findAllByRegistrationIdOrderByCreatedAtDesc(id).stream().map(mapper::paymentResponse).toList(),
            trackingRepository.findAllByRegistrationIdOrderByIdAsc(id).stream().map(mapper::trackingResponse).toList());
    }

    private CompanyRegistration owned(Long id) { return registrationRepository.findByIdAndUserId(id, currentUserId()).orElseThrow(() -> new CompanyRegistrationNotFoundException("Company registration not found")); }
    private String currentUserId() { Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); if (authentication == null || !(authentication.getPrincipal() instanceof JwtPrincipal principal)) throw new CompanyRegistrationNotFoundException("Authenticated customer is required"); return principal.custId(); }
    private void advance(CompanyRegistration registration) { if ("DRAFT".equals(registration.getStatus())) registration.setStatus("IN_PROGRESS"); registrationRepository.save(registration); }
    private void requireText(String value, String message) { if (!StringUtils.hasText(value)) throw new CompanyRegistrationValidationException(message); }
    private void validatePerson(PersonRequest request) { requireText(request.name(), "person name is required"); requireText(request.pan(), "person PAN is required"); requireText(request.email(), "person email is required"); }
    private CompanyRegistrationResponse summary(CompanyRegistration r) { return summary(r, null); }
    private CompanyRegistrationResponse summary(CompanyRegistration r, Integer currentStepOverride) {
        int currentStep = currentStepOverride == null ? resolveCurrentStep(r) : currentStepOverride;
        return mapper.summary(r, currentStep);
    }
    private int resolveCurrentStep(CompanyRegistration registration) {
        if (registration.getCurrentStep() != null && registration.getCurrentStep() > 0) {
            return registration.getCurrentStep();
        }
        if (registration.getSubmittedAt() != null || "SUBMITTED".equals(registration.getStatus())) return 10;
        Long id = registration.getId();
        int currentStep = 1;
        if (detailsRepository.findByRegistrationId(id).isPresent()) currentStep = 2;
        if (officeRepository.findByRegistrationId(id).isPresent()) currentStep = 3;
        if (!personRepository.findAllByRegistrationIdOrderByIdAsc(id).isEmpty()) currentStep = 4;
        if (capitalRepository.findByRegistrationId(id).isPresent()) currentStep = 5;
        if (!shareholdingRepository.findAllByRegistrationIdOrderByIdAsc(id).isEmpty()) currentStep = 6;
        if (linkedRepository.findByRegistrationId(id).isPresent()) currentStep = 7;
        return currentStep;
    }

}
