package com.taxedge.loan.businessloan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.taxedge.loan.businessloan.entity.BusinessLoanApplication;

@Repository
public interface BusinessLoanApplicationRepository
        extends JpaRepository<BusinessLoanApplication, String> {

    Optional<BusinessLoanApplication> findByIdAndCustomer_CustId(String id, String custId);

    List<BusinessLoanApplication> findByCustomer_CustIdOrderByCreatedAtDesc(String custId);

    @Query(value = "SELECT nextval('business_loan_seq')", nativeQuery = true)
    Long getNextSequenceValue();
}
