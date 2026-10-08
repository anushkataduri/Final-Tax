package com.taxedge.loan.machineryloan.service;

import java.util.List;

import com.taxedge.loan.machineryloan.dto.MachineryLoanApplicationDto;

public interface MachineryLoanApplicationService {

    String saveApplication(MachineryLoanApplicationDto dto);

    String updateApplication(String machineryLoanId, MachineryLoanApplicationDto dto);

    MachineryLoanApplicationDto getApplication(String machineryLoanId);

    List<MachineryLoanApplicationDto> getApplications();
}
