import type { StoreApi } from "zustand";
import {
  getRequiredDocuments,
  getPersonalLoanDocuments,
} from "../constants/loanDocuments";
import { getLoanSubmissionService } from "../services/loanSubmissionService";
import { validateReviewSubmission } from "../validation/loanReviewValidation";
import { pruneBusinessFormData } from "../businessWorkingCapital/utils/pruneBusinessFormData";
import type { LoansStoreState } from "./loansStore.types";

type ReviewActionKeys =
  | "setDocumentAttachment"
  | "setReviewConsent"
  | "validateReview"
  | "clearReviewErrors"
  | "submitLoanApplication"
  | "resetReviewState";

const SUBMIT_FAILED_MESSAGE =
  "We couldn't submit your application right now. Your details are saved — please try again.";

const omitKey = <T,>(record: Record<string, T>, key: string): Record<string, T> =>
  Object.fromEntries(Object.entries(record).filter(([k]) => k !== key));

/** Documents, consent and submission actions of the loans store. */
export function createReviewActions(
  set: StoreApi<LoansStoreState>["setState"],
  get: StoreApi<LoansStoreState>["getState"]
): Pick<LoansStoreState, ReviewActionKeys> {
  return {
    setDocumentAttachment: (documentId, attachment) =>
      set((state) => {
        const others = omitKey(state.uploadedDocuments, documentId);
        return {
          uploadedDocuments: attachment
            ? { ...others, [documentId]: attachment }
            : others,
          reviewErrors: {
            ...state.reviewErrors,
            documents: omitKey(state.reviewErrors.documents ?? {}, documentId),
          },
        };
      }),

    setReviewConsent: (consent) =>
      set((state) => {
        const { consent: consentError, ...otherErrors } = state.reviewErrors;
        return {
          isReviewConsentGiven: consent,
          reviewErrors: consent
            ? otherErrors
            : { ...otherErrors, ...(consentError ? { consent: consentError } : {}) },
        };
      }),

    validateReview: () => {
      const { isValid, errors } = validateReviewSubmission(
        get().kycData,
        get().businessFormData,
        get().uploadedDocuments,
        get().isReviewConsentGiven,
        get().personalFormData,
        get().selectedCategory?.id
      );
      set({ reviewErrors: errors });
      return isValid;
    },

    clearReviewErrors: () => set({ reviewErrors: {} }),

    submitLoanApplication: async () => {
      if (get().isSubmitting) return false;
      if (!get().validateReview()) return false;

      set({ isSubmitting: true });
      try {
        const { kycData, businessFormData, uploadedDocuments } = get();
        // Only documents that apply to the selected loan type are sent
        const requirements =
          get().selectedCategory?.id === "personal-loan"
            ? getPersonalLoanDocuments(get().personalFormData)
            : getRequiredDocuments(
                businessFormData.loanType,
                businessFormData
              );
        const applicableDocuments = requirements.flatMap((requirement) => {
          const upload = uploadedDocuments[requirement.id];
          return upload?.fileUri ? [upload] : [];
        });

        const result = await getLoanSubmissionService().submit({
          kycData,
          businessFormData: pruneBusinessFormData(businessFormData),
          personalFormData: get().personalFormData,
          categoryId: get().selectedCategory?.id,
          documents: applicableDocuments,
        });
        set({
          submittedApplicationId: result.applicationId,
          submittedAt: result.submittedAt,
          isSubmissionSynced: result.isSyncedToServer,
          isSubmitting: false,
          activeStep: "submitted",
        });
        return true;
      } catch {
        set((state) => ({
          isSubmitting: false,
          reviewErrors: { ...state.reviewErrors, general: SUBMIT_FAILED_MESSAGE },
        }));
        return false;
      }
    },

    resetReviewState: () =>
      set({
        uploadedDocuments: {},
        isReviewConsentGiven: false,
        reviewErrors: {},
        submittedApplicationId: null,
        submittedAt: null,
        isSubmissionSynced: false,
        isSubmitting: false,
      }),
  };
}
