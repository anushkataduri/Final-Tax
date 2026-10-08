package com.taxedge.companyregistration.service;

import com.taxedge.companyregistration.dto.response.ReceiptResponse;
import com.taxedge.companyregistration.service.CompanyRegistrationService;
import com.taxedge.companyregistration.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {
    private final CompanyRegistrationService registrations;

    @Override public ReceiptResponse receipt(Long id) { return registrations.receipt(id); }
}