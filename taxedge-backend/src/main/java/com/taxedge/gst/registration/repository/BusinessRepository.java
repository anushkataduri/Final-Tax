package com.taxedge.gst.registration.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.registration.entity.Business;

public interface BusinessRepository extends JpaRepository<Business, String> {

	List<Business> findByCustomer_CustId(String custId);
}