package com.taxedge.gst.amendment.repository;

import com.taxedge.gst.amendment.entity.BankAccountAmendmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountAmendmentRepository extends JpaRepository<BankAccountAmendmentEntity, Long> {

    Optional<BankAccountAmendmentEntity> findByGstNumber(String gstNumber);
    List<BankAccountAmendmentEntity> findByCustomerCustId(String custId);
}
