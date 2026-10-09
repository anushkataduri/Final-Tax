package com.taxedge.security.otp.policy;

import java.util.Set;
import java.util.regex.Pattern;

/**
 * Rules for a mobile number sent to the OTP endpoints. Mirrors the mobile app's validation
 * (validation/mobileNumber.ts): the canonical form is exactly 10 digits starting 6-9. The app
 * strips +91 / 91 / 0 prefixes and separators before sending, so anything else is rejected here
 * rather than silently reinterpreted.
 */
public final class MobileNumberPolicy {

    private static final Pattern INDIAN_MOBILE = Pattern.compile("^[6-9]\\d{9}$");

    /** The dummy numbers reported as bug BUG-LOGIN-002. This is the approved list; do not extend it ad hoc. */
    private static final Set<String> BLOCKED_DUMMY_NUMBERS =
            Set.of("9999999999", "8888888888", "7777777777", "6666666666");

    public static final String CODE_INVALID = "MOBILE_NUMBER_INVALID";
    public static final String CODE_NOT_ALLOWED = "MOBILE_NUMBER_NOT_ALLOWED";

    private MobileNumberPolicy() {
    }

    /** Returns the trimmed number, or throws {@link InvalidMobileNumberException}. */
    public static String requireValid(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.isBlank()) {
            throw new InvalidMobileNumberException(CODE_INVALID, "Mobile number is required");
        }
        String mobile = mobileNumber.trim();
        if (!INDIAN_MOBILE.matcher(mobile).matches()) {
            throw new InvalidMobileNumberException(CODE_INVALID,
                    "Please enter a valid 10-digit Indian mobile number");
        }
        if (BLOCKED_DUMMY_NUMBERS.contains(mobile)) {
            throw new InvalidMobileNumberException(CODE_NOT_ALLOWED,
                    "This mobile number is not allowed. Please enter a valid mobile number.");
        }
        return mobile;
    }
}
