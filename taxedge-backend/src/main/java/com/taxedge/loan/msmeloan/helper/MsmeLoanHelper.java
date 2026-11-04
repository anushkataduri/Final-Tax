package com.taxedge.loan.msmeloan.helper;

public final class MsmeLoanHelper {

    private MsmeLoanHelper() {}

    public static String formatLoanApplicationId(int year, long sequenceNumber) {
        return String.format("LOAN-MSME-%04d-%05d", year, sequenceNumber);
    }
}
