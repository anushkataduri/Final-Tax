package com.taxedge.security.jwt.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.customer.entity.Customer;
import com.taxedge.security.jwt.dto.RefreshTokenRequest;
import com.taxedge.security.jwt.dto.RefreshTokenResponse;
import com.taxedge.security.jwt.entity.RefreshToken;
import com.taxedge.security.jwt.service.JwtService;
import com.taxedge.security.jwt.service.RefreshTokenService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        if (request.getRefreshToken() == null || request.getRefreshToken().isBlank()) {
            return ResponseEntity.badRequest().body("Refresh token is required");
        }

        Optional<RefreshToken> tokenOptional =
                refreshTokenService.validateRefreshToken(request.getRefreshToken());

        if (tokenOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired refresh token");
        }

        RefreshToken refreshTokenEntity = tokenOptional.get();
        Customer customer = refreshTokenEntity.getCustomer();

        String newAccessToken = jwtService.generateToken(
                customer.getCustId(),
                customer.getName(),
                customer.getMobileNumber()
        );

        String newRefreshToken = refreshTokenService.rotateRefreshToken(refreshTokenEntity);

        RefreshTokenResponse response = RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/revoke")
    public ResponseEntity<String> revokeToken(@RequestBody RefreshTokenRequest request) {
        if (request.getRefreshToken() == null || request.getRefreshToken().isBlank()) {
            return ResponseEntity.badRequest().body("Refresh token is required");
        }

        refreshTokenService.revokeRefreshToken(request.getRefreshToken());
        return ResponseEntity.ok("Refresh token revoked successfully");
    }
}
