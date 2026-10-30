package com.taxedge.itr.tdsrefund.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taxedge.gst.registration.enums.RegisterationStatus;
import com.taxedge.itr.tdsrefund.entity.TdsRefund;

@Repository
public interface TdsRefundRepository extends JpaRepository<TdsRefund, String> {

    Optional<TdsRefund> findByIdAndCustId(String id, String custId);

    List<TdsRefund> findByCustId(String custId);

    boolean existsByIdAndCustId(String id, String custId);

    @Query("SELECT t FROM TdsRefund t WHERE t.status = :status AND ((t.updatedAt IS NOT NULL AND t.updatedAt < :cutoff) OR (t.updatedAt IS NULL AND (t.createdAt < :cutoff OR t.createdAt IS NULL)))")
    List<TdsRefund> findByStatusAndUpdatedAtBefore(@Param("status") RegisterationStatus status, @Param("cutoff") LocalDateTime cutoff);
}
