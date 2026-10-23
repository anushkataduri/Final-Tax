import { File as ExpoFile } from "expo-file-system";
import type { CompanyRegistrationDraft } from "../types/registration.types";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { apiClient } from "@/core/api/apiClient";
import { logger } from "@/core/logging/logger";
import { getErrorMessage } from "@/core/error-handling/errorMessage";

const API_V1 = "/api/v1";

const cleanStr = (val?: string, fallback = "") =>
  val && val.trim().length > 0 ? val.trim() : fallback;

export const extractId = (response: string) => {
  const parts = response.split("ID: ");
  return parts.length > 1 ? parts[1].trim() : response.trim();
};

const formatToIsoDate = (dobStr?: string, fallback = "1990-01-01"): string => {
  if (!dobStr || !dobStr.trim()) return fallback;
  const t = dobStr.trim();
  if (/^\d{2}-\d{2}-\d{4}$/.test(t)) {
    const [dd, mm, yyyy] = t.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  if (/^\d{2}-\d{2}-\d{2}$/.test(t)) {
    const [dd, mm, yy] = t.split("-");
    const fullYear = parseInt(yy, 10) > 30 ? `19${yy}` : `20${yy}`;
    return `${fullYear}-${mm}-${dd}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  return fallback;
};

export const mapDraftToCompanyDetailsDto = (
  draft: CompanyRegistrationDraft,
  companyRegistrationId?: string,
) => {
  const company = draft.company;
  const authState = useAuthStore.getState();
  const customerId = authState.customer?.customerId || "CIXZPU77UY";

  return {
    companyRegistrationId: companyRegistrationId ?? undefined,
    categoryOfCompany:      cleanStr(company?.companyCategory, "Company limited by Shares"),
    subCategoryOfCompany:   cleanStr(company?.companySubCategory, "Indian Non-Government Company"),
    proposedCompanyName:    cleanStr(company?.proposedName1, "Tech Solutions"),
    alternativeProposedName: cleanStr(company?.proposedName2, "Tech Corp"),
    primaryBusinessActivity: cleanStr(company?.primaryActivity, "Information Technology"),
    nic5DigitCode:           /^[0-9]{5}$/.test(company?.nicCode || "") ? company.nicCode : "62011",
    secondaryActivity:       cleanStr(company?.secondaryActivity),
    companyStructure:        cleanStr(company?.companyType, "Private Limited"),
    customerId,
  };
};

export const mapDraftToOfficeDto = (
  draft: CompanyRegistrationDraft,
  companyRegistrationId: string,
  registeredOfficeId?: string,
) => {
  const company = draft.company;
  return {
    registeredOfficeId: registeredOfficeId ?? undefined,
    companyRegistrationId,
    buildingPremisesAddressLine: cleanStr(company?.registeredAddressLine, "123 Business Park"),
    city:             cleanStr(company?.registeredCity, "Bangalore"),
    district:         cleanStr(company?.registeredDistrict, "Bangalore"),
    state:            cleanStr(company?.registeredState, "Karnataka"),
    pinCode:          /^[0-9]{6}$/.test(company?.registeredPincode || "") ? company.registeredPincode : "560001",
    premisesOwnership: cleanStr(company?.premisesOwnership, "Rented"),
    companyEmail:     cleanStr(company?.companyEmail, "company@taxedge.in"),
    mobileNumber:     /^[0-9]{10}$/.test(company?.companyMobile || "") ? company.companyMobile : "9876543210",
  };
};

interface DirectorRecord {
  id?: string;
  promoterDirectorId?: string;
  name?: string;
  fullName?: string;
  pan?: string;
  panNumber?: string;
  email?: string;
  emailAddress?: string;
  phone?: string;
  mobileNumber?: string;
  dob?: string;
  dateOfBirth?: string;
  designation?: string;
  din?: string;
  aadhaar?: string;
  numberOfShares?: number | string;
}

export const mapDraftToPromotersDto = (
  draft: CompanyRegistrationDraft,
  companyRegistrationId: string,
) => {
  const isOpc =
    draft.company?.companyType?.toLowerCase().includes("opc") ||
    draft.company?.companyType?.toLowerCase().includes("one person") ||
    draft.company?.companyType === "One Person Company (OPC)";

  if (isOpc && draft.opcNominee?.name) {
    const nominee = draft.opcNominee;
    return [
      {
        companyRegistrationId,
        fullName:      cleanStr(nominee.name, "Nominee Director"),
        panNumber:     /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(nominee.pan || "") ? nominee.pan : "ABCDE1234F",
        dateOfBirth:   formatToIsoDate(nominee.dob || "1990-01-01"),
        designation:   "Nominee Director",
        emailAddress:  cleanStr(nominee.email, "nominee@taxedge.in"),
        mobileNumber:  /^[0-9]{10}$/.test(nominee.phone || "") ? nominee.phone : "9876543210",
        relationship:  nominee.relationship?.trim() ?? undefined,
        aadhaarNumber: /^[0-9]{12}$/.test(nominee.aadhaar || "") ? nominee.aadhaar : undefined,
      },
    ];
  }

  const directors: DirectorRecord[] =
    (draft.directors ?? []).length > 0
      ? (draft.directors as DirectorRecord[])
      : [{ id: "dir-1", name: "Director One", pan: "ABCDE1234F", email: "director@taxedge.in", phone: "9876543210", dob: "1990-01-01", designation: "Director" }];

  return directors.map((d) => ({
    companyRegistrationId,
    fullName:      cleanStr(d.name || d.fullName, "Director One"),
    panNumber:     /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(d.pan || d.panNumber || "") ? (d.pan || d.panNumber) : "ABCDE1234F",
    dateOfBirth:   formatToIsoDate(d.dob || d.dateOfBirth),
    designation:   cleanStr(d.designation, "Director"),
    emailAddress:  cleanStr(d.email || d.emailAddress, "director@taxedge.in"),
    mobileNumber:  /^[0-9]{10}$/.test(d.phone || d.mobileNumber || "") ? (d.phone || d.mobileNumber) : "9876543210",
    din:           d.din ?? undefined,
    aadhaarNumber: /^[0-9]{12}$/.test(d.aadhaar || "") ? d.aadhaar : undefined,
  }));
};

export const mapDraftToCapitalDto = (
  draft: CompanyRegistrationDraft,
  companyRegistrationId: string,
  promoterIds: string[],
) => {
  const company = draft.company;
  const faceValue      = Number(company?.faceValuePerShare) || 10;
  const authCapital    = Number(company?.authorizedCapital) || 100_000;
  const totalAuthShares = faceValue > 0 ? Math.floor(authCapital / faceValue) : 10_000;
  const directors      = (draft.directors ?? []) as DirectorRecord[];

  const shareholdingPattern = promoterIds.map((pId, idx) => {
    const dir       = directors[idx];
    const allocShares = Number(dir?.numberOfShares) > 0
      ? Number(dir.numberOfShares)
      : Math.floor(totalAuthShares / (promoterIds.length || 1));
    const amt = allocShares * faceValue;
    return {
      promoterDirectorId: pId,
      allocatedShares: allocShares > 0 ? allocShares : 1,
      amount: amt > 0 ? amt : faceValue,
    };
  });

  const subscribedCapital = shareholdingPattern.reduce((sum, p) => sum + p.amount, 0);

  return {
    companyRegistrationId,
    authorisedCapital:  authCapital,
    faceValuePerShare:  faceValue,
    authorisedShares:   totalAuthShares,
    subscribedCapital:  subscribedCapital > 0 ? subscribedCapital : authCapital,
    shareholdingPattern,
  };
};

const MIME_MAP: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};
const mimeForExt = (name: string) =>
  MIME_MAP[name.split(".").pop()?.toLowerCase() ?? ""] ?? "application/pdf";

const appendFileToForm = async (
  formData: FormData,
  fieldName: string,
  file: { uri: string; name: string },
): Promise<void> => {
  const cleanName = file.name || `${fieldName}.pdf`;
  const mime = mimeForExt(cleanName);
  try {
    const res = await fetch(file.uri);
    const rawBlob = await res.blob();
    const blob = rawBlob.type && rawBlob.type !== "application/octet-stream"
      ? rawBlob
      : rawBlob.slice(0, rawBlob.size, mime);
    formData.append(fieldName, blob, cleanName);
  } catch {
    // ExpoFile path (native), then fall back to React Native FormData object literal
    try {
      const expoFile = new ExpoFile(file.uri);
      formData.append(fieldName, expoFile as unknown as Blob);
    } catch {
      formData.append(fieldName, { uri: file.uri, name: cleanName, type: mime } as unknown as Blob);
    }
  }
};

export const companyRegistrationApiService = {
  createRegistration: async (draft: CompanyRegistrationDraft) =>
    apiClient.post<string>(`${API_V1}/company-registration/register`, mapDraftToCompanyDetailsDto(draft)),

  updateRegistration: async (companyRegistrationId: string, draft: CompanyRegistrationDraft) =>
    apiClient.put<string>(
      `${API_V1}/company-registration/${companyRegistrationId}`,
      mapDraftToCompanyDetailsDto(draft, companyRegistrationId),
    ),

  saveRegisteredOffice: async (companyRegistrationId: string, draft: CompanyRegistrationDraft) =>
    apiClient.post<string>(
      `${API_V1}/registered-office-details/register`,
      mapDraftToOfficeDto(draft, companyRegistrationId),
    ),

  updateRegisteredOffice: async (
    registeredOfficeId: string,
    draft: CompanyRegistrationDraft,
    companyRegistrationId: string,
  ) =>
    apiClient.put<string>(
      `${API_V1}/registered-office-details/${registeredOfficeId}`,
      mapDraftToOfficeDto(draft, companyRegistrationId, registeredOfficeId),
    ),

  savePromoters: async (companyRegistrationId: string, draft: CompanyRegistrationDraft) =>
    apiClient.post<string>(
      `${API_V1}/promoter-director-details/register`,
      mapDraftToPromotersDto(draft, companyRegistrationId),
    ),

  getPromoters: async (companyRegistrationId: string): Promise<DirectorRecord[]> => {
    try {
      return await apiClient.get<DirectorRecord[]>(
        `${API_V1}/company-registration/${companyRegistrationId}/promoters`,
      );
    } catch (err) {
      logger.warn("[CompanyRegAPI] getPromoters failed", { error: getErrorMessage(err) });
      return [];
    }
  },

  saveShareholdingCapital: async (
    companyRegistrationId: string,
    draft: CompanyRegistrationDraft,
    promoterIds: string[],
  ) =>
    apiClient.post<string>(
      `${API_V1}/register`,
      mapDraftToCapitalDto(draft, companyRegistrationId, promoterIds),
    ),

  uploadDocuments: async (
    companyRegistrationId: string,
    files: Record<string, { uri: string; name: string }>,
  ) => {
    const formData = new FormData();
    formData.append("companyRegistrationId", companyRegistrationId);
    const uploads = Object.entries(files).filter(([, file]) => Boolean(file?.uri));
    await Promise.all(uploads.map(([fieldName, file]) => appendFileToForm(formData, fieldName, file)));
    return apiClient.post<string>(`${API_V1}/documents-kyc-checklist/register`, formData);
  },

  submitRegistration: async (companyRegistrationId: string) =>
    apiClient.post<string>(`${API_V1}/company-registration/${companyRegistrationId}`, {}),
};

export default companyRegistrationApiService;
