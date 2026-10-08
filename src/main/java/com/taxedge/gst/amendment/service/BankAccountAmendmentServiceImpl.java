package com.taxedge.gst.amendment.service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.amendment.dto.BankAccountAmendmentViewDto;
import com.taxedge.gst.amendment.entity.BankAccountAmendmentEntity;
import com.taxedge.gst.registration.entity.Business;
import com.taxedge.gst.registration.enums.AccountType;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.amendment.mapper.BankAccountAmendmentMapper;
import com.taxedge.gst.amendment.repository.BankAccountAmendmentRepository;
import com.taxedge.gst.registration.repository.BusinessRepository;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BankAccountAmendmentServiceImpl implements BankAccountAmendmentService {

    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;
    private final BankAccountAmendmentRepository bankAmendmentRepository;
    private final BankAccountAmendmentMapper amendmentMapper;

    private Customer resolveAndVerifyCustomer(String customerId, String gstId) {
        String resolvedCustId = null;

        if (customerId != null && !customerId.trim().isEmpty()) {
            resolvedCustId = customerId.trim();
        }

        if (resolvedCustId == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof JwtPrincipal principal) {
                resolvedCustId = principal.custId();
            } else if (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser")) {
                resolvedCustId = auth.getName();
            }
        }

        if (resolvedCustId == null && gstId != null && !gstId.trim().isEmpty()) {
            if (customerRepository.existsById(gstId.trim())) {
                resolvedCustId = gstId.trim();
            }
        }

        if (resolvedCustId == null || resolvedCustId.trim().isEmpty()) {
            throw new ResourceNotFoundException("Customer ID is required to submit amendment");
        }

        final String finalCustId = resolvedCustId;
        return customerRepository.findById(finalCustId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + finalCustId));
    }

    @Override
    public BankAccountAmendmentViewDto getExistingBankAccountDetails(String gstId) {
        Optional<Business> businessOpt = businessRepository.findById(gstId);
        if (businessOpt.isPresent()) {
            Business business = businessOpt.get();
            return BankAccountAmendmentViewDto.builder()
                    .newBankName(business.getBankName())
                    .newBankAccountNumber(business.getBankAccountNumber())
                    .newIfscCode(business.getIfscCode())
                    .newAccountType(business.getAccountType())
                    .businessGstId(business.getGstId())
                    .gstNumber(business.getGstId())
                    .build();
        }

        return BankAccountAmendmentViewDto.builder()
                .businessGstId(gstId)
                .gstNumber(gstId)
                .build();
    }

    @Override
    @Transactional
    public BankAccountAmendmentViewDto submitBankAccountAmendment(String gstId, String customerId, String bankName, String accountNumber,
                                                                 String ifscCode, AccountType accountType, MultipartFile file) throws IOException {

        Customer customer = resolveAndVerifyCustomer(customerId, gstId);
        String gstNumber = gstId != null ? gstId.trim() : "";

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting proof document is required for bank account amendment");
        }

        byte[] fileBytes = file.getBytes();

        BankAccountAmendmentViewDto inputDto = new BankAccountAmendmentViewDto();
        inputDto.setNewBankName(bankName);
        inputDto.setNewBankAccountNumber(accountNumber);
        inputDto.setNewIfscCode(ifscCode);
        inputDto.setNewAccountType(accountType);
        inputDto.setGstNumber(gstNumber);
        inputDto.setImageData(fileBytes);

        BankAccountAmendmentEntity amendment = amendmentMapper.toEntity(inputDto);
        amendment.setCustomer(customer);

        amendment = bankAmendmentRepository.save(amendment);

        return amendmentMapper.toDto(amendment);
    }

    @Override
    public BankAccountAmendmentViewDto getAmendmentById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        BankAccountAmendmentEntity entity = bankAmendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No bank account amendment found with id: " + id));

        return amendmentMapper.toDto(entity);
    }

    @Override
    @Transactional
    public BankAccountAmendmentViewDto updateBankAccountAmendment(Long id, String bankName, String accountNumber,
                                                                 String ifscCode, AccountType accountType, MultipartFile file) throws IOException {
        if (id == null) {
            throw new IllegalArgumentException("Amendment ID must not be null");
        }
        BankAccountAmendmentEntity entity = bankAmendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No bank account amendment found with id: " + id));

        if (bankName != null && !bankName.trim().isEmpty()) entity.setNewBankName(bankName);
        if (accountNumber != null && !accountNumber.trim().isEmpty()) entity.setNewBankAccountNumber(accountNumber);
        if (ifscCode != null && !ifscCode.trim().isEmpty()) entity.setNewIfscCode(ifscCode);
        if (accountType != null) entity.setNewAccountType(accountType);
        if (file != null && !file.isEmpty()) {
            entity.setImageData(file.getBytes());
        }

        entity = bankAmendmentRepository.save(entity);

        return amendmentMapper.toDto(entity);
    }
}
