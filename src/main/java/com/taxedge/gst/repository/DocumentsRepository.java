package com.taxedge.gst.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.entity.Documents;


public interface DocumentsRepository extends JpaRepository<Documents, Long> {

}