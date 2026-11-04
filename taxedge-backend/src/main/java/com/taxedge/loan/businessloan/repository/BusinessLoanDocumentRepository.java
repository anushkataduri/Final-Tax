package com.taxedge.loan.businessloan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.loan.businessloan.entity.BusinessLoanDocument;

@Repository
public interface BusinessLoanDocumentRepository extends JpaRepository<BusinessLoanDocument, String> {

    Optional<BusinessLoanDocument> findByLoanApplication_Id(String loanApplicationId);

    boolean existsByLoanApplication_Id(String loanApplicationId);

    void deleteByLoanApplication_Id(String loanApplicationId);
}
