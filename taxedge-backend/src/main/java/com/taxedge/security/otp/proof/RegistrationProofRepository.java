package com.taxedge.security.otp.proof;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RegistrationProofRepository extends JpaRepository<RegistrationProof, Long> {

    Optional<RegistrationProof> findByTokenHash(String tokenHash);

    /** Drops the number's unspent proofs so only the newest verification can register. */
    @Modifying
    @Query("delete from RegistrationProof p where p.mobileNumber = :mobile and p.purpose = :purpose and p.consumedAt is null")
    int deleteUnspent(@Param("mobile") String mobile, @Param("purpose") String purpose);

    /**
     * Spends a proof in one conditional UPDATE: it only matches a proof for this number and flow
     * that is unspent and unexpired, so of any number of concurrent callers exactly one gets 1.
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update RegistrationProof p set p.consumedAt = :now "
            + "where p.tokenHash = :hash and p.mobileNumber = :mobile and p.purpose = :purpose "
            + "and p.consumedAt is null and p.expiresAt > :now")
    int consume(@Param("hash") String hash, @Param("mobile") String mobile,
                @Param("purpose") String purpose, @Param("now") Instant now);
}
