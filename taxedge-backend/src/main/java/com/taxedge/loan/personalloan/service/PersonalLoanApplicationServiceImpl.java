package com.taxedge.loan.personalloan.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.exception.ResourceNotFoundException;
import com.taxedge.loan.personalloan.dto.PersonalLoanApplicationDto;
import com.taxedge.loan.personalloan.entity.PersonalLoanApplication;
import com.taxedge.loan.personalloan.enums.LoanApplicationStatus;
import com.taxedge.loan.personalloan.mapper.PersonalLoanApplicationMapper;
import com.taxedge.loan.personalloan.repository.PersonalLoanApplicationRepository;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PersonalLoanApplicationServiceImpl implements PersonalLoanApplicationService {

    private static final BigDecimal MIN_LOAN_AMOUNT = new BigDecimal("10000");
    private static final BigDecimal MAX_LOAN_AMOUNT = new BigDecimal("10000000");
    private static final BigDecimal MIN_MONTHLY_INCOME = new BigDecimal("10000");
    private static final Set<String> JOB_TYPES = Set.of(
            "Private", "Government", "Public Sector", "Self-Employed Professional", "Other");
    private static final Set<String> WORK_EXPERIENCE = Set.of(
            "Less than 1 year", "1 - 3 years", "3 - 5 years", "5+ years");
    private static final Set<String> SALARY_CREDIT_METHODS = Set.of("Bank Account", "Cash", "Cheque");
    private static final Set<String> NATURE_OF_BUSINESS = Set.of(
            "Trading", "Services", "Manufacturing", "Retail", "Professional", "Other");
    private static final Set<String> YEARS_IN_BUSINESS = Set.of(
            "Less than 1 year", "1 - 2 years", "3 - 5 years", "5+ years");

    private final PersonalLoanApplicationRepository repository;
    private final CustomerRepository customerRepository;
    private final PersonalLoanApplicationMapper mapper;

    @Override
    @Transactional
    public PersonalLoanApplicationDto saveApplication(PersonalLoanApplicationDto dto) {
        validateApplication(dto);
        String customerId = currentCustomerId();

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated customer not found"));

        if (dto.getId() != null && !dto.getId().isBlank()) {
            PersonalLoanApplication existing = repository.findById(dto.getId()).orElse(null);
            if (existing != null) {
                if (!existing.getCustomer().getCustId().equals(customerId)) {
                    throw new AccessDeniedException("You do not have access to this application");
                }
                mapper.updateFromDto(dto, existing);
                if (dto.getStatus() != null) {
                    existing.setStatus(dto.getStatus());
                }
                log.info("Personal loan application updated via save: {}", existing.getId());
                return mapper.toDto(existing);
            }
        }

        PersonalLoanApplication entity = mapper.toEntity(dto);
        if (dto.getId() != null && !dto.getId().isBlank()) {
            entity.setId(dto.getId());
        }
        entity.setCustomer(customer);
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        } else {
            entity.setStatus(LoanApplicationStatus.DRAFT);
        }

        PersonalLoanApplication saved = repository.save(entity);
        log.info("Personal loan application created: {}", saved.getId());

        return mapper.toDto(saved);
    }

    @Override
    @Transactional
    public PersonalLoanApplicationDto updateApplication(String id, PersonalLoanApplicationDto dto) {
        validateApplication(dto);

        PersonalLoanApplication entity = findOrThrow(id);
        if (entity.getStatus() == LoanApplicationStatus.APPROVED || entity.getStatus() == LoanApplicationStatus.REJECTED) {
            throw new IllegalStateException("Completed personal loan applications cannot be edited");
        }

        mapper.updateFromDto(dto, entity);
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }

        log.info("Personal loan application updated: {}", id);
        return mapper.toDto(entity);
    }

    @Override
    public PersonalLoanApplicationDto getApplication(String id) {
        return mapper.toDto(findOrThrow(id));
    }

    @Override
    public List<PersonalLoanApplicationDto> getMyApplications() {
        return repository.findByCustomer_CustIdOrderByCreatedAtDesc(currentCustomerId())
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    private PersonalLoanApplication findOrThrow(String id) {
        if (!StringUtils.hasText(id)) {
            throw new IllegalArgumentException("Personal loan application ID is required");
        }
        return repository.findByIdAndCustomer_CustId(id.trim(), currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Personal loan application not found: " + id));
    }

    private String currentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof JwtPrincipal principal)
                || !StringUtils.hasText(principal.custId())
                || !authentication.getAuthorities().stream()
                        .anyMatch(authority -> "ROLE_CUSTOMER".equals(authority.getAuthority()))) {
            throw new AccessDeniedException("An authenticated customer is required");
        }
        return principal.custId();
    }

    private void validateApplication(PersonalLoanApplicationDto dto) {
        if (dto == null || dto.getLoanAmount() == null) {
            throw new IllegalArgumentException("Requested loan amount is required");
        }
        if (dto.getLoanAmount().compareTo(MIN_LOAN_AMOUNT) < 0
                || dto.getLoanAmount().compareTo(MAX_LOAN_AMOUNT) > 0) {
            throw new IllegalArgumentException("Requested loan amount must be between 10000 and 10000000");
        }
        if (dto.getEmploymentType() == null) {
            throw new IllegalArgumentException("Employment type is required");
        }

        if ("salaried".equals(dto.getEmploymentType())) {
            requireText(dto.getEmployerName(), "Employer name");
            requireAllowed(dto.getJobType(), JOB_TYPES, "Job type");
            requireMinimumIncome(dto.getMonthlyNetSalary(), "Monthly net salary");
            requireAllowed(dto.getWorkExperience(), WORK_EXPERIENCE, "Work experience");
            requireAllowed(dto.getSalaryCreditMethod(), SALARY_CREDIT_METHODS, "Salary credit method");
        } else if ("self-employed".equals(dto.getEmploymentType())) {
            requireText(dto.getBusinessOrProfessionName(), "Business or profession name");
            requireAllowed(dto.getNatureOfBusiness(), NATURE_OF_BUSINESS, "Nature of business");
            requireMinimumIncome(dto.getAverageMonthlyIncome(), "Average monthly income");
            requireAllowed(dto.getYearsInBusiness(), YEARS_IN_BUSINESS, "Years in business");
        } else {
            throw new IllegalArgumentException("Employment type must be salaried or self-employed");
        }
    }

    private void requireText(String value, String field) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(field + " is required");
        }
    }

    private void requireAllowed(String value, Set<String> allowedValues, String field) {
        if (!allowedValues.contains(value)) {
            throw new IllegalArgumentException("Select a valid " + field.toLowerCase());
        }
    }

    private void requireMinimumIncome(BigDecimal value, String field) {
        if (value == null || value.compareTo(MIN_MONTHLY_INCOME) < 0) {
            throw new IllegalArgumentException(field + " must be at least 10000");
        }
    }
}
