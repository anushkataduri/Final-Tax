import type { ComponentProps } from "react";
import type Ionicons from "@expo/vector-icons/Ionicons";
import { formatCurrencyINR } from "@/shared/formatters/currencyFormatter";
import type { BusinessLoanFormData } from "../businessWorkingCapital/types/businessLoan.types";
import type { PersonalLoanFormData } from "../personalLoan/types/personalLoan.types";
import type { LoanKycAddress, LoanKycData } from "../types/loanKyc.types";
import { isProjectCostRequired } from "../businessWorkingCapital/validation/businessLoanValidation";

export type ReviewSectionId = "applicant" | "business" | "loan" | "employment";
export type ReviewEditTarget = "kyc" | "business-details" | "personal-employment";

export interface ReviewRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ReviewSection {
  id: ReviewSectionId;
  title: string;
  subtitle: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  editTarget: ReviewEditTarget;
  editLabel: string;
  rows: ReviewRow[];
}

const EMPTY = "—";

export const LOAN_TYPE_LABELS: Record<BusinessLoanFormData["loanType"], string> = {
  "business-loan": "Business Loan",
  "working-capital": "Working Capital Loan",
};

const formatAddress = (address: LoanKycAddress): string =>
  [address.houseNumber, address.street, address.city, address.state, address.pincode]
    .filter((part) => part?.trim())
    .join(", ");

/** "XXXX XXXX 1234": the full Aadhaar number is never shown on screen. */
export const maskAadhaar = (aadhaar: string): string => {
  const digits = aadhaar.replace(/\D/g, "");
  return digits.length >= 4 ? `XXXX XXXX ${digits.slice(-4)}` : EMPTY;
};

const orOther = (value: string, other: string): string =>
  value === "Other" ? other.trim() || EMPTY : value || EMPTY;

const amount = (value: string): string =>
  value?.trim() ? formatCurrencyINR(value) : EMPTY;

function applicantSection(kyc: LoanKycData): ReviewSection {
  const rows: ReviewRow[] = [
    { label: "Full Name", value: kyc.fullName || EMPTY },
    { label: "Mobile Number", value: kyc.mobile ? `+91 ${kyc.mobile}` : EMPTY },
  ];
  if (kyc.email) rows.push({ label: "Email", value: kyc.email });
  if (kyc.pan) rows.push({ label: "PAN", value: kyc.pan.toUpperCase() });
  if (kyc.aadhaar) rows.push({ label: "Aadhaar", value: maskAadhaar(kyc.aadhaar) });
  if (kyc.dob) rows.push({ label: "Date of Birth", value: kyc.dob });
  rows.push({
    label: "Current Address",
    value: formatAddress(kyc.currentAddress) || EMPTY,
  });
  rows.push({
    label: "Permanent Address",
    value: kyc.isPermanentSameAsCurrent
      ? "Same as current address"
      : formatAddress(kyc.permanentAddress) || EMPTY,
  });

  return {
    id: "applicant",
    title: "Applicant Details",
    subtitle: "Name, contact, PAN, Aadhaar and address",
    icon: "person-outline",
    editTarget: "kyc",
    editLabel: "Edit applicant details",
    rows,
  };
}

function businessSection(form: BusinessLoanFormData): ReviewSection {
  const p = form.businessProfile;
  const rows: ReviewRow[] = [
    { label: "Business Name", value: p.businessName || EMPTY },
    { label: "Constitution", value: orOther(p.constitution, p.constitutionOther) },
    { label: "Activity", value: orOther(p.businessActivity, p.activityOther) },
    { label: "Established", value: p.establishmentDate || EMPTY },
    { label: "Business Address", value: p.businessAddress || EMPTY },
    { label: "PIN Code", value: p.pincode || EMPTY },
    {
      label: "GST",
      value: p.isGstRegistered ? p.gstin || "Registered" : "Not registered",
    },
  ];
  if (p.udyamRegistration) {
    rows.push({ label: "Udyam / MSME", value: p.udyamRegistration });
  }

  return {
    id: "business",
    title: "Business Details",
    subtitle: "Business profile and operational information",
    icon: "business-outline",
    editTarget: "business-details",
    editLabel: "Edit business details",
    rows,
  };
}

function loanSection(form: BusinessLoanFormData): ReviewSection {
  const rows: ReviewRow[] = [
    { label: "Loan Type", value: LOAN_TYPE_LABELS[form.loanType] },
  ];

  if (form.loanType === "business-loan") {
    const d = form.businessLoan;
    rows.push(
      { label: "Requested Amount", value: amount(d.loanAmount), highlight: true },
      { label: "Purpose", value: orOther(d.purpose, d.purposeOther) }
    );
    if (d.purposeDescription.trim()) {
      rows.push({ label: "Description", value: d.purposeDescription.trim() });
    }
    // Only the purposes that need a cost estimate show it.
    if (isProjectCostRequired(d.purpose) && d.projectCost.trim()) {
      rows.push({ label: "Project / Equipment Cost", value: amount(d.projectCost) });
    }
  } else {
    const d = form.workingCapital;
    rows.push(
      { label: "Required Credit Limit", value: amount(d.loanAmount), highlight: true },
      { label: "Purpose of Funds", value: orOther(d.purpose, d.purposeOther) }
    );
    if (d.purposeDescription.trim()) {
      rows.push({ label: "Description", value: d.purposeDescription.trim() });
    }
    rows.push(
      { label: "Avg Monthly Sales", value: amount(d.monthlySales) },
      { label: "Avg Monthly Expenses", value: amount(d.monthlyExpenses) }
    );
  }

  return {
    id: "loan",
    title: "Loan Details",
    subtitle: "Loan type and financing requirements",
    icon: "cash-outline",
    editTarget: "business-details",
    editLabel: "Edit loan requirements",
    rows,
  };
}

