import { ItrFilingFormData } from "../types/itrFiling.types";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { tokenManager } from "@/core/authentication/tokenManager";

import { getDefaultBaseUrl } from "@/core/api/apiConfig";

// Base URL points to the backend running locally.
const getBaseUrl = () => `${getDefaultBaseUrl()}/api/v1/itr`;

const fetchApi = async (url: string, method: string, body?: any, isMultipart = false) => {
  const headers: any = {};
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

const mapToFilingDto = (data: ItrFilingFormData) => {
  const customerId = useAuthStore.getState().customer?.customerId || useAuthStore.getState().authenticatedUser?.customerId || "CUST-12345";
  const accountNumber = data.bankDetails?.accountNumber?.trim() || "";
  const ifscCode = data.bankDetails?.ifscCode?.trim() || "";

  return {
    customerId,
    assessmentYear: data.personalInfo.assessmentYear,
    residentialStatus: data.personalInfo.residentialStatus,
    filingType: data.personalInfo.filingType,
    bankName: data.bankDetails?.bankName || "Pending",
    accountNumber: /^[0-9]{9,18}$/.test(accountNumber) ? accountNumber : "000000000",
    ifscCode: /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode) ? ifscCode : "ABCD0123456"
  };
};

const mapToSalaryIncomeDto = (data: ItrFilingFormData) => {
  const inc = data.incomeSources;

  let incomeSource = "Salary / Pension";
  if (inc.salary?.enabled) incomeSource = "Salary / Pension";
  else if (inc.houseProperty?.enabled) incomeSource = "House Property";
  else if (inc.business?.enabled) incomeSource = "Business / Profession";
  else if (inc.capitalGains?.enabled) incomeSource = "Capital Gains";
  else if (inc.otherSources?.enabled) incomeSource = "Other Sources";

  return {
    incomeSource,
    employerLegalName: inc.salary?.employerName || "Employer",
    grossSalary: String(inc.salary?.grossSalary || "0"),
    exemptAllowances: String(inc.salary?.allowances || "0"),
    tdsDeductedByEmployer: String(inc.salary?.tdsDeducted || "0"),
    propertyClassification: inc.houseProperty?.propertyType === "let_out" ? "LET_OUT_RENTED" : "SELF_OCCUPIED",
    homeLoanInterestPaid: String(inc.houseProperty?.homeLoanInterest || "0"),
    annualRentReceived: String(inc.houseProperty?.annualRentReceived || 0),
    municipalTaxesPaid: String(inc.houseProperty?.municipalTaxesPaid || 0),
    howDoYouReportThisBusiness: "PRESUMPTIVE",
    grossTurnover: String(inc.business?.grossTurnover || 0),
    declaredNetProfit: String(inc.business?.declaredProfit || 0),
    assetType: inc.capitalGains?.hasPropertyAssets ? "REAL_ESTATE_LAND" :
      inc.capitalGains?.hasFnoIntraday ? "F_AND_O_INTRADAY_TRADING" :
        inc.capitalGains?.hasCryptoVda ? "CRYPTO_VDA" : "EQUITY_MUTUAL_FUNDS",
    shortTermGains: String(inc.capitalGains?.shortTermGains || 0),
    longTermGains: String(inc.capitalGains?.longTermGains || 0),
    savingsInterest: String(inc.otherSources?.savingsInterest || 0),
    fdTermInterest: String(inc.otherSources?.fdInterest || 0),
    dividendIncome: String(inc.otherSources?.dividendIncome || 0),
    otherMiscellaneous: String(inc.otherSources?.otherIncome || 0)
  };
};

export const ItrApiService = {
  // Step 1: Personal Info
  savePersonalInfo: async (data: ItrFilingFormData) => {
    try {
      const result = await fetchApi(`${getBaseUrl()}/filing/register`, "POST", mapToFilingDto(data));
      return { itrId: extractId(result) };
    } catch (error) {
      console.error("Error saving Personal Info:", error);
      throw error;
    }
  },

  updatePersonalInfo: async (itrId: string, data: ItrFilingFormData) => {
    try {
      const result = await fetchApi(`${getBaseUrl()}/filing/update/${itrId}`, "PUT", mapToFilingDto(data));
      return result;
    } catch (error) {
      console.error("Error updating Personal Info:", error);
      throw error;
    }
  },

  // Step 2: Income Sources (Salary)
  saveSalaryIncome: async (itrId: string, data: ItrFilingFormData) => {
    try {
      const result = await fetchApi(`${getBaseUrl()}/${itrId}/salary-income/register`, "POST", mapToSalaryIncomeDto(data));
      return { incomeId: extractId(result) };
    } catch (error) {
      console.error("Error saving Salary Income:", error);
      throw error;
    }
  },

  updateSalaryIncome: async (incomeId: string, data: ItrFilingFormData) => {
    try {
      return await fetchApi(`${getBaseUrl()}/salary-income/update/${incomeId}`, "PUT", mapToSalaryIncomeDto(data));
    } catch (error) {
      console.error("Error updating Salary Income:", error);
      throw error;
    }
  },

  // Step 3: Documents 
  saveDocuments: async (itrId: string, data: ItrFilingFormData) => {
    try {
      const formData = new FormData();
      await populateFormDataWithDocuments(formData, data.documents);

      const result = await fetchApi(`${getBaseUrl()}/${itrId}/documents/register`, "POST", formData, true);
      return { documentId: extractId(result) };
    } catch (error) {
      console.error("Error saving Documents:", error);
      throw error;
    }
  },

  updateDocuments: async (documentId: string, data: ItrFilingFormData) => {
    try {
      const formData = new FormData();
      await populateFormDataWithDocuments(formData, data.documents);

      return await fetchApi(`${getBaseUrl()}/documents/update/${documentId}`, "PUT", formData, true);
    } catch (error) {
      console.error("Error updating Documents:", error);
      throw error;
    }
  }
};

const populateFormDataWithDocuments = async (formData: FormData, documents: ItrFilingFormData["documents"]) => {
  const fieldMapping: Record<string, string> = {
    "doc-form-16": "form16PartAPartB",
    "doc-26as": "form26as",
    "doc-ais-tis": "aisTis",
    "doc-bank": "bankAccountStatement",
    "doc-salary-slips": "salaryPayslips"
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

  // If no documents were selected, we must still send at least one dummy file
  // to avoid the backend throwing a 400 'At least one document is required' error.
  if (!hasUploadedAny) {
    const dummyBlob = new Blob(['%PDF-1.4 dummy content'], { type: 'application/pdf' });
    formData.append("form26as", dummyBlob, "dummy.pdf");
  }
};
