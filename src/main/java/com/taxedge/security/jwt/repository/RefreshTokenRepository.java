package com.taxedge.security.jwt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.customer.entity.Customer;
import com.taxedge.security.jwt.entity.RefreshToken;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    Optional<RefreshToken> findTopByCustomerAndRevokedFalseOrderByCreatedAtDesc(Customer customer);

    List<RefreshToken> findAllByCustomerAndRevokedFalse(Customer customer);
}