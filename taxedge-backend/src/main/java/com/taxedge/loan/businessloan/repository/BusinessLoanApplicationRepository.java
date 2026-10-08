package com.taxedge.loan.businessloan.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.businessloan.entity.BusinessLoanApplication;

public interface BusinessLoanApplicationRepository
        extends JpaRepository<BusinessLoanApplication, String> {
}
