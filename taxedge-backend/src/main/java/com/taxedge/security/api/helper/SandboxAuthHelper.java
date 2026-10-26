package com.taxedge.security.api.helper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.time.Duration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taxedge.security.api.dto.AuthenticateResponse;
import com.taxedge.security.api.exception.ExternalServiceException;

public final class SandboxAuthHelper {

    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(15);
    private static final int MASK_VISIBLE_CHARS = 4;

    private SandboxAuthHelper() {
        throw new AssertionError("Utility class — do not instantiate");
    }

    public static HttpRequest buildAuthenticateRequest(String baseUrl, String apiKey,
                                                       String apiSecret) {
        return HttpRequest.newBuilder()
                .uri(URI.create(resolveUrl(baseUrl, "/authenticate")))
                .header("x-api-key", apiKey)
                .header("x-api-secret", apiSecret)
                .timeout(REQUEST_TIMEOUT)
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();
    }

    public static String extractToken(ObjectMapper objectMapper, String responseBody) {
        try {
            AuthenticateResponse body =
                    objectMapper.readValue(responseBody, AuthenticateResponse.class);

            if (body.getData() == null || isBlank(body.getData().getAccessToken())) {
                throw new ExternalServiceException("Sandbox authenticate returned no access token");
            }
            return body.getData().getAccessToken();

        } catch (IOException ex) {
            throw new ExternalServiceException("Unreadable response from Sandbox authenticate", ex);
        }
    }

  
    public static String resolveUrl(String baseUrl, String path) {
        String base = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        return base + (path.startsWith("/") ? path : "/" + path);
    }

   
    public static boolean isCredentialFailure(int status) {
        return status == 401 || status == 403;
    }

   
    public static boolean isRetryable(int status) {
        return status >= 500 || status == 429 || status == 408;
    }

    
    public static void sleepBeforeRetry(long baseBackoffMillis, int attempt) {
        try {
            Thread.sleep(baseBackoffMillis * attempt);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new ExternalServiceException("Sandbox authentication interrupted", ex);
        }
    }

    
    public static String mask(String secret) {
        if (isBlank(secret)) {
            return "****";
        }
        if (secret.length() <= MASK_VISIBLE_CHARS) {
            return "*".repeat(secret.length());
        }
        return "*".repeat(secret.length() - MASK_VISIBLE_CHARS)
                + secret.substring(secret.length() - MASK_VISIBLE_CHARS);
    }

    public static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}