import type { LoanCategory } from "../types/loanCategory.types";
import type {
  LoanKycData,
  LoanKycAddress,
  LoanKycErrors,
  LoanKycVerificationStatus,
} from "../types/loanKyc.types";
import type {
  BusinessLoanFormData,
  BusinessLoanType,
  CommonBusinessProfile,
  BusinessLoanDetails,
  WorkingCapitalDetails,
  BusinessLoanErrors,
} from "../businessWorkingCapital/types/businessLoan.types";
import type {
  LoanDocumentUpload,
  LoanReviewErrors,
} from "../types/loanReview.types";
import type {
  PersonalLoanFormData,
  PersonalLoanErrors,
  PersonalEmploymentType,
} from "../personalLoan/types/personalLoan.types";

export type LoanStep =
  | "categories"
  | "kyc"
  | "business-details"
  | "personal-employment"
  | "personal-employment"
  | "documents"
  | "review"
  | "submitted";

export const createEmptyAddress = (): LoanKycAddress => ({
  houseNumber: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
});

export const createInitialKycData = (): LoanKycData => ({
  fullName: "",
  mobile: "",
  email: "",
  pan: "",
  aadhaar: "",
  dob: "",
  currentAddress: createEmptyAddress(),
  isPermanentSameAsCurrent: true,
  permanentAddress: createEmptyAddress(),
  consentGiven: false,
  isProfilePrefilled: false,
});

export const createInitialBusinessFormData = (): BusinessLoanFormData => ({
  loanType: "business-loan",
  businessProfile: {
    businessName: "",
    constitution: "",
    constitutionOther: "",
    businessActivity: "",
    activityOther: "",
    establishmentDate: "",
    businessAddress: "",
    pincode: "",
    isGstRegistered: false,
    gstin: "",
    udyamRegistration: "",
  },
  businessLoan: {
    loanAmount: "",
    purpose: "",
    purposeOther: "",
    purposeDescription: "",
    projectCost: "",
  },
  workingCapital: {
    loanAmount: "",
    purpose: "",
    purposeOther: "",
    purposeDescription: "",
    monthlySales: "",
    monthlyExpenses: "",
  },
});

export const createInitialPersonalFormData = (): PersonalLoanFormData => ({
  employmentType: "salaried",
  employerName: "",
  companyName: "",
  jobType: "",
  monthlyNetSalary: "",
  monthlySalary: "",
  workExperience: "",
  salaryCreditMethod: "Bank Account",
  businessOrProfessionName: "",
  professionName: "",
  natureOfBusiness: "",
  averageMonthlyIncome: "",
  monthlyIncome: "",
  yearsInBusiness: "",
  loanAmount: "",
  requestedAmount: "",
  purpose: "",
  purposeOther: "",
});

export interface LoansStoreState {
  selectedCategory: LoanCategory | null;
  activeStep: LoanStep;
  /** True while the customer is editing a section opened from Review. */
  returnToReview: boolean;
  kycData: LoanKycData;
  kycStatus: LoanKycVerificationStatus;
  kycErrors: LoanKycErrors;
  businessFormData: BusinessLoanFormData;
  businessErrors: BusinessLoanErrors;
  personalFormData: PersonalLoanFormData;
  personalErrors: PersonalLoanErrors;
  uploadedDocuments: Record<string, LoanDocumentUpload>;
  isReviewConsentGiven: boolean;
  reviewErrors: LoanReviewErrors;
  submittedApplicationId: string | null;
  submittedAt: string | null;
  /** False while the submission exists only on this device. */
  isSubmissionSynced: boolean;
  isSubmitting: boolean;

  // Step 1 Actions
  selectCategory: (category: LoanCategory) => void;
  setActiveStep: (step: LoanStep) => void;
  /** Opens a section for editing and remembers to come back to Review afterwards. */
  editFromReview: (step: LoanStep) => void;
  /** Moves forward; while editing from Review this returns to Review instead. */
  advanceTo: (nextStep: LoanStep) => void;
  /** Moves back; while editing from Review this returns to Review instead. */
  retreatTo: (previousStep: LoanStep) => void;
  setKycField: <K extends keyof LoanKycData>(field: K, value: LoanKycData[K]) => void;
  setCurrentAddressField: (field: keyof LoanKycAddress, value: string) => void;
  setPermanentAddressField: (field: keyof LoanKycAddress, value: string) => void;
  setPermanentSameAsCurrent: (isSame: boolean) => void;
  setConsent: (consent: boolean) => void;
  populateFromUserProfile: () => void;
  validateForm: () => boolean;
  clearKycErrors: () => void;
  resetKycData: () => void;

  // Step 2 Business Actions
  setLoanType: (type: BusinessLoanType) => void;
  setBusinessProfileField: <K extends keyof CommonBusinessProfile>(
    field: K,
    value: CommonBusinessProfile[K]
  ) => void;
  setBusinessLoanField: <K extends keyof BusinessLoanDetails>(
    field: K,
    value: BusinessLoanDetails[K]
  ) => void;
  setWorkingCapitalField: <K extends keyof WorkingCapitalDetails>(
    field: K,
    value: WorkingCapitalDetails[K]
  ) => void;
  validateBusinessForm: () => boolean;
  clearBusinessErrors: () => void;
  resetBusinessFormData: () => void;

  // Step 2 Personal Loan Actions
  setPersonalEmploymentType: (type: PersonalEmploymentType) => void;
  setPersonalLoanField: <K extends keyof PersonalLoanFormData>(
    field: K,
    value: PersonalLoanFormData[K]
  ) => void;
  validatePersonalForm: () => boolean;
  clearPersonalErrors: () => void;
  resetPersonalFormData: () => void;

  // Step 3 Review & Submission Actions
  setDocumentAttachment: (
    documentId: string,
    attachment: LoanDocumentUpload | null
  ) => void;
  setReviewConsent: (consent: boolean) => void;
  validateReview: () => boolean;
  clearReviewErrors: () => void;
  submitLoanApplication: () => Promise<boolean>;
  resetReviewState: () => void;

  resetAll: () => void;
}
