export type InsuranceCategory = 'HEALTH' | 'LIFE' | 'MOTOR' | 'TERM' | 'TRAVEL' | 'HOME';

export interface InsurancePlan {
  id: string;
  category: InsuranceCategory;
  provider: string;
  planName: string;
  coverAmount: number;
  monthlyPremium: number;
  annualPremium: number;
  cashlessHospitalsCount?: number;
  claimSettlementRatio: number;
  features: string[];
  waitingPeriod?: string;
  taxBenefits?: string;
}

export interface InsuranceApplication {
  id: string;
  planId: string;
  category: InsuranceCategory;
  proposerName: string;
  proposerEmail: string;
  proposerPhone: string;
  totalPremium: number;
  policyNumber?: string;
  policyDocumentUrl?: string;
  status: 'DRAFT' | 'DOCUMENTS_PENDING' | 'UNDER_VERIFICATION' | 'APPROVED' | 'POLICY_ISSUED' | 'REJECTED';
  createdAt: string;
}
