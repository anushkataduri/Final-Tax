package com.taxedge.security.otp.service;

public interface OtpService {

    /** Issues a new OTP unless the number is locked or has hit the resend limits. */
    OtpSendResult generateOtp(String mobileNumber);

    /** Checks an OTP, counting wrong attempts and locking the number after too many. */
    OtpVerifyResult verifyOtp(String mobileNumber, String otpCode);
}
