import { LOAN_SERVICES } from "../mock/loanServices";
import { LoanServiceItem } from "../types/loans.types";

export class LoansService {
  async fetchLoanServices(): Promise<LoanServiceItem[]> {
    return LOAN_SERVICES;
  }
}

export const loansService = new LoansService();
export default loansService;
