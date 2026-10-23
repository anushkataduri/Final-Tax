import type { StoreApi } from "zustand";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { isProfileComplete } from "@/shared/guards/serviceAccess";
import { resolveLoanCategory } from "../constants/loanCategories";
import { getLoanEntryStep } from "../constants/loanFlow";
import {
  createInitialKycData,
  createInitialBusinessFormData,
  createInitialPersonalFormData,
  createInitialHomeLoanFormData,
  type LoansStoreState,
  type LoanStep,
} from "./loansStore.types";
import { createInitialPropertyFormData } from "../property/types/property.types";
import { createInitialVehicleLoanFormData } from "../vehicle/types/vehicleLoan.types";
import { createInitialMachineryLoanFormData } from "../machinery/types/machinery.types";
import { createInitialMsmeLoanFormData } from "../msme/types/msmeLoan.types";
import type { LoanCategory } from "../types/loanCategory.types";

type Set = StoreApi<LoansStoreState>["setState"];
type Get = StoreApi<LoansStoreState>["getState"];

const getProfileCompleteStatus = () => {
  const authState = useAuthStore.getState();
  const storageUser = authStorage.getUser();
  return isProfileComplete({
    profileCompleted: authState.profileCompleted,
    isExistingUser: authState.isExistingUser,
    customerExists: authState.customerExists,
    customer: authState.customer ?? (storageUser as Parameters<typeof isProfileComplete>[0]["customer"]),
    authenticatedUser: authState.authenticatedUser ?? (storageUser as Parameters<typeof isProfileComplete>[0]["authenticatedUser"]),
  });
};

const resetProductState = () => ({
  completedSteps: [] as LoanStep[],
  kycStatus: "not_connected" as const,
  kycErrors: {},
  businessFormData: createInitialBusinessFormData(),
  businessErrors: {},
  personalFormData: createInitialPersonalFormData(),
  personalErrors: {},
  homeLoanFormData: createInitialHomeLoanFormData(),
  homeLoanErrors: {},
  propertyFormData: createInitialPropertyFormData(),
  propertyErrors: {},
  vehicleFormData: createInitialVehicleLoanFormData(),
  vehicleErrors: {},
  invalidVehicleMoneyFields: {},
  machineryFormData: createInitialMachineryLoanFormData(),
  machineryErrors: {},
  invalidMachineryMoneyFields: {},
  msmeFormData: createInitialMsmeLoanFormData(),
  msmeErrors: {},
  invalidMsmeMoneyFields: {},
  uploadedDocuments: {},
  isReviewConsentGiven: false,
  reviewErrors: {},
  submittedApplicationId: null,
  submittedAt: null,
  isSubmissionSynced: false,
  isSubmitting: false,
});

export const createNavigationActions = (set: Set, get: Get) => ({
  selectCategory: (category: LoanCategory) =>
    set((state) => {
      const isDifferentLoan = state.selectedCategory?.id !== category.id;
      const profileComplete = getProfileCompleteStatus();
      const isLocked = state.isProfileLocked || state.kycData.isProfileLocked || profileComplete;

      const preservedProfile = isLocked
        ? {
            fullName: state.kycData.fullName,
            mobile: state.kycData.mobile,
            email: state.kycData.email,
            pan: state.kycData.pan,
            aadhaar: state.kycData.aadhaar,
            dob: state.kycData.dob,
            currentAddress: { ...state.kycData.currentAddress },
            permanentAddress: { ...state.kycData.permanentAddress },
            isPermanentSameAsCurrent: state.kycData.isPermanentSameAsCurrent,
            isProfilePrefilled: state.kycData.isProfilePrefilled,
            isProfileLocked: true,
          }
        : null;

      return {
        selectedCategory: category,
        pendingCategory: null,
        activeStep: getLoanEntryStep(category.id),
        returnToReview: false,
        isProfileLocked: isLocked,
        ...(isDifferentLoan
          ? {
              ...resetProductState(),
              kycData: preservedProfile
                ? { ...createInitialKycData(), ...preservedProfile }
                : createInitialKycData(),
            }
          : null),
      };
    }),

  selectLoanProduct: (productId: string): boolean => {
    const resolved = resolveLoanCategory(productId);
    if (!resolved) return false;

    const authState = useAuthStore.getState();
    const profileComplete = getProfileCompleteStatus();

    if (!profileComplete) {
      set({ pendingCategory: resolved.category, selectedCategory: resolved.category });
      if (resolved.loanType) get().setLoanType(resolved.loanType);
      authState.openCompleteProfileModal(`/service/loans?category=${productId}`);
      return false;
    }

    get().populateFromUserProfile();
    get().selectCategory(resolved.category);
    if (resolved.loanType) get().setLoanType(resolved.loanType);
    return true;
  },

  setActiveStep: (step: LoanStep) => set({ activeStep: step }),

  editFromReview: (step: LoanStep) => set({ activeStep: step, returnToReview: true }),

  advanceTo: (nextStep: LoanStep) =>
    set((state) => {
      const completedSteps = Array.from(new Set([...state.completedSteps, state.activeStep]));
      return state.returnToReview || nextStep === "review"
        ? { activeStep: "review", returnToReview: false, reviewErrors: {}, completedSteps }
        : { activeStep: nextStep, completedSteps };
    }),

  retreatTo: (previousStep: LoanStep) =>
    set((state) =>
      state.returnToReview
        ? { activeStep: "review", returnToReview: false }
        : { activeStep: previousStep },
    ),
});
