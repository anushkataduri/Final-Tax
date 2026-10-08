export interface InsuranceMember {
  id: string;
  relation: 'Self' | 'Spouse' | 'Son' | 'Daughter' | 'Father' | 'Mother';
  fullName: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  preExistingDiseases: string[];
}

export interface NomineeDetails {
  fullName: string;
  relation: string;
  dob: string;
  sharePercentage: number;
}
