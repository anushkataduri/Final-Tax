package com.taxedge.security.otp.policy;

/** A mobile number rejected by {@link MobileNumberPolicy}; the code lets clients tell the cases apart. */
public class InvalidMobileNumberException extends IllegalArgumentException {

    private static final long serialVersionUID = 1L;

    private final String code;

    public InvalidMobileNumberException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
