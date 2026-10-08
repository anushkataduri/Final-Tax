import { useEffect, useState } from 'react';
import { insuranceService } from '../services/insuranceService';
import type { InsurancePlan, InsuranceCategory } from '../types/insurance.types';
import { useInsuranceStore } from '../store/insuranceSlice';

export function useInsurance(category?: InsuranceCategory) {
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedPlan = useInsuranceStore((s) => s.selectedPlan);
  const setSelectedPlan = useInsuranceStore((s) => s.setSelectedPlan);

  useEffect(() => {
    insuranceService.getFeaturedPlans(category).then((res) => {
      setPlans(res);
      setLoading(false);
    });
  }, [category]);

  return { plans, loading, selectedPlan, setSelectedPlan };
}
