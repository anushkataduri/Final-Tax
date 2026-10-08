package com.taxedge.itr.tdsrefund.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.itr.tdsrefund.entity.TdsTaxesPaid;

public interface TdsTaxesPaidRepository extends JpaRepository<TdsTaxesPaid, Long> {

    Optional<TdsTaxesPaid> findByIdAndRefundBankAccount_CustId(Long id, String custId);
    Optional<TdsTaxesPaid> findByRefundBankAccount_Id(String tdsRefundId);
}
