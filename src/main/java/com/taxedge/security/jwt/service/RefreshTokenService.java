package com.taxedge.security.jwt.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.security.jwt.entity.RefreshToken;
import com.taxedge.security.jwt.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    private static final int REFRESH_TOKEN_EXPIRY_MINUTES = 5; // 5 minutes for testing

    public String createRefreshToken(Customer customer) {

        byte[] randomBytes = new byte[64];

        secureRandom.nextBytes(randomBytes);

        String refreshToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        String tokenHash = hashToken(refreshToken);

        // Check if customer already has active (non-revoked) refresh tokens
        List<RefreshToken> activeTokens =
                refreshTokenRepository.findAllByCustomerAndRevokedFalse(customer);

        RefreshToken refreshTokenEntity;

        if (!activeTokens.isEmpty()) {
            // Update the latest active token
            refreshTokenEntity = activeTokens.get(0);
            refreshTokenEntity.setTokenHash(tokenHash);
            refreshTokenEntity.setCreatedAt(LocalDateTime.now());
            refreshTokenEntity.setExpiresAt(
                    LocalDateTime.now()
                            .plusMinutes(REFRESH_TOKEN_EXPIRY_MINUTES)
            );
            refreshTokenEntity.setRevoked(false);

            // Clean up / revoke any legacy duplicate active tokens
            if (activeTokens.size() > 1) {
                for (int i = 1; i < activeTokens.size(); i++) {
                    RefreshToken old = activeTokens.get(i);
                    old.setRevoked(true);
                    refreshTokenRepository.save(old);
                }
            }
        } else {
            // No existing token found, create a new one
            refreshTokenEntity = RefreshToken.builder()
                    .tokenHash(tokenHash)
                    .customer(customer)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(
                            LocalDateTime.now()
                                    .plusMinutes(REFRESH_TOKEN_EXPIRY_MINUTES)
                    )
                    .revoked(false)
                    .build();
        }

        refreshTokenRepository.save(refreshTokenEntity);

        return refreshToken;
    }

    public String rotateRefreshToken(RefreshToken storedToken) {

        byte[] randomBytes = new byte[64];

        secureRandom.nextBytes(randomBytes);

        String newRefreshToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        String newTokenHash = hashToken(newRefreshToken);

        storedToken.setTokenHash(newTokenHash);
        storedToken.setCreatedAt(LocalDateTime.now());
        storedToken.setExpiresAt(
                LocalDateTime.now()
                        .plusMinutes(REFRESH_TOKEN_EXPIRY_MINUTES)
        );
        storedToken.setRevoked(false);

        refreshTokenRepository.save(storedToken);

        return newRefreshToken;
    }

    public Optional<RefreshToken> validateRefreshToken(
            String refreshToken) {

        String tokenHash = hashToken(refreshToken);

        Optional<RefreshToken> token =
                refreshTokenRepository.findByTokenHash(tokenHash);

        if (token.isEmpty()) {
            return Optional.empty();
        }

        RefreshToken storedToken = token.get();

        if (storedToken.isRevoked()) {
            return Optional.empty();
        }

        if (storedToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            return Optional.empty();
        }

        return Optional.of(storedToken);
    }

    public void revokeRefreshToken(String refreshToken) {

        String tokenHash = hashToken(refreshToken);

        Optional<RefreshToken> token =
                refreshTokenRepository.findByTokenHash(tokenHash);

        if (token.isPresent()) {

            RefreshToken storedToken = token.get();

            storedToken.setRevoked(true);

            refreshTokenRepository.save(storedToken);
        }
    }

    private String hashToken(String token) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            token.getBytes(StandardCharsets.UTF_8)
                    );

            return Base64.getEncoder()
                    .encodeToString(hash);

        } catch (NoSuchAlgorithmException e) {

            throw new IllegalStateException(
                    "SHA-256 algorithm not available",
                    e
            );
        }
    }
}