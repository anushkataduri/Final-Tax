package com.taxedge.shared.concurrency;

import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Supplier;

import org.springframework.stereotype.Component;

/**
 * Serialises work per key inside this JVM (striped, so memory stays bounded).
 *
 * <p>Used around "read counter, decide, write counter" sequences so that concurrent requests for
 * the same mobile number cannot all pass a limit check before any of them records its attempt.
 * Callers must open their transaction <em>inside</em> {@link #withLock} so the commit happens
 * before the lock is released. Across several application instances the database row lock
 * (pessimistic write) provides the same guarantee.
 */
@Component
public class KeyedLock {

    private static final int DEFAULT_STRIPES = 256;

    private final ReentrantLock[] stripes;

    public KeyedLock() {
        this(DEFAULT_STRIPES);
    }

    public KeyedLock(int stripeCount) {
        this.stripes = new ReentrantLock[stripeCount];
        for (int i = 0; i < stripeCount; i++) {
            stripes[i] = new ReentrantLock();
        }
    }

    public <T> T withLock(String key, Supplier<T> action) {
        ReentrantLock lock = stripes[Math.floorMod(key.hashCode(), stripes.length)];
        lock.lock();
        try {
            return action.get();
        } finally {
            lock.unlock();
        }
    }
}
