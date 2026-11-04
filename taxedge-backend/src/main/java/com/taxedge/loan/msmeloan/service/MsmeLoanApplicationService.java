package com.taxedge.loan.msmeloan.service;

import java.util.List;

import com.taxedge.loan.msmeloan.dto.MsmeLoanApplicationDto;

public interface MsmeLoanApplicationService {

    MsmeLoanApplicationDto saveApplication(MsmeLoanApplicationDto dto);

    MsmeLoanApplicationDto updateApplication(String id, MsmeLoanApplicationDto dto);

    MsmeLoanApplicationDto getApplication(String id);

    List<MsmeLoanApplicationDto> getMyApplications();

    void deleteApplication(String id);
}
