package com.taxedge.gst.amendment.repository;

import com.taxedge.gst.amendment.entity.ContactAmendmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactAmendmentRepository extends JpaRepository<ContactAmendmentEntity, Long> {

    Optional<ContactAmendmentEntity> findByGstNumber(String gstNumber);
    List<ContactAmendmentEntity> findByCustomerCustId(String custId);
}
