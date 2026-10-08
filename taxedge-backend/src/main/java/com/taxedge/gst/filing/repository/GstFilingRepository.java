package com.taxedge.gst.filing.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.filing.entity.GstFiling;
import com.taxedge.gst.filing.enums.ReturnType;

public interface GstFilingRepository extends JpaRepository<GstFiling, String> {

	List<GstFiling> findByGstin(String gstin);

	List<GstFiling> findByCustomer_CustId(String customerId);

	Optional<GstFiling> findByGstfilingIdAndGstin(String gstfilingId, String gstin);

	boolean existsByGstinAndFinancialYearAndFilingPeriodAndReturnType(String gstin, String financialYear,
			String filingPeriod, ReturnType returnType);
}