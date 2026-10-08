package com.taxedge.gst.compliance.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.compliance.entity.GstCompliance;

public interface GstComplianceRepository extends JpaRepository<GstCompliance, String> {

	List<GstCompliance> findByGstin(String gstin);

	Optional<GstCompliance> findByComplinaceIdAndGstin(String complinaceId, String gstin);
}