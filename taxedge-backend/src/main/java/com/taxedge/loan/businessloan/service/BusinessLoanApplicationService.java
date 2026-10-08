package com.taxedge.loan.businessloan.service;

import com.taxedge.loan.businessloan.dto.BusinessLoanApplicationDto;

public interface BusinessLoanApplicationService {

    String saveApplication(BusinessLoanApplicationDto dto);

    String updateApplication(String id, BusinessLoanApplicationDto dto);

    BusinessLoanApplicationDto getApplication(String id);
}
