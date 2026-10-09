package com.taxedge.security.otp.proof;

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
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory stand-in for the proof table. {@code consume} is synchronized so it behaves like the
 * database's single conditional UPDATE (one caller wins); the real row-level atomicity is the
 * database's and is not exercised by these unit tests.
 */
public final class RegistrationProofTestSupport {

    private RegistrationProofTestSupport() {
    }

    public static final class MutableClock extends Clock {
        private volatile Instant now;

        public MutableClock(Instant start) {
            this.now = start;
        }

        public void advance(Duration duration) {
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

    public static final class Store {
        public final List<RegistrationProof> rows = new ArrayList<>();
        public final RegistrationProofRepository repository = mock(RegistrationProofRepository.class);
        private final AtomicLong ids = new AtomicLong();

        public Store() {
            when(repository.save(any(RegistrationProof.class))).thenAnswer(inv -> {
                RegistrationProof proof = inv.getArgument(0);
                synchronized (rows) {
                    proof.setId(ids.incrementAndGet());
                    rows.add(proof);
                }
                return proof;
            });
            when(repository.findByTokenHash(anyString())).thenAnswer(inv -> {
                synchronized (rows) {
                    return rows.stream().filter(r -> r.getTokenHash().equals(inv.getArgument(0))).findFirst();
                }
            });
            when(repository.deleteUnspent(anyString(), anyString())).thenAnswer(inv -> {
                synchronized (rows) {
                    int before = rows.size();
                    rows.removeIf(r -> r.getMobileNumber().equals(inv.getArgument(0))
                            && r.getPurpose().equals(inv.getArgument(1)) && r.getConsumedAt() == null);
                    return before - rows.size();
                }
            });
            when(repository.consume(anyString(), anyString(), anyString(), any(Instant.class))).thenAnswer(inv -> {
                String hash = inv.getArgument(0);
                String mobile = inv.getArgument(1);
                String purpose = inv.getArgument(2);
                Instant now = inv.getArgument(3);
                synchronized (rows) {
                    Optional<RegistrationProof> match = rows.stream()
                            .filter(r -> r.getTokenHash().equals(hash) && r.getMobileNumber().equals(mobile)
                                    && r.getPurpose().equals(purpose) && r.getConsumedAt() == null
                                    && r.getExpiresAt().isAfter(now))
                            .findFirst();
                    match.ifPresent(r -> r.setConsumedAt(now));
                    return match.isPresent() ? 1 : 0;
                }
            });
        }
    }
}
