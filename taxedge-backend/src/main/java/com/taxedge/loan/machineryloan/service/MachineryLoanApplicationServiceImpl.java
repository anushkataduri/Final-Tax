package com.taxedge.loan.machineryloan.service;

import java.time.Year;
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
import com.taxedge.loan.machineryloan.dto.MachineryLoanApplicationDto;
import com.taxedge.loan.machineryloan.entity.MachineryLoanApplication;
import com.taxedge.loan.machineryloan.enums.MachineryLoanApplicationStatus;
import com.taxedge.loan.machineryloan.helper.MachineryLoanHelper;
import com.taxedge.loan.machineryloan.mapper.MachineryLoanApplicationMapper;
import com.taxedge.loan.machineryloan.repository.MachineryLoanApplicationRepository;
import com.taxedge.loan.machineryloan.repository.MachineryLoanDocumentRepository;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MachineryLoanApplicationServiceImpl implements MachineryLoanApplicationService {

    private final MachineryLoanApplicationRepository repository;
    private final CustomerRepository customerRepository;
    private final MachineryLoanApplicationMapper mapper;
    private final MachineryLoanDocumentRepository documentRepository;

    @Override
    @Transactional
    public String saveApplication(MachineryLoanApplicationDto dto) {
        String custId = currentCustomerId();

        Customer customer = customerRepository.findById(custId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + custId));

        MachineryLoanApplication entity = mapper.toEntity(dto);
        if (!StringUtils.hasText(entity.getId())) {
            int year = Year.now().getValue();
            long seq = repository.getNextSequenceValue();
            entity.setId(MachineryLoanHelper.formatLoanApplicationId(year, seq));
        }
        entity.setCustomer(customer);
        entity.setStatus(MachineryLoanApplicationStatus.DRAFT);

        String machineryLoanId = repository.save(entity).getId();
        log.info("Machinery loan application created [{}] for customer [{}]", machineryLoanId, custId);

        return machineryLoanId;
    }

    @Override
    @Transactional
    public String updateApplication(String machineryLoanId, MachineryLoanApplicationDto dto) {
        MachineryLoanApplication entity = findOrThrow(machineryLoanId);
        if (entity.getStatus() == MachineryLoanApplicationStatus.SUBMITTED
                || entity.getStatus() == MachineryLoanApplicationStatus.APPROVED) {
            throw new IllegalStateException("Submitted or approved machinery loan applications cannot be edited");
        }

        MachineryLoanApplicationStatus currentStatus = entity.getStatus();
        mapper.updateFromDto(dto, entity);
        entity.setStatus(currentStatus);

        log.info("Machinery loan application updated [{}]", machineryLoanId);
        return machineryLoanId;
    }

    @Override
    public MachineryLoanApplicationDto getApplication(String machineryLoanId) {
        return mapper.toDto(findOrThrow(machineryLoanId));
    }

    @Override
    public List<MachineryLoanApplicationDto> getApplications() {
        return repository.findByCustomer_CustIdOrderByCreatedAtDesc(currentCustomerId())
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void deleteApplication(String machineryLoanId) {
        MachineryLoanApplication entity = findOrThrow(machineryLoanId);
        if (entity.getStatus() == MachineryLoanApplicationStatus.SUBMITTED
                || entity.getStatus() == MachineryLoanApplicationStatus.APPROVED) {
            throw new IllegalStateException("Submitted or approved machinery loan applications cannot be deleted");
        }
        documentRepository.deleteByMachineryLoanApplication_Id(machineryLoanId);
        repository.delete(entity);
        log.info("Deleted machinery loan application {} and associated documents", machineryLoanId);
    }

    private MachineryLoanApplication findOrThrow(String machineryLoanId) {
        if (!StringUtils.hasText(machineryLoanId)) {
            throw new IllegalArgumentException("Machinery loan application ID is required");
        }
        return repository.findByIdAndCustomer_CustId(machineryLoanId.trim(), currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Machinery loan application not found: " + machineryLoanId));
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