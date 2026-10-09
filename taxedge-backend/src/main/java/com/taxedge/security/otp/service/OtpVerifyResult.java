package com.taxedge.security.otp.service;

public record OtpVerifyResult(Status status, int remainingAttempts, long retryAfterSeconds) {

    public enum Status { VERIFIED, INVALID, LOCKED }

    public static OtpVerifyResult verified() {
        return new OtpVerifyResult(Status.VERIFIED, 0, 0);
    }

    public static OtpVerifyResult invalid(int remainingAttempts) {
        return new OtpVerifyResult(Status.INVALID, remainingAttempts, 0);
    }

    public static OtpVerifyResult locked(long retryAfterSeconds) {
        return new OtpVerifyResult(Status.LOCKED, 0, retryAfterSeconds);
    }
}
