package com.taxedge.loan.workingcapitalloan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.workingcapitalloan.entity.WorkingCapitalApplication;

public interface WorkingCapitalApplicationRepository
        extends JpaRepository<WorkingCapitalApplication, String> {

    Optional<WorkingCapitalApplication> findByIdAndCustomer_CustId(String id, String custId);

    List<WorkingCapitalApplication> findByCustomer_CustIdOrderByCreatedAtDesc(String custId);
}
