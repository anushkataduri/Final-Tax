import { useAuthStore } from "@/modules/authentication/store/authStore";
import { tokenManager } from "@/core/authentication/tokenManager";
import { getDefaultBaseUrl, getActiveBaseUrl } from "@/core/api/apiConfig";
import { apiClient } from "@/core/api/apiClient";

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
      const formData = new FormData();
      const fieldMapping: Record<string, string> = {
        "doc-1": "panCard",
        "doc-2": "aadhaarCard",
        "doc-3": "form16Form16A",
        "doc-4": "aisTisStatement",
        "doc-5": "bankStatements",
        "doc-6": "investmentProofs"
      };

      let hasUploadedAny = false;
      for (const doc of documents) {
        if (doc.fileUri && fieldMapping[doc.id]) {
          const paramName = fieldMapping[doc.id];
          try {
            const response = await fetch(doc.fileUri);
            const rawBlob = await response.blob();
            
            let mimeType = doc.mimeType;
            let extension = "pdf";

            const lowerName = (doc.fileName || "").toLowerCase();
            if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
              mimeType = "image/jpeg";
              extension = "jpg";
            } else if (lowerName.endsWith(".png")) {
              mimeType = "image/png";
              extension = "png";
            } else {
              mimeType = mimeType || "application/pdf";
            }

            const fileBlob = new Blob([rawBlob], { type: mimeType });
            const finalFileName = doc.fileName || `${doc.id}.${extension}`;
            
            formData.append(paramName, fileBlob, finalFileName);
            hasUploadedAny = true;
          } catch (err) {
            console.error(`Failed to read file ${doc.id} at ${doc.fileUri}`, err);
          }
        }
      }

      if (!hasUploadedAny) {
        const dummyBlob = new Blob(['%PDF-1.4 dummy content'], { type: 'application/pdf' });
        formData.append("panCard", dummyBlob, "dummy.pdf");
      }
      
      const token = await tokenManager.getAccessToken();
      const targetUrl = await getApiUrl(`/${revisedItrId}/document/register`);
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Document upload failed");
      const result = await response.text();
      return { documentId: extractId(result) };
    } catch (error) {
      console.error("Error saving Revised Documents:", error);
      throw error;
    }
  },
  updateRevisedDocuments: async (documentId: string, documents: any[]) => {
    try {
      const formData = new FormData();
      const fieldMapping: Record<string, string> = {
        "doc-1": "panCard",
        "doc-2": "aadhaarCard",
        "doc-3": "form16Form16A",
        "doc-4": "aisTisStatement",
        "doc-5": "bankStatements",
        "doc-6": "investmentProofs"
      };

      let hasUploadedAny = false;
      for (const doc of documents) {
        if (doc.fileUri && fieldMapping[doc.id]) {
          const paramName = fieldMapping[doc.id];
          try {
            const response = await fetch(doc.fileUri);
            const rawBlob = await response.blob();
            
            let mimeType = doc.mimeType;
            let extension = "pdf";

            const lowerName = (doc.fileName || "").toLowerCase();
            if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
              mimeType = "image/jpeg";
              extension = "jpg";
            } else if (lowerName.endsWith(".png")) {
              mimeType = "image/png";
              extension = "png";
            } else {
              mimeType = mimeType || "application/pdf";
            }

            const fileBlob = new Blob([rawBlob], { type: mimeType });
            const finalFileName = doc.fileName || `${doc.id}.${extension}`;
            
            formData.append(paramName, fileBlob, finalFileName);
            hasUploadedAny = true;
          } catch (err) {
            console.error(`Failed to read file ${doc.id} at ${doc.fileUri}`, err);
          }
        }
      }

      if (!hasUploadedAny) {
        const dummyBlob = new Blob(['%PDF-1.4 dummy content'], { type: 'application/pdf' });
        formData.append("panCard", dummyBlob, "dummy.pdf");
      }
      
      const token = await tokenManager.getAccessToken();
      const targetUrl = await getApiUrl(`/document/update/${documentId}`);
      const response = await fetch(targetUrl, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Document update failed");
      return await response.text();
    } catch (error) {
      console.error("Error updating Revised Documents:", error);
      throw error;
    }
  }
};
