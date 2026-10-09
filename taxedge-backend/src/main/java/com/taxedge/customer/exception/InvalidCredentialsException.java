package com.taxedge.customer.exception;

public class InvalidCredentialsException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /** Attempts left before lockout, or null when not applicable (e.g. unknown account). */
    private final Integer remainingAttempts;

    public InvalidCredentialsException(String message) {
        this(message, null);
    }

    public InvalidCredentialsException(String message, Integer remainingAttempts) {
        super(message);
        this.remainingAttempts = remainingAttempts;
    }

    public Integer getRemainingAttempts() {
        return remainingAttempts;
    }
}
