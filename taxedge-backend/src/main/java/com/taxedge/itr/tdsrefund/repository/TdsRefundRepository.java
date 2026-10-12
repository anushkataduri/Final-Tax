package com.taxedge.itr.tdsrefund.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.itr.tdsrefund.entity.TdsRefund;




@Repository
public interface TdsRefundRepository extends JpaRepository<TdsRefund, String> {

    Optional<TdsRefund> findByIdAndCustId(String id, String custId);

    List<TdsRefund> findByCustId(String custId);

    boolean existsByIdAndCustId(String id, String custId);
}