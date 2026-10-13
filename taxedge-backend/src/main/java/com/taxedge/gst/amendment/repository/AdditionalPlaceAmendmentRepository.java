package com.taxedge.gst.amendment.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taxedge.gst.amendment.entity.AdditionalPlaceAmendmentEntity;
import com.taxedge.gst.registration.enums.RegisterationStatus;

@Repository
public interface AdditionalPlaceAmendmentRepository extends JpaRepository<AdditionalPlaceAmendmentEntity, Long> {

    List<AdditionalPlaceAmendmentEntity> findByGstNumber(String gstNumber);
    List<AdditionalPlaceAmendmentEntity> findByCustomerCustId(String custId);
    Optional<AdditionalPlaceAmendmentEntity> findFirstByGstNumberOrderByCreatedAtDesc(String gstNumber);

    @Query("SELECT a FROM AdditionalPlaceAmendmentEntity a WHERE a.status = :status AND ((a.updatedAt IS NOT NULL AND a.updatedAt < :cutoff) OR (a.updatedAt IS NULL AND (a.createdAt < :cutoff OR a.createdAt IS NULL)))")
    List<AdditionalPlaceAmendmentEntity> findByStatusAndUpdatedAtBefore(@Param("status") RegisterationStatus status, @Param("cutoff") LocalDateTime cutoff);
}
