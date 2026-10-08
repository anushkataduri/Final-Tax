package com.taxedge.loan.homeloan.service;

import java.util.List;

import com.taxedge.loan.homeloan.dto.HomeLoanApplicationDto;

public interface HomeLoanApplicationService {

    String saveApplication(String custId, HomeLoanApplicationDto dto);

    String updateApplication(String homeLoanId, HomeLoanApplicationDto dto);

    HomeLoanApplicationDto getApplication(String homeLoanId);

    List<HomeLoanApplicationDto> getApplicationsByCustomer(String custId);
}
