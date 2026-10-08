import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanDocumentItem,
  CustomerProfileSummary,
} from "../../types/loans.types";

export interface VehicleLoanDetailsFormData extends LoanDetailsFormData {
  vehicleCondition?: "New Vehicle" | "Pre-Owned / Used Vehicle";
  vehicleMakeModel?: string;
  onRoadPrice?: string;
  downPayment?: string;
  registrationNumber?: string;
  registrationYear?: string;
}

export interface VehicleLoanDraftData {
  currentStepIndex: number;
  loanDetails: VehicleLoanDetailsFormData;
  businessDetails: LoanBusinessFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
  savedAt: string;
}
