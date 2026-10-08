package com.taxedge.gst.filing.helper;

import java.security.SecureRandom;

public class GstFilingRandomNumberGenerator {

    private static final SecureRandom random = new SecureRandom();

    public static String generateId() {
        int number = random.nextInt(1_000_000);
        return String.format("FIL%06d", number);
    }
}
