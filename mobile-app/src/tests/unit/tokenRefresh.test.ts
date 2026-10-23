/// <reference types="node" />
/**
 * Regression tests for the 401 token-refresh interceptor (H3 production fix).
 *
 * Run with:
 *   node scripts/run-token-refresh-tests.cjs
 *
 * Tests exercise the real tokenManager, tokenRefreshManager, and apiClient
 * against a scripted fetch queue — no mocking of the auth layer itself.
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
const harness = (globalThis as unknown as { __tokenRefreshTest: Harness }).__tokenRefreshTest;

// ── Controllable clock ───────────────────────────────────────────────────────
const BASE_SEC = 1_700_000_000;
let nowSec = BASE_SEC;
Date.now = () => nowSec * 1000;
const validExp   = () => nowSec + 3600;   // 1 h from now
const _expiredExp = () => nowSec - 60;    // 1 min ago

// ── JWT builder (real Base64URL structure the tokenManager can parse) ────────
function makeJwt(expSeconds: number): string {
  const enc = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString("base64url");
  const header  = enc({ alg: "HS256", typ: "JWT" });
  const payload = enc({ sub: "test-user", exp: expSeconds, iat: expSeconds - 3600 });
  return `${header}.${payload}.fakesig`;
}

// ── Scripted fetch queue ─────────────────────────────────────────────────────
interface ScriptedResp { status: number; body: unknown }
const queue: ScriptedResp[] = [];
const captured: { url: string; method: string; headers: Record<string, string>; body: unknown }[] = [];

(globalThis as unknown as { fetch: unknown }).fetch = async (
  url: string,
  init?: { method?: string; headers?: Record<string, string>; body?: string },
) => {
  captured.push({
    url,
    method: init?.method ?? "GET",
    headers: init?.headers ?? {},
    body: init?.body
      ? (() => { try { return JSON.parse(init.body!); } catch { return init.body; } })()
      : undefined,
  });
  const next = queue.shift();
  if (!next) throw new Error(`No scripted response queued for ${url}`);
  const text = typeof next.body === "string" ? next.body : JSON.stringify(next.body);
  return {
    ok: next.status >= 200 && next.status < 300,
    status: next.status,
    statusText: String(next.status),
    headers: { get: (_h: string) => null },
    text:  async () => text,
    json:  async () => JSON.parse(text),
  };
};

const reply    = (status: number, body: unknown) => queue.push({ status, body });
const replyOk  = (body: unknown) => reply(200, body);
const reply401 = () => reply(401, { message: "Unauthorized", code: "TOKEN_EXPIRED" });
const newTokens = (suffix = "") => ({
  accessToken:  makeJwt(validExp() + 5000),
  refreshToken: `refresh-new${suffix}`,
  tokenType:    "Bearer",
});

// ── Module loaders ───────────────────────────────────────────────────────────
type TM  = typeof import("../../core/authentication/tokenManager");
type TRM = typeof import("../../core/authentication/tokenRefreshManager");
type API = typeof import("../../core/api/apiClient");
type ERR = typeof import("../../core/api/apiError");

let tokenManager:        TM["tokenManager"];
let tokenRefreshManager: TRM["tokenRefreshManager"];
let apiClient:           API["apiClient"];
let ApiError:            ERR["ApiError"];

async function freshModules(): Promise<void> {
  harness.freshLaunch();
  queue.length    = 0;
  captured.length = 0;
  harness.secureStore.clear();
  harness.asyncStore.clear();

  tokenManager        = (await import("../../core/authentication/tokenManager")).tokenManager;
  tokenRefreshManager = (await import("../../core/authentication/tokenRefreshManager")).tokenRefreshManager;
  apiClient           = (await import("../../core/api/apiClient")).apiClient;
  ApiError            = (await import("../../core/api/apiError")).ApiError;
}

beforeEach(async () => {
  nowSec = BASE_SEC;
  await freshModules();
});

// ────────────────────────────────────────────────────────────────────────────
// T1 — Normal request attaches the current access token
// ────────────────────────────────────────────────────────────────────────────
test("T1: normal API request attaches the current access token", async () => {
  const access = makeJwt(validExp());
  await tokenManager.setAccessToken(access);
  await tokenManager.setRefreshToken("refresh-ok");

  replyOk({ data: "hello" });
  await apiClient.get("/api/hello");

  const req = captured[0];
  assert.ok(req, "Expected a request to be made");
  assert.equal(req.headers["Authorization"], `Bearer ${access}`);
});

// ────────────────────────────────────────────────────────────────────────────
// T2 — 401 triggers exactly one refresh
// ────────────────────────────────────────────────────────────────────────────
test("T2: a 401 triggers exactly one refresh request", async () => {
  await tokenManager.setAccessToken(makeJwt(validExp()));
  await tokenManager.setRefreshToken("refresh-original");

  reply401();
  replyOk(newTokens());
  replyOk({ ok: true });

  await apiClient.get("/api/protected");

  const refreshCalls = captured.filter(r => r.url.includes("/auth/refresh"));
  assert.equal(refreshCalls.length, 1, "Exactly one /auth/refresh call expected");
});

// ────────────────────────────────────────────────────────────────────────────
// T3 — Successful refresh retries the original request
// ────────────────────────────────────────────────────────────────────────────
test("T3: successful refresh retries the original request and returns its result", async () => {
  await tokenManager.setAccessToken(makeJwt(validExp()));
  await tokenManager.setRefreshToken("refresh-original");

  reply401();
  replyOk(newTokens());
  replyOk({ result: "retried-success" });

  const result = await apiClient.get<{ result: string }>("/api/data");
  assert.equal(result.result, "retried-success");

  // 3 total calls: original, refresh, retry
  assert.equal(captured.length, 3);
});

// ────────────────────────────────────────────────────────────────────────────
// T4 — Retry uses the new access token, not the old one
// ────────────────────────────────────────────────────────────────────────────
test("T4: the retried request carries the new access token", async () => {
  const oldAccess = makeJwt(validExp());
  const freshResp  = newTokens();

  await tokenManager.setAccessToken(oldAccess);
  await tokenManager.setRefreshToken("refresh-original");

  reply401();
  replyOk(freshResp);
  replyOk({ ok: true });

  await apiClient.get("/api/check-token");

  // The last captured request is the retry
  const retryReq = captured[captured.length - 1];
  assert.equal(
    retryReq.headers["Authorization"],
    `Bearer ${freshResp.accessToken}`,
    "Retry must carry the NEW access token",
  );
  assert.notEqual(
    retryReq.headers["Authorization"],
    `Bearer ${oldAccess}`,
    "Retry must NOT carry the OLD access token",
  );
});

// ────────────────────────────────────────────────────────────────────────────
// T5 — Second 401 on retry does NOT trigger another refresh (no infinite loop)
// ────────────────────────────────────────────────────────────────────────────
test("T5: a 401 on the retried request does not trigger a second refresh", async () => {
  await tokenManager.setAccessToken(makeJwt(validExp()));
  await tokenManager.setRefreshToken("refresh-ok");

  reply401();           // original → 401
  replyOk(newTokens()); // refresh  → ok
  reply401();           // retry    → 401 again

  await assert.rejects(
    () => apiClient.get("/api/protected"),
    (err: unknown) => {
      assert.ok(err instanceof ApiError, "Should throw ApiError");
      assert.equal((err as InstanceType<typeof ApiError>).statusCode, 401);
      return true;
    },
  );

  const refreshCalls = captured.filter(r => r.url.includes("/auth/refresh"));
  assert.equal(refreshCalls.length, 1, "Must NOT refresh more than once");
});

// ────────────────────────────────────────────────────────────────────────────
// T6 — Refresh failure fires sessionExpiredListener (clears tokens + notifies)
// ────────────────────────────────────────────────────────────────────────────
test("T6: refresh failure fires the session-expired listener and clears tokens", async () => {
  let sessionExpiredFired = false;
  tokenRefreshManager.onSessionExpired(() => { sessionExpiredFired = true; });

  await tokenManager.setAccessToken(makeJwt(validExp()));
  await tokenManager.setRefreshToken("expired-refresh");

  reply401();                                           // original → 401
  reply(401, { message: "Refresh token expired" });    // /auth/refresh → 401

  await assert.rejects(
    () => apiClient.get("/api/secure"),
    (err: unknown) => err instanceof ApiError && (err as InstanceType<typeof ApiError>).statusCode === 401,
  );

  // Allow the async token-clear inside handleSessionExpired to complete
  await new Promise<void>(resolve => setTimeout(resolve, 20));

  assert.equal(sessionExpiredFired, true, "Session expired listener must be called");
  assert.equal(await tokenManager.getAccessToken(),  null, "Access token must be cleared");
  assert.equal(await tokenManager.getRefreshToken(), null, "Refresh token must be cleared");
});

// ────────────────────────────────────────────────────────────────────────────
// T7 — Concurrent 401 requests share exactly one refresh operation
// ────────────────────────────────────────────────────────────────────────────
test("T7: concurrent 401 requests share exactly one /auth/refresh call", async () => {
  await tokenManager.setAccessToken(makeJwt(validExp()));
  await tokenManager.setRefreshToken("shared-refresh");

  // 3 original requests → 401
  reply401();
  reply401();
  reply401();
  // 1 shared refresh → ok
  replyOk(newTokens("-shared"));
  // 3 retries → ok
  replyOk({ i: 1 });
  replyOk({ i: 2 });
  replyOk({ i: 3 });

  await Promise.all([
    apiClient.get("/api/r1"),
    apiClient.get("/api/r2"),
    apiClient.get("/api/r3"),
  ]);

  const refreshCalls = captured.filter(r => r.url.includes("/auth/refresh"));
  assert.equal(refreshCalls.length, 1, "Concurrent 401s must share exactly one refresh");
});

// ────────────────────────────────────────────────────────────────────────────
// T8 — Tokens are never written to AsyncStorage
// ────────────────────────────────────────────────────────────────────────────
test("T8: tokens are stored in SecureStore, never in AsyncStorage", async () => {
  await tokenManager.setAccessToken(makeJwt(validExp()));
  await tokenManager.setRefreshToken("refresh-sec");

  // Trigger a refresh so new tokens are stored
  reply401();
  replyOk(newTokens("-async-check"));
  replyOk({ ok: true });
  await apiClient.get("/api/any");

  // AsyncStorage must contain no auth token values
  const asyncKeys = [...harness.asyncStore.keys()];
  const tokenKeys = asyncKeys.filter(
    k => k.toLowerCase().includes("token") ||
         k.toLowerCase().includes("access") ||
         k.toLowerCase().includes("refresh") ||
         k.toLowerCase().includes("auth_"),
  );
  assert.equal(
    tokenKeys.length,
    0,
    `Tokens must not be in AsyncStorage; found keys: ${tokenKeys.join(", ")}`,
  );

  // SecureStore must contain the token keys
  const secKeys = [...harness.secureStore.keys()];
  assert.ok(
    secKeys.some(k => k.includes("token")),
    `Tokens must be in SecureStore; found keys: ${secKeys.join(", ")}`,
  );
});

// ────────────────────────────────────────────────────────────────────────────
// T9 — Auth/public endpoints never trigger a silent refresh on 401
// ────────────────────────────────────────────────────────────────────────────
test("T9: 401 on auth endpoints does not trigger a refresh (loop prevention)", async () => {
  await tokenManager.setAccessToken(makeJwt(validExp()));
  await tokenManager.setRefreshToken("refresh-ok");

  // /auth/refresh itself returning 401 must not cause another refresh call
  reply(401, { message: "Token invalid" });

  await assert.rejects(
    () => apiClient.post("/auth/refresh", { refreshToken: "some-tok" }),
    (err: unknown) => err instanceof ApiError && (err as InstanceType<typeof ApiError>).statusCode === 401,
  );

  // Only the one explicitly-made call to /auth/refresh — no auto-retry
  const refreshCalls = captured.filter(
    r => r.url.includes("/auth/refresh") && r.method === "POST",
  );
  assert.equal(refreshCalls.length, 1, "Must not auto-retry on /auth/refresh");
});

// ────────────────────────────────────────────────────────────────────────────
// T10 — Successful request makes exactly one network call (no spurious refresh)
// ────────────────────────────────────────────────────────────────────────────
test("T10: a successful API request makes exactly one network call", async () => {
  await tokenManager.setAccessToken(makeJwt(validExp()));
  await tokenManager.setRefreshToken("refresh-ok");

  replyOk({ data: "fine" });
  await apiClient.get("/api/fine");

  assert.equal(captured.length, 1, "Exactly one network call for a 200 response");
  assert.ok(!captured[0].url.includes("/auth/refresh"), "No refresh on success");
});
