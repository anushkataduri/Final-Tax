package com.taxedge.loan.personalloan.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.personalloan.entity.PersonalLoanApplication;

public interface PersonalLoanApplicationRepository
        extends JpaRepository<PersonalLoanApplication, String> {
}
