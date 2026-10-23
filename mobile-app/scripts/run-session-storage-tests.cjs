/**
 * Test runner for the H5 session metadata security regression suite.
 *
 *   node scripts/run-session-storage-tests.cjs
 *
 * Runs the real authStorage service against scripted SecureStore and AsyncStorage fakes.
 * Only native-module stubs and the logger are replaced; the auth layer itself is exercised as-is.
 */
"use strict";
const Module = require("module");
const path   = require("path");
const fs     = require("fs");

const root = path.resolve(path.dirname(process.argv[1]), "..");
const SRC  = path.join(root, "src");
const ts   = require(path.join(root, "node_modules", "typescript"));

global.__DEV__ = false;
process.env.EXPO_PUBLIC_API_URL = "http://backend.test";

// ── TypeScript on the fly ─────────────────────────────────────────────────────
for (const ext of [".ts", ".tsx"]) {
  require.extensions[ext] = (module, filename) => {
    const out = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: {
        module:           ts.ModuleKind.CommonJS,
        target:           ts.ScriptTarget.ES2020,
        esModuleInterop:  true,
        jsx:              ts.JsxEmit.ReactJSX,
      },
    });
    module._compile(out.outputText, filename);
  };
}

for (const ext of [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]) {
  require.extensions[ext] = (module) => { module.exports = {}; };
}

// ── "@/" alias ────────────────────────────────────────────────────────────────
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith("@/")) {
    return origResolve.call(this, path.join(SRC, request.slice(2)), ...rest);
  }
  return origResolve.call(this, request, ...rest);
};

// ── Native-module fakes ───────────────────────────────────────────────────────
const secureStore = new Map();
const asyncStore  = new Map();

const asyncStorageFake = {
  getItem:    async (k) => asyncStore.get(k) ?? null,
  setItem:    async (k, v) => void asyncStore.set(k, String(v)),
  removeItem: async (k) => void asyncStore.delete(k),
  clear:      async () => asyncStore.clear(),
  getAllKeys:  async () => [...asyncStore.keys()],
};

const nativeFakes = {
  "react-native": {
    Platform:      { OS: "ios", select: (o) => o.ios ?? o.default },
    AppState:      { addEventListener: () => ({ remove() {} }) },
    StyleSheet:    { create: (s) => s, flatten: (s) => s },
    NativeModules: {},
  },
  "@react-native-async-storage/async-storage": {
    ...asyncStorageFake,
    default: asyncStorageFake,
  },
  "expo-secure-store": {
    getItemAsync:    async (k) => secureStore.get(k) ?? null,
    setItemAsync:    async (k, v) => void secureStore.set(k, String(v)),
    deleteItemAsync: async (k) => void secureStore.delete(k),
  },
  "expo-constants": {
    expoConfig:   { extra: {} },
    appOwnership: "standalone",
  },
  "expo-local-authentication": {
    AuthenticationType:               { FINGERPRINT: 1, FACIAL_RECOGNITION: 2, IRIS: 3 },
    hasHardwareAsync:                 async () => false,
    isEnrolledAsync:                  async () => false,
    supportedAuthenticationTypesAsync: async () => [],
    authenticateAsync:                async () => ({ success: false }),
  },
  "expo-modules-core": {
    requireNativeModule:         () => ({}),
    requireOptionalNativeModule: () => null,
    Platform:                    { OS: "ios" },
  },
  "expo-device": { isDevice: true },
  "expo-router": { useRouter: () => ({ replace: () => {}, push: () => {}, back: () => {} }) },
  "@expo/vector-icons/Ionicons": function Ionicons() { return null; },
};

const origRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (Object.prototype.hasOwnProperty.call(nativeFakes, id)) {
    const api = nativeFakes[id];
    if (typeof api === "function") return { default: api, __esModule: true };
    return { ...api, default: api, __esModule: true };
  }
  return origRequire.apply(this, arguments);
};

// ── Logger stub (suppress noise, capture messages) ──────────────────────────
const logs = [];
const rec  = (level) => (...args) =>
  void logs.push(`[${level}] ${args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")}`);
const noopLogger = { debug: rec("debug"), info: rec("info"), warn: rec("warn"), error: rec("error") };

function installLoggerStub() {
  const file = require.resolve(path.join(SRC, "core/logging/logger"));
  require.cache[file] = {
    id: file, filename: file, loaded: true,
    exports: { logger: noopLogger, default: noopLogger, __esModule: true },
    children: [], paths: [],
  };
}

// ── freshLaunch: clears module cache so each test starts from a clean instance
function freshLaunch() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(SRC)) delete require.cache[key];
  }
  logs.length = 0;
  installLoggerStub();
}

// ── Expose harness to the test file ─────────────────────────────────────────
global.__sessionStorageTest = { secureStore, asyncStore, logs, freshLaunch };
installLoggerStub();

// ── Run tests ─────────────────────────────────────────────────────────────────
const testFile = path.join(SRC, "tests", "unit", "sessionStorage.test.ts");
require(testFile);
