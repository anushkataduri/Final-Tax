package com.taxedge.gst.compliance.helper;

import java.security.SecureRandom;

public class GstComplianceRandomNumberGenerator {

    private static final SecureRandom random = new SecureRandom();

    public static String generateId() {
        int number = random.nextInt(1_000_000);
        return String.format("COM%06d", number);
    }
}
