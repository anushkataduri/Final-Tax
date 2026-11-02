
package com.taxedge.loan.homeloan.service;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.loan.homeloan.dto.HomeLoanRequirementApplicationDto;
import com.taxedge.loan.homeloan.entity.HomeLoanRequirementApplication;
import com.taxedge.loan.homeloan.repository.HomeLoanRequirementApplicationRepository;
import com.taxedge.loan.homeloan.service.HomeLoanRequirementApplicationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HomeLoanRequirementApplicationServiceImpl
        implements HomeLoanRequirementApplicationService {

    private final HomeLoanRequirementApplicationRepository
            homeLoanRequirementApplicationRepository;

    private final CustomerRepository customerRepository;


    @Override
    public HomeLoanRequirementApplicationDto createApplication(
            HomeLoanRequirementApplicationDto dto) {

        // Step 1: Find the existing customer
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Customer not found: " + dto.getCustomerId()
                ));

        // Step 2: Generate the home loan ID in the service
        String homeLoanId = "HL" + UUID.randomUUID()
                .toString()
                .replace("-", "");

        // Step 3: Convert request DTO into an entity
        HomeLoanRequirementApplication application =
                HomeLoanRequirementApplication.builder()
                        .homeLoanId(homeLoanId)
                        .customer(customer)
                        .requestedLoanAmount(dto.getRequestedLoanAmount())
                        .loanPurpose(dto.getLoanPurpose())
                        .propertyStatus(dto.getPropertyStatus())
                        .approximatePropertyValue(
                                dto.getApproximatePropertyValue())
                        .applicationStatus("DRAFT")
                        .build();

        // Step 4: Save the entity
        HomeLoanRequirementApplication savedApplication =
                homeLoanRequirementApplicationRepository.save(application);

        // Step 5: Return the saved application as a DTO
        return convertToDto(savedApplication);
    }


    @Override
    @Transactional(readOnly = true)
    public HomeLoanRequirementApplicationDto getApplication(
            String homeLoanId) {

        HomeLoanRequirementApplication application =
                homeLoanRequirementApplicationRepository.findById(homeLoanId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Home loan application not found: " + homeLoanId
                        ));

        return convertToDto(application);
    }


    @Override
    @Transactional(readOnly = true)
    public List<HomeLoanRequirementApplicationDto> getAllApplications() {

        return homeLoanRequirementApplicationRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    @Override
    public HomeLoanRequirementApplicationDto updateApplication(
            String homeLoanId,
            HomeLoanRequirementApplicationDto dto) {

        HomeLoanRequirementApplication application =
                homeLoanRequirementApplicationRepository.findById(homeLoanId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Home loan application not found: " + homeLoanId
                        ));

        if (!application.getCustomer().getCustId()
                .equals(dto.getCustomerId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Customer ID cannot be changed for an existing application"
            );
        }

        if (!"DRAFT".equals(application.getApplicationStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only draft applications can be updated"
            );
        }

        application.setRequestedLoanAmount(dto.getRequestedLoanAmount());
        application.setLoanPurpose(dto.getLoanPurpose());
        application.setPropertyStatus(dto.getPropertyStatus());
        application.setApproximatePropertyValue(
                dto.getApproximatePropertyValue());

        HomeLoanRequirementApplication updatedApplication =
                homeLoanRequirementApplicationRepository.save(application);

        return convertToDto(updatedApplication);
    }

    @Override
    public void deleteApplication(String homeLoanId) {

        HomeLoanRequirementApplication application =
                homeLoanRequirementApplicationRepository.findById(homeLoanId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Home loan application not found: " + homeLoanId
                        ));

        if (!"DRAFT".equals(application.getApplicationStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only draft applications can be deleted"
            );
        }

        homeLoanRequirementApplicationRepository.delete(application);
    }


    private HomeLoanRequirementApplicationDto convertToDto(
            HomeLoanRequirementApplication application) {

        HomeLoanRequirementApplicationDto dto =
                new HomeLoanRequirementApplicationDto();

        dto.setHomeLoanId(application.getHomeLoanId());
        dto.setApplicationStatus(application.getApplicationStatus());
        dto.setCustomerId(application.getCustomer().getCustId());

        dto.setRequestedLoanAmount(application.getRequestedLoanAmount());
        dto.setLoanPurpose(application.getLoanPurpose());
        dto.setPropertyStatus(application.getPropertyStatus());
        dto.setApproximatePropertyValue(
                application.getApproximatePropertyValue());

        return dto;
    }
}
