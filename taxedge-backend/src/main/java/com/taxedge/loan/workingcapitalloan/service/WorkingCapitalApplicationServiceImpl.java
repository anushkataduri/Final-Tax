package com.taxedge.loan.workingcapitalloan.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.loan.workingcapitalloan.dto.WorkingCapitalApplicationDto;
import com.taxedge.loan.workingcapitalloan.entity.WorkingCapitalApplication;
import com.taxedge.loan.workingcapitalloan.mapper.WorkingCapitalApplicationMapper;
import com.taxedge.loan.workingcapitalloan.repository.WorkingCapitalApplicationRepository;
import com.taxedge.loan.workingcapitalloan.service.WorkingCapitalApplicationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkingCapitalApplicationServiceImpl implements WorkingCapitalApplicationService {

    private final WorkingCapitalApplicationRepository repository;
    private final CustomerRepository customerRepository;
    private final WorkingCapitalApplicationMapper mapper;

    @Override
    @Transactional
    public String saveApplication(WorkingCapitalApplicationDto dto) {

        String custId = currentCustomerId();

        Customer customer = customerRepository.findById(custId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found: " + custId));

        WorkingCapitalApplication entity = mapper.toEntity(dto);
        entity.setCustomer(customer);

        String workingCapitalId = repository.save(entity).getId();
        log.info("Working capital application created [{}] for customer [{}]",
                workingCapitalId, custId);

        return workingCapitalId;
    }

    @Override
    @Transactional
    public String updateApplication(String workingCapitalId,
                                    WorkingCapitalApplicationDto dto) {

        WorkingCapitalApplication entity = findOrThrow(workingCapitalId);

        mapper.updateFromDto(dto, entity);

        log.info("Working capital application updated [{}]", workingCapitalId);
        return workingCapitalId;
    }

    @Override
    public WorkingCapitalApplicationDto getApplication(String workingCapitalId) {
        return mapper.toDto(findOrThrow(workingCapitalId));
    }

    @Override
    public List<WorkingCapitalApplicationDto> getApplications() {
        return repository.findByCustomer_CustIdOrderByCreatedAtDesc(currentCustomerId())
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    private WorkingCapitalApplication findOrThrow(String workingCapitalId) {
        return repository.findByIdAndCustomer_CustId(workingCapitalId, currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Working capital application not found: " + workingCapitalId));
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
