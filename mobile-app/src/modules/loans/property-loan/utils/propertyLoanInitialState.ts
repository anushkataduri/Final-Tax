import {
  LoanDetailsFormData,
  LoanApplicantFormData,
  LoanPropertyFormData,
  LoanOwnershipFormData,
} from "../../types/loans.types";

export const initialLoanDetails: LoanDetailsFormData = {
  loanType: "Property Loan",
  requiredAmount: "",
  purpose: "",
  preferredTenureMonths: "",
  hasExistingLoans: undefined,
  existingEmi: "",
  monthlyIncomeOrTurnover: "",
  employmentType: undefined,
};

export const initialApplicantDetails: LoanApplicantFormData = {
  fullName: "",
  pan: "",
  mobile: "",
  dob: "",
  currentAddress: "",
  gender: "",
  maritalStatus: "",
  residenceType: "",
  yearsAtCurrentAddress: "",
  employerCategory: "",
  employerName: "",
  totalWorkExperience: "",
  yearsInCurrentJob: "",
  annualIncome: "",
  hasExistingLoans: null,
};

export const initialPropertyDetails: LoanPropertyFormData = {
  pincode: "",
  city: "",
  district: "",
  state: "",
  propertyAddress: "",
  landmark: "",
  propertyType: "",
  propertySubType: "",
  constructionStatus: "",
  currentUsage: "",
  areaType: "",
  area: "",
  propertyAge: "",
  approvingAuthority: "",
  estimatedMarketValue: "",
};

export const initialOwnershipDetails: LoanOwnershipFormData = {
  ownershipType: "",
  coOwnerFullName: "",
  coOwnerRelationship: "",
  coOwnerPan: "",
  coOwnerMobile: "",
  currentLender: "",
  existingLoanType: "",
  outstandingLoanAmount: "",
  isConfirmationChecked: false,
};

export const STEPS = [
  "Loan Requirement",
  "Applicant & Income",
  "Property Details",
  "Ownership",
  "Documents",
  "Review",
] as const;
