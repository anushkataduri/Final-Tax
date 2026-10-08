package com.taxedge.gst.registration.helper;

import java.security.SecureRandom;

public class RegistrationRandomNumberGenerator {

    private static final SecureRandom random = new SecureRandom();

    public static String generateId() {
        int number = random.nextInt(1_000_000);
        return String.format("REG%06d", number);
    }
}
