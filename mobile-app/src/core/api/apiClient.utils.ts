import { getErrorMessage } from "../error-handling/errorMessage";

/**
 * Paths that should NEVER trigger a silent refresh on 401.
 * These are the auth endpoints themselves — retrying them would cause infinite loops.
 */
export const NO_REFRESH_PATHS = [
  "/auth/refresh",
  "/auth/revoke",
  "/auth/validate",
  "/otp/generate",
  "/otp/verify",
  "/customer/exists",
  "/customer/login",
  "/customer/register",
  "/customer/update_password",
];

/**
 * Returns true if the given path or URL is a public/unauthenticated endpoint.
 * These endpoints must NEVER receive a Bearer token header, because sending
 * an expired or invalid token to Spring Boot's JwtAuthenticationFilter causes
 * an immediate 401 TOKEN_EXPIRED rejection before reaching the controller.
 */
export function isPublicEndpoint(pathOrUrl: string): boolean {
  if (!pathOrUrl) return false;
  let path = pathOrUrl;
  const protoIndex = path.indexOf("://");
  if (protoIndex !== -1) {
    const slashAfterHost = path.indexOf("/", protoIndex + 3);
    path = slashAfterHost !== -1 ? path.slice(slashAfterHost) : "/";
  }
  const qIndex = path.indexOf("?");
  if (qIndex !== -1) {
    path = path.slice(0, qIndex);
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const publicPrefixes = [
    "/otp/",
    "/customer/exists",
    "/customer/login",
    "/customer/register",
    "/customer/update_password",
    "/auth/refresh",
    "/auth/revoke",
  ];

  return publicPrefixes.some((prefix) => cleanPath.startsWith(prefix));
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeoutMs?: number;
}

/** JSON error body the backend sends with non-2xx responses (all fields optional). */
export interface ApiErrorBody {
  message?: string;
  error?: string;
  code?: string;
  errors?: Record<string, string[]>;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
}

/** A finite, non-negative number from a JSON field or header, else undefined. */
export const toSeconds = (value: unknown): number | undefined => {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : undefined;
};

/** User-facing message for a request that failed before any HTTP response (timeout, offline, …). */
export const describeTransportError = (error: unknown): string => {
  let errMessage = getErrorMessage(error) || "Request failed";
  if (
    errMessage.includes("canceled") ||
    errMessage.includes("aborted") ||
    errMessage.includes("Network request failed") ||
    errMessage.includes("fetch failed")
  ) {
    errMessage = "Unable to connect to server. Please check your internet connection.";
  }
  return errMessage;
};
