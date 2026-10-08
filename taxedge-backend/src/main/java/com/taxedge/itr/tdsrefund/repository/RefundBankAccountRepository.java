package com.taxedge.itr.tdsrefund.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;                   
import com.taxedge.itr.tdsrefund.entity.RefundBankAccount;

public interface RefundBankAccountRepository extends JpaRepository<RefundBankAccount, String> {

    Optional<RefundBankAccount> findByIdAndCustId(String id, String custId);
    Optional<RefundBankAccount> findTopByCustIdOrderByCreatedAtDesc(String custId);
}
