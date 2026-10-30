import { apiClient } from "../../../core/api/apiClient";
import type { ItrFilingDraft } from "../types/itr.types";

export const itrApi = {
  submitItr: async (draft: Partial<ItrFilingDraft>) => {
    return apiClient.post<{ applicationId: string; status: string }>("/itr/file", draft);
  },
  fetchStatus: async (applicationId: string) => {
    return apiClient.get<{ status: string; acknowledgementNumber: string }>(`/itr/status/${applicationId}`);
  },
};

export default itrApi;
