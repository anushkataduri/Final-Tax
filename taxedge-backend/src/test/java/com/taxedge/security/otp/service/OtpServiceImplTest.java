package com.taxedge.security.otp.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.junit.jupiter.api.BeforeEach;
import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.SimpleTransactionStatus;
import org.springframework.transaction.support.TransactionTemplate;

import com.taxedge.security.otp.config.OtpProperties;
import com.taxedge.security.otp.entity.Otp;
import com.taxedge.security.otp.policy.InvalidMobileNumberException;
import com.taxedge.security.otp.repository.OtpRepository;
import com.taxedge.shared.concurrency.KeyedLock;

/**
 * Behaviour of the server-side OTP limits. The repository is an in-memory fake and the clock is
 * controllable; row-level database locking is not exercised here (see the in-JVM lock tests).
 */
class OtpServiceImplTest {

    private static final String MOBILE = "9876543210";

    private MutableClock clock;
    private Map<String, Otp> rows;
    private OtpRepository repository;
    private OtpProperties properties;
    private KeyedLock keyedLock;
    private TransactionTemplate transactionTemplate;
    private OtpServiceImpl service;

    @BeforeEach
    void setUp() {
        clock = new MutableClock(Instant.parse("2026-01-01T10:00:00Z"));
        rows = new ConcurrentHashMap<>();
        repository = fakeRepository(rows);
        properties = new OtpProperties();
        keyedLock = new KeyedLock();

        PlatformTransactionManager txManager = mock(PlatformTransactionManager.class);
        when(txManager.getTransaction(any())).thenAnswer(inv -> new SimpleTransactionStatus());
        transactionTemplate = new TransactionTemplate(txManager);

        service = newService();
    }

    private OtpServiceImpl newService() {
        return new OtpServiceImpl(repository, properties, clock, keyedLock, transactionTemplate);
    }

    // ---- BUG-OTP-001: lock after 3 wrong attempts for 15 minutes ----------------------------

    @Test
    void locksAfterThreeWrongAttemptsFor15Minutes() {
        sendOtp();
        String wrong = differentFrom(currentCode());

        OtpVerifyResult first = service.verifyOtp(MOBILE, wrong);
        OtpVerifyResult second = service.verifyOtp(MOBILE, wrong);
        OtpVerifyResult third = service.verifyOtp(MOBILE, wrong);

        assertEquals(OtpVerifyResult.Status.INVALID, first.status());
        assertEquals(2, first.remainingAttempts());
        assertEquals(OtpVerifyResult.Status.INVALID, second.status());
        assertEquals(1, second.remainingAttempts());
        assertEquals(OtpVerifyResult.Status.LOCKED, third.status());
        assertEquals(Duration.ofMinutes(15).toSeconds(), third.retryAfterSeconds());
    }

    @Test
    void correctOtpIsRejectedWhileLocked() {
        sendOtp();
        String originalCode = currentCode();
        lockByWrongAttempts(originalCode);

        OtpVerifyResult result = service.verifyOtp(MOBILE, originalCode);

        assertEquals(OtpVerifyResult.Status.LOCKED, result.status());
    }

    @Test
    void lockedRefusalsAreNotCounted_andReportShrinkingRetryTime() {
        sendOtp();
        lockByWrongAttempts(currentCode());

        clock.advance(Duration.ofMinutes(10));
        OtpVerifyResult during = service.verifyOtp(MOBILE, "000000");

        assertEquals(OtpVerifyResult.Status.LOCKED, during.status());
        assertEquals(Duration.ofMinutes(5).toSeconds(), during.retryAfterSeconds());
    }

    @Test
    void stillLockedOneSecondBeforeExpiry_unlockedAtExpiry() {
        sendOtp();
        lockByWrongAttempts(currentCode());

        clock.advance(Duration.ofMinutes(15).minusSeconds(1));
        assertEquals(OtpVerifyResult.Status.LOCKED, service.verifyOtp(MOBILE, "000000").status());

        clock.advance(Duration.ofSeconds(1));
        OtpVerifyResult atExpiry = service.verifyOtp(MOBILE, "000000");
        assertEquals(OtpVerifyResult.Status.INVALID, atExpiry.status());
        assertEquals(2, atExpiry.remainingAttempts());
    }

