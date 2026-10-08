package com.taxedge.loan.workingcapitalloan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.loan.workingcapitalloan.entity.WorkingCapitalDocument;

public interface WorkingCapitalDocumentRepository
        extends JpaRepository<WorkingCapitalDocument, Long> {

    Optional<WorkingCapitalDocument> findByWorkingCapitalApplication_Id(
            String workingCapitalId);

    Optional<WorkingCapitalDocument>
            findByWorkingCapitalApplication_IdAndWorkingCapitalApplication_Customer_CustId(
                    String workingCapitalId, String custId);

    boolean existsByWorkingCapitalApplication_Id(String workingCapitalId);
}
