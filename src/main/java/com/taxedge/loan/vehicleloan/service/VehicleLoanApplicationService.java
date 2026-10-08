package com.taxedge.loan.vehicleloan.service;

import java.util.List;

import com.taxedge.loan.vehicleloan.dto.VehicleLoanApplicationDto;

public interface VehicleLoanApplicationService {

    String saveApplication(VehicleLoanApplicationDto dto);

    String updateApplication(String id, VehicleLoanApplicationDto dto);

    VehicleLoanApplicationDto getApplication(String id);

    List<VehicleLoanApplicationDto> getMyApplications();

    String submitApplication(String id);
}
