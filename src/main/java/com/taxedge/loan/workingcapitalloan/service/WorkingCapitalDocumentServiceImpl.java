package com.taxedge.loan.workingcapitalloan.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.loan.workingcapitalloan.dto.WorkingCapitalDocumentDto;
import com.taxedge.loan.workingcapitalloan.entity.WorkingCapitalApplication;
import com.taxedge.loan.workingcapitalloan.entity.WorkingCapitalDocument;
import com.taxedge.loan.workingcapitalloan.mapper.WorkingCapitalDocumentMapper;
import com.taxedge.loan.workingcapitalloan.repository.WorkingCapitalApplicationRepository;
import com.taxedge.loan.workingcapitalloan.repository.WorkingCapitalDocumentRepository;
import com.taxedge.loan.workingcapitalloan.service.WorkingCapitalDocumentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkingCapitalDocumentServiceImpl implements WorkingCapitalDocumentService {

    private final WorkingCapitalDocumentRepository repository;
    private final WorkingCapitalApplicationRepository applicationRepository;
    private final WorkingCapitalDocumentMapper mapper;

    @Override
    @Transactional
    public String saveDocuments(String workingCapitalId, WorkingCapitalDocumentDto dto) {

        if (repository.existsByWorkingCapitalApplication_Id(workingCapitalId)) {
            return updateDocuments(workingCapitalId, dto);
        }

        WorkingCapitalApplication application = applicationRepository
                .findByIdAndCustomer_CustId(workingCapitalId, currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Working capital application not found: " + workingCapitalId));

        WorkingCapitalDocument entity = mapper.toEntity(dto);
        entity.setWorkingCapitalApplication(application);

        repository.save(entity);
        log.info("Documents stored for working capital [{}]", workingCapitalId);

        return workingCapitalId;
    }

    @Override
    @Transactional
    public String updateDocuments(String workingCapitalId, WorkingCapitalDocumentDto dto) {

        WorkingCapitalDocument entity = findOrThrow(workingCapitalId);

        mapper.updateFromDto(dto, entity);

        log.info("Documents updated for working capital [{}]", workingCapitalId);
        return workingCapitalId;
    }

    @Override
    public WorkingCapitalDocumentDto getDocuments(String workingCapitalId) {
        return mapper.toDto(findOrThrow(workingCapitalId));
    }

    private WorkingCapitalDocument findOrThrow(String workingCapitalId) {
        return repository
                .findByWorkingCapitalApplication_IdAndWorkingCapitalApplication_Customer_CustId(
                        workingCapitalId, currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Documents not found for working capital: " + workingCapitalId));
    }

    /** The authenticated customer, taken from the token rather than the request. */
    private String currentCustomerId() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated customer in context");
        }

        return authentication.getName();
    }
}
