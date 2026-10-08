package com.taxedge.loan.personalloan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.personalloan.entity.PersonalLoanDocument;

public interface PersonalLoanDocumentRepository extends JpaRepository<PersonalLoanDocument, Long> {

    Optional<PersonalLoanDocument> findByLoanApplication_Id(String loanApplicationId);

    boolean existsByLoanApplication_Id(String loanApplicationId);

   
}
