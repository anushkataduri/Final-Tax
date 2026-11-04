package com.taxedge.loan.msmeloan.service;


import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.exception.ResourceNotFoundException;
import com.taxedge.loan.msmeloan.dto.MsmeLoanApplicationDto;
import com.taxedge.loan.msmeloan.entity.MsmeLoanApplication;
import com.taxedge.loan.msmeloan.helper.MsmeLoanHelper;
import com.taxedge.loan.msmeloan.mapper.MsmeLoanApplicationMapper;
import com.taxedge.loan.msmeloan.repository.MsmeLoanApplicationRepository;
import com.taxedge.loan.msmeloan.repository.MsmeLoanDocumentRepository;
import com.taxedge.loan.personalloan.enums.LoanApplicationStatus;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MsmeLoanApplicationServiceImpl implements MsmeLoanApplicationService {

    private final MsmeLoanApplicationRepository repository;
    private final MsmeLoanDocumentRepository documentRepository;
    private final CustomerRepository customerRepository;
    private final MsmeLoanApplicationMapper mapper;

    @Override
    @Transactional
    public MsmeLoanApplicationDto saveApplication(MsmeLoanApplicationDto dto) {
        String customerId = currentCustomerId();
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer not found: " + customerId));

        MsmeLoanApplication entity = mapper.toEntity(dto);
        if (!StringUtils.hasText(entity.getId())) {
            int year = java.time.Year.now().getValue();
            long seq = repository.getNextSequenceValue();
            entity.setId(MsmeLoanHelper.formatLoanApplicationId(year, seq));
        }
        entity.setCustomer(customer);
        entity.setStatus(LoanApplicationStatus.DRAFT);

        MsmeLoanApplication saved = repository.save(entity);
        log.info("Created MSME loan application {} for customer {}", saved.getId(), customerId);
        return mapper.toDto(saved);
    }

    @Override
    @Transactional
    public MsmeLoanApplicationDto updateApplication(String id, MsmeLoanApplicationDto dto) {
        MsmeLoanApplication entity = findOrThrow(id);
        if (entity.getStatus() == LoanApplicationStatus.SUBMITTED || entity.getStatus() == LoanApplicationStatus.APPROVED) {
            throw new IllegalStateException("Submitted or approved MSME loan applications cannot be edited");
        }

        LoanApplicationStatus currentStatus = entity.getStatus();
        mapper.updateFromDto(dto, entity);
        entity.setStatus(currentStatus);

        log.info("Updated MSME loan application: {}", id);
        return mapper.toDto(entity);
    }

    @Override
    public MsmeLoanApplicationDto getApplication(String id) {
        return mapper.toDto(findOrThrow(id));
    }

    @Override
    public List<MsmeLoanApplicationDto> getMyApplications() {
        return repository.findByCustomer_CustIdOrderByCreatedAtDesc(currentCustomerId())
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void deleteApplication(String id) {
        MsmeLoanApplication entity = findOrThrow(id);
        if (entity.getStatus() == LoanApplicationStatus.SUBMITTED || entity.getStatus() == LoanApplicationStatus.APPROVED) {
            throw new IllegalStateException("Submitted or approved MSME loan applications cannot be deleted");
        }
        documentRepository.deleteByLoanApplication_Id(entity.getId());
        repository.delete(entity);
        log.info("Deleted MSME loan application {} and associated documents", id);
    }

    private MsmeLoanApplication findOrThrow(String id) {
        if (!StringUtils.hasText(id)) {
            throw new IllegalArgumentException("MSME loan application ID is required");
        }
        return repository.findByIdAndCustomer_CustId(id.trim(), currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("MSME loan application not found: " + id));
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
