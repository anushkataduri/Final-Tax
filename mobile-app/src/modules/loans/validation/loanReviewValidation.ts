import type { BusinessLoanFormData } from "../businessWorkingCapital/types/businessLoan.types";
import type { PersonalLoanFormData } from "../personalLoan/types/personalLoan.types";
import type { LoanKycData } from "../types/loanKyc.types";
import type {
  LoanDocumentUpload,
  LoanReviewErrors,
} from "../types/loanReview.types";
import {
  getRequiredDocuments,
  getPersonalLoanDocuments,
} from "../constants/loanDocuments";

export function validateReviewSubmission(
  kycData: LoanKycData,
  businessFormData: BusinessLoanFormData,
  documents: Record<string, LoanDocumentUpload>,
  isConsentGiven: boolean,
  personalFormData?: PersonalLoanFormData,
  categoryId?: string
): { isValid: boolean; errors: LoanReviewErrors } {
  const errors: LoanReviewErrors = {
    documents: {},
  };

  // 1. Verify KYC minimums
  if (!kycData.fullName?.trim() || !kycData.mobile?.trim()) {
    errors.applicant = "Applicant details are incomplete. Please edit applicant details.";
    errors.general = errors.applicant;
  }

  // 2. Loan details validation
  if (categoryId === "personal-loan" && personalFormData) {
    const loanAmt = (
      personalFormData.loanAmount ||
      personalFormData.requestedAmount ||
      ""
    ).trim();
    if (!loanAmt) {
      errors.loan = "Personal loan requested amount is missing. Please edit loan details.";
      errors.general = errors.loan;
    }

    if (personalFormData.employmentType === "salaried") {
      const employer = (
        personalFormData.employerName ||
        personalFormData.companyName ||
        ""
      ).trim();
      const salary = (
        personalFormData.monthlyNetSalary ||
        personalFormData.monthlySalary ||
        ""
      ).trim();
      if (!employer || !salary) {
        errors.business = "Employment details are incomplete. Please edit employment details.";
        errors.employment = errors.business;
        errors.general = errors.business;
      }
    } else {
      const profession = (
        personalFormData.businessOrProfessionName ||
        personalFormData.professionName ||
        ""
      ).trim();
      const income = (
        personalFormData.averageMonthlyIncome ||
        personalFormData.monthlyIncome ||
        ""
      ).trim();
      if (!profession || !income) {
        errors.business = "Profession details are incomplete. Please edit profession details.";
        errors.employment = errors.business;
        errors.general = errors.business;
      }
    }
  } else {
    // Business profile minimums
    if (
      !businessFormData.businessProfile.businessName?.trim() ||
      !businessFormData.businessProfile.constitution?.trim() ||
      !businessFormData.businessProfile.pincode?.trim()
    ) {
      errors.business = "Business details are incomplete. Please edit business details.";
      errors.general = errors.business;
    }

    if (businessFormData.loanType === "business-loan") {
      if (!businessFormData.businessLoan.loanAmount?.trim()) {
        errors.loan = "Loan requested amount is missing. Please edit loan requirements.";
        errors.general = errors.loan;
      }
    } else if (businessFormData.loanType === "working-capital") {
      if (
        !businessFormData.workingCapital.loanAmount?.trim() ||
        !businessFormData.workingCapital.monthlySales?.trim()
      ) {
        errors.loan = "Working capital limit or sales information is incomplete.";
        errors.general = errors.loan;
      }
    }
  }

  // 3. Verify Mandatory Documents
  const requirements =
    categoryId === "personal-loan" && personalFormData
      ? getPersonalLoanDocuments(personalFormData)
      : getRequiredDocuments(businessFormData.loanType, businessFormData);

  const missingDocs: Record<string, string> = {};
  requirements
    .filter((req) => req.isMandatory)
    .forEach((req) => {
      const doc = documents[req.id];
      if (!doc || !doc.fileUri) {
        missingDocs[req.id] = `${req.name} is required for submission`;
      }
    });

  if (Object.keys(missingDocs).length > 0) {
    errors.documents = missingDocs;
  }

  // 4. Verify Consent
  if (!isConsentGiven) {
    errors.consent = "Please confirm that the provided information is accurate";
  }

  const hasDocErrors = Object.keys(errors.documents || {}).length > 0;
  const isValid =
    !errors.applicant &&
    !errors.business &&
    !errors.employment &&
    !errors.loan &&
    !hasDocErrors &&
    !errors.consent;

  return { isValid, errors };
}

