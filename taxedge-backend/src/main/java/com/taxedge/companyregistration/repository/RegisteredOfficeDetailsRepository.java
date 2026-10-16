package com.taxedge.companyregistration.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.companyregistration.entity.RegisteredOfficeDetails;

@Repository
public interface RegisteredOfficeDetailsRepository extends JpaRepository<RegisteredOfficeDetails, String> {
}