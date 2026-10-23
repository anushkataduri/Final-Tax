import { moduleRegistry } from "./ModuleRegistry";
import { container } from "./DependencyContainer";
import { apiClient, isPublicEndpoint } from "@/core/api/apiClient";
import { tokenManager, JwtUtils } from "@/core/authentication/tokenManager";
import { tokenRefreshManager } from "@/core/authentication/tokenRefreshManager";
import { sessionManager } from "@/core/authentication/sessionManager";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { logger } from "@/core/logging/logger";

export class AppBootstrap {
  private static isInitialized = false;

  static async init(): Promise<void> {
    if (this.isInitialized) return;

    logger.info("Starting TaxEdge App Bootstrap...");

    // Register core dependencies
    container.register("apiClient", apiClient);
    container.register("tokenManager", tokenManager);
    container.register("sessionManager", sessionManager);
    container.register("logger", logger);

    // ── Request interceptor: attach Bearer token ──────────────────────────
    apiClient.interceptors.useRequest(async (config) => {
      // Never attach Authorization header to public/auth endpoints
      if (isPublicEndpoint(config.url)) {
        delete config.headers.Authorization;
        return config;
      }
      const token = await tokenManager.getAccessToken();
      if (token && JwtUtils.isStructureAndExpiryValid(token, 0)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
      return config;
    });

    // ── Session-expired handler ───────────────────────────────────────────
    // Fired by tokenRefreshManager when the refresh token itself is expired
    // or revoked. The session is irrecoverably dead — clear auth state and
    // redirect to login.
    //
    // We call useAuthStore.getState().logout() rather than
    // sessionManager.logout() because only the Zustand logout resets
    // isLoggedIn to false, which is what the auth navigation guard reads to
    // redirect the user to the login screen. sessionManager.logout() only
    // clears the core session object; it leaves isLoggedIn: true in Zustand,
    // stranding the user in a partially-authenticated state with no valid tokens.
    tokenRefreshManager.onSessionExpired(() => {
      logger.warn(
        "Session expired — refresh token is no longer valid. Clearing auth state and redirecting to login."
      );
      useAuthStore.getState().logout();
    });

    // Initialize all domain modules
    await moduleRegistry.initializeAll();

    this.isInitialized = true;
    logger.info("TaxEdge App Bootstrap completed successfully.");
  }
}

export default AppBootstrap;
