package com.taxedge.gst.helper;

import java.security.SecureRandom;

public class RandomNumberGenerator {

    private static final SecureRandom random = new SecureRandom();



    public static String generateGstId() {

        int number = random.nextInt(1_000_000);

        return String.format("GST%06d", number);
    }
}