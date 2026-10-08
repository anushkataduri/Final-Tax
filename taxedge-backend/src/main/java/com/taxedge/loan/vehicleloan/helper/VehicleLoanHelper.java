package com.taxedge.loan.vehicleloan.helper;

import java.security.SecureRandom;

public final class VehicleLoanHelper {

    private static final String PREFIX = "VHL-";
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int RANDOM_LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();

    private VehicleLoanHelper() {
        throw new AssertionError("Utility class — do not instantiate");
    }

    public static String generateVehicleLoanApplicationId() {
        StringBuilder sb = new StringBuilder(PREFIX.length() + RANDOM_LENGTH);
        sb.append(PREFIX);
        for (int i = 0; i < RANDOM_LENGTH; i++) {
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
}
