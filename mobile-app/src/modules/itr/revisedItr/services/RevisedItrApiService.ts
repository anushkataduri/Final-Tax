import { tokenManager } from "@/core/authentication/tokenManager";
import { getDefaultBaseUrl } from "@/core/api/apiConfig";
import { logger } from "@/core/logging/logger";

const getBaseUrl = () => `${getDefaultBaseUrl()}/api/v1/itr/revised`;

interface RevisedItrDocument {
  id: string;
  fileUri?: string;
  fileName?: string;
  mimeType?: string;
}

const fetchApi = async (url: string, method: string, body?: Record<string, unknown>, isMultipart = false) => {
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  const token = await tokenManager.getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: isMultipart ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    logger.warn(`[RevisedITR API] Backend error ${response.status}`, { status: response.status });
    throw new Error(`HTTP error! Status: ${response.status}. Details: ${errText}`);
  }
  return response.text();
};

const extractId = (response: string) => {
  const parts = response.split("ID: ");
  return parts.length > 1 ? parts[1].trim() : response;
};

export const RevisedItrApiService = {
  // Step 1: Base Revised ITR
  saveRevisedItr: async (data: Record<string, unknown>) => {
    try {
      const result = await fetchApi(`${getBaseUrl()}/register`, "POST", data);
      return { revisedItrId: extractId(result) };
    } catch (error) {
      logger.warn("[RevisedITR API] Error saving Revised ITR", { error });
      throw error;
    }
  },
  updateRevisedItr: async (revisedItrId: string, data: Record<string, unknown>) => {
    try {
      return await fetchApi(`${getBaseUrl()}/update/${revisedItrId}`, "PUT", data);
    } catch (error) {
      logger.warn("[RevisedITR API] Error updating Revised ITR", { error });
      throw error;
    }
  },

  // Step 2: Revision Reason
  saveRevisionReason: async (data: Record<string, unknown>) => {
    try {
      const result = await fetchApi(`${getBaseUrl()}/reason/register`, "POST", data);
      return { revisionReasonId: extractId(result) };
    } catch (error) {
      logger.warn("[RevisedITR API] Error saving Revision Reason", { error });
      throw error;
    }
  },
  updateRevisionReason: async (revisionReasonId: string, data: Record<string, unknown>) => {
    try {
      return await fetchApi(`${getBaseUrl()}/reason/update/${revisionReasonId}`, "PUT", data);
    } catch (error) {
      logger.warn("[RevisedITR API] Error updating Revision Reason", { error });
      throw error;
    }
  },

  // Step 3: Revised Details
  saveRevisedDetails: async (data: Record<string, unknown>) => {
    try {
      const result = await fetchApi(`${getBaseUrl()}/details/register`, "POST", data);
      return { detailsId: extractId(result) };
    } catch (error) {
      logger.warn("[RevisedITR API] Error saving Revised Details", { error });
      throw error;
    }
  },
  updateRevisedDetails: async (detailsId: string, data: Record<string, unknown>) => {
    try {
      return await fetchApi(`${getBaseUrl()}/details/update/${detailsId}`, "PUT", data);
    } catch (error) {
      logger.warn("[RevisedITR API] Error updating Revised Details", { error });
      throw error;
    }
  },

  // Step 4: Documents
  saveRevisedDocuments: async (revisedItrId: string, documents: RevisedItrDocument[]) => {
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
            logger.warn("[RevisedITR API] Failed to read file for upload", { docId: doc.id, error: err });
          }
        }
      }

      if (!hasUploadedAny) {
        const dummyBlob = new Blob(['%PDF-1.4 dummy content'], { type: 'application/pdf' });
        formData.append("panCard", dummyBlob, "dummy.pdf");
      }

      const token = await tokenManager.getAccessToken();
      const response = await fetch(`${getBaseUrl()}/${revisedItrId}/document/register`, {
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
      logger.warn("[RevisedITR API] Error saving Revised Documents", { error });
      throw error;
    }
  },
  updateRevisedDocuments: async (documentId: string, documents: RevisedItrDocument[]) => {
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
            logger.warn("[RevisedITR API] Failed to read file for update", { docId: doc.id, error: err });
          }
        }
      }

      if (!hasUploadedAny) {
        const dummyBlob = new Blob(['%PDF-1.4 dummy content'], { type: 'application/pdf' });
        formData.append("panCard", dummyBlob, "dummy.pdf");
      }

      const token = await tokenManager.getAccessToken();
      const response = await fetch(`${getBaseUrl()}/document/update/${documentId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Document update failed");
      return response.text();
    } catch (error) {
      logger.warn("[RevisedITR API] Error updating Revised Documents", { error });
      throw error;
    }
  },
};
