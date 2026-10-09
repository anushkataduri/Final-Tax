package com.taxedge.customer.repository;

import com.taxedge.customer.entity.Customer;

import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, String> {
	
	boolean existsByAadhaar(String aadhaar);

    boolean existsByPan(String pan); 

    boolean existsByMobileNumber(String mobileNumber);

    boolean existsByEmail(String email);

    Optional<Customer> findByMobileNumber(String mobileNumber);

    /** Row-locked lookup used by login so concurrent attempts for one account are serialised across instances. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Customer c where c.mobileNumber = :mobileNumber")
    Optional<Customer> findByMobileNumberForUpdate(@Param("mobileNumber") String mobileNumber);
    
    
 
}
