package com.taxedge.gst.registration.helper;

import java.security.SecureRandom;

public class RandomNumberGenerator  {
	 private static final SecureRandom random = new SecureRandom();
	public static String generateGstId() {
        long number = random.nextLong(1_000_000_000_000L);
        return String.format("GST%012d", number);
    }
}


