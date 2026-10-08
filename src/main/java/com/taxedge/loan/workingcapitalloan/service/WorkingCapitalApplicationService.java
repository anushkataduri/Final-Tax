package com.taxedge.loan.workingcapitalloan.service;

import java.util.List;

import com.taxedge.loan.workingcapitalloan.dto.WorkingCapitalApplicationDto;

public interface WorkingCapitalApplicationService {

    String saveApplication(WorkingCapitalApplicationDto dto);

    String updateApplication(String workingCapitalId, WorkingCapitalApplicationDto dto);

    WorkingCapitalApplicationDto getApplication(String workingCapitalId);

    List<WorkingCapitalApplicationDto> getApplications();
}
