package com.taxedge.loan.propertyloan.helper;

import java.util.Locale;
import java.util.UUID;

public class PropertyLoanHelper {

    private PropertyLoanHelper() {}

    public static String generateLoanApplicationId() {
        return "PRP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
    }

    public static String generateDocumentId() {
        return "DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
    }
}
