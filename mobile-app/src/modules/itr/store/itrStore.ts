import { create } from "zustand";
import { getInitialFormData } from "./itrInitialState";
import { recalculateItrForm } from "./itrStoreHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/authStore";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { addDraftToIndex, removeDraftFromIndex } from "@/shared/hooks/useServiceDraft";
import type {
  ItrFilingFormData,
  IncomeSourcesState,
} from "../itr-filing/types/itrFiling.types";
import { calculateItrTax } from "../itr-filing/engine/itrTaxCalculator";
import { generateDynamicDocumentChecklist } from "../itr-filing/engine/itrDocumentEngine";
import type { ITRState, ItrDraftState, ItrDocumentFileInfo } from "./itrStore.types";

export type { ItrDraftState, ItrDocumentFileInfo };


type DraftPayload = {
  stepIndex?: number;
  step?: number;
  formData?: ItrFilingFormData;
  filingData?: ItrFilingFormData;
  id?: string;
  updatedAt?: string;
};

function getMobileKey(suffix: string): string {
  const authState = useAuthStore.getState();
  const mobile =
    authState.customer?.mobile ||
    authState.authenticatedUser?.mobileNumber ||
    authState.mobileNumber ||
    "user";
  const clean = String(mobile).replace(/\D/g, "") || "user";
  return `@taxedge_draft_${clean}_${suffix}`;
}

