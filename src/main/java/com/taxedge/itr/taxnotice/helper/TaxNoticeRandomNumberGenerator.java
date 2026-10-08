package com.taxedge.itr.taxnotice.helper;

import java.util.Random;

public class TaxNoticeRandomNumberGenerator {

    private static final Random random = new Random();

    public static String generateTaxNoticeId() {
        int number = random.nextInt(1_000_000);
        return String.format("TNA%06d", number);
    }

    public static String generateTaxNoticeDocumentId() {
        int number = random.nextInt(1_000_000);
        return String.format("TND%06d", number);
    }
}
