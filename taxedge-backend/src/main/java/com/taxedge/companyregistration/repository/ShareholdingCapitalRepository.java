package com.taxedge.companyregistration.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.companyregistration.entity.ShareholdingCapital;

public interface ShareholdingCapitalRepository extends JpaRepository<ShareholdingCapital, String> {

	Optional<ShareholdingCapital> findByCompanyDetails_CompanyRegistrationId(String companyRegistrationId);
}