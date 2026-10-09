package com.taxedge.security.otp.proof;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.taxedge.security.otp.proof.RegistrationProofTestSupport.MutableClock;
import com.taxedge.security.otp.proof.RegistrationProofTestSupport.Store;

class RegistrationProofServiceTest {

    private static final String MOBILE = "9876543210";

    private MutableClock clock;
    private Store store;
    private RegistrationProofService service;

    @BeforeEach
    void setUp() {
        clock = new MutableClock(Instant.parse("2026-01-01T10:00:00Z"));
        store = new Store();
        service = new RegistrationProofService(store.repository, new RegistrationProofProperties(), clock);
    }

    private String codeOf(Runnable action) {
        return assertThrows(RegistrationProofException.class, action::run).getCode();
    }

    // ---- issuing ----------------------------------------------------------------------------

    @Test
    void issuesALongRandomTokenBoundToTheNumberAndFlow() {
        RegistrationProofService.IssuedProof issued = service.issueForRegistration(MOBILE);

        assertEquals(43, issued.token().length(), "256 random bits, base64url without padding");
        assertEquals(Duration.ofMinutes(30).toSeconds(), issued.expiresInSeconds());
        assertEquals(1, store.rows.size());
        RegistrationProof row = store.rows.get(0);
        assertEquals(MOBILE, row.getMobileNumber());
        assertEquals(RegistrationProofService.PURPOSE_CUSTOMER_REGISTRATION, row.getPurpose());
        assertEquals(clock.instant().plus(Duration.ofMinutes(30)), row.getExpiresAt());
        assertNotNull(row.getCreatedAt());
    }

    @Test
    void storesOnlyAHashOfTheToken() {
        RegistrationProofService.IssuedProof issued = service.issueForRegistration(MOBILE);

        RegistrationProof row = store.rows.get(0);
        assertNotEquals(issued.token(), row.getTokenHash());
        assertEquals(64, row.getTokenHash().length());
        assertFalse(row.getTokenHash().contains(issued.token()));
        assertEquals(RegistrationProofService.hash(issued.token()), row.getTokenHash());
    }

    @Test
    void everyIssuedTokenIsDifferent() {
        Set<String> tokens = new HashSet<>();
        for (int i = 0; i < 200; i++) {
            tokens.add(service.issueForRegistration("9" + String.format("%09d", i)).token());
        }
        assertEquals(200, tokens.size());
    }

    @Test
    void reissuingReplacesTheEarlierUnspentProof() {
        String first = service.issueForRegistration(MOBILE).token();
        String second = service.issueForRegistration(MOBILE).token();

        assertEquals(1, store.rows.size());
        assertEquals(RegistrationProofException.INVALID, codeOf(() -> service.consumeForRegistration(MOBILE, first)));
        service.consumeForRegistration(MOBILE, second);
    }

    // ---- accepting --------------------------------------------------------------------------

    @Test
    void aValidProofIsAcceptedOnceForItsNumber() {
        String token = service.issueForRegistration(MOBILE).token();

        service.consumeForRegistration(MOBILE, token);

        assertNotNull(store.rows.get(0).getConsumedAt());
    }

    @Test
    void aProofIsStillValidJustBeforeItExpires() {
        String token = service.issueForRegistration(MOBILE).token();
        clock.advance(Duration.ofMinutes(30).minusSeconds(1));

        service.consumeForRegistration(MOBILE, token);
    }

    // ---- rejecting --------------------------------------------------------------------------

    @Test
    void aMissingProofIsRejected() {
        service.issueForRegistration(MOBILE);

        assertEquals(RegistrationProofException.REQUIRED, codeOf(() -> service.consumeForRegistration(MOBILE, null)));
        assertEquals(RegistrationProofException.REQUIRED, codeOf(() -> service.consumeForRegistration(MOBILE, "")));
        assertEquals(RegistrationProofException.REQUIRED, codeOf(() -> service.consumeForRegistration(MOBILE, "   ")));
        assertNull(store.rows.get(0).getConsumedAt());
    }

    @Test
    void anInvalidProofIsRejected() {
        service.issueForRegistration(MOBILE);

        assertEquals(RegistrationProofException.INVALID,
                codeOf(() -> service.consumeForRegistration(MOBILE, "not-a-real-proof")));
        assertNull(store.rows.get(0).getConsumedAt());
    }

    @Test
    void aProofForAnotherNumberIsRejectedAndNotSpent() {
        String token = service.issueForRegistration(MOBILE).token();

        assertEquals(RegistrationProofException.MOBILE_MISMATCH,
                codeOf(() -> service.consumeForRegistration("9123456789", token)));

        assertNull(store.rows.get(0).getConsumedAt(), "a mismatched attempt must not burn the real owner's proof");
        service.consumeForRegistration(MOBILE, token);
    }

    @Test
    void aProofIssuedForADifferentFlowIsRejected() {
        String token = service.issueForRegistration(MOBILE).token();
        store.rows.get(0).setPurpose("PASSCODE_RESET");

        assertEquals(RegistrationProofException.MOBILE_MISMATCH,
                codeOf(() -> service.consumeForRegistration(MOBILE, token)));
    }

    @Test
    void anExpiredProofIsRejected() {
        String token = service.issueForRegistration(MOBILE).token();
        clock.advance(Duration.ofMinutes(30));

        assertEquals(RegistrationProofException.EXPIRED, codeOf(() -> service.consumeForRegistration(MOBILE, token)));
    }

    @Test
    void aSpentProofCannotBeUsedAgain() {
        String token = service.issueForRegistration(MOBILE).token();
        service.consumeForRegistration(MOBILE, token);

        assertEquals(RegistrationProofException.ALREADY_USED,
                codeOf(() -> service.consumeForRegistration(MOBILE, token)));
    }

    @Test
    void aSpentProofCannotBeUsedForAnotherNumberEither() {
        String token = service.issueForRegistration(MOBILE).token();
        service.consumeForRegistration(MOBILE, token);

        assertEquals(RegistrationProofException.MOBILE_MISMATCH,
                codeOf(() -> service.consumeForRegistration("9123456789", token)));
    }

    @Test
    void aNewVerificationAfterRegistrationGetsItsOwnProof() {
        String first = service.issueForRegistration(MOBILE).token();
        service.consumeForRegistration(MOBILE, first);

        String second = service.issueForRegistration(MOBILE).token();

        assertNotEquals(first, second);
        service.consumeForRegistration(MOBILE, second);
        assertTrue(store.rows.stream().allMatch(r -> r.getConsumedAt() != null));
    }

    // ---- concurrency ------------------------------------------------------------------------

    @Test
    void ofManyConcurrentUsesExactlyOneSucceeds() throws Exception {
        String token = service.issueForRegistration(MOBILE).token();
        int threads = 40;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch ready = new CountDownLatch(threads);
        CountDownLatch go = new CountDownLatch(1);
        List<Future<String>> results = new ArrayList<>();
        for (int i = 0; i < threads; i++) {
            results.add(pool.submit(() -> {
                ready.countDown();
                go.await();
                try {
                    service.consumeForRegistration(MOBILE, token);
                    return "ok";
                } catch (RegistrationProofException e) {
                    return e.getCode();
                }
            }));
        }
        ready.await();
        go.countDown();
        int ok = 0;
        for (Future<String> result : results) {
            String outcome = result.get();
            if (outcome.equals("ok")) {
                ok++;
            } else {
                assertEquals(RegistrationProofException.ALREADY_USED, outcome);
            }
        }
        pool.shutdownNow();

        assertEquals(1, ok);
    }
}
