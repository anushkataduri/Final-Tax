import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanDocumentItem,
} from "../../types/loans.types";

const HOME_LOAN_DRAFT_KEY = "@taxedge_home_loan_draft_v1";

export interface HomeLoanDraftData {
  currentStepIndex: number;
  loanDetails: LoanDetailsFormData;
  businessDetails: LoanBusinessFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
  savedAt: string;
}

export const homeLoanDraftService = {
  saveDraft: async (draft: HomeLoanDraftData): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        HOME_LOAN_DRAFT_KEY,
        JSON.stringify({ ...draft, savedAt: new Date().toISOString() })
      );
    } catch {
      // Ignore storage errors
    }
  },

  loadDraft: async (): Promise<HomeLoanDraftData | null> => {
    try {
      const raw = await AsyncStorage.getItem(HOME_LOAN_DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as HomeLoanDraftData;
    } catch {
      return null;
    }
  },

  clearDraft: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(HOME_LOAN_DRAFT_KEY);
    } catch {
      // Ignore storage errors
    }
  },

  hasDraft: async (): Promise<boolean> => {
    try {
      const raw = await AsyncStorage.getItem(HOME_LOAN_DRAFT_KEY);
      return Boolean(raw);
    } catch {
      return false;
    }
  },
};
