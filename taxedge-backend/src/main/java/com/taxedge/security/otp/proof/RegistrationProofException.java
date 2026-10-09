package com.taxedge.security.otp.proof;

/** A registration was refused because its OTP-verification proof is missing, invalid, expired, spent or for another number. */
public class RegistrationProofException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public static final String REQUIRED = "REGISTRATION_PROOF_REQUIRED";
    public static final String INVALID = "REGISTRATION_PROOF_INVALID";
    public static final String EXPIRED = "REGISTRATION_PROOF_EXPIRED";
    public static final String ALREADY_USED = "REGISTRATION_PROOF_ALREADY_USED";
    public static final String MOBILE_MISMATCH = "REGISTRATION_PROOF_MOBILE_MISMATCH";

    private final String code;

    public RegistrationProofException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
