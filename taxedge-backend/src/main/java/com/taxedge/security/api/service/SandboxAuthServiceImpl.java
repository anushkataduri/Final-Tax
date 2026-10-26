package com.taxedge.security.api.service;

import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taxedge.security.api.entity.ApiAccessToken;
import com.taxedge.security.api.exception.ApiAuthenticationException;
import com.taxedge.security.api.exception.ExternalServiceException;
import com.taxedge.security.api.helper.SandboxAuthHelper;
import com.taxedge.security.api.repository.ApiAccessTokenRepository;
import com.taxedge.security.api.service.SandboxAuthService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SandboxAuthServiceImpl implements SandboxAuthService {

    private static final int MAX_ATTEMPTS = 3;
    private static final long RETRY_BACKOFF_MS = 1_000L;
    private static final int TOKEN_VALIDITY_HOURS = 23;
    private final ApiAccessTokenRepository repository;
    private final ObjectMapper objectMapper;

    @Value("${sandbox.base-url}") 
    private String baseUrl;
    
    @Value("${sandbox.api-key}")  
    private String apiKey;
    
    @Value("${sandbox.api-secret}") 
    private String apiSecret;

    
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .version(HttpClient.Version.HTTP_1_1)
            .build();
    
    @PostConstruct
    void validateConfiguration() {
        if (SandboxAuthHelper.isBlank(baseUrl)
                || SandboxAuthHelper.isBlank(apiKey)
                || SandboxAuthHelper.isBlank(apiSecret)) {
            throw new IllegalStateException(
                    "Sandbox integration is misconfigured: base-url, api-key and api-secret are required");
        }
        log.info("Sandbox integration configured for {} with key {}",
                baseUrl, SandboxAuthHelper.mask(apiKey));
    }

    @Override
    public synchronized String getAccessToken() {

        ApiAccessToken stored = repository.findFirstByOrderByIdAsc().orElse(null);

        if (stored != null
                && stored.getExpiresAt() != null
                && LocalDateTime.now().isBefore(stored.getExpiresAt())) {
            return stored.getAccessToken();
        }

        return generateNewToken();
    }

    @Override
    public synchronized String generateNewToken() {

        String freshToken = authenticate(1);
        LocalDateTime now = LocalDateTime.now();

        ApiAccessToken entity = repository.findFirstByOrderByIdAsc()
                .orElseGet(ApiAccessToken::new);

        entity.setAccessToken(freshToken);
        entity.setIssuedAt(now);
        entity.setExpiresAt(now.plusHours(TOKEN_VALIDITY_HOURS));

        repository.save(entity);

        log.info("Sandbox access token generated, valid until {}", entity.getExpiresAt());
        return freshToken;
    }

    private String authenticate(int attempt) {

        HttpRequest request =
                SandboxAuthHelper.buildAuthenticateRequest(baseUrl, apiKey, apiSecret);

        try {
            HttpResponse<String> response =
                    HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

            int status = response.statusCode();

            if (status == 200) {
                return SandboxAuthHelper.extractToken(objectMapper, response.body());
            }

            if (SandboxAuthHelper.isCredentialFailure(status)) {
                log.error("Sandbox rejected credentials (status {}, key {})",
                        status, SandboxAuthHelper.mask(apiKey));
                throw new ApiAuthenticationException("Sandbox authentication rejected");
            }

            if (!SandboxAuthHelper.isRetryable(status)) {
                throw new ExternalServiceException("Sandbox authentication failed with status " + status);
            }

            log.warn("Sandbox authenticate attempt {}/{} failed with status {}",
                    attempt, MAX_ATTEMPTS, status);

            return retryOrFail(attempt, "Sandbox authentication failed with status " + status, null);

        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new ExternalServiceException("Sandbox authentication interrupted", ex);

        } catch (IOException ex) {
            log.warn("Sandbox authenticate attempt {}/{} failed: {}",
                    attempt, MAX_ATTEMPTS, ex.getMessage());
            return retryOrFail(attempt, "Sandbox service unreachable", ex);
        }
    }

    private String retryOrFail(int attempt, String message, Throwable cause) {
        if (attempt >= MAX_ATTEMPTS) {
            throw new ExternalServiceException(message, cause);
        }
        SandboxAuthHelper.sleepBeforeRetry(RETRY_BACKOFF_MS, attempt);
        return authenticate(attempt + 1);
    }
}