package com.taxedge.itr.taxnotice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.itr.taxnotice.entity.TaxNoticeAssistance;

@Repository
public interface TaxNoticeAssistanceRepository extends JpaRepository<TaxNoticeAssistance, String> {
}