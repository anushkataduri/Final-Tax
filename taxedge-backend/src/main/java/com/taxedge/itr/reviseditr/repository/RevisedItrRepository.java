package com.taxedge.itr.reviseditr.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taxedge.gst.registration.enums.RegisterationStatus;
import com.taxedge.itr.reviseditr.entity.RevisedItr;

@Repository
public interface RevisedItrRepository extends JpaRepository<RevisedItr, String> {

	@Query("SELECT r FROM RevisedItr r WHERE r.status = :status AND ((r.updatedAt IS NOT NULL AND r.updatedAt < :cutoff) OR (r.updatedAt IS NULL AND (r.createdAt < :cutoff OR r.createdAt IS NULL)))")
	List<RevisedItr> findByStatusAndUpdatedAtBefore(@Param("status") RegisterationStatus status, @Param("cutoff") LocalDateTime cutoff);
}
