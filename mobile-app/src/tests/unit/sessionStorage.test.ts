/// <reference types="node" />
/**
 * Regression tests for H5: session metadata security.
 * Session (isLoggedIn, activeMobile) must be stored in SecureStore, never AsyncStorage.
 *
 * Run with:
 *   node scripts/run-session-storage-tests.cjs
 */
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";

// ── Harness injected by the test runner ──────────────────────────────────────
interface Harness {
  secureStore: Map<string, string>;
  asyncStore:  Map<string, string>;
  logs:        string[];
  freshLaunch: () => void;
}
const harness = (globalThis as unknown as { __sessionStorageTest: Harness }).__sessionStorageTest;

// ── Module loaders ───────────────────────────────────────────────────────────
type AS = typeof import("../../modules/authentication/services/authStorage");

let authStorage: AS["authStorage"];

async function freshModules(): Promise<void> {
  harness.freshLaunch();
  harness.secureStore.clear();
  harness.asyncStore.clear();
  harness.logs.length = 0;
  authStorage = (await import("../../modules/authentication/services/authStorage")).authStorage;
}

beforeEach(async () => {
  await freshModules();
});

// ── T1: isLoggedIn never written to AsyncStorage ─────────────────────────────
test("T1: saveSession never writes session data to AsyncStorage", async () => {
  authStorage.saveSession({ isLoggedIn: true, activeMobile: "9876543210", lastLoginAt: null });

  await new Promise<void>((resolve) => setTimeout(resolve, 30));

  const sessionInAsync = harness.asyncStore.get("taxEdgeDevSession");
  assert.equal(
    sessionInAsync,
    undefined,
    "taxEdgeDevSession must not appear in AsyncStorage after saveSession",
  );

  // No AsyncStorage key at all that looks like a session
  const allAsyncKeys = [...harness.asyncStore.keys()];
  const sessionKeys = allAsyncKeys.filter(
    (k) => k.toLowerCase().includes("session") || k.toLowerCase().includes("isloggedin"),
  );
  assert.equal(
    sessionKeys.length,
    0,
    `Session keys must not appear in AsyncStorage; found: ${sessionKeys.join(", ")}`,
  );
});

// ── T2: Session stored in SecureStore ────────────────────────────────────────
test("T2: saveSession writes session data to SecureStore", async () => {
  authStorage.saveSession({ isLoggedIn: true, activeMobile: "9876543210", lastLoginAt: null });

  await new Promise<void>((resolve) => setTimeout(resolve, 30));

  const secureKeys = [...harness.secureStore.keys()];
  const hasSessionKey = secureKeys.some((k) => k.includes("session_metadata"));
  assert.ok(
    hasSessionKey,
    `Session must be in SecureStore; found keys: ${secureKeys.join(", ")}`,
  );

  const raw = harness.secureStore.get("taxedge_secure_session_metadata");
  assert.ok(raw, "taxedge_secure_session_metadata must be set in SecureStore");
  const parsed = JSON.parse(raw!);
  assert.equal(parsed.isLoggedIn, true);
  assert.equal(parsed.activeMobile, "9876543210");
});

// ── T3: initAsync correctly restores authenticated session from SecureStore ──
test("T3: initAsync restores an authenticated session from SecureStore", async () => {
  const sessionJson = JSON.stringify({ isLoggedIn: true, activeMobile: "9876543210", lastLoginAt: "2026-01-01" });
  harness.secureStore.set("taxedge_secure_session_metadata", sessionJson);

  await authStorage.initAsync();

  const session = authStorage.getSession();
  assert.equal(session.isLoggedIn, true, "isLoggedIn must be true after initAsync from SecureStore");
  assert.equal(session.activeMobile, "9876543210", "activeMobile must be restored from SecureStore");
});

// ── T4: Missing secure session → logged-out state ────────────────────────────
test("T4: missing session in SecureStore yields logged-out default", async () => {
  await authStorage.initAsync();

  const session = authStorage.getSession();
  assert.equal(session.isLoggedIn, false, "isLoggedIn must be false when no session is stored");
  assert.equal(session.activeMobile, null, "activeMobile must be null when no session is stored");
});

// ── T5: clearSession marks session as logged out in SecureStore ──────────────
test("T5: clearSession writes logged-out state to SecureStore", async () => {
  authStorage.saveSession({ isLoggedIn: true, activeMobile: "9999999999", lastLoginAt: null });
  await new Promise<void>((resolve) => setTimeout(resolve, 20));

  authStorage.clearSession();
  await new Promise<void>((resolve) => setTimeout(resolve, 20));

  const session = authStorage.getSession();
  assert.equal(session.isLoggedIn, false, "clearSession must mark isLoggedIn as false");

  const secureSessionRaw = harness.secureStore.get("taxedge_secure_session_metadata");
  assert.ok(secureSessionRaw, "Cleared session must still be persisted in SecureStore");
  const secureSession = JSON.parse(secureSessionRaw!);
  assert.equal(secureSession.isLoggedIn, false, "SecureStore session must have isLoggedIn: false");
  assert.equal(secureSession.activeMobile, null, "SecureStore session must have activeMobile: null");
});

// ── T6: Migration copies stale AsyncStorage session to SecureStore ───────────
test("T6: initAsync migrates stale session from AsyncStorage to SecureStore", async () => {
  const legacySession = JSON.stringify({ isLoggedIn: true, activeMobile: "8888888888", lastLoginAt: "2025-12-01" });
  harness.asyncStore.set("taxEdgeDevSession", legacySession);

  await authStorage.initAsync();

  const secureSessionRaw = harness.secureStore.get("taxedge_secure_session_metadata");
  assert.ok(secureSessionRaw, "Migrated session must appear in SecureStore after initAsync");
  const secureSession = JSON.parse(secureSessionRaw!);
  assert.equal(secureSession.activeMobile, "8888888888", "Migrated session must carry the correct activeMobile");
  assert.equal(secureSession.isLoggedIn, true, "Migrated session must carry the isLoggedIn value");
});

