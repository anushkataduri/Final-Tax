package com.taxedge.security.otp.service;

public record OtpSendResult(Status status, long retryAfterSeconds) {

    public enum Status { SENT, RATE_LIMITED, LOCKED }

    public static OtpSendResult sent() {
        return new OtpSendResult(Status.SENT, 0);
    }

    public static OtpSendResult rateLimited(long retryAfterSeconds) {
        return new OtpSendResult(Status.RATE_LIMITED, retryAfterSeconds);
    }

    public static OtpSendResult locked(long retryAfterSeconds) {
        return new OtpSendResult(Status.LOCKED, retryAfterSeconds);
    }
}
