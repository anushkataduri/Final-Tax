package com.taxedge.loan.vehicleloan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.loan.vehicleloan.entity.VehicleLoanApplication;

@Repository
public interface VehicleLoanApplicationRepository extends JpaRepository<VehicleLoanApplication, String> {

    Optional<VehicleLoanApplication> findByIdAndCustomer_CustId(String id, String custId);

    List<VehicleLoanApplication> findByCustomer_CustIdOrderByCreatedAtDesc(String custId);

    boolean existsByIdAndCustomer_CustId(String id, String custId);
}
