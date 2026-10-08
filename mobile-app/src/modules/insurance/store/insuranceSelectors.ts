import { useInsuranceStore } from './insuranceSlice';

export const useSelectedPlan = () => useInsuranceStore((s) => s.selectedPlan);
export const useInsuranceMembers = () => useInsuranceStore((s) => s.members);
export const useInsuranceNominee = () => useInsuranceStore((s) => s.nominee);
