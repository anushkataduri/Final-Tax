package com.taxedge.loan.machineryloan.helper;

import java.security.SecureRandom;

public final class MachineryLoanHelper {

    private static final String PREFIX = "MCL-";
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int RANDOM_LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();

    private MachineryLoanHelper() {
        throw new AssertionError("Utility class — do not instantiate");
    }

    public static String generateMachineryLoanApplicationId() {
        StringBuilder sb = new StringBuilder(PREFIX.length() + RANDOM_LENGTH);
        sb.append(PREFIX);
        for (int i = 0; i < RANDOM_LENGTH; i++) {
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
}
