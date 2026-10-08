import { useInsuranceStore } from '../store/insuranceSlice';

export function useInsuranceQuotes() {
  const plan = useInsuranceStore((s) => s.selectedPlan);
  const members = useInsuranceStore((s) => s.members);

  const baseAnnual = plan?.annualPremium || 0;
  const membersMultiplier = Math.max(1, members.length);
  const calculatedTotal = baseAnnual * membersMultiplier;
  const gstAmount = Math.round(calculatedTotal * 0.18);
  const grandTotal = calculatedTotal + gstAmount;

  return {
    baseAnnual,
    calculatedTotal,
    gstAmount,
    grandTotal,
  };
}
