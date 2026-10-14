export type BusinessLoanType = "business-loan" | "working-capital";

export type BusinessConstitution =
  | "Proprietorship"
  | "Partnership"
  | "LLP"
  | "Private Limited Company"
  | "Other";

export type BusinessActivity =
  | "Trading"
  | "Manufacturing"
  | "Retail"
  | "Services"
  | "Other";

export type BusinessLoanPurpose =
  | "Business Expansion"
  | "Equipment Purchase"
  | "Renovation"
  | "Inventory Purchase"
  | "Business Setup"
  | "Other";

export type WorkingCapitalPurpose =
  | "Inventory Purchase"
  | "Supplier Payments"
  | "Operating Expenses"
  | "Payroll"
  | "Cash-Flow Gap"
  | "Seasonal Business Needs"
  | "Other";

export interface CommonBusinessProfile {
  businessName: string;
  constitution: BusinessConstitution | "";
  constitutionOther: string;
  businessActivity: BusinessActivity | "";
  activityOther: string;
  establishmentDate: string;
  businessAddress: string;
  pincode: string;
  isGstRegistered: boolean;
  gstin: string;
  udyamRegistration: string;
}

export interface BusinessLoanDetails {
  loanAmount: string;
  purpose: BusinessLoanPurpose | "";
  purposeOther: string;
  purposeDescription: string;
  projectCost: string;
}

export interface WorkingCapitalDetails {
  loanAmount: string;
  purpose: WorkingCapitalPurpose | "";
  purposeOther: string;
  purposeDescription: string;
  monthlySales: string;
  monthlyExpenses: string;
}

export interface BusinessLoanFormData {
  loanType: BusinessLoanType;
  businessProfile: CommonBusinessProfile;
  businessLoan: BusinessLoanDetails;
  workingCapital: WorkingCapitalDetails;
}

export type BusinessLoanErrors = Record<string, string | undefined>;
