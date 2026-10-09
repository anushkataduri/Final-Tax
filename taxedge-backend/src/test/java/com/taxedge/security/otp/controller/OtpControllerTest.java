package com.taxedge.security.otp.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.security.otp.policy.InvalidMobileNumberException;
import com.taxedge.security.otp.proof.RegistrationProofService;
import com.taxedge.security.otp.service.OtpSendResult;
import com.taxedge.security.otp.service.OtpService;
import com.taxedge.security.otp.service.OtpVerifyResult;

/** HTTP contract of /otp/generate and /otp/verify that the mobile app relies on. */
class OtpControllerTest {

    private static final String BODY = "{\"mobileNumber\":\"9876543210\",\"otpCode\":\"123456\"}";

    private OtpService otpService;
    private CustomerRepository customerRepository;
    private RegistrationProofService registrationProofService;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        otpService = mock(OtpService.class);
        customerRepository = mock(CustomerRepository.class);
        registrationProofService = mock(RegistrationProofService.class);
        mvc = MockMvcBuilders
                .standaloneSetup(new OtpController(otpService, customerRepository, registrationProofService))
                .build();
    }

    @Test
    void generateSuccessKeepsThePlainTextBody() throws Exception {
        when(otpService.generateOtp(anyString())).thenReturn(OtpSendResult.sent());

        mvc.perform(post("/otp/generate").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isOk())
                .andExpect(content().string("OTP sent successfully"));
    }

    @Test
    void generateRateLimitedReturns429WithRetryAfter() throws Exception {
        when(otpService.generateOtp(anyString())).thenReturn(OtpSendResult.rateLimited(20));

        mvc.perform(post("/otp/generate").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string("Retry-After", "20"))
                .andExpect(jsonPath("$.code").value("OTP_RESEND_LIMITED"))
                .andExpect(jsonPath("$.retryAfterSeconds").value(20))
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void generateDuringLockoutReturns429WithLockedCode() throws Exception {
        when(otpService.generateOtp(anyString())).thenReturn(OtpSendResult.locked(840));

        mvc.perform(post("/otp/generate").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.code").value("OTP_LOCKED"))
                .andExpect(jsonPath("$.retryAfterSeconds").value(840));
    }

    @Test
    void wrongOtpReturns400WithAttemptsLeft() throws Exception {
        when(otpService.verifyOtp(anyString(), any())).thenReturn(OtpVerifyResult.invalid(2));

        mvc.perform(post("/otp/verify").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("OTP_INVALID"))
                .andExpect(jsonPath("$.remainingAttempts").value(2))
                .andExpect(jsonPath("$.message").value("Invalid OTP. 2 attempts remaining."));
    }

    @Test
    void lockedVerificationReturns429With15MinuteRetry() throws Exception {
        when(otpService.verifyOtp(anyString(), any())).thenReturn(OtpVerifyResult.locked(900));

        mvc.perform(post("/otp/verify").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string("Retry-After", "900"))
                .andExpect(jsonPath("$.code").value("OTP_LOCKED"))
                .andExpect(jsonPath("$.retryAfterSeconds").value(900))
                .andExpect(jsonPath("$.remainingAttempts").value(0))
                .andExpect(jsonPath("$.message").value("Too many incorrect OTP attempts. Please try again in 15 minutes."));
    }

    @Test
    void verifiedOtpKeepsTheExistingResponseShape() throws Exception {
        when(otpService.verifyOtp(anyString(), any())).thenReturn(OtpVerifyResult.verified());
        when(customerRepository.findByMobileNumber("9876543210")).thenReturn(Optional.of(new Customer()));

        mvc.perform(post("/otp/verify").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.isExistingUser").value(true))
                .andExpect(jsonPath("$.customerExists").value(true))
                .andExpect(jsonPath("$.hasPasscode").value(true))
                .andExpect(jsonPath("$.message").value("OTP verified successfully"));
    }

    @Test
    void verifyingANewNumberIssuesASingleUseRegistrationProof() throws Exception {
        when(otpService.verifyOtp(anyString(), any())).thenReturn(OtpVerifyResult.verified());
        when(customerRepository.findByMobileNumber("9876543210")).thenReturn(Optional.empty());
        when(registrationProofService.issueForRegistration("9876543210")).thenReturn(
                new RegistrationProofService.IssuedProof("proof-token", java.time.Instant.parse("2026-01-01T10:30:00Z"), 1800));

        mvc.perform(post("/otp/verify").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isExistingUser").value(false))
                .andExpect(jsonPath("$.registrationProof").value("proof-token"))
                .andExpect(jsonPath("$.registrationProofExpiresInSeconds").value(1800));
    }

    @Test
    void verifyingAnExistingCustomerIssuesNoProof() throws Exception {
        when(otpService.verifyOtp(anyString(), any())).thenReturn(OtpVerifyResult.verified());
        when(customerRepository.findByMobileNumber("9876543210")).thenReturn(Optional.of(new Customer()));

        mvc.perform(post("/otp/verify").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.registrationProof").doesNotExist());
        verify(registrationProofService, never()).issueForRegistration(any());
    }

    @Test
    void failedOrLockedVerificationNeverIssuesAProof() throws Exception {
        when(otpService.verifyOtp(anyString(), any())).thenReturn(OtpVerifyResult.invalid(2));
        mvc.perform(post("/otp/verify").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.registrationProof").doesNotExist());

        when(otpService.verifyOtp(anyString(), any())).thenReturn(OtpVerifyResult.locked(900));
        mvc.perform(post("/otp/verify").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.registrationProof").doesNotExist());

        verify(registrationProofService, never()).issueForRegistration(any());
    }

    @Test
    void dummyNumberIs400WithANotAllowedCode() throws Exception {
        when(otpService.generateOtp(any())).thenThrow(new InvalidMobileNumberException(
                "MOBILE_NUMBER_NOT_ALLOWED", "This mobile number is not allowed. Please enter a valid mobile number."));

        mvc.perform(post("/otp/generate").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mobileNumber\":\"9999999999\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("MOBILE_NUMBER_NOT_ALLOWED"));
    }

    @Test
    void missingMobileNumberIsABadRequestNotAServerError() throws Exception {
        when(otpService.generateOtp(any())).thenThrow(new IllegalArgumentException("Mobile number is required"));

        mvc.perform(post("/otp/generate").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());
    }
}
