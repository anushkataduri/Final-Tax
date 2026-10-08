import { apiClient } from "../../../core/api/apiClient";
import type {
  LoanApplicationDraft,
  LoanApplicationResponse,
  LoanApplicationStatus,
  LoanServiceItem,
} from "../types/loans.types";
import { LOAN_SERVICES } from "../mock/loanServices";

const ALL_STATUSES: LoanApplicationStatus[] = [
  "New Lead",
  "Application Received",
  "Documents Pending",
  "Documents Received",
  "Eligibility Verification",
  "Application Prepared",
  "Submitted to Lender",
  "Under Credit Review",
  "Query Raised",
  "Query Resolved",
  "Sanctioned",
  "Sanction Letter",
  "Documentation",
  "Disbursement",
  "Completed",
  "Rejected",
  "On Hold",
];

export const loansApi = {
  getLoanServices: async (): Promise<LoanServiceItem[]> => {
    try {
      const res = await apiClient.get<LoanServiceItem[]>("/loans/services");
      return res && res.length > 0 ? res : LOAN_SERVICES;
    } catch {
      return LOAN_SERVICES;
    }
  },

  applyLoan: async (
    draft: Partial<LoanApplicationDraft>
  ): Promise<LoanApplicationResponse> => {
    try {
      const res = await apiClient.post<LoanApplicationResponse>(
        "/loans/apply",
        draft
      );
      return res;
    } catch {
      // Mock fallback response
      const appId = "LN-" + Date.now().toString().slice(-6);
      return {
        applicationId: appId,
        referenceNumber: `TXE-LN-${Date.now().toString().slice(-8)}`,
        loanType: draft.loanType || "Business Loan",
        status: "Application Received",
        amount: Number(draft.loanDetails?.requiredAmount || 500000),
        createdAt: new Date().toISOString(),
        timeline: ALL_STATUSES.map((status, index) => ({
          status,
          title: status,
          description: getStatusDescription(status),
          timestamp: index <= 1 ? new Date().toLocaleDateString() : "",
          completed: index <= 1,
          isCurrent: index === 1,
        })),
      };
    }
  },

  uploadLoanDocument: async (
    applicationId: string,
    docId: string,
    fileUri: string
  ): Promise<{ success: boolean; documentId: string }> => {
    try {
      const res = await apiClient.post<{ success: boolean; documentId: string }>(
        `/loans/${applicationId}/documents`,
        { docId, fileUri }
      );
      return res;
    } catch {
      return { success: true, documentId: docId };
    }
  },

  fetchStatus: async (
    applicationId: string
  ): Promise<LoanApplicationResponse> => {
    try {
      const res = await apiClient.get<LoanApplicationResponse>(
        "/loans/status/" + applicationId
      );
      return res;
    } catch {
      return {
        applicationId,
        referenceNumber: `TXE-${applicationId}`,
        loanType: "Business Loan",
        status: "Documents Received",
        amount: 1500000,
        createdAt: new Date().toISOString(),
        timeline: ALL_STATUSES.map((status, index) => ({
          status,
          title: status,
          description: getStatusDescription(status),
          timestamp: index <= 3 ? "Today, 11:30 AM" : "",
          completed: index <= 3,
          isCurrent: index === 3,
        })),
      };
    }
  },
};

function getStatusDescription(status: LoanApplicationStatus): string {
  switch (status) {
    case "New Lead":
      return "Enquiry registered in the loan portal.";
    case "Application Received":
      return "Application received and assigned to loan manager.";
    case "Documents Pending":
      return "Waiting for mandatory KYC and financial documents.";
    case "Documents Received":
      return "All uploaded documents verified by credit desk.";
    case "Eligibility Verification":
      return "Credit score, FOIR, and bank statements analyzed.";
    case "Application Prepared":
      return "CAM (Credit Assessment Memorandum) generated.";
    case "Submitted to Lender":
      return "Application lodged with partner banks and NBFCs.";
    case "Under Credit Review":
      return "Lender credit committee reviewing loan proposal.";
    case "Query Raised":
      return "Lender has raised an information or doc clarification.";
    case "Query Resolved":
      return "Clarification submitted back to the lender.";
    case "Sanctioned":
      return "Congratulations! Loan sanctioned by lender.";
    case "Sanction Letter":
      return "Formal sanction letter issued and ready for download.";
    case "Documentation":
      return "Agreement signing, NACH mandate, and stamp duty.";
    case "Disbursement":
      return "Loan disbursement order released to your bank account.";
    case "Completed":
      return "Loan disbursed successfully. Welcome onboard!";
    case "Rejected":
      return "Application could not be approved at this time.";
    case "On Hold":
      return "Application paused pending customer action.";
  }
}

export default loansApi;
