package com.taxedge.itr.tdsrefund.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.tdsrefund.dto.TdsRefundDto;
import com.taxedge.itr.tdsrefund.entity.TdsRefund;
import com.taxedge.itr.tdsrefund.mapper.TdsRefundMapper;
import com.taxedge.itr.tdsrefund.repository.TdsRefundRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdsRefundServiceImpl implements TdsRefundService {

    private final TdsRefundRepository repository;
    private final TdsRefundMapper mapper;

    
    
   
    @Override
    @Transactional
    public String saveTds(TdsRefundDto dto) {

        String custId = currentCustomerId();

        TdsRefund entity = mapper.toEntity(dto);
        entity.setId("TDS" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
        entity.setCustId(custId);
        entity.setCreatedAt(LocalDateTime.now());
        normalise(entity);

        String id = repository.save(entity).getId();
        log.info("TDS refund bank account created [{}] for customer [{}]", id, custId);
        return id;
    }

    @Override
    @Transactional
    public String updateTds(String id, TdsRefundDto dto) {

    	TdsRefund entity = findOrThrow(id);

        mapper.updateEntity(dto, entity);
        normalise(entity);

        log.info("TDS refund bank account updated [{}]", id);
        return entity.getId();
    }

    @Override
    public TdsRefundDto getTds(String id) {
        return mapper.toDto(findOrThrow(id));
    }

    @Override
    public TdsRefundDto getTdsByCustId(String custId) {

        requireSelf(custId);

        return repository.findByCustId(custId)
                .stream()
                .findFirst()
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No TDS refund bank account found for customer: " + custId));
    }

   

    private String currentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated customer in context");
        }
        return authentication.getName();
    }

    private void requireSelf(String custId) {
        if (!currentCustomerId().equals(custId)) {
            log.warn("Customer [{}] attempted to read TDS refund data of [{}]", currentCustomerId(), custId);
            throw new ResourceNotFoundException("No TDS refund bank account found for customer: " + custId);
        }
    }

    private TdsRefund findOrThrow(String id) {
        return repository.findByIdAndCustId(id, currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("TDS refund bank account not found: " + id));
    }

    private void normalise(TdsRefund entity) {
        if (entity.getBusinessPan() != null) {
            entity.setBusinessPan(entity.getBusinessPan().trim().toUpperCase());
        }
        if (entity.getIfscCode() != null) {
            entity.setIfscCode(entity.getIfscCode().trim().toUpperCase());
        }
        if (entity.getAadhaarNumber() != null) {
            entity.setAadhaarNumber(entity.getAadhaarNumber().replaceAll("\\s+", ""));
        }
        if (entity.getMobileNumber() != null) {
            entity.setMobileNumber(entity.getMobileNumber().replaceAll("[^0-9]", ""));
        }
    }
}