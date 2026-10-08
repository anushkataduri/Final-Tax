export interface PolicyDetailsData {
  policyNumber: string;
  planName: string;
  provider: string;
  coverAmount: number;
  sumInsured: number;
  validFrom: string;
  validUntil: string;
  status: 'ACTIVE' | 'EXPIRED' | 'GRACE_PERIOD';
  downloadUrl?: string;
}
