import type {
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
  GstReconciliationSummary,
  ItrCategoryType,
} from "../itr-filing/types/itrFiling.types";

export interface ItrDocumentFileInfo {
  uri: string;
  name: string;
  size: string;
  mimeType?: string;
}

export interface ItrDraftState {
  id: string;
  stepIndex: number;
  formData: ItrFilingFormData;
  updatedAt: string;
}

export interface ITRState {
  currentStep: number;
  maxStepReached: number;
  setStep: (step: number) => void;
  formData: ItrFilingFormData;
  setCategory: (category: ItrCategoryType) => void;
  setPersonalInfo: (info: Partial<ItrPersonalInfo>) => void;
  selectRefundBank: (bankId: string) => void;
  addBankAccount: (bank: ItrSelectableBank) => void;
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
  updateDocument: (docId: string, fileInfo: ItrDocumentFileInfo | null) => void;
  updateGstReconciliation: (data: Partial<GstReconciliationSummary>) => void;
  setBackendIds: (ids: { itrId?: string; incomeId?: string; documentId?: string }) => void;
  itrDraft: ItrDraftState | null;
  saveItrDraft: () => void;
  restoreItrDraft: () => Promise<boolean>;
  clearItrDraft: () => void;
  resetForm: () => void;
  fetchAndPopulateUserProfile: () => Promise<void>;
}