    @Test
    void oldCodeIsDeadAfterLockoutExpires_freshOtpWorks() {
        sendOtp();
        String originalCode = currentCode();
        lockByWrongAttempts(originalCode);

        clock.advance(Duration.ofMinutes(15));

        assertEquals(OtpVerifyResult.Status.INVALID, service.verifyOtp(MOBILE, originalCode).status());

        clock.advance(Duration.ofSeconds(31));
        sendOtp();
        assertEquals(OtpVerifyResult.Status.VERIFIED, service.verifyOtp(MOBILE, currentCode()).status());
    }

    @Test
    void successfulVerificationResetsTheFailureCounter() {
        sendOtp();
        String code = currentCode();
        service.verifyOtp(MOBILE, differentFrom(code));
        service.verifyOtp(MOBILE, differentFrom(code));

        assertEquals(OtpVerifyResult.Status.VERIFIED, service.verifyOtp(MOBILE, code).status());

        OtpVerifyResult next = service.verifyOtp(MOBILE, differentFrom(code));
        assertEquals(OtpVerifyResult.Status.INVALID, next.status());
        assertEquals(2, next.remainingAttempts());
    }

    @Test
    void failuresOlderThanTheLockoutWindowNoLongerCount() {
        sendOtp();
        String code = currentCode();
        service.verifyOtp(MOBILE, differentFrom(code));
        service.verifyOtp(MOBILE, differentFrom(code));

        clock.advance(Duration.ofMinutes(16));

        OtpVerifyResult result = service.verifyOtp(MOBILE, differentFrom(code));
        assertEquals(OtpVerifyResult.Status.INVALID, result.status());
        assertEquals(2, result.remainingAttempts());
    }

    @Test
    void nullOrMissingCodeCountsAsAFailedAttempt() {
        sendOtp();

        assertEquals(2, service.verifyOtp(MOBILE, null).remainingAttempts());
        assertEquals(1, service.verifyOtp(MOBILE, "").remainingAttempts());
        assertEquals(OtpVerifyResult.Status.LOCKED, service.verifyOtp(MOBILE, null).status());
    }

    // ---- Requesting a new OTP must not bypass a lockout --------------------------------------

    @Test
    void requestingANewOtpDuringLockoutIsRefusedAndDoesNotResetAttempts() {
        sendOtp();
        lockByWrongAttempts(currentCode());
        String codeAtLock = currentCode();

        clock.advance(Duration.ofMinutes(1));
        OtpSendResult resend = service.generateOtp(MOBILE);

        assertEquals(OtpSendResult.Status.LOCKED, resend.status());
        assertEquals(Duration.ofMinutes(14).toSeconds(), resend.retryAfterSeconds());
        assertEquals(codeAtLock, currentCode());
        assertEquals(OtpVerifyResult.Status.LOCKED, service.verifyOtp(MOBILE, codeAtLock).status());
    }

    @Test
    void resendingBetweenWrongAttemptsDoesNotResetTheCounter() {
        sendOtp();
        service.verifyOtp(MOBILE, differentFrom(currentCode()));
        service.verifyOtp(MOBILE, differentFrom(currentCode()));

        clock.advance(Duration.ofSeconds(31));
        sendOtp();

        OtpVerifyResult result = service.verifyOtp(MOBILE, differentFrom(currentCode()));
        assertEquals(OtpVerifyResult.Status.LOCKED, result.status());
    }

    // ---- BUG-OTP-003: resend rate limits -----------------------------------------------------

    @Test
    void secondRequestInsideTheCooldownIsRefused() {
        assertEquals(OtpSendResult.Status.SENT, service.generateOtp(MOBILE).status());
        String firstCode = currentCode();

        clock.advance(Duration.ofSeconds(10));
        OtpSendResult tooSoon = service.generateOtp(MOBILE);

        assertEquals(OtpSendResult.Status.RATE_LIMITED, tooSoon.status());
        assertEquals(20, tooSoon.retryAfterSeconds());
        assertEquals(firstCode, currentCode());

        clock.advance(Duration.ofSeconds(20));
        assertEquals(OtpSendResult.Status.SENT, service.generateOtp(MOBILE).status());
    }

