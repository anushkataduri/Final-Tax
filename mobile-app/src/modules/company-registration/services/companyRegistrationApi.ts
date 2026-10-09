import { apiClient } from "../../../core/api/apiClient";
import type { CompanyRegistrationDraft } from "../types/registration.types";

export const companyRegistrationApi = {
  submitApplication: async (draft: CompanyRegistrationDraft) => {
    return apiClient.post<{ applicationId: string; cin?: string; status: string }>(
      "/company-registration/apply",
      draft,
      { timeoutMs: 3000 }
    );
  },
  checkNameAvailability: async (proposedName: string) => {
    return apiClient.get<{ available: boolean; similarNames: string[] }>(
      "/company-registration/check-name",
      { params: { name: proposedName } }
    );
  },
  fetchStatus: async (applicationId: string) => {
    return apiClient.get<{ status: string; currentStage: string }>(
      `/company-registration/status/${applicationId}`,
      { timeoutMs: 3000 }
    );
  },
};

export default companyRegistrationApi;
