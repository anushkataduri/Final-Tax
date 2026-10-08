package com.taxedge.itr.tdsrefund.helper;

import java.util.Random;

public class TdsRefundRandomNumberGenerator {

    private static final Random random = new Random();

    public static String generateTdsRefundId() {
        int number = random.nextInt(1_000_000);
        return String.format("TDS%06d", number);
    }
}
