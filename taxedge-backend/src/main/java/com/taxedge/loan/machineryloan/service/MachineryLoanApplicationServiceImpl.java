package com.taxedge.loan.machineryloan.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.loan.machineryloan.dto.MachineryLoanApplicationDto;
import com.taxedge.loan.machineryloan.entity.MachineryLoanApplication;
import com.taxedge.loan.machineryloan.mapper.MachineryLoanApplicationMapper;
import com.taxedge.loan.machineryloan.repository.MachineryLoanApplicationRepository;
import com.taxedge.loan.machineryloan.service.MachineryLoanApplicationService;

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

    @Override
    @Transactional
    public String saveApplication(MachineryLoanApplicationDto dto) {

        String custId = currentCustomerId();

        Customer customer = customerRepository.findById(custId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found: " + custId));

        MachineryLoanApplication entity = mapper.toEntity(dto);
        entity.setCustomer(customer);

        String machineryLoanId = repository.save(entity).getId();
        log.info("Machinery loan application created [{}] for customer [{}]",
                machineryLoanId, custId);

        return machineryLoanId;
    }

    @Override
    @Transactional
    public String updateApplication(String machineryLoanId,
                                    MachineryLoanApplicationDto dto) {

        MachineryLoanApplication entity = findOrThrow(machineryLoanId);

        mapper.updateFromDto(dto, entity);

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

    private MachineryLoanApplication findOrThrow(String machineryLoanId) {
        return repository.findByIdAndCustomer_CustId(machineryLoanId, currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Machinery loan application not found: " + machineryLoanId));
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
