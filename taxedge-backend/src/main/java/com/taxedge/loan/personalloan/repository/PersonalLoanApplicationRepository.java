package com.taxedge.loan.personalloan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.personalloan.entity.PersonalLoanApplication;

public interface PersonalLoanApplicationRepository
        extends JpaRepository<PersonalLoanApplication, String> {

    List<PersonalLoanApplication> findByCustomer_CustIdOrderByCreatedAtDesc(String customerId);

    Optional<PersonalLoanApplication> findByIdAndCustomer_CustId(String id, String customerId);
}
