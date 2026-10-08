package com.taxedge.gst.amendment.repository;

import com.taxedge.gst.amendment.entity.SignatoryAmendmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SignatoryAmendmentRepository extends JpaRepository<SignatoryAmendmentEntity, Long> {

    Optional<SignatoryAmendmentEntity> findByGstNumber(String gstNumber);
    List<SignatoryAmendmentEntity> findByCustomerCustId(String custId);
}
