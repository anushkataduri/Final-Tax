package com.taxedge.security.otp.policy;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class MobileNumberPolicyTest {

    @Test
    void acceptsACanonicalTenDigitNumberAndTrimsWhitespace() {
        assertEquals("9876543210", MobileNumberPolicy.requireValid("9876543210"));
        assertEquals("9876543210", MobileNumberPolicy.requireValid(" 9876543210 "));
    }

    @ParameterizedTest
    @ValueSource(strings = {"9999999999", "8888888888", "7777777777", "6666666666"})
    void rejectsTheFourReportedDummyNumbers(String dummy) {
        InvalidMobileNumberException ex =
                assertThrows(InvalidMobileNumberException.class, () -> MobileNumberPolicy.requireValid(dummy));
        assertEquals(MobileNumberPolicy.CODE_NOT_ALLOWED, ex.getCode());
    }

    @ParameterizedTest
    @ValueSource(strings = {"+919876543210", "919876543210", "09876543210", "98765 43210", "987654321",
            "98765432101", "5876543210", "abcdefghij", "98765-43210"})
    void rejectsAnythingNotInCanonicalForm(String malformed) {
        InvalidMobileNumberException ex =
                assertThrows(InvalidMobileNumberException.class, () -> MobileNumberPolicy.requireValid(malformed));
        assertEquals(MobileNumberPolicy.CODE_INVALID, ex.getCode());
    }

    @Test
    void rejectsMissingNumbers() {
        assertThrows(InvalidMobileNumberException.class, () -> MobileNumberPolicy.requireValid(null));
        assertThrows(InvalidMobileNumberException.class, () -> MobileNumberPolicy.requireValid("  "));
    }

    @ParameterizedTest
    @ValueSource(strings = {"9876543210", "6000000001", "7000000000", "8123456789", "9111111111", "9999999998"})
    void doesNotRejectOtherLegitimateNumbersIncludingRepeatedLookalikes(String legit) {
        assertEquals(legit, MobileNumberPolicy.requireValid(legit));
    }
}
