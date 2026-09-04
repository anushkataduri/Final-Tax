package com.taxedge.customer.helper;

import java.security.SecureRandom;


public final class CustomerHelper {

    private static final SecureRandom RANDOM = new SecureRandom();

    
    public static String generateCustomerId() {

        int number = 100000 + RANDOM.nextInt(900000);

        return "CI" + number;
    }


}