package com.taxedge.gst.amendment.repository;

import com.taxedge.gst.amendment.entity.PrincipalPlaceAmendmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrincipalPlaceAmendmentRepository extends JpaRepository<PrincipalPlaceAmendmentEntity, Long> {

    Optional<PrincipalPlaceAmendmentEntity> findByGstNumber(String gstNumber);
    List<PrincipalPlaceAmendmentEntity> findByCustomerCustId(String custId);
}
