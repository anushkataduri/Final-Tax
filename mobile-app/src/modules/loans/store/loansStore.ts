import { create } from "zustand";
import { createPersonalActions } from "../personalLoan/store/personalLoanActions";
import { createPropertyActions } from "../property/store/propertyLoanActions";
import { createInitialPropertyFormData } from "../property/types/property.types";
import { createVehicleLoanActions } from "../vehicle/store/vehicleLoanActions";
import { createInitialVehicleLoanFormData } from "../vehicle/types/vehicleLoan.types";
import { createMachineryLoanActions } from "../machinery/store/machineryLoanActions";
import { createInitialMachineryLoanFormData } from "../machinery/types/machinery.types";
import { createMsmeLoanActions } from "../msme/store/msmeLoanActions";
import { createInitialMsmeLoanFormData } from "../msme/types/msmeLoan.types";
import { createReviewActions } from "./loansReviewActions";
import { createNavigationActions } from "./loanNavigationActions";
import { createLoanKycActions } from "./loanKycActions";
import { createBusinessLoanStoreActions } from "./businessLoanStoreActions";
import { createHomeLoanStoreActions } from "./homeLoanStoreActions";
import {
  createInitialKycData,
  createInitialBusinessFormData,
  createInitialPersonalFormData,
  createInitialHomeLoanFormData,
  type LoansStoreState,
  type LoanStep,
} from "./loansStore.types";

export type { LoanStep, LoansStoreState };

export const useLoansStore = create<LoansStoreState>((set, get) => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  selectedCategory: null,
  activeStep: "categories",
  returnToReview: false,
  completedSteps: [],
  kycData: createInitialKycData(),
  kycStatus: "not_connected",
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
  isProfileLocked: false,
  pendingCategory: null,

  // ── Action slices ──────────────────────────────────────────────────────────
  ...createNavigationActions(set, get),
  ...createLoanKycActions(set, get),
  ...createBusinessLoanStoreActions(set, get),
  ...createPersonalActions(set, get),
  ...createPropertyActions(set, get),
  ...createVehicleLoanActions(set, get),
  ...createMachineryLoanActions(set, get),
  ...createMsmeLoanActions(set, get),
  ...createHomeLoanStoreActions(set, get),
  ...createReviewActions(set, get),

  // ── Full reset ─────────────────────────────────────────────────────────────
  resetAll: () =>
    set({
      selectedCategory: null,
      activeStep: "categories",
      returnToReview: false,
      completedSteps: [],
      isProfileLocked: false,
      pendingCategory: null,
      kycData: createInitialKycData(),
      kycErrors: {},
      kycStatus: "not_connected",
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
    }),
}));
