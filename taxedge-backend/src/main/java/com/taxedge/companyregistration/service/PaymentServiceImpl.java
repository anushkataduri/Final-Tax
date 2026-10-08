package com.taxedge.companyregistration.service;

import com.taxedge.companyregistration.dto.request.PaymentRequest;
import com.taxedge.companyregistration.service.CompanyRegistrationService;
import com.taxedge.companyregistration.service.PaymentService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final CompanyRegistrationService registrations;

    @Override
     public Map<String, Object> payment(Long id){
         return registrations.payment(id); 
        }
    @Override
     public Map<String, Object> savePayment(Long id, PaymentRequest request) {
         return registrations.savePayment(id, request);
         }
}