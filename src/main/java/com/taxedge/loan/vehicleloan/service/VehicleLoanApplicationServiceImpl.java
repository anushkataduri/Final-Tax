package com.taxedge.loan.vehicleloan.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.loan.vehicleloan.dto.VehicleLoanApplicationDto;
import com.taxedge.loan.vehicleloan.entity.VehicleLoanApplication;
import com.taxedge.loan.vehicleloan.enums.ExistingLoanStatus;
import com.taxedge.loan.vehicleloan.enums.VehicleLoanApplicationStatus;
import com.taxedge.loan.vehicleloan.mapper.VehicleLoanApplicationMapper;
import com.taxedge.loan.vehicleloan.repository.VehicleLoanApplicationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VehicleLoanApplicationServiceImpl implements VehicleLoanApplicationService {

    private final VehicleLoanApplicationRepository repository;
    private final CustomerRepository customerRepository;
    private final VehicleLoanApplicationMapper mapper;

    @Override
    @Transactional
    public String saveApplication(VehicleLoanApplicationDto dto) {
        String custId = currentCustomerId();

        Customer customer = customerRepository.findById(custId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + custId));

        VehicleLoanApplication entity = mapper.toEntity(dto);
        entity.setCustomer(customer);
        normalise(entity);

        String id = repository.save(entity).getId();
        log.info("Vehicle loan application created [{}] for customer [{}]", id, custId);
        return id;
    }

    @Override
    @Transactional
    public String updateApplication(String id, VehicleLoanApplicationDto dto) {
        VehicleLoanApplication entity = findOrThrow(id);
        requireEditable(entity);

        mapper.updateEntity(dto, entity);
        normalise(entity);

        log.info("Vehicle loan application updated [{}]", id);
        return entity.getId();
    }

    @Override
    public VehicleLoanApplicationDto getApplication(String id) {
        return mapper.toDto(findOrThrow(id));
    }

    @Override
    public List<VehicleLoanApplicationDto> getMyApplications() {
        return repository.findByCustomer_CustIdOrderByCreatedAtDesc(currentCustomerId())
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public String submitApplication(String id) {
        VehicleLoanApplication entity = findOrThrow(id);
        requireEditable(entity);

        entity.setStatus(VehicleLoanApplicationStatus.SUBMITTED);
        log.info("Vehicle loan application submitted [{}]", id);
        return entity.getId();
    }



    private String currentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated customer in context");
        }
        return authentication.getName();
    }

    private VehicleLoanApplication findOrThrow(String id) {
        return repository.findByIdAndCustomer_CustId(id, currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle loan application not found: " + id));
    }

    private void requireEditable(VehicleLoanApplication entity) {
        if (entity.getStatus() != VehicleLoanApplicationStatus.DRAFT) {
            throw new IllegalStateException(
                    "Application [" + entity.getId() + "] is " + entity.getStatus() + " and can no longer be edited");
        }
    }

    private void normalise(VehicleLoanApplication entity) {

        if (entity.getGstin() != null) {
            entity.setGstin(entity.getGstin().trim().toUpperCase());
        }
        if (entity.getIfscCode() != null) {
            entity.setIfscCode(entity.getIfscCode().trim().toUpperCase());
        }
        if (entity.getRegistrationNumber() != null) {
            entity.setRegistrationNumber(entity.getRegistrationNumber().replaceAll("\\s+", "").toUpperCase());
        }
    }
}
