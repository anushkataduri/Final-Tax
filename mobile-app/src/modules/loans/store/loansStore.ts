import { create } from "zustand";
import { authStorage } from "@/modules/authentication/services/authStorage";
import type {
  LoanKycErrors,
} from "../types/loanKyc.types";
import { validateLoanKyc } from "../validation/loanKycValidation";
import { loanKycService } from "../services/loanKycService";
import { validateBusinessLoanForm } from "../businessWorkingCapital/validation/businessLoanValidation";
import { validatePersonalLoanForm } from "../personalLoan/validation/personalLoanValidation";
import { createReviewActions } from "./loansReviewActions";
import {
  createInitialKycData,
  createInitialBusinessFormData,
  createInitialPersonalFormData,
  type LoansStoreState,
  type LoanStep,
} from "./loansStore.types";

export type { LoanStep, LoansStoreState };

export const useLoansStore = create<LoansStoreState>((set, get) => ({
  selectedCategory: null,
  activeStep: "categories",
  returnToReview: false,
  kycData: createInitialKycData(),
  kycStatus: "not_connected",
  kycErrors: {},
  businessFormData: createInitialBusinessFormData(),
  businessErrors: {},
  personalFormData: createInitialPersonalFormData(),
  personalErrors: {},
  uploadedDocuments: {},
  isReviewConsentGiven: false,
  reviewErrors: {},
  submittedApplicationId: null,
  submittedAt: null,
  isSubmissionSynced: false,
  isSubmitting: false,

  selectCategory: (category) =>
    set({
      selectedCategory: category,
      activeStep: "kyc",
      returnToReview: false,
    }),

  setActiveStep: (step) => set({ activeStep: step }),

  editFromReview: (step) => set({ activeStep: step, returnToReview: true }),

  advanceTo: (nextStep) =>
    set((state) =>
      state.returnToReview
        ? { activeStep: "review", returnToReview: false }
        : { activeStep: nextStep }
    ),

  retreatTo: (previousStep) =>
    set((state) =>
      state.returnToReview
        ? { activeStep: "review", returnToReview: false }
        : { activeStep: previousStep }
    ),

  setKycField: (field, value) =>
    set((state) => {
      const nextErrors = { ...state.kycErrors };
      delete nextErrors[field as keyof LoanKycErrors];
      return {
        kycData: { ...state.kycData, [field]: value },
        kycErrors: nextErrors,
      };
    }),

  setCurrentAddressField: (field, value) =>
    set((state) => {
      const updatedCurrent = {
        ...state.kycData.currentAddress,
        [field]: value,
      };
      const nextErrors = { ...state.kycErrors };
      delete nextErrors[`currentAddress.${field}` as keyof LoanKycErrors];
      return {
        kycData: {
          ...state.kycData,
          currentAddress: updatedCurrent,
          permanentAddress: state.kycData.isPermanentSameAsCurrent
            ? { ...updatedCurrent }
            : state.kycData.permanentAddress,
        },
        kycErrors: nextErrors,
      };
    }),

  setPermanentAddressField: (field, value) =>
    set((state) => {
      const nextErrors = { ...state.kycErrors };
      delete nextErrors[`permanentAddress.${field}` as keyof LoanKycErrors];
      return {
        kycData: {
          ...state.kycData,
          permanentAddress: { ...state.kycData.permanentAddress, [field]: value },
        },
        kycErrors: nextErrors,
      };
    }),

  setPermanentSameAsCurrent: (isSame) =>
    set((state) => ({
      kycData: {
        ...state.kycData,
        isPermanentSameAsCurrent: isSame,
        permanentAddress: isSame
          ? { ...state.kycData.currentAddress }
          : state.kycData.permanentAddress,
      },
    })),

  setConsent: (consent) =>
    set((state) => {
      const nextErrors = { ...state.kycErrors };
      if (consent) delete nextErrors.consentGiven;
      return {
        kycData: { ...state.kycData, consentGiven: consent },
        kycErrors: nextErrors,
      };
    }),

  populateFromUserProfile: () => {
    try {
      const profile = authStorage.getUser() as Record<string, string> | null;
      if (!profile) return;

      const pan = (profile.pan || profile.panNumber || "").toUpperCase();
      const aadhaar = profile.aadhaar || profile.aadhaarNumber || "";
      const name = profile.name || profile.fullName || "";
      const rawDob = profile.dob || profile.dateOfBirth || "";
      const mobile = profile.mobileNumber || profile.mobile || "";
      const email = profile.email || "";
      const addressLine1 = profile.addressLine1 || profile.address || "";
      const addressLine2 = profile.addressLine2 || "";
      const city = profile.city || "";
      const state = profile.state || "";
      const pincode = profile.pincode || profile.pinCode || "";

      // Normalize DOB if provided in ISO format YYYY-MM-DD
      let normalizedDob = rawDob;
      if (rawDob) {
        const apiFormat = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawDob.trim());
        if (apiFormat) {
          normalizedDob = `${apiFormat[3]}-${apiFormat[2]}-${apiFormat[1]}`;
        }
      }

      // Handle address splitting if addressLine2 is empty and addressLine1 contains commas
      let houseNumber = addressLine1;
      let street = addressLine2;
      if (!street && addressLine1) {
        const parts = addressLine1.split(/,|\n/).map((p: string) => p.trim()).filter(Boolean);
        if (parts.length > 1) {
          houseNumber = parts[0];
          street = parts.slice(1).join(", ");
        }
      }

      set((prev) => ({
        kycStatus: "not_connected",
        kycData: {
          ...prev.kycData,
          fullName: prev.kycData.fullName || name,
          mobile: prev.kycData.mobile || mobile,
          email: prev.kycData.email || email,
          pan: prev.kycData.pan || pan,
          aadhaar: prev.kycData.aadhaar || aadhaar,
          dob: prev.kycData.dob || normalizedDob,
          currentAddress: {
            houseNumber: prev.kycData.currentAddress.houseNumber || houseNumber,
            street: prev.kycData.currentAddress.street || street,
            city: prev.kycData.currentAddress.city || city,
            state: prev.kycData.currentAddress.state || state,
            pincode: prev.kycData.currentAddress.pincode || pincode,
          },
          isProfilePrefilled: Boolean(name || mobile || pan || aadhaar),
        },
      }));
    } catch {
      // Graceful fallback
    }
  },

  validateForm: () => {
    const requirements = loanKycService.getProviderRequirements(
      get().selectedCategory?.id
    );
    const { isValid, errors } = validateLoanKyc(get().kycData, requirements);
    set({ kycErrors: errors });
    return isValid;
  },

  clearKycErrors: () => set({ kycErrors: {} }),
  resetKycData: () => set({ kycData: createInitialKycData(), kycErrors: {} }),

  // Step 2 Actions
  setLoanType: (type) =>
    set((state) => ({
      businessFormData: { ...state.businessFormData, loanType: type },
      businessErrors: {},
    })),

  setBusinessProfileField: (field, value) =>
    set((state) => {
      const nextErrors = { ...state.businessErrors };
      delete nextErrors[field as string];
      return {
        businessFormData: {
          ...state.businessFormData,
          businessProfile: {
            ...state.businessFormData.businessProfile,
            [field]: value,
          },
        },
        businessErrors: nextErrors,
      };
    }),

  setBusinessLoanField: (field, value) =>
    set((state) => {
      const nextErrors = { ...state.businessErrors };
      const map: Record<string, string> = {
        loanAmount: "businessLoanAmount",
        purpose: "businessLoanPurpose",
        purposeOther: "businessLoanPurposeOther",
        purposeDescription: "businessLoanDescription",
        projectCost: "businessLoanProjectCost",
      };
      if (map[field]) delete nextErrors[map[field]];
      return {
        businessFormData: {
          ...state.businessFormData,
          businessLoan: {
            ...state.businessFormData.businessLoan,
            [field]: value,
          },
        },
        businessErrors: nextErrors,
      };
    }),

  setWorkingCapitalField: (field, value) =>
    set((state) => {
      const nextErrors = { ...state.businessErrors };
      const map: Record<string, string> = {
        loanAmount: "workingCapitalAmount",
        purpose: "workingCapitalPurpose",
        purposeOther: "workingCapitalPurposeOther",
        purposeDescription: "workingCapitalDescription",
        monthlySales: "monthlySales",
        monthlyExpenses: "monthlyExpenses",
      };
      if (map[field]) delete nextErrors[map[field]];
      return {
        businessFormData: {
          ...state.businessFormData,
          workingCapital: {
            ...state.businessFormData.workingCapital,
            [field]: value,
          },
        },
        businessErrors: nextErrors,
      };
    }),

  validateBusinessForm: () => {
    const { isValid, errors } = validateBusinessLoanForm(get().businessFormData);
    set({ businessErrors: errors });
    return isValid;
  },

  clearBusinessErrors: () => set({ businessErrors: {} }),
  resetBusinessFormData: () =>
    set({
      businessFormData: createInitialBusinessFormData(),
      businessErrors: {},
    }),

  // Step 2 Personal Loan Actions
  setPersonalEmploymentType: (type) =>
    set((state) => ({
      personalFormData: { ...state.personalFormData, employmentType: type },
      personalErrors: {},
    })),

  setPersonalLoanField: (field, value) =>
    set((state) => {
      const nextErrors = { ...state.personalErrors };
      delete nextErrors[field];
      const updated = {
        ...state.personalFormData,
        [field]: value,
      };
      if (field === "loanAmount") {
        updated.requestedAmount = value as string;
        delete nextErrors.requestedAmount;
      }
      if (field === "requestedAmount") {
        updated.loanAmount = value as string;
        delete nextErrors.loanAmount;
      }
      if (field === "employerName") {
        updated.companyName = value as string;
        delete nextErrors.companyName;
      }
      if (field === "companyName") {
        updated.employerName = value as string;
        delete nextErrors.employerName;
      }
      if (field === "monthlyNetSalary") {
        updated.monthlySalary = value as string;
        delete nextErrors.monthlySalary;
      }
      if (field === "monthlySalary") {
        updated.monthlyNetSalary = value as string;
        delete nextErrors.monthlyNetSalary;
      }
      if (field === "businessOrProfessionName") {
        updated.professionName = value as string;
        delete nextErrors.professionName;
      }
      if (field === "professionName") {
        updated.businessOrProfessionName = value as string;
        delete nextErrors.businessOrProfessionName;
      }
      if (field === "averageMonthlyIncome") {
        updated.monthlyIncome = value as string;
        delete nextErrors.monthlyIncome;
      }
      if (field === "monthlyIncome") {
        updated.averageMonthlyIncome = value as string;
        delete nextErrors.averageMonthlyIncome;
      }

      return {
        personalFormData: updated,
        personalErrors: nextErrors,
      };
    }),

  validatePersonalForm: () => {
    const { isValid, errors } = validatePersonalLoanForm(get().personalFormData);
    set({ personalErrors: errors });
    return isValid;
  },

  clearPersonalErrors: () => set({ personalErrors: {} }),
  resetPersonalFormData: () =>
    set({
      personalFormData: createInitialPersonalFormData(),
      personalErrors: {},
    }),

  // Documents, consent and submission
  ...createReviewActions(set, get),

  resetAll: () =>
    set({
      selectedCategory: null,
      activeStep: "categories",
      returnToReview: false,
      kycData: createInitialKycData(),
      kycErrors: {},
      kycStatus: "not_connected",
      businessFormData: createInitialBusinessFormData(),
      businessErrors: {},
      personalFormData: createInitialPersonalFormData(),
      personalErrors: {},
      uploadedDocuments: {},
      isReviewConsentGiven: false,
      reviewErrors: {},
      submittedApplicationId: null,
      submittedAt: null,
      isSubmissionSynced: false,
      isSubmitting: false,
    }),
}));
