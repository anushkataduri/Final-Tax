package com.taxedge.loan.machineryloan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.machineryloan.entity.MachineryLoanDocument;

public interface MachineryLoanDocumentRepository
        extends JpaRepository<MachineryLoanDocument, Long> {

    Optional<MachineryLoanDocument> findByMachineryLoanApplication_Id(String machineryLoanId);

    boolean existsByMachineryLoanApplication_Id(String machineryLoanId);
}
