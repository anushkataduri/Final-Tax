package com.taxedge.companyregistration.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taxedge.companyregistration.entity.ShareholdingPattern;

@Repository
public interface ShareholdingPatternRepository extends JpaRepository<ShareholdingPattern, String> {

	List<ShareholdingPattern> findByPromoterDirectorDetails_PromoterDirectorId(String promoterDirectorId);

	@Modifying
	@Query("DELETE FROM ShareholdingPattern sp "
			+ "WHERE sp.promoterDirectorDetails.promoterDirectorId = :promoterDirectorId")
	void deleteByPromoterDirectorId(@Param("promoterDirectorId") String promoterDirectorId);
}
