package com.taxedge.loan.businessloan.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.taxedge.exception.ResourceNotFoundException;
import com.taxedge.loan.businessloan.dto.BusinessLoanDocumentDto;
import com.taxedge.loan.businessloan.entity.BusinessLoanApplication;
import com.taxedge.loan.businessloan.entity.BusinessLoanDocument;
import com.taxedge.loan.businessloan.mapper.BusinessLoanDocumentMapper;
import com.taxedge.loan.businessloan.repository.BusinessLoanApplicationRepository;
import com.taxedge.loan.businessloan.repository.BusinessLoanDocumentRepository;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BusinessLoanDocumentServiceImpl implements BusinessLoanDocumentService {

    private final BusinessLoanDocumentRepository repository;
    private final BusinessLoanApplicationRepository applicationRepository;
    private final BusinessLoanDocumentMapper mapper;

    @Override
    @Transactional
    public String saveDocuments(BusinessLoanDocumentDto dto) {

        BusinessLoanApplication application = getOwnedApplication(dto.getLoanApplicationId());

        BusinessLoanDocument entity = mapper.toEntity(dto);
        entity.setLoanApplication(application);

        repository.save(entity);
        log.info("Documents saved for application {}", application.getId());

        return application.getId();
    }

    @Override
    @Transactional
    public String updateDocuments(String loanApplicationId, BusinessLoanDocumentDto dto) {

        getOwnedApplication(loanApplicationId);
        BusinessLoanDocument entity = findOrThrow(loanApplicationId);

        mapper.updateFromDto(dto, entity);

        log.info("Documents updated for application {}", loanApplicationId);
        return loanApplicationId;
    }

    @Override
    public BusinessLoanDocumentDto getDocuments(String loanApplicationId) {
        getOwnedApplication(loanApplicationId);
        return mapper.toDto(findOrThrow(loanApplicationId));
    }

    @Override
    @Transactional
    public void deleteDocuments(String loanApplicationId) {
        if (!repository.existsByLoanApplication_Id(loanApplicationId)) {
            throw new ResourceNotFoundException("Documents not found for loan application: " + loanApplicationId);
        }
        repository.deleteByLoanApplication_Id(loanApplicationId);
        log.info("Deleted documents for business loan [{}]", loanApplicationId);
    }

    private BusinessLoanDocument findOrThrow(String loanApplicationId) {
        return repository.findByLoanApplication_Id(loanApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Documents not found for application: " + loanApplicationId));
    }

    private BusinessLoanApplication getOwnedApplication(String loanApplicationId) {
        if (!StringUtils.hasText(loanApplicationId)) {
            throw new IllegalArgumentException("Loan application ID is required");
        }
        return applicationRepository.findByIdAndCustomer_CustId(loanApplicationId.trim(), currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Loan application not found: " + loanApplicationId));
    }

    private String currentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof JwtPrincipal principal)
                || !StringUtils.hasText(principal.custId())) {
            throw new AccessDeniedException("An authenticated customer is required");
        }
        return principal.custId();
    }
}
