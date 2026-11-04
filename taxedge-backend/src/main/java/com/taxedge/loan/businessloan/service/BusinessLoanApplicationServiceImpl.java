package com.taxedge.loan.businessloan.service;

import java.time.Year;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.exception.ResourceNotFoundException;
import com.taxedge.loan.businessloan.dto.BusinessLoanApplicationDto;
import com.taxedge.loan.businessloan.entity.BusinessLoanApplication;
import com.taxedge.loan.businessloan.enums.LoanApplicationStatus;
import com.taxedge.loan.businessloan.helper.BusinessLoanHelper;
import com.taxedge.loan.businessloan.mapper.BusinessLoanApplicationMapper;
import com.taxedge.loan.businessloan.repository.BusinessLoanApplicationRepository;
import com.taxedge.loan.businessloan.repository.BusinessLoanBankingRepository;
import com.taxedge.loan.businessloan.repository.BusinessLoanDocumentRepository;
import com.taxedge.loan.businessloan.repository.BusinessLoanProfileRepository;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BusinessLoanApplicationServiceImpl implements BusinessLoanApplicationService {

    private final BusinessLoanApplicationRepository repository;
    private final CustomerRepository customerRepository;
    private final BusinessLoanApplicationMapper mapper;
    private final BusinessLoanDocumentRepository documentRepository;
    private final BusinessLoanProfileRepository profileRepository;
    private final BusinessLoanBankingRepository bankingRepository;

    @Override
    @Transactional
    public String saveApplication(BusinessLoanApplicationDto dto) {
        String custId = currentCustomerId();

        Customer customer = customerRepository.findById(custId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + custId));

        BusinessLoanApplication entity = mapper.toEntity(dto);
        if (!StringUtils.hasText(entity.getId())) {
            int year = Year.now().getValue();
            long seq = repository.getNextSequenceValue();
            entity.setId(BusinessLoanHelper.formatLoanApplicationId(year, seq));
        }
        entity.setCustomer(customer);
        entity.setStatus(LoanApplicationStatus.DRAFT);

        String id = repository.save(entity).getId();
        log.info("Business loan application created: {} for customer {}", id, custId);

        return id;
    }

    @Override
    @Transactional
    public String updateApplication(String id, BusinessLoanApplicationDto dto) {
        BusinessLoanApplication entity = findOrThrow(id);
        if (entity.getStatus() == LoanApplicationStatus.SUBMITTED || entity.getStatus() == LoanApplicationStatus.APPROVED) {
            throw new IllegalStateException("Submitted or approved business loan applications cannot be edited");
        }

        LoanApplicationStatus currentStatus = entity.getStatus();
        mapper.updateFromDto(dto, entity);
        entity.setStatus(currentStatus);

        log.info("Business loan application updated: {}", id);
        return id;
    }

    @Override
    public BusinessLoanApplicationDto getApplication(String id) {
        return mapper.toDto(findOrThrow(id));
    }

    @Override
    @Transactional
    public void deleteApplication(String id) {
        BusinessLoanApplication entity = findOrThrow(id);
        if (entity.getStatus() == LoanApplicationStatus.SUBMITTED || entity.getStatus() == LoanApplicationStatus.APPROVED) {
            throw new IllegalStateException("Submitted or approved business loan applications cannot be deleted");
        }
        documentRepository.deleteByLoanApplication_Id(id);
        profileRepository.deleteByLoanApplication_Id(id);
        bankingRepository.deleteByLoanApplication_Id(id);
        repository.delete(entity);
        log.info("Deleted business loan application {} and associated sections", id);
    }

    private BusinessLoanApplication findOrThrow(String id) {
        if (!StringUtils.hasText(id)) {
            throw new IllegalArgumentException("Business loan application ID is required");
        }
        return repository.findByIdAndCustomer_CustId(id.trim(), currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found: " + id));
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
