package com.taxedge.gst.amendment.repository;

import com.taxedge.gst.amendment.entity.LegalNameAmendmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LegalNameAmendmentRepository extends JpaRepository<LegalNameAmendmentEntity, Long> {
    Optional<LegalNameAmendmentEntity> findByGstNumber(String gstNumber);
    List<LegalNameAmendmentEntity> findByCustomerCustId(String custId);
}
