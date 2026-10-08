package com.taxedge.loan.homeloan.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.loan.homeloan.dto.HomeLoanDocumentDto;
import com.taxedge.loan.homeloan.entity.HomeLoanApplication;
import com.taxedge.loan.homeloan.entity.HomeLoanDocument;
import com.taxedge.loan.homeloan.mapper.HomeLoanDocumentMapper;
import com.taxedge.loan.homeloan.repository.HomeLoanApplicationRepository;
import com.taxedge.loan.homeloan.repository.HomeLoanDocumentRepository;
import com.taxedge.loan.homeloan.service.HomeLoanDocumentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeLoanDocumentServiceImpl implements HomeLoanDocumentService {

    private final HomeLoanDocumentRepository repository;
    private final HomeLoanApplicationRepository applicationRepository;
    private final HomeLoanDocumentMapper mapper;

    @Override
    @Transactional
    public String saveDocuments(String homeLoanId, HomeLoanDocumentDto dto) {

        if (repository.existsByHomeLoanApplication_Id(homeLoanId)) {
            return updateDocuments(homeLoanId, dto);
        }

        HomeLoanApplication application = applicationRepository.findById(homeLoanId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Home loan application not found: " + homeLoanId));

        HomeLoanDocument entity = mapper.toEntity(dto);
        entity.setHomeLoanApplication(application);

        repository.save(entity);
        log.info("Documents stored for home loan [{}]", homeLoanId);

        return homeLoanId;
    }

    @Override
    @Transactional
    public String updateDocuments(String homeLoanId, HomeLoanDocumentDto dto) {

        HomeLoanDocument entity = findOrThrow(homeLoanId);

        mapper.updateFromDto(dto, entity);

        log.info("Documents updated for home loan [{}]", homeLoanId);
        return homeLoanId;
    }

    @Override
    public HomeLoanDocumentDto getDocuments(String homeLoanId) {
        return mapper.toDto(findOrThrow(homeLoanId));
    }

    private HomeLoanDocument findOrThrow(String homeLoanId) {
        return repository.findByHomeLoanApplication_Id(homeLoanId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Documents not found for home loan: " + homeLoanId));
    }
}
