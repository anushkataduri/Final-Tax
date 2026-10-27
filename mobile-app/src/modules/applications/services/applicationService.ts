import { apiClient } from "../../../core/api/apiClient";
import { ApiError } from "../../../core/api/apiError";
import { useAuthStore } from "../../authentication/store/authStore";
import { logger } from "../../../core/logging/logger";
import { getErrorMessage } from "@/core/error-handling/errorMessage";
import type { Application } from "../../../types/domain";

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const state = useAuthStore.getState();
  const customerId = state.customer?.customerId || state.authenticatedUser?.customerId;
  const mobile = state.customer?.mobile || state.authenticatedUser?.mobileNumber || state.mobileNumber;

  if (customerId && customerId.trim()) {
    headers["X-Customer-Id"] = customerId.trim();
  }
  if (mobile && mobile.trim()) {
    headers["X-Customer-Mobile"] = mobile.trim();
  }
  return headers;
}

import { extractApplicationsFromResponse } from "../utils/applicationResponseParser";
import { appendFilePart } from "@/shared/utils/formDataFile";
import { sanitizeMessageText } from "../utils/chatAttachmentUtils";
export { extractApplicationsFromResponse };

export const applicationService = {
  getApplications: async (): Promise<Application[]> => {
    const headers = getAuthHeaders();
    try {
      const result = await apiClient.get<unknown>("/applications", { headers });
      const list = extractApplicationsFromResponse(result);
      return list.map((app) => ({
        ...app,
        documents: Array.isArray(app?.documents) ? app.documents : [],
        timeline: Array.isArray(app?.timeline) ? app.timeline : [],
        chatHistory: Array.isArray(app?.chatHistory) ? app.chatHistory : [],
      }));
    } catch (err: unknown) {
      if (err instanceof ApiError && (err.statusCode === 204 || err.statusCode === 404)) {
        return [];
      }
      const errMsg = getErrorMessage(err);
      if (
        errMsg &&
        (errMsg.includes("404") ||
          errMsg.toLowerCase().includes("not found") ||
          errMsg.toLowerCase().includes("no applications") ||
          errMsg.toLowerCase().includes("no static resource"))
      ) {
        return [];
      }
      throw err;
    }
  },

  getApplicationById: async (id: string): Promise<Application | null> => {
    if (!id) return null;
    const headers = getAuthHeaders();
    try {
      return await apiClient.get<Application>("/applications/" + encodeURIComponent(id), { headers });
    } catch {
      return null;
    }
  },

  createApplication: async (app: Application): Promise<Application> => {
    const headers = getAuthHeaders();
    const state = useAuthStore.getState();
    const customerId = state.customer?.customerId || state.authenticatedUser?.customerId;
    const mobile = state.customer?.mobile || state.authenticatedUser?.mobileNumber || state.mobileNumber;

    const payload = {
      ...app,
      id: app.id && app.id.trim() ? app.id.trim() : `APP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customerId || undefined,
      mobileNumber: mobile || undefined,
    };

    try {
      return await apiClient.post<Application>("/applications", payload, { headers });
    } catch (err) {
      logger.debug("[applicationService] Backend /applications endpoint unavailable, saved to local persistence", {
        error: getErrorMessage(err),
      });
      return payload as Application;
    }
  },

  updateApplication: async (app: Application): Promise<Application> => {
    try {
      const headers = getAuthHeaders();
      return await apiClient.post<Application>("/applications", app, { headers });
    } catch (err) {
      logger.debug("[applicationService] Backend /applications endpoint unavailable, saved to local persistence", {
        error: getErrorMessage(err),
      });
      return app;
    }
  },

  uploadChatAttachment: async (
    appId: string,
    file: { uri: string; name: string; type: string; size?: number }
  ): Promise<string | null> => {
    const formData = new FormData();
    appendFilePart(formData, "file", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
    formData.append("applicationId", appId);

    const headers = getAuthHeaders();
    try {
      const res = await apiClient.post<{ url?: string; fileUrl?: string; attachmentUrl?: string }>(
        `/applications/${encodeURIComponent(appId)}/attachments`,
        formData,
        { headers }
      );
      const remoteUrl = res?.attachmentUrl || res?.fileUrl || res?.url;
      if (remoteUrl && typeof remoteUrl === "string") {
        return remoteUrl;
      }
    } catch (err) {
      logger.debug("[applicationService] Backend attachment upload endpoint unavailable, will handle via fallback", {
        error: getErrorMessage(err),
      });
    }
    return null;
  },

  sendChatMessage: async (
    appId: string,
    text: string,
    sender: "user" | "staff" = "user",
    attachment?: { uri: string; name: string; type: string; size?: number }
  ): Promise<boolean> => {
    try {
      const app = await applicationService.getApplicationById(appId);
      if (!app) return false;

      let remoteUrl: string | undefined;
      if (attachment) {
        remoteUrl = (await applicationService.uploadChatAttachment(appId, attachment)) || undefined;
      }

      const cleanText = sanitizeMessageText(text);
      const newMessage = {
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sender,
        text: cleanText,
        caption: cleanText || undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        imageUrl: remoteUrl || attachment?.uri,
        attachmentUrl: remoteUrl || attachment?.uri,
        attachmentName: attachment?.name,
      };

      const updatedApp: Application = {
        ...app,
        chatHistory: [...(app.chatHistory || []), newMessage],
      };

      await applicationService.updateApplication(updatedApp);
      return true;
    } catch (e) {
      logger.warn("[applicationService] Failed to persist chat message to backend:", { error: e });
      return false;
    }
  },
};

export default applicationService;