// ── T7: After migration, stale AsyncStorage session is removed ───────────────
test("T7: initAsync removes stale AsyncStorage session after migrating to SecureStore", async () => {
  harness.asyncStore.set(
    "taxEdgeDevSession",
    JSON.stringify({ isLoggedIn: true, activeMobile: "7777777777", lastLoginAt: null }),
  );

  await authStorage.initAsync();

  const staleKey = harness.asyncStore.get("taxEdgeDevSession");
  assert.equal(staleKey, undefined, "taxEdgeDevSession must be removed from AsyncStorage after migration");
});

// ── T8: Injected AsyncStorage cannot override existing SecureStore session ───
test("T8: injected AsyncStorage session cannot override an existing SecureStore session", async () => {
  // SecureStore already has a logged-out session (from a previous proper logout)
  harness.secureStore.set(
    "taxedge_secure_session_metadata",
    JSON.stringify({ isLoggedIn: false, activeMobile: null, lastLoginAt: null }),
  );

  // Attacker injects a session into AsyncStorage
  harness.asyncStore.set(
    "taxEdgeDevSession",
    JSON.stringify({ isLoggedIn: true, activeMobile: "6666666666" }),
  );

  await authStorage.initAsync();

  const session = authStorage.getSession();
  assert.equal(
    session.isLoggedIn,
    false,
    "AsyncStorage injection must not override the existing SecureStore session",
  );
  assert.equal(
    session.activeMobile,
    null,
    "activeMobile must remain null after injection attempt",
  );
});

// ── T9: App restart after logout remains logged out ──────────────────────────
test("T9: app restart after logout remains logged out", async () => {
  // Save a logged-in session to SecureStore
  authStorage.saveSession({ isLoggedIn: true, activeMobile: "5555555555", lastLoginAt: null });
  await new Promise<void>((resolve) => setTimeout(resolve, 20));

  // Logout — writes logged-out state to SecureStore
  authStorage.clearSession();
  await new Promise<void>((resolve) => setTimeout(resolve, 20));

  // Capture SecureStore state before fresh module load
  const secureSnap = new Map(harness.secureStore);

  // Simulate app restart: fresh module cache (memory cleared), but SecureStore persists
  harness.freshLaunch();
  harness.asyncStore.clear();
  harness.logs.length = 0;
  // Restore the persisted SecureStore content
  harness.secureStore.clear();
  for (const [k, v] of secureSnap) harness.secureStore.set(k, v);

  authStorage = (await import("../../modules/authentication/services/authStorage")).authStorage;
  await authStorage.initAsync();

  const session = authStorage.getSession();
  assert.equal(session.isLoggedIn, false, "After logout + restart, isLoggedIn must remain false");
  assert.equal(session.activeMobile, null, "activeMobile must remain null after restart");
});

// ── T10: clearAllAuthData removes session from SecureStore ───────────────────
test("T10: clearAllAuthData removes session from SecureStore", async () => {
  authStorage.saveSession({ isLoggedIn: true, activeMobile: "4444444444", lastLoginAt: null });
  await new Promise<void>((resolve) => setTimeout(resolve, 20));

  authStorage.clearAllAuthData();
  await new Promise<void>((resolve) => setTimeout(resolve, 20));

  const secureKeys = [...harness.secureStore.keys()];
  const hasSessionKey = secureKeys.some((k) => k.includes("session_metadata"));
  assert.equal(hasSessionKey, false, "Session must be removed from SecureStore after clearAllAuthData");
});

// ── T11: User profile map stays in AsyncStorage (not auth-sensitive) ─────────
test("T11: saveUser writes user profile to AsyncStorage, not SecureStore", async () => {
  authStorage.saveUser({
    mobileNumber: "3333333333",
    customerId:   "CUST-001",
    name:         "Test User",
    email:        "test@example.com",
    customerType: "Individual",
  });
  await new Promise<void>((resolve) => setTimeout(resolve, 30));

  const userMapInAsync = harness.asyncStore.get("taxEdgeDevUsersMap");
  assert.ok(userMapInAsync, "User profile map must be stored in AsyncStorage");
  const map = JSON.parse(userMapInAsync!);
  assert.ok(map["3333333333"], "Saved user must appear in the AsyncStorage users map");

  const secureKeys = [...harness.secureStore.keys()];
  const hasUserData = secureKeys.some((k) => k.includes("User") || k.includes("user"));
  assert.equal(hasUserData, false, "User profile data must NOT be stored in SecureStore");
});

// ── T12: No sensitive session info appears in log output ─────────────────────
test("T12: no sensitive session data (isLoggedIn, activeMobile) appears in log output", async () => {
  authStorage.saveSession({ isLoggedIn: true, activeMobile: "9876543210", lastLoginAt: null });
  authStorage.clearSession();
  authStorage.saveUser({
    mobileNumber: "9876543210",
    customerId:   "C1",
    name:         "Name",
    email:        "e@e.com",
    customerType: "Individual",
  });
  await new Promise<void>((resolve) => setTimeout(resolve, 30));

  const sensitivePatterns: RegExp[] = [
    /isLoggedIn.*true/,
    /activeMobile.*\d{10}/,
    /"isLoggedIn"\s*:\s*true/,
  ];
  for (const pattern of sensitivePatterns) {
    const found = harness.logs.find((line) => pattern.test(line));
    assert.equal(
      found,
      undefined,
      `Sensitive pattern ${pattern} must not appear in logs; found: ${found ?? "none"}`,
    );
  }
});
