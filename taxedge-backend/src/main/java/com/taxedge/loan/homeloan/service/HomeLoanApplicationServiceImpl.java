package com.taxedge.loan.homeloan.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.loan.homeloan.dto.HomeLoanApplicationDto;
import com.taxedge.loan.homeloan.entity.HomeLoanApplication;
import com.taxedge.loan.homeloan.mapper.HomeLoanApplicationMapper;
import com.taxedge.loan.homeloan.repository.HomeLoanApplicationRepository;
import com.taxedge.loan.homeloan.service.HomeLoanApplicationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeLoanApplicationServiceImpl implements HomeLoanApplicationService {

    private final HomeLoanApplicationRepository repository;
    private final CustomerRepository customerRepository;
    private final HomeLoanApplicationMapper mapper;

    @Override
    @Transactional
    public String saveApplication(String custId, HomeLoanApplicationDto dto) {

        Customer customer = customerRepository.findById(custId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer not found: " + custId));

        HomeLoanApplication entity = mapper.toEntity(dto);
        entity.setCustomer(customer);

        String homeLoanId = repository.save(entity).getId();
        log.info("Home loan application created [{}] for customer [{}]", homeLoanId, custId);

        return homeLoanId;
    }

    @Override
    @Transactional
    public String updateApplication(String homeLoanId, HomeLoanApplicationDto dto) {

        HomeLoanApplication entity = findOrThrow(homeLoanId);

        mapper.updateFromDto(dto, entity);

        log.info("Home loan application updated [{}]", homeLoanId);
        return homeLoanId;
    }

    @Override
    public HomeLoanApplicationDto getApplication(String homeLoanId) {
        return mapper.toDto(findOrThrow(homeLoanId));
    }

    @Override
    public List<HomeLoanApplicationDto> getApplicationsByCustomer(String custId) {
        return repository.findByCustomer_CustIdOrderByCreatedAtDesc(custId)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    private HomeLoanApplication findOrThrow(String homeLoanId) {
        return repository.findById(homeLoanId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Home loan application not found: " + homeLoanId));
    }
}
