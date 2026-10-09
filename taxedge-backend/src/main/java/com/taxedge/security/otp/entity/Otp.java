package com.taxedge.security.otp.entity;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(
    name = "otps",
    uniqueConstraints = @UniqueConstraint(name = "uk_otps_mobile_number", columnNames = "mobile_number")
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;


    @Column(name = "otp_code", nullable = false, length = 6)
    private String otpCode;

    // Abuse-limit state. Nullable so rows created before these columns existed still load (null = 0 / unset).

    /** Wrong verification attempts since the last success or expired lockout. */
    @Column(name = "failed_attempts")
    private Integer failedAttempts;

    @Column(name = "last_failed_at")
    private Instant lastFailedAt;

    /** Verification and new OTP requests are refused until this instant. */
    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "last_sent_at")
    private Instant lastSentAt;

    @Column(name = "send_window_start")
    private Instant sendWindowStart;

    @Column(name = "send_count")
    private Integer sendCount;
}