function personalEmploymentSection(form: PersonalLoanFormData): ReviewSection {
  const isSalaried = form.employmentType === "salaried";
  const rows: ReviewRow[] = [
    {
      label: "Employment Type",
      value: isSalaried ? "Salaried" : "Self Employed",
    },
  ];

  if (isSalaried) {
    rows.push(
      {
        label: "Employer / Company",
        value: form.employerName || form.companyName || EMPTY,
      },
      { label: "Job Type", value: form.jobType || EMPTY },
      {
        label: "Monthly Net Salary",
        value: amount(form.monthlyNetSalary || form.monthlySalary),
        highlight: true,
      },
      { label: "Work Experience", value: form.workExperience || EMPTY },
      {
        label: "Salary Credit Method",
        value: form.salaryCreditMethod || EMPTY,
      }
    );
  } else {
    rows.push(
      {
        label: "Business / Profession",
        value:
          form.businessOrProfessionName || form.professionName || EMPTY,
      },
      { label: "Nature of Business", value: form.natureOfBusiness || EMPTY },
      {
        label: "Average Monthly Income",
        value: amount(form.averageMonthlyIncome || form.monthlyIncome),
        highlight: true,
      },
      { label: "Years in Business", value: form.yearsInBusiness || EMPTY }
    );
  }

  return {
    id: "employment",
    title: "Employment & Income",
    subtitle: isSalaried
      ? "Salaried employment and compensation"
      : "Professional or business earnings",
    icon: isSalaried ? "briefcase-outline" : "person-outline",
    editTarget: "personal-employment",
    editLabel: "Edit employment details",
    rows,
  };
}

function personalLoanSection(form: PersonalLoanFormData): ReviewSection {
  const loanAmt = form.loanAmount || form.requestedAmount || "";
  const rows: ReviewRow[] = [
    { label: "Loan Type", value: "Personal Loan" },
    {
      label: "Requested Loan Amount",
      value: amount(loanAmt),
      highlight: true,
    },
  ];
  if (form.purpose?.trim()) {
    rows.push({
      label: "Purpose",
      value: orOther(form.purpose, form.purposeOther || ""),
    });
  }

  return {
    id: "loan",
    title: "Loan Requirements",
    subtitle: "Requested financing and purpose",
    icon: "cash-outline",
    editTarget: "personal-employment",
    editLabel: "Edit loan requirements",
    rows,
  };
}

/** Read-only summary of everything the customer entered, grouped for the Review screen. */
export function buildReviewSections(
  kyc: LoanKycData,
  businessForm: BusinessLoanFormData,
  personalForm?: PersonalLoanFormData,
  categoryId?: string
): ReviewSection[] {
  if (categoryId === "personal-loan" && personalForm) {
    return [
      applicantSection(kyc),
      personalLoanSection(personalForm),
      personalEmploymentSection(personalForm),
    ];
  }
  return [
    applicantSection(kyc),
    businessSection(businessForm),
    loanSection(businessForm),
  ];
}


export const LOAN_CATEGORY_LABELS: Record<string, string> = {
  "business-loan": "Business & Working Capital Loans",
  "personal-loan": "Personal Loan",
  "home-loan": "Home Loan",
  "property-loan": "Property Loan",
  "vehicle-loan": "Vehicle Loan",
  "machinery-loan": "Machinery Loans",
  "msme-loan": "MSME Loans",
  "project-finance": "Project Finance",
};

/** The loan name and requested amount shown on the post-submission screen. */
export function getSubmittedLoanSummary(
  categoryId: string | undefined,
  form: BusinessLoanFormData,
  personalLoanAmount?: string
): { label: string; amountRaw: string } {
  if (categoryId === "personal-loan") {
    return { label: "Personal Loan", amountRaw: personalLoanAmount ?? "" };
  }
  if (!categoryId || categoryId === "business-loan") {
    const amountRaw =
      form.loanType === "business-loan"
        ? form.businessLoan.loanAmount
        : form.workingCapital.loanAmount;
    return { label: LOAN_TYPE_LABELS[form.loanType] ?? "Business Loan", amountRaw };
  }
  return {
    label: LOAN_CATEGORY_LABELS[categoryId] ?? "Loan Application",
    amountRaw: personalLoanAmount ?? "",
  };
}
