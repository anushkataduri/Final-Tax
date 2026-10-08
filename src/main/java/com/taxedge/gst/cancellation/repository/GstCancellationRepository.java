package com.taxedge.gst.cancellation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.cancellation.entity.GstCancellation;

public interface GstCancellationRepository extends JpaRepository<GstCancellation, String> {

    boolean existsByGstin(String gstin);

    Optional<GstCancellation> findByGstin(String gstin);
}