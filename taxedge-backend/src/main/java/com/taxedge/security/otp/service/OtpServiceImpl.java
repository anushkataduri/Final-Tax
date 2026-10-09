package com.taxedge.security.otp.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.function.Supplier;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import com.taxedge.security.otp.config.OtpProperties;
import com.taxedge.security.otp.entity.Otp;
import com.taxedge.security.otp.policy.MobileNumberPolicy;
import com.taxedge.security.otp.repository.OtpRepository;
import com.taxedge.shared.concurrency.KeyedLock;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * OTP issue/verify with server-enforced limits. All state lives on the {@link Otp} row, so it
 * survives restarts and cannot be reset from the client.
 *
 * <p>Each operation runs under a per-number lock (JVM) wrapping a transaction that holds a
 * pessimistic row lock (database), so parallel requests cannot slip past a limit. Outcomes are
 * returned rather than thrown so counter updates commit instead of rolling back.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private static final String LOCK_PREFIX = "otp:";

    private final OtpRepository otpRepository;
    private final OtpProperties properties;
    private final Clock clock;
    private final KeyedLock keyedLock;
    private final TransactionTemplate transactionTemplate;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public OtpSendResult generateOtp(String mobileNumber) {
        String mobile = normalise(mobileNumber);
        return locked(mobile, () -> doGenerate(mobile));
    }

    @Override
    public OtpVerifyResult verifyOtp(String mobileNumber, String otpCode) {
        String mobile = normalise(mobileNumber);
        return locked(mobile, () -> doVerify(mobile, otpCode));
    }

    private OtpSendResult doGenerate(String mobile) {
        Instant now = clock.instant();
        Otp row = otpRepository.findFirstByMobileNumberOrderByIdDesc(mobile)
                .orElseGet(() -> otpRepository.saveAndFlush(newRow(mobile)));

        releaseExpiredState(row, now);

        // Requesting a fresh OTP must never be a way around an active lockout.
        if (isLocked(row, now)) {
            return OtpSendResult.locked(secondsUntil(row.getLockedUntil(), now));
        }

        if (row.getLastSentAt() != null) {
            Instant nextAllowed = row.getLastSentAt().plus(properties.getResendCooldown());
            if (now.isBefore(nextAllowed)) {
                return OtpSendResult.rateLimited(secondsUntil(nextAllowed, now));
            }
        }

        Instant windowStart = row.getSendWindowStart();
        int sent = zeroIfNull(row.getSendCount());
        if (windowStart == null || !now.isBefore(windowStart.plus(properties.getSendWindow()))) {
            windowStart = now;
            sent = 0;
        }
        if (sent >= properties.getMaxSendsPerWindow()) {
            return OtpSendResult.rateLimited(secondsUntil(windowStart.plus(properties.getSendWindow()), now));
        }

        String otpCode = newCode();
        row.setOtpCode(otpCode);
        row.setLastSentAt(now);
        row.setSendWindowStart(windowStart);
        row.setSendCount(sent + 1);
        otpRepository.save(row);

        if (properties.isLogCode()) {
            log.info("OTP for {} is: {}", mobile, otpCode);
        }
        return OtpSendResult.sent();
    }

    private OtpVerifyResult doVerify(String mobile, String otpCode) {
        Instant now = clock.instant();
        Otp row = otpRepository.findFirstByMobileNumberOrderByIdDesc(mobile).orElse(null);
        if (row == null) {
            return OtpVerifyResult.invalid(properties.getMaxFailedAttempts());
        }

        releaseExpiredState(row, now);

        // A locked number is refused even for the right code, and the refusal is not counted.
        if (isLocked(row, now)) {
            return OtpVerifyResult.locked(secondsUntil(row.getLockedUntil(), now));
        }

        if (matches(otpCode, row.getOtpCode())) {
            row.setFailedAttempts(0);
            row.setLastFailedAt(null);
            otpRepository.save(row);
            return OtpVerifyResult.verified();
        }

        int failed = zeroIfNull(row.getFailedAttempts()) + 1;
        row.setFailedAttempts(failed);
        row.setLastFailedAt(now);

        if (failed >= properties.getMaxFailedAttempts()) {
            row.setLockedUntil(now.plus(properties.getLockoutDuration()));
            // Burn the current code: after the lockout a fresh OTP must be requested.
            row.setOtpCode(newCode());
            otpRepository.save(row);
            log.warn("OTP verification locked for {} until {}", mobile, row.getLockedUntil());
            return OtpVerifyResult.locked(secondsUntil(row.getLockedUntil(), now));
        }

        otpRepository.save(row);
        return OtpVerifyResult.invalid(properties.getMaxFailedAttempts() - failed);
    }

    /**
     * Runs {@code work} under the per-number lock in its own transaction. Retries once if another
     * instance created the row first (unique constraint on the mobile number).
     */
    private <T> T locked(String mobile, Supplier<T> work) {
        return keyedLock.withLock(LOCK_PREFIX + mobile, () -> {
            try {
                return transactionTemplate.execute(status -> work.get());
            } catch (DataIntegrityViolationException raced) {
                return transactionTemplate.execute(status -> work.get());
            }
        });
    }

    /** Clears a finished lockout, and failures old enough to no longer count. */
    private void releaseExpiredState(Otp row, Instant now) {
        boolean lockoutOver = row.getLockedUntil() != null && !now.isBefore(row.getLockedUntil());
        boolean staleFailures = row.getLockedUntil() == null
                && zeroIfNull(row.getFailedAttempts()) > 0
                && row.getLastFailedAt() != null
                && now.isAfter(row.getLastFailedAt().plus(properties.getLockoutDuration()));
        if (lockoutOver || staleFailures) {
            row.setLockedUntil(null);
            row.setFailedAttempts(0);
            row.setLastFailedAt(null);
        }
    }

    private boolean isLocked(Otp row, Instant now) {
        return row.getLockedUntil() != null && now.isBefore(row.getLockedUntil());
    }

    private boolean matches(String submitted, String stored) {
        if (submitted == null || stored == null) {
            return false;
        }
        return MessageDigest.isEqual(
                submitted.getBytes(StandardCharsets.UTF_8),
                stored.getBytes(StandardCharsets.UTF_8));
    }

    private Otp newRow(String mobile) {
        return Otp.builder().mobileNumber(mobile).otpCode(newCode()).build();
    }

    private String newCode() {
        return String.valueOf(100000 + secureRandom.nextInt(900000));
    }

    private static long secondsUntil(Instant target, Instant now) {
        long millis = Duration.between(now, target).toMillis();
        return Math.max(1, (millis + 999) / 1000);
    }

    private static int zeroIfNull(Integer value) {
        return value == null ? 0 : value;
    }

    /** Rejects malformed and dummy numbers before any OTP state is read or written. */
    private static String normalise(String mobileNumber) {
        return MobileNumberPolicy.requireValid(mobileNumber);
    }
}
