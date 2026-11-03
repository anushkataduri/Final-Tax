import { tokenManager } from "@/core/authentication/tokenManager";
import { getDefaultBaseUrl, getActiveBaseUrl } from "@/core/api/apiConfig";
import { apiClient } from "@/core/api/apiClient";
import {
  REVISED_DOCUMENT_FIELD_MAP,
  resolveMimeType,
  prepareLocalFileForUpload,
  createBlobFromFileUri,
} from "../utils/revisedDocumentUploadHelper";

let activeBaseUrlCache = "";
const getBaseUrl = async () => {
  try {
    const activeHost = await getActiveBaseUrl();
    activeBaseUrlCache = `${activeHost}/api/v1/itr/revised`;
  } catch {
    activeBaseUrlCache = `${getDefaultBaseUrl()}/api/v1/itr/revised`;
  }
  return activeBaseUrlCache;
};

const getApiUrl = async (path: string) => {
  const base = await getBaseUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

const fetchApi = async (url: string, method: string, body?: any, isMultipart = false) => {
  const headers: any = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  const token = await tokenManager.getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const targetUrl = url.startsWith("http") ? url : await getApiUrl(url);

  const response = await fetch(targetUrl, {
    method,
    headers,
    body: isMultipart ? body : JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`Backend Error Response (${response.status}):`, errText);
    throw new Error(`HTTP error! Status: ${response.status}. Details: ${errText}`);
  }
  return response.text();
};

const extractId = (response: string) => {
  const parts = response.split("ID: ");
  return parts.length > 1 ? parts[1].trim() : response;
};

export const RevisedItrApiService = {
  // Final Step: Submit Revised ITR for CA Review
  submitRevisedItr: async (revisedItrId: string, pushToken?: string) => {
    try {
      const cleanId = String(revisedItrId || "").trim();
      if (!cleanId) {
        throw new Error("Missing Revised ITR ID for submission.");
      }

      const token = await tokenManager.getAccessToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const params: Record<string, string> = { revisedItrId: cleanId };
      if (pushToken && pushToken.trim()) {
        params.pushToken = pushToken.trim();
      }

      console.log(`🌐 [Revised ITR API] Calling POST /api/v1/itr/revised/submit?revisedItrId=${cleanId}`, { pushToken });

      try {
        return await apiClient.post<string>("/api/v1/itr/revised/submit", undefined, { headers, params });
      } catch (clientErr: any) {
        const errMsg = String(clientErr?.response?.data || clientErr?.message || "");
        if (
          errMsg.toLowerCase().includes("already submitted") ||
          errMsg.toLowerCase().includes("cannot be submitted")
        ) {
          console.warn("[Revised ITR API] Idempotent submit detected:", errMsg);
          return `Revised ITR submitted successfully. Revised ITR ID: ${cleanId}`;
        }

        // Direct fetch fallback
        const baseUrl = await getBaseUrl();
        let url = `${baseUrl}/submit?revisedItrId=${encodeURIComponent(cleanId)}`;
        if (pushToken && pushToken.trim()) {
          url += `&pushToken=${encodeURIComponent(pushToken.trim())}`;
        }

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const resText = await res.text();
        if (!res.ok) {
          if (
            resText.toLowerCase().includes("already submitted") ||
            resText.toLowerCase().includes("cannot be submitted")
          ) {
            return `Revised ITR submitted successfully. Revised ITR ID: ${cleanId}`;
          }
          throw new Error(resText || `HTTP ${res.status}`);
        }
        return resText;
      }
    } catch (error) {
      console.error("Error submitting Revised ITR:", error);
      throw error;
    }
  },

  // Step 1: Base Revised ITR
  saveRevisedItr: async (data: any) => {
    try {
      const result = await fetchApi("/register", "POST", data);
      return { revisedItrId: extractId(result) };
    } catch (error) {
      console.error("Error saving Revised ITR:", error);
      throw error;
    }
  },
  updateRevisedItr: async (revisedItrId: string, data: any) => {
    try {
      return await fetchApi(`/update/${revisedItrId}`, "PUT", data);
    } catch (error) {
      console.error("Error updating Revised ITR:", error);
      throw error;
    }
  },

  // Step 2: Revision Reason
  saveRevisionReason: async (data: any) => {
    try {
      const result = await fetchApi("/reason/register", "POST", data);
      return { revisionReasonId: extractId(result) };
    } catch (error) {
      console.error("Error saving Revision Reason:", error);
      throw error;
    }
  },
  updateRevisionReason: async (revisionReasonId: string, data: any) => {
    try {
      return await fetchApi(`/reason/update/${revisionReasonId}`, "PUT", data);
    } catch (error) {
      console.error("Error updating Revision Reason:", error);
      throw error;
    }
  },

  // Step 3: Revised Details
  saveRevisedDetails: async (data: any) => {
    try {
      const result = await fetchApi("/details/register", "POST", data);
      return { detailsId: extractId(result) };
    } catch (error) {
      console.error("Error saving Revised Details:", error);
      throw error;
    }
  },
  updateRevisedDetails: async (detailsId: string, data: any) => {
    try {
      return await fetchApi(`/details/update/${detailsId}`, "PUT", data);
    } catch (error) {
      console.error("Error updating Revised Details:", error);
      throw error;
    }
  },

  // Step 4: Documents
  saveRevisedDocuments: async (revisedItrId: string, documents: any[]) => {
    try {
      const cleanId = String(revisedItrId || "").trim();
      if (!cleanId) {
        throw new Error("Missing Revised ITR ID for document upload.");
      }

      const formData = new FormData();
      let hasUploadedAny = false;

      for (const doc of documents) {
        if (doc.fileUri && REVISED_DOCUMENT_FIELD_MAP[doc.id]) {
          const paramName = REVISED_DOCUMENT_FIELD_MAP[doc.id];
          const fileName = doc.fileName || `${doc.id}.pdf`;
          const mimeType = resolveMimeType(fileName, doc.mimeType);

          const { localUri } = await prepareLocalFileForUpload(doc.fileUri, fileName);
          const fileBlob = await createBlobFromFileUri(localUri, fileName, mimeType);

          formData.append(paramName, fileBlob, fileName);

          hasUploadedAny = true;
        }
      }

      if (!hasUploadedAny) {
        throw new Error("At least one document is required before proceeding.");
      }

      let token = await tokenManager.getAccessToken();
      const targetUrl = await getApiUrl(`/${cleanId}/document/register`);
      let response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (response.status === 401) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { tokenRefreshManager } = require("@/core/authentication/tokenRefreshManager");
          const refreshed = await tokenRefreshManager.attemptRefresh();
          if (refreshed) {
            token = await tokenManager.getAccessToken();
            response = await fetch(targetUrl, {
              method: "POST",
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: formData,
            });
          }
        } catch {
          // Silent refresh failed; proceed to evaluate response
        }
      }

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || `Document upload failed with status ${response.status}`);
      }

      return { documentId: extractId(responseText) };
    } catch (error) {
      console.error("Error saving Revised Documents:", error);
      throw error;
    }
  },

  updateRevisedDocuments: async (documentId: string, documents: any[]) => {
    try {
      const cleanId = String(documentId || "").trim();
      if (!cleanId) {
        throw new Error("Missing document ID for update.");
      }

      const formData = new FormData();
      let hasUploadedAny = false;

      for (const doc of documents) {
        if (doc.fileUri && REVISED_DOCUMENT_FIELD_MAP[doc.id]) {
          const paramName = REVISED_DOCUMENT_FIELD_MAP[doc.id];
          const fileName = doc.fileName || `${doc.id}.pdf`;
          const mimeType = resolveMimeType(fileName, doc.mimeType);

          const { localUri } = await prepareLocalFileForUpload(doc.fileUri, fileName);
          const fileBlob = await createBlobFromFileUri(localUri, fileName, mimeType);

          formData.append(paramName, fileBlob, fileName);

          hasUploadedAny = true;
        }
      }

      if (!hasUploadedAny) {
        throw new Error("At least one document is required before proceeding.");
      }

      let token = await tokenManager.getAccessToken();
      const targetUrl = await getApiUrl(`/document/update/${cleanId}`);
      let response = await fetch(targetUrl, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (response.status === 401) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { tokenRefreshManager } = require("@/core/authentication/tokenRefreshManager");
          const refreshed = await tokenRefreshManager.attemptRefresh();
          if (refreshed) {
            token = await tokenManager.getAccessToken();
            response = await fetch(targetUrl, {
              method: "PUT",
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: formData,
            });
          }
        } catch {
          // Silent refresh failed; proceed to evaluate response
        }
      }

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || `Document update failed with status ${response.status}`);
      }

      return responseText;
    } catch (error) {
      console.error("Error updating Revised Documents:", error);
      throw error;
    }
  },
};
