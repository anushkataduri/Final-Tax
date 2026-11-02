
package com.taxedge.loan.homeloan.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.homeloan.entity.HomeLoanRequirementApplication;

public interface HomeLoanRequirementApplicationRepository
        extends JpaRepository<HomeLoanRequirementApplication, String> {

}
