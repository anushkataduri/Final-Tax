package com.taxedge.loan.homeloan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.homeloan.entity.HomeLoanDocument;

public interface HomeLoanDocumentRepository extends JpaRepository<HomeLoanDocument, Long> {

    Optional<HomeLoanDocument> findByHomeLoanApplication_Id(String homeLoanId);

    boolean existsByHomeLoanApplication_Id(String homeLoanId);
}
