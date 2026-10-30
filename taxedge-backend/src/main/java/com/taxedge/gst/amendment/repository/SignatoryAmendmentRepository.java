package com.taxedge.gst.amendment.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taxedge.gst.amendment.entity.SignatoryAmendmentEntity;
import com.taxedge.gst.registration.enums.RegisterationStatus;

@Repository
public interface SignatoryAmendmentRepository extends JpaRepository<SignatoryAmendmentEntity, Long> {

    Optional<SignatoryAmendmentEntity> findByGstNumber(String gstNumber);
    List<SignatoryAmendmentEntity> findByCustomerCustId(String custId);


    @Query("SELECT s FROM SignatoryAmendmentEntity s WHERE s.status = :status AND ((s.updatedAt IS NOT NULL AND s.updatedAt < :cutoff) OR (s.updatedAt IS NULL AND (s.createdAt < :cutoff OR s.createdAt IS NULL)))")
    List<SignatoryAmendmentEntity> findByStatusAndUpdatedAtBefore(@Param("status") RegisterationStatus status, @Param("cutoff") LocalDateTime cutoff);
}
