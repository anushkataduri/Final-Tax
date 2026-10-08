package com.taxedge.loan.homeloan.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.homeloan.entity.HomeLoanApplication;

public interface HomeLoanApplicationRepository
        extends JpaRepository<HomeLoanApplication, String> {

    List<HomeLoanApplication> findByCustomer_CustIdOrderByCreatedAtDesc(String custId);
}
