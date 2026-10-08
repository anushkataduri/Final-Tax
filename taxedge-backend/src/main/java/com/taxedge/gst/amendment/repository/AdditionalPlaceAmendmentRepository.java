package com.taxedge.gst.amendment.repository;

import com.taxedge.gst.amendment.entity.AdditionalPlaceAmendmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdditionalPlaceAmendmentRepository extends JpaRepository<AdditionalPlaceAmendmentEntity, Long> {

    List<AdditionalPlaceAmendmentEntity> findByGstNumber(String gstNumber);
    List<AdditionalPlaceAmendmentEntity> findByCustomerCustId(String custId);
}
