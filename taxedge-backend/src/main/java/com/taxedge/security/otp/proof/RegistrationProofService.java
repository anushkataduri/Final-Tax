package com.taxedge.security.otp.proof;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

/**
 * Issues and spends the proof that a mobile number passed OTP verification.
 *
 * <p>The token is 256 random bits from {@link SecureRandom}, returned once and stored only as a
 * SHA-256 hash. It is never logged. {@link #consume} must run inside the registration transaction
 * so a failed registration rolls the proof back to unspent while a successful one spends it for good.
 */
@Service
@RequiredArgsConstructor
public class RegistrationProofService {

    public static final String PURPOSE_CUSTOMER_REGISTRATION = "CUSTOMER_REGISTRATION";

    private final RegistrationProofRepository repository;
    private final RegistrationProofProperties properties;
    private final Clock clock;

    private final SecureRandom secureRandom = new SecureRandom();

    /** A freshly issued proof: the secret token (shown once) and when it stops being valid. */
    public record IssuedProof(String token, Instant expiresAt, long expiresInSeconds) {
    }

    /** Mints a proof for a number that has just passed OTP verification, replacing any unspent one. */
    @Transactional
    public IssuedProof issueForRegistration(String mobileNumber) {
        byte[] raw = new byte[32];
        secureRandom.nextBytes(raw);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);

        Instant now = clock.instant();
        Instant expiresAt = now.plus(properties.getTtl());

        repository.deleteUnspent(mobileNumber, PURPOSE_CUSTOMER_REGISTRATION);
        repository.save(RegistrationProof.builder()
                .mobileNumber(mobileNumber)
                .purpose(PURPOSE_CUSTOMER_REGISTRATION)
                .tokenHash(hash(token))
                .createdAt(now)
                .expiresAt(expiresAt)
                .build());

        return new IssuedProof(token, expiresAt, properties.getTtl().toSeconds());
    }

    /**
     * Spends the proof for {@code mobileNumber}, or throws {@link RegistrationProofException}
     * saying why it cannot be used. Join the caller's transaction (do not start a new one).
     */
    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.MANDATORY)
    public void consumeForRegistration(String mobileNumber, String token) {
        if (token == null || token.isBlank()) {
            throw new RegistrationProofException(RegistrationProofException.REQUIRED,
                    "Mobile number verification is required before registering.");
        }
        String hash = hash(token.trim());
        Instant now = clock.instant();

        if (repository.consume(hash, mobileNumber, PURPOSE_CUSTOMER_REGISTRATION, now) == 1) {
            return;
        }

        // Not spendable. Work out why, for a precise error; none of these paths spends anything.
        RegistrationProof existing = repository.findByTokenHash(hash).orElse(null);
        if (existing == null) {
            throw new RegistrationProofException(RegistrationProofException.INVALID,
                    "Mobile number verification is invalid. Please verify your number again.");
        }
        if (!PURPOSE_CUSTOMER_REGISTRATION.equals(existing.getPurpose())
                || !existing.getMobileNumber().equals(mobileNumber)) {
            throw new RegistrationProofException(RegistrationProofException.MOBILE_MISMATCH,
                    "Mobile number verification does not match this registration.");
        }
        if (existing.getConsumedAt() != null) {
            throw new RegistrationProofException(RegistrationProofException.ALREADY_USED,
                    "This verification has already been used. Please verify your number again.");
        }
        throw new RegistrationProofException(RegistrationProofException.EXPIRED,
                "Mobile number verification has expired. Please verify your number again.");
    }

    static String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is unavailable", e);
        }
    }
}