    @Test
    void sixthRequestInAnHourIsRefusedUntilTheWindowEnds() {
        for (int i = 0; i < 5; i++) {
            assertEquals(OtpSendResult.Status.SENT, service.generateOtp(MOBILE).status(), "send " + (i + 1));
            clock.advance(Duration.ofSeconds(31));
        }

        OtpSendResult sixth = service.generateOtp(MOBILE);

        assertEquals(OtpSendResult.Status.RATE_LIMITED, sixth.status());
        long expected = Duration.ofHours(1).toSeconds() - 5 * 31;
        assertEquals(expected, sixth.retryAfterSeconds());

        clock.advance(Duration.ofSeconds(expected));
        assertEquals(OtpSendResult.Status.SENT, service.generateOtp(MOBILE).status());
    }

    @Test
    void limitsAreTrackedPerMobileNumber() {
        assertEquals(OtpSendResult.Status.SENT, service.generateOtp(MOBILE).status());
        assertEquals(OtpSendResult.Status.SENT, service.generateOtp("9123456789").status());
    }

    // ---- State is persisted, not held in memory ---------------------------------------------

    @Test
    void lockoutSurvivesARestartOfTheService() {
        sendOtp();
        String code = currentCode();
        lockByWrongAttempts(code);

        OtpServiceImpl restarted = newService();

        assertEquals(OtpVerifyResult.Status.LOCKED, restarted.verifyOtp(MOBILE, code).status());
        assertEquals(OtpSendResult.Status.LOCKED, restarted.generateOtp(MOBILE).status());
    }

    @Test
    void resendLimitSurvivesARestartOfTheService() {
        service.generateOtp(MOBILE);

        assertEquals(OtpSendResult.Status.RATE_LIMITED, newService().generateOtp(MOBILE).status());
    }

    @Test
    void rowsCreatedBeforeTheLimitColumnsExistStillWork() {
        rows.put(MOBILE, Otp.builder().id(1L).mobileNumber(MOBILE).otpCode("123456").build());

        assertEquals(OtpVerifyResult.Status.VERIFIED, service.verifyOtp(MOBILE, "123456").status());
        assertEquals(OtpSendResult.Status.SENT, service.generateOtp(MOBILE).status());
    }

    @Test
    void reportedDummyNumbersAreRejectedBeforeAnyOtpIsCreated() {
        for (String dummy : List.of("9999999999", "8888888888", "7777777777", "6666666666")) {
            assertThrows(InvalidMobileNumberException.class, () -> service.generateOtp(dummy));
            assertThrows(InvalidMobileNumberException.class, () -> service.verifyOtp(dummy, "123456"));
        }
        assertTrue(rows.isEmpty(), "no OTP row may be created for a rejected number");
    }

    @Test
    void malformedNumbersAreRejectedBeforeAnyOtpIsCreated() {
        for (String bad : List.of("+919876543210", "919876543210", "98765", "98765432101", "abcdefghij")) {
            assertThrows(InvalidMobileNumberException.class, () -> service.generateOtp(bad));
        }
        assertTrue(rows.isEmpty());
    }

    @Test
    void theOtpIsNotWrittenToTheLogByDefault() {
        Logger logger = (Logger) LoggerFactory.getLogger(OtpServiceImpl.class);
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        appender.start();
        logger.addAppender(appender);
        try {
            sendOtp();
            String code = currentCode();
            service.verifyOtp(MOBILE, "000000");

            assertTrue(appender.list.stream().noneMatch(e -> e.getFormattedMessage().contains(code)),
                    "the OTP must not appear in logs unless taxedge.otp.log-code is on");
        } finally {
            logger.detachAppender(appender);
        }
    }

    @Test
    void theOtpIsLoggedOnlyWhenTheDevelopmentFlagIsOn() {
        properties.setLogCode(true);
        Logger logger = (Logger) LoggerFactory.getLogger(OtpServiceImpl.class);
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        appender.start();
        logger.addAppender(appender);
        try {
            sendOtp();
            String code = currentCode();

            assertTrue(appender.list.stream().anyMatch(e -> e.getFormattedMessage().contains(code)));
        } finally {
            logger.detachAppender(appender);
        }
    }

    @Test
    void blankMobileNumberIsRejected() {
        assertThrows(IllegalArgumentException.class, () -> service.generateOtp(" "));
        assertThrows(IllegalArgumentException.class, () -> service.verifyOtp(null, "123456"));
    }

