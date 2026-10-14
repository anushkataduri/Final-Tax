import type { BusinessLoanFormData } from "../businessWorkingCapital/types/businessLoan.types";
import type { PersonalLoanFormData } from "../personalLoan/types/personalLoan.types";
import type { LoanKycData } from "../types/loanKyc.types";
import type { LoanDocumentUpload } from "../types/loanReview.types";

export interface LoanSubmissionPayload {
  kycData: LoanKycData;
  businessFormData: BusinessLoanFormData;
  personalFormData?: PersonalLoanFormData;
  categoryId?: string;
  documents: LoanDocumentUpload[];
}

export interface LoanSubmissionResult {
  applicationId: string;
  submittedAt: string;
  /** False while the application exists only on this device. */
  isSyncedToServer: boolean;
}

/** The single boundary through which a completed application leaves the frontend. */
export interface LoanSubmissionService {
  submit: (payload: LoanSubmissionPayload) => Promise<LoanSubmissionResult>;
}

/**
 * Placeholder used until the real submission API is connected: nothing is sent anywhere.
 * It records the submission locally and says so through `isSyncedToServer: false`.
 */
export const localLoanSubmissionService: LoanSubmissionService = {
  submit: async () => {
    const now = new Date();
    return {
      applicationId: `TXE-LN-${now.getTime().toString().slice(-6)}`,
      submittedAt: now.toISOString(),
      isSyncedToServer: false,
    };
  },
};

let activeService: LoanSubmissionService = localLoanSubmissionService;

export const getLoanSubmissionService = (): LoanSubmissionService => activeService;

/** Connects a real implementation (or a test double). */
export const setLoanSubmissionService = (service: LoanSubmissionService): void => {
  activeService = service;
};
