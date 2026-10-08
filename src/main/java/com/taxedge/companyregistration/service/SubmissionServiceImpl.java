package com.taxedge.companyregistration.service;

import com.taxedge.companyregistration.dto.response.SubmissionResponse;
import com.taxedge.companyregistration.service.CompanyRegistrationService;
import com.taxedge.companyregistration.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {
    private final CompanyRegistrationService registrations;

    @Override public SubmissionResponse submit(Long id) { return registrations.submit(id); }
}