import type { StoreApi } from "zustand";
import { validateBusinessLoanForm } from "../businessWorkingCapital/validation/businessLoanValidation";
import type {
  BusinessLoanType,
  CommonBusinessProfile,
  BusinessLoanDetails,
  WorkingCapitalDetails,
} from "../businessWorkingCapital/types/businessLoan.types";
import { createInitialBusinessFormData, type LoansStoreState } from "./loansStore.types";

type Set = StoreApi<LoansStoreState>["setState"];
type Get = StoreApi<LoansStoreState>["getState"];

export const createBusinessLoanStoreActions = (set: Set, get: Get) => ({
  setLoanType: (type: BusinessLoanType) =>
    set((state) => {
      const uploadedDocuments = { ...state.uploadedDocuments };
      if (state.businessFormData.loanType !== type) {
        delete uploadedDocuments.bank_statement;
      }
      return {
        businessFormData: { ...state.businessFormData, loanType: type },
        uploadedDocuments,
        businessErrors: {},
      };
    }),

  setBusinessProfileField: <K extends keyof CommonBusinessProfile>(
    field: K,
    value: CommonBusinessProfile[K],
  ) =>
    set((state) => {
      const nextErrors = { ...state.businessErrors };
      delete nextErrors[field as string];
      const uploadedDocuments = { ...state.uploadedDocuments };
      if (
        field === "isGstRegistered" &&
        state.businessFormData.businessProfile.isGstRegistered !== value
      ) {
        delete uploadedDocuments.gst_certificate;
      }
      return {
        businessFormData: {
          ...state.businessFormData,
          businessProfile: { ...state.businessFormData.businessProfile, [field]: value },
        },
        uploadedDocuments,
        businessErrors: nextErrors,
      };
    }),

  setBusinessLoanField: <K extends keyof BusinessLoanDetails>(
    field: K,
    value: BusinessLoanDetails[K],
  ) =>
    set((state) => {
      const nextErrors = { ...state.businessErrors };
      const errorKeyMap: Record<string, string> = {
        loanAmount: "businessLoanAmount",
        purpose: "businessLoanPurpose",
        purposeOther: "businessLoanPurposeOther",
        purposeDescription: "businessLoanDescription",
        projectCost: "businessLoanProjectCost",
      };
      const mappedKey = errorKeyMap[field as string];
      if (mappedKey) delete nextErrors[mappedKey];
      return {
        businessFormData: {
          ...state.businessFormData,
          businessLoan: { ...state.businessFormData.businessLoan, [field]: value },
        },
        businessErrors: nextErrors,
      };
    }),

  setWorkingCapitalField: <K extends keyof WorkingCapitalDetails>(
    field: K,
    value: WorkingCapitalDetails[K],
  ) =>
    set((state) => {
      const nextErrors = { ...state.businessErrors };
      const errorKeyMap: Record<string, string> = {
        loanAmount: "workingCapitalAmount",
        purpose: "workingCapitalPurpose",
        purposeOther: "workingCapitalPurposeOther",
        purposeDescription: "workingCapitalDescription",
        monthlySales: "monthlySales",
        monthlyExpenses: "monthlyExpenses",
      };
      const mappedKey = errorKeyMap[field as string];
      if (mappedKey) delete nextErrors[mappedKey];
      return {
        businessFormData: {
          ...state.businessFormData,
          workingCapital: { ...state.businessFormData.workingCapital, [field]: value },
        },
        businessErrors: nextErrors,
      };
    }),

  validateBusinessForm: (): boolean => {
    const { isValid, errors } = validateBusinessLoanForm(get().businessFormData);
    set({ businessErrors: errors });
    return isValid;
  },

  clearBusinessErrors: () => set({ businessErrors: {} }),

  resetBusinessFormData: () =>
    set({ businessFormData: createInitialBusinessFormData(), businessErrors: {} }),
});
