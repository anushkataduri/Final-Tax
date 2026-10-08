package com.taxedge.loan.personalloan.service;

import com.taxedge.loan.personalloan.dto.PersonalLoanApplicationDto;

public interface PersonalLoanApplicationService {

    String saveApplication(PersonalLoanApplicationDto dto);

    String updateApplication(String id, PersonalLoanApplicationDto dto);

    PersonalLoanApplicationDto getApplication(String id);
}
