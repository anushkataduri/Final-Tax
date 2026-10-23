import type { BusinessLoanFormData } from "../businessWorkingCapital/types/businessLoan.types";
import type { PersonalLoanFormData } from "../personalLoan/types/personalLoan.types";
import type { HomeLoanRequirementFormData } from "../homeLoan/types/homeLoan.types";
import type { PropertyLoanFormData } from "../property/types/property.types";
import type { VehicleLoanFormData } from "../vehicle/types/vehicleLoan.types";
import type { MachineryLoanFormData } from "../machinery/types/machinery.types";
import type { MsmeLoanFormData } from "../msme/types/msmeLoan.types";
import type { LoanCategoryId } from "../types/loanCategory.types";
import { getLoanFlowDefinition } from "../constants/loanFlow";
import { buildPropertyReviewSections } from "./propertyReviewSummary";
import type { LoanKycData } from "../types/loanKyc.types";
import {
  LOAN_TYPE_LABELS,
  type ReviewSection,
  applicantSection,
  businessSection,
  loanSection,
  personalEmploymentSection,
  personalLoanSection,
  homeLoanRequirementSection,
  vehicleLoanSection,
  machineryLoanSection,
  msmeReviewSection,
} from "./loanSectionBuilders";

// Re-export types and helpers for all existing consumers
export type { ReviewSectionId, ReviewEditTarget, ReviewRow, ReviewSection } from "./loanSectionBuilders";
export { LOAN_TYPE_LABELS, maskAadhaar } from "./loanSectionBuilders";

export const LOAN_CATEGORY_LABELS: Record<string, string> = {
  "business-loan": "Business & Working Capital Loans",
  "personal-loan": "Personal Loan",
  "home-loan": "Home Loan",
  "property-loan": "Property Loan",
  "vehicle-loan": "Vehicle Loan",
  "machinery-loan": "Machinery Loans",
  "msme-loan": "MSME Loan",
  "project-finance": "Project Finance",
};

/** Read-only summary of everything the customer entered, grouped for the Review screen. */
export function buildReviewSections(
  kyc: LoanKycData,
  businessForm: BusinessLoanFormData,
  personalForm?: PersonalLoanFormData,
  categoryId?: LoanCategoryId,
  homeLoanForm?: HomeLoanRequirementFormData,
  propertyForm?: PropertyLoanFormData,
  vehicleForm?: VehicleLoanFormData,
  machineryForm?: MachineryLoanFormData,
  msmeForm?: MsmeLoanFormData
): ReviewSection[] {
  if (categoryId && getLoanFlowDefinition(categoryId).availability === "coming-soon") {
    return [applicantSection(kyc)];
  }
  if (categoryId === "msme-loan") {
    return msmeForm
      ? [applicantSection(kyc), msmeReviewSection(msmeForm)]
      : [applicantSection(kyc)];
  }
  if (categoryId === "property-loan") {
    return [
      applicantSection(kyc),
      ...(propertyForm ? buildPropertyReviewSections(propertyForm) : []),
    ];
  }
  if (categoryId === "vehicle-loan") {
    return vehicleForm
      ? [applicantSection(kyc), vehicleLoanSection(vehicleForm)]
      : [applicantSection(kyc)];
  }
  if (categoryId === "machinery-loan") {
    return machineryForm
      ? [applicantSection(kyc), machineryLoanSection(machineryForm)]
      : [applicantSection(kyc)];
  }
  if (categoryId === "personal-loan") {
    return personalForm
      ? [
          applicantSection(kyc),
          personalLoanSection(personalForm),
          personalEmploymentSection(personalForm),
        ]
      : [applicantSection(kyc)];
  }
  if (categoryId === "home-loan") {
    return homeLoanForm
      ? [applicantSection(kyc), homeLoanRequirementSection(homeLoanForm)]
      : [applicantSection(kyc)];
  }
  if (categoryId === "business-loan" || !categoryId) {
    return [applicantSection(kyc), businessSection(businessForm), loanSection(businessForm)];
  }
  return [applicantSection(kyc)];
}

/** The loan name and requested amount shown on the post-submission screen. */
export function getSubmittedLoanSummary(
  categoryId: string | undefined,
  form: BusinessLoanFormData,
  personalLoanAmount?: string,
  propertyLoanAmount?: string,
  homeLoanAmount?: string,
  vehicleLoanAmount?: string,
  machineryLoanAmount?: string,
  msmeTurnover?: string
): { label: string; amountRaw: string } {
  if (categoryId === "msme-loan") return { label: "MSME Loan", amountRaw: msmeTurnover ?? "" };
  if (categoryId === "home-loan") return { label: "Home Loan", amountRaw: homeLoanAmount ?? "" };
  if (categoryId === "property-loan") return { label: "Property Loan", amountRaw: propertyLoanAmount ?? "" };
  if (categoryId === "personal-loan") return { label: "Personal Loan", amountRaw: personalLoanAmount ?? "" };
  if (categoryId === "vehicle-loan") return { label: "Vehicle Loan", amountRaw: vehicleLoanAmount ?? "" };
  if (categoryId === "machinery-loan") return { label: "Machinery Loan", amountRaw: machineryLoanAmount ?? "" };
  if (!categoryId || categoryId === "business-loan") {
    const amountRaw = form.loanType === "business-loan"
      ? form.businessLoan.loanAmount
      : form.workingCapital.loanAmount;
    return { label: LOAN_TYPE_LABELS[form.loanType] ?? "Business Loan", amountRaw };
  }
  return { label: LOAN_CATEGORY_LABELS[categoryId] ?? "Loan Application", amountRaw: "" };
}
