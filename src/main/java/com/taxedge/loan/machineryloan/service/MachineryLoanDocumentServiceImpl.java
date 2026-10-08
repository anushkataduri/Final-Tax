package com.taxedge.loan.machineryloan.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.loan.machineryloan.dto.MachineryLoanDocumentDto;
import com.taxedge.loan.machineryloan.entity.MachineryLoanApplication;
import com.taxedge.loan.machineryloan.entity.MachineryLoanDocument;
import com.taxedge.loan.machineryloan.mapper.MachineryLoanDocumentMapper;
import com.taxedge.loan.machineryloan.repository.MachineryLoanApplicationRepository;
import com.taxedge.loan.machineryloan.repository.MachineryLoanDocumentRepository;
import com.taxedge.loan.machineryloan.service.MachineryLoanDocumentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MachineryLoanDocumentServiceImpl implements MachineryLoanDocumentService {

    private final MachineryLoanDocumentRepository repository;
    private final MachineryLoanApplicationRepository applicationRepository;
    private final MachineryLoanDocumentMapper mapper;

    @Override
    @Transactional
    public String saveDocuments(String machineryLoanId, MachineryLoanDocumentDto dto) {

        if (repository.existsByMachineryLoanApplication_Id(machineryLoanId)) {
            return updateDocuments(machineryLoanId, dto);
        }

        MachineryLoanApplication application = applicationRepository.findById(machineryLoanId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Machinery loan application not found: " + machineryLoanId));

        MachineryLoanDocument entity = mapper.toEntity(dto);
        entity.setMachineryLoanApplication(application);

        repository.save(entity);
        log.info("Documents stored for machinery loan [{}]", machineryLoanId);

        return machineryLoanId;
    }

    @Override
    @Transactional
    public String updateDocuments(String machineryLoanId, MachineryLoanDocumentDto dto) {

        MachineryLoanDocument entity = findOrThrow(machineryLoanId);

        mapper.updateFromDto(dto, entity);

        log.info("Documents updated for machinery loan [{}]", machineryLoanId);
        return machineryLoanId;
    }

    @Override
    public MachineryLoanDocumentDto getDocuments(String machineryLoanId) {
        return mapper.toDto(findOrThrow(machineryLoanId));
    }

    private MachineryLoanDocument findOrThrow(String machineryLoanId) {
        return repository.findByMachineryLoanApplication_Id(machineryLoanId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Documents not found for machinery loan: " + machineryLoanId));
    }
}
