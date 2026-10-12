import { apiClient } from "../../../core/api/apiClient";
import type { CompanyRegistrationDraft } from "../types/registration.types";

const DOCUMENT_ID_MAP: Record<string, string> = {
  'doc-pan': 'DIRECTOR_PAN',
  'doc-aadhaar': 'DIRECTOR_ID_PROOF',
  'doc-address': 'REGISTERED_OFFICE_PROOF',
  'doc-utility': 'OFFICE_UTILITY_BILL',
  'doc-noc': 'PROPERTY_OWNER_NOC',
  'DIRECTOR_PAN': 'DIRECTOR_PAN',
  'DIRECTOR_ID_PROOF': 'DIRECTOR_ID_PROOF',
  'REGISTERED_OFFICE_PROOF': 'REGISTERED_OFFICE_PROOF',
  'OFFICE_UTILITY_BILL': 'OFFICE_UTILITY_BILL',
  'PROPERTY_OWNER_NOC': 'PROPERTY_OWNER_NOC',
};

export const companyRegistrationApi = {
  submitApplication: async (draft: CompanyRegistrationDraft) => {
    const isOpc = draft.company?.companyType === 'One Person Company (OPC)';

    // Map document IDs to the 5 enum constants recognized by backend and filter out unsupported client-side docs
    const mappedDocuments = (draft.documents || [])
      .filter((doc) => DOCUMENT_ID_MAP[doc.id])
      .map((doc) => ({
        ...doc,
        id: DOCUMENT_ID_MAP[doc.id],
      }));

    const payload: any = {
      ...draft,
      documents: mappedDocuments,
      // For non-OPC entities, omit opcNominee (undefined) to prevent backend Bean Validation errors on empty nominee strings
      opcNominee: isOpc && draft.opcNominee && draft.opcNominee.name?.trim() ? draft.opcNominee : undefined,
    };

    return apiClient.post<{ applicationId: string; cin?: string; status: string }>(
      "/company-registration/apply",
      payload,
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
