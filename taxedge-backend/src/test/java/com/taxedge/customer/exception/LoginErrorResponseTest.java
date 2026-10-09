package com.taxedge.customer.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;

import com.taxedge.security.otp.proof.RegistrationProofException;

/** Error bodies returned by POST /customer/login for wrong and locked passcodes. */
class LoginErrorResponseTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();
    private final ServletWebRequest request = new ServletWebRequest(new MockHttpServletRequest("POST", "/customer/login"));

    @Test
    void wrongPasscodeIs401WithAttemptsLeft() {
        ResponseEntity<Map<String, Object>> response =
                handler.handleInvalidCredentials(new InvalidCredentialsException("x", 3), request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("INVALID_CREDENTIALS", response.getBody().get("code"));
        assertEquals(3, response.getBody().get("remainingAttempts"));
    }

    @Test
    void unknownAccountDoesNotRevealAnAttemptCount() {
        ResponseEntity<Map<String, Object>> response =
                handler.handleInvalidCredentials(new InvalidCredentialsException("x"), request);

        assertFalse(response.getBody().containsKey("remainingAttempts"));
    }

    @Test
    void refusedRegistrationProofIs403WithItsCode() {
        ResponseEntity<Map<String, Object>> response = handler.handleRegistrationProof(
                new RegistrationProofException(RegistrationProofException.EXPIRED, "expired"), request);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("REGISTRATION_PROOF_EXPIRED", response.getBody().get("code"));
    }

    @Test
    void lockedAccountIs429WithRetryAfterHeaderAndBody() {
        ResponseEntity<Map<String, Object>> response =
                handler.handleAccountLocked(new AccountLockedException("Try later", 900), request);

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        assertEquals("900", response.getHeaders().getFirst("Retry-After"));
        assertEquals("PASSCODE_LOCKED", response.getBody().get("code"));
        assertEquals(900L, response.getBody().get("retryAfterSeconds"));
        assertEquals(0, response.getBody().get("remainingAttempts"));
    }
}
