package com.taxedge.security.otp.dto;

import lombok.Data;

/** Body of {@code POST /otp/generate} and {@code POST /otp/verify}. */
@Data
public class OtpRequest {
    private String mobileNumber;
    private String otpCode;
}
