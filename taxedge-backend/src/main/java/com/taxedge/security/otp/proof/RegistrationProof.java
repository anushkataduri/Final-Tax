package com.taxedge.security.otp.proof;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Server-side record that a mobile number passed OTP verification and may register once.
 * Only a SHA-256 hash of the proof token is stored, so a database read does not yield a usable proof.
 */
@Entity
@Table(
    name = "registration_proofs",
    uniqueConstraints = @UniqueConstraint(name = "uk_registration_proofs_token_hash", columnNames = "token_hash"),
    indexes = @Index(name = "idx_registration_proofs_mobile", columnList = "mobile_number")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationProof {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;

    /** The flow this proof is valid for; a proof minted for one flow is refused by another. */
    @Column(name = "purpose", nullable = false, length = 40)
    private String purpose;

    /** Lower-case hex SHA-256 of the proof token. */
    @Column(name = "token_hash", nullable = false, length = 64)
    private String tokenHash;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    /** Set, once, when the proof is spent by a registration. */
    @Column(name = "consumed_at")
    private Instant consumedAt;
}
