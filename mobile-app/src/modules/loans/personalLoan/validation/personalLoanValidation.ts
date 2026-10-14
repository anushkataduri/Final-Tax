import { parseIndianNumber } from "@/shared/formatters/currencyFormatter";
import type {
  PersonalLoanFormData,
  PersonalLoanErrors,
} from "../types/personalLoan.types";

export const MIN_MONTHLY_INCOME = 10000;

/**
 * Validates the Personal Loan Details form (Screen 2: Employment & Income).
 * Pure functional validation without loops.
 */
export function validatePersonalLoanForm(
  data: PersonalLoanFormData
): {
  isValid: boolean;
  errors: PersonalLoanErrors;
} {
  const errors: PersonalLoanErrors = {};

  // 1. Requested Loan Amount (Required)
  const amountRaw = (data.loanAmount || data.requestedAmount || "").trim();
  if (!amountRaw) {
    errors.loanAmount = "Enter the loan amount you need.";
    errors.requestedAmount = "Enter the loan amount you need.";
  } else if (amountRaw.includes(".")) {
    errors.loanAmount = "Enter whole rupees without paise.";
    errors.requestedAmount = "Enter whole rupees without paise.";
  } else {
    const amountNum = parseIndianNumber(amountRaw);
    if (!Number.isFinite(amountNum) || isNaN(amountNum) || amountNum <= 0) {
      errors.loanAmount = "Enter the loan amount you need.";
      errors.requestedAmount = "Enter the loan amount you need.";
    }
  }

  if (!data.employmentType) {
    errors.employmentType = "Please select employment type";
  }

  if (data.employmentType === "salaried") {
    const employer = (data.employerName || data.companyName || "").trim();
    if (!employer) {
      errors.employerName = "Enter your employer name";
      errors.companyName = "Enter your employer name";
    } else if (employer.length < 2) {
      errors.employerName = "Employer name must be at least 2 characters";
      errors.companyName = "Employer name must be at least 2 characters";
    }

    if (!data.jobType?.trim()) {
      errors.jobType = "Please select your job type";
    }

    const salaryRaw = data.monthlyNetSalary || data.monthlySalary || "";
    const salaryNum = parseIndianNumber(salaryRaw);
    if (!salaryRaw.trim()) {
      errors.monthlyNetSalary = "Enter your monthly net salary";
      errors.monthlySalary = "Enter your monthly net salary";
    } else if (!Number.isFinite(salaryNum) || isNaN(salaryNum)) {
      errors.monthlyNetSalary = "Enter a valid monthly net salary";
      errors.monthlySalary = "Enter a valid monthly net salary";
    } else if (salaryNum < MIN_MONTHLY_INCOME) {
      errors.monthlyNetSalary = "Monthly net salary must be at least ₹10,000";
      errors.monthlySalary = "Monthly net salary must be at least ₹10,000";
    }

    if (!data.workExperience?.trim()) {
      errors.workExperience = "Please select your work experience";
    }

    if (!data.salaryCreditMethod?.trim()) {
      errors.salaryCreditMethod = "Please select how you receive your salary";
    }
  } else if (data.employmentType === "self-employed") {
    const profession = (
      data.businessOrProfessionName ||
      data.professionName ||
      ""
    ).trim();
    if (!profession) {
      errors.businessOrProfessionName = "Enter your business or profession name";
      errors.professionName = "Enter your business or profession name";
    } else if (profession.length < 2) {
      errors.businessOrProfessionName =
        "Business or profession name must be at least 2 characters";
      errors.professionName =
        "Business or profession name must be at least 2 characters";
    }

    if (!data.natureOfBusiness?.trim()) {
      errors.natureOfBusiness = "Please select nature of business";
    }

    const incomeRaw = data.averageMonthlyIncome || data.monthlyIncome || "";
    const incomeNum = parseIndianNumber(incomeRaw);
    if (!incomeRaw.trim()) {
      errors.averageMonthlyIncome = "Enter your average monthly income";
      errors.monthlyIncome = "Enter your average monthly income";
    } else if (!Number.isFinite(incomeNum) || isNaN(incomeNum)) {
      errors.averageMonthlyIncome = "Enter a valid average monthly income";
      errors.monthlyIncome = "Enter a valid average monthly income";
    } else if (incomeNum < MIN_MONTHLY_INCOME) {
      errors.averageMonthlyIncome =
        "Average monthly income must be at least ₹10,000";
      errors.monthlyIncome =
        "Average monthly income must be at least ₹10,000";
    }

    if (!data.yearsInBusiness?.trim()) {
      errors.yearsInBusiness = "Please select years in business";
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
}

/** True once every required field of the selected employment type has a value. */
export function isPersonalFormFilled(data: PersonalLoanFormData): boolean {
  const has = (...values: (string | undefined)[]): boolean =>
    values.some((value) => Boolean(value?.trim()));

  const hasAmount = Boolean(
    (data.loanAmount || data.requestedAmount)?.trim()
  );

  if (data.employmentType === "salaried") {
    return (
      hasAmount &&
      has(data.employerName, data.companyName) &&
      has(data.jobType) &&
      has(data.monthlyNetSalary, data.monthlySalary) &&
      has(data.workExperience) &&
      has(data.salaryCreditMethod)
    );
  }
  if (data.employmentType === "self-employed") {
    return (
      hasAmount &&
      has(data.businessOrProfessionName, data.professionName) &&
      has(data.natureOfBusiness) &&
      has(data.averageMonthlyIncome, data.monthlyIncome) &&
      has(data.yearsInBusiness)
    );
  }
  return false;
}
