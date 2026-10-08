import { useState, useEffect } from 'react';
import { loansService } from '../services/LoansService';
import type { LoanServiceItem } from '../types/loans.types';

export function useLoans() {
  const [loanServices, setLoanServices] = useState<LoanServiceItem[]>([]);

  useEffect(() => {
    loansService.fetchLoanServices().then(setLoanServices);
  }, []);

  return {
    loanServices,
  };
}

export default useLoans;
