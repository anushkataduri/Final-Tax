package com.taxedge.loan.machineryloan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.machineryloan.entity.MachineryLoanApplication;

public interface MachineryLoanApplicationRepository
        extends JpaRepository<MachineryLoanApplication, String> {

    Optional<MachineryLoanApplication> findByIdAndCustomer_CustId(String id, String custId);

    List<MachineryLoanApplication> findByCustomer_CustIdOrderByCreatedAtDesc(String custId);
}
