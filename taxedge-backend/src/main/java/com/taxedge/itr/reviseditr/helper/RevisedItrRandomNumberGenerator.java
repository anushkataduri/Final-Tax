package com.taxedge.itr.reviseditr.helper;

import java.util.Random;

public class RevisedItrRandomNumberGenerator {

    private static final Random random = new Random();

    public static String generateRevisedItrId() {
        int number = random.nextInt(1_000_000);
        return String.format("RITR%06d", number);
    }

    public static String generateRevisionReasonId() {
        int number = random.nextInt(1_000_000);
        return String.format("RR%06d", number);
    }

    public static String generateRevisedItrDetailsId() {
        int number = random.nextInt(1_000_000);
        return String.format("RID%06d", number);
    }

    public static String generateRevisedItrDocumentId() {
        int number = random.nextInt(1_000_000);
        return String.format("RID%06d", number);
    }
}
