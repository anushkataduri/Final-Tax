package com.taxedge.gst.amendment.helper;

import java.security.SecureRandom;

public class GstAmendmentRandomNumberGenerator {

    private static final SecureRandom random = new SecureRandom();

    public static String generateId() {
        int number = random.nextInt(1_000_000);
        return String.format("AMD%06d", number);
    }
}
