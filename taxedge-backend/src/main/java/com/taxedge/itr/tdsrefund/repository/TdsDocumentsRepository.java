package com.taxedge.itr.tdsrefund.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.itr.tdsrefund.entity.TdsDocuments;

public interface TdsDocumentsRepository extends JpaRepository<TdsDocuments, Long> {
	
	Optional<TdsDocuments> findByRefundBankAccount_Id(String tdsRefundId);
}
