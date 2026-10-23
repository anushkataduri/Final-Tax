import AsyncStorage from "@react-native-async-storage/async-storage";
import { secureStorage } from "@/core/storage/secureStorage";
import type { AuthSession, StoredUser } from "../types/auth.types";
import { logger } from "@/core/logging/logger";
import { getErrorMessage } from "@/core/error-handling/errorMessage";

/** SecureStore key (via secureStorage wrapper) for the authenticated session. */
const KEY_SESSION = "session_metadata";
/** AsyncStorage key for the user profile map (non-auth data). */
const KEY_USERS = "taxEdgeDevUsersMap";
/**
 * Legacy AsyncStorage key written by app versions prior to the H5 security fix.
 * Read once during initAsync migration and then deleted; never written after the fix.
 */
const LEGACY_SESSION_KEY = "taxEdgeDevSession";

const memory: Record<string, string> = {};

// Eagerly pre-populate in-memory cache on module load.
// initAsync() is the authoritative path; these are best-effort warm-ups only.
secureStorage.getItem(KEY_SESSION).then((val) => {
  if (val) memory[KEY_SESSION] = val;
}).catch((err) => {
  logger.debug("[AuthStorage] Pre-populating session cache from SecureStore failed", { error: getErrorMessage(err) });
});

AsyncStorage.getItem(KEY_USERS).then((val) => {
  if (val) memory[KEY_USERS] = val;
}).catch((err) => {
  logger.debug("[AuthStorage] Pre-populating users cache from AsyncStorage failed", { error: getErrorMessage(err) });
});

/** Read user map raw JSON (includes web localStorage fallback). */
const getUsersRaw = (): string | null => {
  if (memory[KEY_USERS]) return memory[KEY_USERS];
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(KEY_USERS);
    }
  } catch (err) {
    logger.debug("[AuthStorage] localStorage read failed", { key: KEY_USERS, error: getErrorMessage(err) });
  }
  return null;
};

/** Write user map raw JSON (web localStorage + AsyncStorage, never SecureStore due to size limits). */
const setUsersRaw = (v: string) => {
  memory[KEY_USERS] = v;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(KEY_USERS, v);
    }
  } catch (err) {
    logger.debug("[AuthStorage] localStorage write failed", { key: KEY_USERS, error: getErrorMessage(err) });
  }
  AsyncStorage.setItem(KEY_USERS, v).catch((err) => {
    logger.warn("[AuthStorage] AsyncStorage write failed for users map", { error: getErrorMessage(err) });
  });
};

/** Read session raw JSON (memory only — populated from SecureStore by initAsync). */
const getSessionRaw = (): string | null => memory[KEY_SESSION] ?? null;

/** Write session raw JSON to memory + SecureStore (never AsyncStorage or localStorage). */
const setSessionRaw = (v: string) => {
  memory[KEY_SESSION] = v;
  secureStorage.setItem(KEY_SESSION, v).catch((err) => {
    logger.warn("[AuthStorage] SecureStore write failed for session", { error: getErrorMessage(err) });
  });
};

/** Delete session from memory + SecureStore. */
const delSessionRaw = () => {
  delete memory[KEY_SESSION];
  secureStorage.removeItem(KEY_SESSION).catch((err) => {
    logger.warn("[AuthStorage] SecureStore remove failed for session", { error: getErrorMessage(err) });
  });
};

export const authStorage = {
  /**
   * Await this before reading the session on app launch.
   * Loads the session from SecureStore (migrating from AsyncStorage on first upgrade).
   * Loads the user map from AsyncStorage.
   */
  initAsync: async (): Promise<void> => {
    try {
      const [secureSession, users] = await Promise.all([
        secureStorage.getItem(KEY_SESSION),
        AsyncStorage.getItem(KEY_USERS),
      ]);

      if (secureSession) {
        memory[KEY_SESSION] = secureSession;
      } else {
        // One-time migration: if a session exists in AsyncStorage from a previous app
        // version, move it to SecureStore and delete the plaintext copy.
        try {
          const legacySession = await AsyncStorage.getItem(LEGACY_SESSION_KEY);
          if (legacySession) {
            memory[KEY_SESSION] = legacySession;
            await secureStorage.setItem(KEY_SESSION, legacySession);
            await AsyncStorage.removeItem(LEGACY_SESSION_KEY);
            logger.info("[AuthStorage] Migrated session metadata from AsyncStorage to SecureStore");
          }
        } catch (migErr) {
          logger.warn("[AuthStorage] Session migration failed — starting with empty session", { error: getErrorMessage(migErr) });
        }
      }

      if (users) memory[KEY_USERS] = users;
    } catch (err) {
      logger.warn("[AuthStorage] initAsync failed, using in-memory state", { error: getErrorMessage(err) });
    }
  },

  getUsersMap: (): Record<string, StoredUser> => {
    try {
      return JSON.parse(getUsersRaw() || "{}");
    } catch (err) {
      logger.warn("[AuthStorage] Failed to parse users map, defaulting to empty", { error: getErrorMessage(err) });
      return {};
    }
  },
  getUserByMobile: (mobile: string): StoredUser | null => {
    if (!mobile) return null;
    const clean = mobile.replace(/\D/g, "").slice(-10);
    return authStorage.getUsersMap()[clean] || null;
  },
  getUser: (): StoredUser | null => {
    const s = authStorage.getSession();
    return s.activeMobile ? authStorage.getUserByMobile(s.activeMobile) : null;
  },
  saveUser: (user: StoredUser) => {
    const rawMob = user.mobileNumber || "";
    const cleanMobile = rawMob.replace(/\D/g, "").slice(-10);
    if (!cleanMobile) return;
    const map = authStorage.getUsersMap();
    const existing = map[cleanMobile] || {};
    const regCompleted =
      typeof user.registrationCompleted === "boolean"
        ? user.registrationCompleted
        : Boolean(existing.registrationCompleted);
    map[cleanMobile] = {
      ...existing,
      ...user,
      mobileNumber: cleanMobile,
      registrationCompleted: regCompleted,
    };
    setUsersRaw(JSON.stringify(map));
  },
  getSession: (): AuthSession => {
    try {
      return JSON.parse(getSessionRaw() || '{"isLoggedIn":false,"activeMobile":null}');
    } catch (err) {
      logger.warn("[AuthStorage] Failed to parse session, defaulting to unauthenticated", { error: getErrorMessage(err) });
      return { isLoggedIn: false, activeMobile: null, lastLoginAt: null };
    }
  },
  saveSession: (s: AuthSession) => setSessionRaw(JSON.stringify(s)),
  clearSession: () =>
    setSessionRaw(JSON.stringify({ isLoggedIn: false, activeMobile: null, lastLoginAt: null })),
  clearAllAuthData: () => {
    // Clear user profile map (AsyncStorage + web localStorage)
    delete memory[KEY_USERS];
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(KEY_USERS);
      }
    } catch {}
    AsyncStorage.removeItem(KEY_USERS).catch((err) => {
      logger.warn("[AuthStorage] AsyncStorage remove failed for users map", { error: getErrorMessage(err) });
    });
    // Clear session from SecureStore
    delSessionRaw();
    // Clear any legacy plaintext session remnants that may exist on older installs
    AsyncStorage.removeItem(LEGACY_SESSION_KEY).catch(() => {});
    AsyncStorage.removeItem("taxEdgeDevUser").catch(() => {});
  },
};

export default authStorage;
