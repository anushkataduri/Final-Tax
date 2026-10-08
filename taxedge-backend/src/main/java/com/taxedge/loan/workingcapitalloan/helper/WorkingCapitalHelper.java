package com.taxedge.loan.workingcapitalloan.helper;

import java.security.SecureRandom;

public final class WorkingCapitalHelper {

    private static final String PREFIX = "WCL-";
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int RANDOM_LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();

    private WorkingCapitalHelper() {
        throw new AssertionError("Utility class — do not instantiate");
    }

    public static String generateWorkingCapitalApplicationId() {
        StringBuilder sb = new StringBuilder(PREFIX.length() + RANDOM_LENGTH);
        sb.append(PREFIX);
        for (int i = 0; i < RANDOM_LENGTH; i++) {
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
}
