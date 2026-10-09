package com.taxedge.security.otp.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.security.otp.dto.OtpRequest;
import com.taxedge.security.otp.policy.InvalidMobileNumberException;
import com.taxedge.security.otp.proof.RegistrationProofService;
import com.taxedge.security.otp.service.OtpSendResult;
import com.taxedge.security.otp.service.OtpService;
import com.taxedge.security.otp.service.OtpVerifyResult;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;
    private final CustomerRepository customerRepository;
    private final RegistrationProofService registrationProofService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateOtp(@RequestBody OtpRequest request) {
        OtpSendResult result = otpService.generateOtp(request.getMobileNumber());
        return switch (result.status()) {
            case SENT -> ResponseEntity.ok("OTP sent successfully");
            case RATE_LIMITED -> tooManyRequests(
                "OTP_RESEND_LIMITED",
                "Too many OTP requests. Please try again in " + describe(result.retryAfterSeconds()) + ".",
                result.retryAfterSeconds(), null);
            case LOCKED -> tooManyRequests(
                "OTP_LOCKED",
                "Too many incorrect OTP attempts. Please try again in " + describe(result.retryAfterSeconds()) + ".",
                result.retryAfterSeconds(), null);
        };
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
        OtpVerifyResult result = otpService.verifyOtp(request.getMobileNumber(), request.getOtpCode());

        if (result.status() == OtpVerifyResult.Status.LOCKED) {
            return tooManyRequests(
                "OTP_LOCKED",
                "Too many incorrect OTP attempts. Please try again in " + describe(result.retryAfterSeconds()) + ".",
                result.retryAfterSeconds(), 0);
        }

        if (result.status() == OtpVerifyResult.Status.INVALID) {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("success", false);
            body.put("code", "OTP_INVALID");
            body.put("message", "Invalid OTP. " + result.remainingAttempts()
                    + (result.remainingAttempts() == 1 ? " attempt" : " attempts") + " remaining.");
            body.put("remainingAttempts", result.remainingAttempts());
            return ResponseEntity.badRequest().body(body);
        }

        String mobile = request.getMobileNumber().trim();
        boolean isExisting = customerRepository.findByMobileNumber(mobile).isPresent();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("isExistingUser", isExisting);
        body.put("customerExists", isExisting);
        body.put("hasPasscode", isExisting);
        body.put("message", "OTP verified successfully");

        // A new number gets a single-use proof it must present to register. Existing customers need none.
        if (!isExisting) {
            RegistrationProofService.IssuedProof proof = registrationProofService.issueForRegistration(mobile);
            body.put("registrationProof", proof.token());
            body.put("registrationProofExpiresInSeconds", proof.expiresInSeconds());
        }
        return ResponseEntity.ok(body);
    }

    @ExceptionHandler(InvalidMobileNumberException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidMobile(InvalidMobileNumberException ex) {
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "code", ex.getCode(),
            "message", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", ex.getMessage()));
    }

    private ResponseEntity<Map<String, Object>> tooManyRequests(
            String code, String message, long retryAfterSeconds, Integer remainingAttempts) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false);
        body.put("code", code);
        body.put("message", message);
        body.put("retryAfterSeconds", retryAfterSeconds);
        if (remainingAttempts != null) {
            body.put("remainingAttempts", remainingAttempts);
        }
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header(HttpHeaders.RETRY_AFTER, String.valueOf(retryAfterSeconds))
                .body(body);
    }

    private static String describe(long seconds) {
        if (seconds >= 60) {
            long minutes = (seconds + 59) / 60;
            return minutes + (minutes == 1 ? " minute" : " minutes");
        }
        return seconds + (seconds == 1 ? " second" : " seconds");
    }
}
