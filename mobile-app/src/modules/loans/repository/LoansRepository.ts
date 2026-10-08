import { LOAN_SERVICES } from "../mock/loanServices";
import { LoanServiceItem } from "../types/loans.types";

export interface ILoansRepository {
  getLoanServices(): Promise<LoanServiceItem[]>;
}

export class LoansRepository implements ILoansRepository {
  async getLoanServices(): Promise<LoanServiceItem[]> {
    return LOAN_SERVICES;
  }
}

export const loansRepository = new LoansRepository();
