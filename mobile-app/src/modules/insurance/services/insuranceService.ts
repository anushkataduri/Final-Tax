import { insuranceApi } from './insuranceApi';
import type { InsurancePlan, InsuranceCategory } from '../types/insurance.types';

const MOCK_PLANS: InsurancePlan[] = [
  {
    id: 'hlth-1',
    category: 'HEALTH',
    provider: 'Star Health',
    planName: 'Family Health Optima',
    coverAmount: 1000000,
    monthlyPremium: 799,
    annualPremium: 8999,
    cashlessHospitalsCount: 14000,
    claimSettlementRatio: 98.2,
    features: ['Zero Co-payment', 'Pre & Post Hospitalization', 'Free Health Checkup annually'],
    waitingPeriod: '2 Years for PED',
    taxBenefits: 'Deduction up to ₹75,000 under Section 80D',
  },
  {
    id: 'term-1',
    category: 'TERM',
    provider: 'HDFC Life',
    planName: 'Click 2 Protect Super',
    coverAmount: 10000000,
    monthlyPremium: 650,
    annualPremium: 7200,
    claimSettlementRatio: 99.3,
    features: ['₹1 Crore Life Cover', 'Terminal Illness Benefit', 'Return of Premium Option'],
    taxBenefits: 'Deduction under Section 80C & Exemption under 10(10D)',
  },
];

export const insuranceService = {
  api: insuranceApi,
  getFeaturedPlans: async (category?: InsuranceCategory): Promise<InsurancePlan[]> => {
    if (!category) return MOCK_PLANS;
    return MOCK_PLANS.filter((p) => p.category === category);
  },
  getPlanById: (id: string): InsurancePlan | undefined => {
    return MOCK_PLANS.find((p) => p.id === id);
  },
};

export default insuranceService;
