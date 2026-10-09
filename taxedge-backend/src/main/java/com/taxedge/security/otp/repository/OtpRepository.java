package com.taxedge.security.otp.repository;

import java.util.Optional;

import com.taxedge.security.otp.entity.Otp;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Otp findTopByMobileNumberOrderByIdDesc(String mobileNumber);

    /** Same lookup, but takes a row lock so concurrent attempts for one number are serialised across instances. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Otp> findFirstByMobileNumberOrderByIdDesc(String mobileNumber);
}