export const useITRStore = create<ITRState>((set, get) => ({
  currentStep: 0,
  maxStepReached: 0,
  setStep: (step) => set((state) => ({
    currentStep: step,
    maxStepReached: Math.max(state.maxStepReached, step),
  })),
  setBackendIds: (ids) =>
    set((state) => ({
      formData: { ...state.formData, ...ids },
    })),
  formData: getInitialFormData(),
  setCategory: (category) =>
    set((state) => {
      const prevSources = state.formData.incomeSources;
      let newSources: IncomeSourcesState = {
        salary: { ...prevSources.salary, enabled: false },
        houseProperty: { ...prevSources.houseProperty, enabled: false },
        business: { ...prevSources.business, enabled: false },
        capitalGains: { ...prevSources.capitalGains, enabled: false },
        otherSources: { ...prevSources.otherSources, enabled: false },
      };
      if (category === "salaried") newSources.salary.enabled = true;
      else if (category === "business") { newSources.business.enabled = true; newSources.business.businessType = "presumptive_44ad"; }
      else if (category === "professional" || category === "freelancer") { newSources.business.enabled = true; newSources.business.businessType = "presumptive_44ada"; }
      else if (category === "trader_investor") { newSources.capitalGains.enabled = true; newSources.capitalGains.hasFnoIntraday = true; }
      else if (category === "rental") { newSources.houseProperty.enabled = true; newSources.houseProperty.propertyType = "let_out"; }
      else if (category === "capital_gains") { newSources.capitalGains.enabled = true; }
      else if (category === "multiple") { newSources.salary.enabled = true; newSources.business.enabled = true; }
      return { formData: recalculateItrForm({ ...state.formData, category, incomeSources: newSources }) };
    }),
  setPersonalInfo: (info) =>
    set((state) => {
      const personalInfo = { ...state.formData.personalInfo, ...info };
      return { formData: recalculateItrForm({ ...state.formData, personalInfo }) };
    }),
  selectRefundBank: (bankId) =>
    set((state) => {
      const updatedAccounts = state.formData.bankAccountsList.map((bank) => ({
        ...bank,
        isPrimaryRefund: bank.id === bankId,
      }));
      const selected = updatedAccounts.find((b) => b.id === bankId);
      if (!selected) return state;
      return {
        formData: {
          ...state.formData,
          bankAccountsList: updatedAccounts,
          bankDetails: {
            bankName: selected.bankName,
            accountNumber: selected.accountNumber,
            confirmAccountNumber: selected.accountNumber,
            ifscCode: selected.ifscCode,
            accountType: selected.accountType,
            isPrimaryRefund: true,
            validationStatus: selected.validationStatus,
          },
        },
      };
    }),
  addBankAccount: (newBank) =>
    set((state) => ({
      formData: {
        ...state.formData,
        bankAccountsList: [...state.formData.bankAccountsList, newBank],
      },
    })),
  setBankDetails: (details) =>
    set((state) => ({
      formData: {
        ...state.formData,
        bankDetails: { ...state.formData.bankDetails, ...details },
      },
    })),
  setPriorItrNotice: (data) =>
    set((state) => {
      const priorItrNotice = { ...state.formData.priorItrNotice, ...data };
      const documents = generateDynamicDocumentChecklist(
        state.formData.incomeSources,
        priorItrNotice,
        state.formData.deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );
      return { formData: { ...state.formData, priorItrNotice, documents } };
    }),
  importPriorItrData: (selectedKeys) =>
    set((state) => {
      const prior = state.formData.priorItrNotice;
      return {
        formData: {
          ...state.formData,
          priorItrNotice: {
            ...prior,
            importedIncomeDetails: selectedKeys.income ?? prior.importedIncomeDetails,
            importedDeductions: selectedKeys.deductions ?? prior.importedDeductions,
            importedLosses: selectedKeys.losses ?? prior.importedLosses,
            importedBankDetails: selectedKeys.bank ?? prior.importedBankDetails,
            importedFilingDetails: selectedKeys.filing ?? prior.importedFilingDetails,
          },
        },
      };
    }),
  setIncomeSalary: (data) =>
    set((state) => {
      const salary = { ...state.formData.incomeSources.salary, ...data };
      return { formData: recalculateItrForm({ ...state.formData, incomeSources: { ...state.formData.incomeSources, salary } }) };
    }),
  setIncomeHouseProperty: (data) =>
    set((state) => {
      const houseProperty = { ...state.formData.incomeSources.houseProperty, ...data };
      return { formData: recalculateItrForm({ ...state.formData, incomeSources: { ...state.formData.incomeSources, houseProperty } }) };
    }),
  setIncomeBusiness: (data) =>
    set((state) => {
      const business = { ...state.formData.incomeSources.business, ...data };
      return { formData: recalculateItrForm({ ...state.formData, incomeSources: { ...state.formData.incomeSources, business } }) };
    }),
  setIncomeCapitalGains: (data) =>
    set((state) => {
      const capitalGains = { ...state.formData.incomeSources.capitalGains, ...data };
      return { formData: recalculateItrForm({ ...state.formData, incomeSources: { ...state.formData.incomeSources, capitalGains } }) };
    }),
  setIncomeOtherSources: (data) =>
    set((state) => {
      const otherSources = { ...state.formData.incomeSources.otherSources, ...data };
      return { formData: recalculateItrForm({ ...state.formData, incomeSources: { ...state.formData.incomeSources, otherSources } }) };
    }),
  setRegime: (regime) =>
    set((state) => ({ formData: recalculateItrForm({ ...state.formData, regime }) })),
  setDeductions: (deductionsPartial) =>
    set((state) => {
      const deductions = { ...state.formData.deductions, ...deductionsPartial };
      const ay = state.formData.personalInfo.assessmentYear;
      const calculation = calculateItrTax(state.formData.incomeSources, deductions, state.formData.taxesPaid, state.formData.regime, ay);
      const documents = generateDynamicDocumentChecklist(state.formData.incomeSources, state.formData.priorItrNotice, deductions, state.formData.taxesPaid, state.formData.regime, state.formData.personalInfo, state.formData.documents);
      return { formData: { ...state.formData, deductions, calculation, documents } };
    }),
  setTaxesPaid: (taxesPartial) =>
    set((state) => {
      const taxesPaid = { ...state.formData.taxesPaid, ...taxesPartial };
      const ay = state.formData.personalInfo.assessmentYear;
      const calculation = calculateItrTax(state.formData.incomeSources, state.formData.deductions, taxesPaid, state.formData.regime, ay);
      const documents = generateDynamicDocumentChecklist(state.formData.incomeSources, state.formData.priorItrNotice, state.formData.deductions, taxesPaid, state.formData.regime, state.formData.personalInfo, state.formData.documents);
      return { formData: { ...state.formData, taxesPaid, calculation, documents } };
    }),
  setDeclarationAccepted: (declarationAccepted) =>
    set((state) => ({ formData: { ...state.formData, declarationAccepted } })),
  updateDocument: (docId, fileInfo: ItrDocumentFileInfo | null) =>
    set((state) => {
      const updatedDocs = state.formData.documents.map((doc) => {
        if (doc.id !== docId) return doc;
        if (!fileInfo) {
          return { ...doc, fileUri: undefined, fileName: undefined, fileSize: undefined, mimeType: undefined, uploadedAt: undefined };
        }
        return { ...doc, fileUri: fileInfo.uri, fileName: fileInfo.name, fileSize: fileInfo.size, mimeType: fileInfo.mimeType, uploadedAt: new Date().toISOString() };
      });
      return { formData: { ...state.formData, documents: updatedDocs } };
    }),
  updateGstReconciliation: (gstData) =>
    set((state) => {
      const existing = state.formData.gstReconciliation;
      if (!existing) return state;
      return { formData: { ...state.formData, gstReconciliation: { ...existing, ...gstData } } };
    }),
  itrDraft: null,
  saveItrDraft: () => {
    const { currentStep, formData } = get();
    const draft: ItrDraftState = {
      id: `itr-draft-${Date.now()}`,
      stepIndex: currentStep,
      formData,
      updatedAt: new Date().toISOString(),
    };
    set({ itrDraft: draft });
    const authState = useAuthStore.getState();
    const mobile = authState.customer?.mobile || authState.authenticatedUser?.mobileNumber || authState.mobileNumber || "user";
    const clean = String(mobile).replace(/\D/g, "") || "user";
    addDraftToIndex(clean, "itr-filing");
    AsyncStorage.setItem(
      `@taxedge_draft_${clean}_itr-filing`,
      JSON.stringify({ serviceKey: "itr-filing", serviceName: "ITR Filing", category: "ITR", step: currentStep, stepIndex: currentStep, formData, documents: formData.documents, updatedAt: draft.updatedAt })
    ).catch(() => {});
  },
  restoreItrDraft: async () => {
    try {
      const key = getMobileKey("itr-filing");
      const raw = await AsyncStorage.getItem(key);
      let draftData: DraftPayload | null = null;
      if (raw) {
        draftData = JSON.parse(raw) as DraftPayload;
      } else {
        draftData = get().itrDraft;
      }
      if (!draftData) return false;
      const restoredStep =
        typeof draftData.stepIndex === "number" ? draftData.stepIndex
          : typeof draftData.step === "number" ? draftData.step
          : 0;
      const restoredFormData = draftData.formData || draftData.filingData;
      if (restoredFormData) {
        set({
          currentStep: restoredStep,
          formData: { ...getInitialFormData(), ...restoredFormData },
          itrDraft: {
            id: draftData.id || `itr-draft-${Date.now()}`,
            stepIndex: restoredStep,
            formData: restoredFormData,
            updatedAt: draftData.updatedAt || new Date().toISOString(),
          },
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  clearItrDraft: () => {
    set({ itrDraft: null });
    const authState = useAuthStore.getState();
    const mobile = authState.customer?.mobile || authState.authenticatedUser?.mobileNumber || authState.mobileNumber || "user";
    const clean = String(mobile).replace(/\D/g, "") || "user";
    removeDraftFromIndex(clean, "itr-filing");
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_itr-filing`).catch(() => {});
  },
  resetForm: () =>
    set({ currentStep: 0, maxStepReached: 0, formData: getInitialFormData(), itrDraft: null }),
  fetchAndPopulateUserProfile: async () => {
    try {
      const profile = authStorage.getUser() as unknown as Record<string, unknown>;
      if (profile) {
        const pan = (profile.pan || profile.panNumber || "") as string;
        const aadhaar = (profile.aadhaar || profile.aadhaarNumber || "") as string;
        const name = (profile.name || profile.fullName || "") as string;
        const dob = (profile.dob || profile.dateOfBirth || "") as string;
        const mobile = (profile.mobileNumber || profile.mobile || "") as string;
        const email = (profile.email || "") as string;
        const address = (profile.address || profile.addressLine1 || "") as string;
        const city = (profile.city || "") as string;
        const userState = (profile.state || "") as string;
        const pincode = (profile.pincode || profile.pinCode || "") as string;
        set((prev) => ({
          formData: {
            ...prev.formData,
            personalInfo: {
              ...prev.formData.personalInfo,
              pan: pan || prev.formData.personalInfo.pan,
              aadhaar: aadhaar || prev.formData.personalInfo.aadhaar,
              name: name || prev.formData.personalInfo.name,
              dob: dob || prev.formData.personalInfo.dob,
              mobile: mobile || prev.formData.personalInfo.mobile,
              email: email || prev.formData.personalInfo.email,
              address: address || prev.formData.personalInfo.address,
              city: city || prev.formData.personalInfo.city,
              state: userState || prev.formData.personalInfo.state,
              pincode: pincode || prev.formData.personalInfo.pincode,
              isAutoVerified: Boolean(pan || prev.formData.personalInfo.pan),
            },
          },
        }));
      }
    } catch {
      // Graceful fallback to existing state
    }
  },
}));
