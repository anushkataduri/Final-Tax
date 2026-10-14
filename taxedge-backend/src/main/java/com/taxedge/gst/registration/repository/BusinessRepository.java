package com.taxedge.gst.registration.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.taxedge.gst.registration.entity.Business;
import com.taxedge.gst.registration.enums.RegisterationStatus;

public interface BusinessRepository extends JpaRepository<Business, String> {

	List<Business> findByCustomer_CustId(String custId);
	
	@Query("SELECT b FROM Business b WHERE b.status = :status AND ((b.updatedAt IS NOT NULL AND b.updatedAt < :cutoff) OR (b.updatedAt IS NULL AND (b.createdAt < :cutoff OR b.createdAt IS NULL)))")
	List<Business> findByStatusAndUpdatedAtBefore(@Param("status") RegisterationStatus status, @Param("cutoff") LocalDateTime cutoff);
}