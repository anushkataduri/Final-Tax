package com.taxedge.gst.cancellation.helper;

import java.security.SecureRandom;

public class GstCancellationRandomNumberGenerator {

    private static final SecureRandom random = new SecureRandom();

    public static String generateId() {
        int number = random.nextInt(1_000_000);
        return String.format("CAN%06d", number);
    }
}