    // ---- Concurrency -------------------------------------------------------------------------

    @Test
    void parallelWrongAttemptsCannotExceedTheLimit() throws Exception {
        sendOtp();
        String wrong = differentFrom(currentCode());

        List<OtpVerifyResult> results = runInParallel(30, () -> service.verifyOtp(MOBILE, wrong));

        long invalid = results.stream().filter(r -> r.status() == OtpVerifyResult.Status.INVALID).count();
        long locked = results.stream().filter(r -> r.status() == OtpVerifyResult.Status.LOCKED).count();
        assertEquals(2, invalid, "only the first two wrong guesses may be reported as plain failures");
        assertEquals(28, locked);
        assertEquals(3, rows.get(MOBILE).getFailedAttempts());
    }

    @Test
    void parallelResendRequestsSendExactlyOneOtp() throws Exception {
        List<OtpSendResult> results = runInParallel(30, () -> service.generateOtp(MOBILE));

        assertEquals(1, results.stream().filter(r -> r.status() == OtpSendResult.Status.SENT).count());
        assertEquals(29, results.stream().filter(r -> r.status() == OtpSendResult.Status.RATE_LIMITED).count());
        assertEquals(1, rows.get(MOBILE).getSendCount());
    }

    @Test
    void parallelCorrectAndWrongGuessesStillHonourTheLimit() throws Exception {
        sendOtp();
        String right = currentCode();
        String wrong = differentFrom(right);

        List<OtpVerifyResult> results = new ArrayList<>(runInParallel(20, () -> service.verifyOtp(MOBILE, wrong)));
        results.addAll(runInParallel(5, () -> service.verifyOtp(MOBILE, right)));

        assertTrue(results.stream().noneMatch(r -> r.status() == OtpVerifyResult.Status.VERIFIED),
                "the right code must not get through once the wrong guesses have locked the number");
    }

    // ---- helpers -----------------------------------------------------------------------------

    private void sendOtp() {
        assertEquals(OtpSendResult.Status.SENT, service.generateOtp(MOBILE).status());
    }

    private void lockByWrongAttempts(String code) {
        String wrong = differentFrom(code);
        service.verifyOtp(MOBILE, wrong);
        service.verifyOtp(MOBILE, wrong);
        assertEquals(OtpVerifyResult.Status.LOCKED, service.verifyOtp(MOBILE, wrong).status());
    }

    private String currentCode() {
        return rows.get(MOBILE).getOtpCode();
    }

    private static String differentFrom(String code) {
        String candidate = "000000";
        assertNotEquals(candidate, code);
        return candidate;
    }

    private static <T> List<T> runInParallel(int threads, java.util.concurrent.Callable<T> task) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch ready = new CountDownLatch(threads);
        CountDownLatch go = new CountDownLatch(1);
        List<Future<T>> futures = new ArrayList<>();
        for (int i = 0; i < threads; i++) {
            futures.add(pool.submit(() -> {
                ready.countDown();
                go.await();
                return task.call();
            }));
        }
        ready.await();
        go.countDown();
        List<T> results = new ArrayList<>();
        for (Future<T> future : futures) {
            results.add(future.get());
        }
        pool.shutdownNow();
        return results;
    }

    private static OtpRepository fakeRepository(Map<String, Otp> rows) {
        OtpRepository repo = mock(OtpRepository.class);
        when(repo.findFirstByMobileNumberOrderByIdDesc(anyString()))
                .thenAnswer(inv -> Optional.ofNullable(rows.get((String) inv.getArgument(0))));
        when(repo.save(any(Otp.class))).thenAnswer(inv -> {
            Otp otp = inv.getArgument(0);
            rows.put(otp.getMobileNumber(), otp);
            return otp;
        });
        when(repo.saveAndFlush(any(Otp.class))).thenAnswer(inv -> {
            Otp otp = inv.getArgument(0);
            rows.put(otp.getMobileNumber(), otp);
            return otp;
        });
        return repo;
    }

    private static final class MutableClock extends Clock {
        private volatile Instant now;

        MutableClock(Instant start) {
            this.now = start;
        }

        void advance(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return now;
        }
    }
}
