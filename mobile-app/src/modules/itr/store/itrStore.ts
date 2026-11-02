import { create } from "zustand";
import { getInitialFormData } from "./itrInitialState";
import { recalculateItrForm } from "./itrStoreHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/authStore";
import { useApplicationStore } from "@/store/applicationStore";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { addDraftToIndex, removeDraftFromIndex } from "@/shared/hooks/useServiceDraft";
import {
  ItrFilingFormData,
  ItrPersonalInfo,
  ItrBankDetails,
  ItrSelectableBank,
  ItrPriorFilingAndNotice,
  IncomeSalaryData,
  IncomeHousePropertyData,
  IncomeBusinessData,
  IncomeCapitalGainsData,
  IncomeOtherSourcesData,
  ItrStructuredDeductions,
  TaxesPaidDetails,
  TaxRegimeType,
  ItrDocumentItem,
  GstReconciliationSummary,
  ItrCategoryType,
  IncomeSourcesState,
} from "../itr-filing/types/itrFiling.types";
import { determineApplicableItrForm } from "../itr-filing/engine/itrFormEngine";
import { calculateItrTax } from "../itr-filing/engine/itrTaxCalculator";
import { generateDynamicDocumentChecklist } from "../itr-filing/engine/itrDocumentEngine";
import { getCurrentAssessmentYear } from "../taxRules";
export interface ItrDraftState {
  id: string;
  stepIndex: number;
  formData: ItrFilingFormData;
  updatedAt: string;
}
interface ITRState {
  currentStep: number;
  maxStepReached: number;
  setStep: (step: number) => void;
  formData: ItrFilingFormData;
  // Specific Step updaters
  setCategory: (category: ItrCategoryType) => void;
  setPersonalInfo: (info: Partial<ItrPersonalInfo>) => void;
  selectRefundBank: (bankId: string) => void;
  addBankAccount: (bank: ItrSelectableBank) => void;
  updateBankAccount: (bank: ItrSelectableBank) => void;
  setBankDetails: (details: Partial<ItrBankDetails>) => void;
  setPriorItrNotice: (data: Partial<ItrPriorFilingAndNotice>) => void;
  importPriorItrData: (selectedKeys: {
    income?: boolean;
    deductions?: boolean;
    losses?: boolean;
    bank?: boolean;
    filing?: boolean;
  }) => void;
  setIncomeSalary: (data: Partial<IncomeSalaryData>) => void;
  setIncomeHouseProperty: (data: Partial<IncomeHousePropertyData>) => void;
  setIncomeBusiness: (data: Partial<IncomeBusinessData>) => void;
  setIncomeCapitalGains: (data: Partial<IncomeCapitalGainsData>) => void;
  setIncomeOtherSources: (data: Partial<IncomeOtherSourcesData>) => void;
  setRegime: (regime: TaxRegimeType) => void;
  setDeductions: (deductions: Partial<ItrStructuredDeductions>) => void;
  setTaxesPaid: (taxes: Partial<TaxesPaidDetails>) => void;
  setDeclarationAccepted: (accepted: boolean) => void;
  updateDocument: (docId: string, fileInfo: any) => void;
  updateGstReconciliation: (data: Partial<GstReconciliationSummary>) => void;
  setBackendIds: (ids: { itrId?: string; incomeId?: string; documentId?: string }) => void;
  // Draft handling
  itrDraft: ItrDraftState | null;
  saveItrDraft: () => void;
  restoreItrDraft: () => Promise<boolean>;
  clearItrDraft: () => void;
  resetForm: () => void;
  fetchAndPopulateUserProfile: () => Promise<void>;
}
export const useITRStore = create<ITRState>((set, get) => ({
  currentStep: 0,
  maxStepReached: 0,
  setStep: (step) => set((state) => ({
    currentStep: step,
    maxStepReached: Math.max(state.maxStepReached, step)
  })),
  setBackendIds: (ids) =>
    set((state) => ({
      formData: { ...state.formData, ...ids },
    })),
  formData: getInitialFormData(),
  setCategory: (category: ItrCategoryType) =>
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
      return { formData: recalculateItrForm({ ...state.formData,
          category,
          incomeSources: newSources, }) };
    }),
  setPersonalInfo: (info) =>
    set((state) => {
      const personalInfo = { ...state.formData.personalInfo, ...info };
      return { formData: recalculateItrForm({ ...state.formData,
          personalInfo,
           }) };
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
  updateBankAccount: (updatedBank) =>
    set((state) => {
      const updatedList = state.formData.bankAccountsList.map((b) =>
        b.id === updatedBank.id ? updatedBank : b
      );
      const isSelected = state.formData.bankDetails.accountNumber === updatedBank.accountNumber;
      return {
        formData: {
          ...state.formData,
          bankAccountsList: updatedList,
          ...(isSelected
            ? {
                bankDetails: {
                  ...state.formData.bankDetails,
                  bankName: updatedBank.bankName,
                  accountNumber: updatedBank.accountNumber,
                  ifscCode: updatedBank.ifscCode,
                  accountType: updatedBank.accountType,
                },
              }
            : {}),
        },
      };
    }),
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
      return {
        formData: {
          ...state.formData,
          priorItrNotice,
          documents,
        },
      };
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
      const incomeSources = { ...state.formData.incomeSources, salary };
      return { formData: recalculateItrForm({ ...state.formData,
          incomeSources, }) };
    }),
  setIncomeHouseProperty: (data) =>
    set((state) => {
      const houseProperty = {
        ...state.formData.incomeSources.houseProperty,
        ...data,
      };
      const incomeSources = { ...state.formData.incomeSources, houseProperty };
      return { formData: recalculateItrForm({ ...state.formData,
          incomeSources, }) };
    }),
  setIncomeBusiness: (data) =>
    set((state) => {
      const business = { ...state.formData.incomeSources.business, ...data };
      const incomeSources = { ...state.formData.incomeSources, business };
      return { formData: recalculateItrForm({ ...state.formData,
          incomeSources, }) };
    }),
  setIncomeCapitalGains: (data) =>
    set((state) => {
      const capitalGains = {
        ...state.formData.incomeSources.capitalGains,
        ...data,
      };
      const incomeSources = { ...state.formData.incomeSources, capitalGains };
      return { formData: recalculateItrForm({ ...state.formData,
          incomeSources, }) };
    }),
  setIncomeOtherSources: (data) =>
    set((state) => {
      const otherSources = {
        ...state.formData.incomeSources.otherSources,
        ...data,
      };
      const incomeSources = { ...state.formData.incomeSources, otherSources };
      return { formData: recalculateItrForm({ ...state.formData, incomeSources }) };
    }),
    setRegime: (regime) =>
    set((state) => {
      return { formData: recalculateItrForm({ ...state.formData, regime }) };
    }),

  setDeductions: (deductionsPartial) =>
    set((state) => {
      const deductions = {
        ...state.formData.deductions,
        ...deductionsPartial,
      };
      const ay = state.formData.personalInfo.assessmentYear;
      const calculation = calculateItrTax(
        state.formData.incomeSources,
        deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        ay
      );
      const documents = generateDynamicDocumentChecklist(
        state.formData.incomeSources,
        state.formData.priorItrNotice,
        deductions,
        state.formData.taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );
      return {
        formData: {
          ...state.formData,
          deductions,
          calculation,
          documents,
        },
      };
    }),
  setTaxesPaid: (taxesPartial) =>
    set((state) => {
      const taxesPaid = { ...state.formData.taxesPaid, ...taxesPartial };
      const ay = state.formData.personalInfo.assessmentYear;
      const calculation = calculateItrTax(
        state.formData.incomeSources,
        state.formData.deductions,
        taxesPaid,
        state.formData.regime,
        ay
      );
      const documents = generateDynamicDocumentChecklist(
        state.formData.incomeSources,
        state.formData.priorItrNotice,
        state.formData.deductions,
        taxesPaid,
        state.formData.regime,
        state.formData.personalInfo,
        state.formData.documents
      );
      return {
        formData: {
          ...state.formData,
          taxesPaid,
          calculation,
          documents,
        },
      };
    }),
  setDeclarationAccepted: (declarationAccepted) =>
    set((state) => ({
      formData: { ...state.formData, declarationAccepted },
    })),
  updateDocument: (docId, fileInfo) =>
    set((state) => ({
      formData: {
        ...state.formData,
        documents: state.formData.documents.map((doc) =>
          doc.id !== docId
            ? doc
            : fileInfo
              ? { ...doc, fileUri: fileInfo.uri, fileName: fileInfo.name, fileSize: fileInfo.size, mimeType: fileInfo.type, uploadedAt: new Date().toISOString() }
              : { ...doc, fileUri: undefined, fileName: undefined, fileSize: undefined, mimeType: undefined, uploadedAt: undefined }
        ),
      },
    })),
  updateGstReconciliation: (gstData) =>
    set((state) => {
      const existing = state.formData.gstReconciliation;
      if (!existing) return state;
      return {
        formData: {
          ...state.formData,
          gstReconciliation: {
            ...existing,
            ...gstData,
          },
        },
      };
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
    const auth = useAuthStore.getState();
    const rawMobile = auth.customer?.mobile || auth.authenticatedUser?.mobileNumber || auth.mobileNumber || "user";
    const clean = String(rawMobile).replace(/\D/g, "") || "user";
    addDraftToIndex(clean, "itr-filing");
    useApplicationStore.getState().saveItrDraft({
      id: draft.id,
      stepIndex: currentStep,
      category: formData.category || "salaried",
      categoryTitle: formData.determinedForm?.formTitle || "ITR Filing",
      formType: formData.determinedForm?.form || "ITR-1",
      assessmentYear: formData.personalInfo?.assessmentYear || "",
      incomeAmount: String(formData.calculation?.grossTotalIncome || "0"),
      regime: formData.regime || "new",
      bankDetails: {
        bankName: formData.bankDetails?.bankName || "",
        accountNumber: formData.bankDetails?.accountNumber || "",
        ifscCode: formData.bankDetails?.ifscCode || "",
        accountType: formData.bankDetails?.accountType || "Savings",
      },
      deductions: {
        sec80c: String(formData.calculation?.totalDeductions || "0"),
        sec80d: formData.deductions?.sec80d?.selfSpouseChildren || "0",
        homeLoan24b: formData.deductions?.sec24b || "0",
        educationLoan80e: formData.deductions?.sec80e || "0",
        otherDeductions: "0",
      },
      previousFilingOption: formData.priorItrNotice?.hasPreviousItr ? "yes" : "no",
      previousAckNumber: formData.priorItrNotice?.previousAckNumber || "",
      documents: (formData.documents || []) as any,
      filingData: formData as any,
      updatedAt: draft.updatedAt,
    } as any);
    AsyncStorage.setItem(
      `@taxedge_draft_${clean}_itr-filing`,
      JSON.stringify({
        serviceKey: "itr-filing",
        serviceName: "ITR Filing",
        category: "ITR",
        step: currentStep,
        stepIndex: currentStep,
        formData,
        documents: formData.documents,
        updatedAt: draft.updatedAt,
      })
    ).catch(() => {});
  },
  restoreItrDraft: async () => {
    try {
      const authState = useAuthStore.getState();
      const mobile =
        authState.customer?.mobile ||
        authState.authenticatedUser?.mobileNumber ||
        authState.mobileNumber ||
        "user";
      const clean = String(mobile).replace(/\D/g, "") || "user";
      const raw = await AsyncStorage.getItem(`@taxedge_draft_${clean}_itr-filing`);
      let draftData: any = null;
      if (raw) {
        draftData = JSON.parse(raw);
      } else {
        draftData = get().itrDraft;
      }
      if (!draftData) return false;
      const restoredStep =
        typeof draftData.stepIndex === "number"
          ? draftData.stepIndex
          : typeof draftData.step === "number"
            ? draftData.step
            : 0;
      const restoredFormData = draftData.formData || draftData.filingData;
      if (restoredFormData) {
        set({
          currentStep: restoredStep,
          formData: {
            ...getInitialFormData(),
            ...restoredFormData,
          },
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
    const auth = useAuthStore.getState();
    const rawMobile = auth.customer?.mobile || auth.authenticatedUser?.mobileNumber || auth.mobileNumber || "user";
    const clean = String(rawMobile).replace(/\D/g, "") || "user";
    removeDraftFromIndex(clean, "itr-filing");
    useApplicationStore.getState().clearItrDraft();
    AsyncStorage.removeItem(`@taxedge_draft_${clean}_itr-filing`).catch(() => {});
  },
  resetForm: () =>
    set({
      currentStep: 0,
  maxStepReached: 0,
      formData: getInitialFormData(),
      itrDraft: null,
    }),
  fetchAndPopulateUserProfile: async () => {
    try {
      const p = authStorage.getUser() as any;
      if (!p) return;
      set((prev) => ({
        formData: {
          ...prev.formData,
          personalInfo: {
            ...prev.formData.personalInfo,
            pan: p.pan || p.panNumber || prev.formData.personalInfo.pan,
            aadhaar: p.aadhaar || p.aadhaarNumber || prev.formData.personalInfo.aadhaar,
            name: p.name || p.fullName || prev.formData.personalInfo.name,
            dob: p.dob || p.dateOfBirth || prev.formData.personalInfo.dob,
            mobile: p.mobileNumber || p.mobile || prev.formData.personalInfo.mobile,
            email: p.email || prev.formData.personalInfo.email,
            address: p.address || p.addressLine1 || prev.formData.personalInfo.address,
            city: p.city || prev.formData.personalInfo.city,
            state: p.state || prev.formData.personalInfo.state,
            pincode: p.pincode || p.pinCode || prev.formData.personalInfo.pincode,
            isAutoVerified: Boolean(p.pan || p.panNumber || prev.formData.personalInfo.pan),
          },
        },
      }));
    } catch {}
  },
}));
