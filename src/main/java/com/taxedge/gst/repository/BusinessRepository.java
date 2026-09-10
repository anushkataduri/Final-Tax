package com.taxedge.gst.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.entity.Business;

public interface BusinessRepository extends JpaRepository<Business, String> {

}