import {
  TdsCustomerIncomeFormData,
  PersonalDetails,
} from "../types/customerIncome.types";
import {
  isValidPan,
  isValidAadhaar,
  isValidMobile,
  isValidEmail,
  isValidPinCode,
  isValidIfsc,
  isValidAccountNumber,
  isValidDob,
  parsePositiveNumber,
} from "../utils/tdsValidation";

export type CustomerFormErrors = Record<string, string>;

export function validatePersonalDetails(personal: PersonalDetails): {
  isValid: boolean;
  errors: CustomerFormErrors;
} {
  const errors: CustomerFormErrors = {};

  if (!personal.fullName || !personal.fullName.trim()) {
    errors["fullName"] = "Full Name is required";
  } else if (personal.fullName.trim().length < 3) {
    errors["fullName"] = "Enter a valid full name";
  }

  if (!personal.pan || !personal.pan.trim()) {
    errors["pan"] = "PAN is required";
  } else if (!isValidPan(personal.pan)) {
    errors["pan"] = "Enter valid 10-character PAN (e.g. ABCDE1234F)";
  }

  if (personal.aadhaar && personal.aadhaar.trim()) {
    if (!isValidAadhaar(personal.aadhaar)) {
      errors["aadhaar"] = "Aadhaar must be a 12-digit number";
    }
  }

  const dobValidation = isValidDob(personal.dob);
  if (!dobValidation.isValid) {
    errors["dob"] = dobValidation.error || "Enter a valid Date of Birth";
  }

  if (!personal.mobileNumber || !personal.mobileNumber.trim()) {
    errors["mobileNumber"] = "Mobile number is required";
  } else if (!isValidMobile(personal.mobileNumber)) {
    errors["mobileNumber"] = "Enter valid 10-digit Indian mobile number";
  }

  if (!personal.email || !personal.email.trim()) {
    errors["email"] = "Email address is required";
  } else if (!isValidEmail(personal.email)) {
    errors["email"] = "Enter a valid email address";
  }

  if (!personal.residentialAddress || !personal.residentialAddress.trim()) {
    errors["residentialAddress"] = "Residential Address is required";
  }

  if (!personal.city || !personal.city.trim()) {
    errors["city"] = "City is required";
  }

  if (!personal.state || !personal.state.trim()) {
    errors["state"] = "State is required";
  }

  if (!personal.pinCode || !personal.pinCode.trim()) {
    errors["pinCode"] = "PIN Code is required";
  } else if (!isValidPinCode(personal.pinCode)) {
    errors["pinCode"] = "Enter valid 6-digit PIN Code";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCustomerIncomeForm(data: TdsCustomerIncomeFormData): {
  isValid: boolean;
  errors: CustomerFormErrors;
} {
  const errors: CustomerFormErrors = {};
  const { personal, bank, income } = data;

  // --- 1. PERSONAL DETAILS ---
  const personalValidation = validatePersonalDetails(personal);
  if (!personalValidation.isValid) {
    Object.entries(personalValidation.errors).forEach(([field, msg]) => {
      errors[`personal.${field}`] = msg;
    });
  }

  // --- 2. BANK DETAILS ---
  if (!bank.accountHolderName || !bank.accountHolderName.trim()) {
    errors["bank.accountHolderName"] = "Account Holder Name is required";
  }

  if (!bank.accountNumber || !bank.accountNumber.trim()) {
    errors["bank.accountNumber"] = "Bank Account Number is required";
  } else if (!isValidAccountNumber(bank.accountNumber)) {
    errors["bank.accountNumber"] = "Enter valid 9 to 18-digit account number";
  }

  if (!bank.confirmAccountNumber || !bank.confirmAccountNumber.trim()) {
    errors["bank.confirmAccountNumber"] = "Please confirm Bank Account Number";
  } else if (bank.accountNumber.trim() !== bank.confirmAccountNumber.trim()) {
    errors["bank.confirmAccountNumber"] = "Bank Account Numbers do not match";
  }

  if (!bank.ifscCode || !bank.ifscCode.trim()) {
    errors["bank.ifscCode"] = "IFSC Code is required";
  } else if (!isValidIfsc(bank.ifscCode)) {
    errors["bank.ifscCode"] = "Enter valid 11-character IFSC (e.g. HDFC0001234)";
  }

  if (!bank.bankName || !bank.bankName.trim()) {
    errors["bank.bankName"] = "Bank Name required (lookup via IFSC)";
  }

  // --- 3. INCOME & TAX CREDITS ---
  // Ensure non-negative numbers
  const salary = parsePositiveNumber(income.salaryIncome);
  const other = parsePositiveNumber(income.otherIncome);
  const interest = parsePositiveNumber(income.interestIncome);
  const tds = parsePositiveNumber(income.totalTdsDeducted);

  if (tds <= 0 && salary <= 0 && other <= 0 && interest <= 0) {
    errors["income.totalTdsDeducted"] = "Enter TDS deducted or income to proceed";
  }

  if (income.hasRentalIncome) {
    const rent = parsePositiveNumber(income.rentalIncome);
    if (rent <= 0) {
      errors["income.rentalIncome"] = "Enter annual rental income received";
    }
  }

  if (income.hasCapitalGains) {
    const stcg = parsePositiveNumber(income.shortTermCapitalGains);
    const ltcg = parsePositiveNumber(income.longTermCapitalGains);
    if (stcg <= 0 && ltcg <= 0) {
      errors["income.shortTermCapitalGains"] = "Enter short-term or long-term capital gains";
    }
  }

  if (income.hasBusinessIncome) {
    const profit = parsePositiveNumber(income.netBusinessProfit);
    if (profit <= 0) {
      errors["income.netBusinessProfit"] = "Enter net business / professional profit";
    }
  }

  if (income.hasHomeLoan) {
    const loanInterest = parsePositiveNumber(income.homeLoanInterestSec24b);
    if (loanInterest <= 0) {
      errors["income.homeLoanInterestSec24b"] = "Enter eligible home loan interest paid";
    }
  }

  if (income.hasDeductions) {
    const d80c = parsePositiveNumber(income.deductions80C);
    const d80d = parsePositiveNumber(income.deductions80D);
    const d80g = parsePositiveNumber(income.donations80G);
    const otherD = parsePositiveNumber(income.otherDeductions);
    if (d80c <= 0 && d80d <= 0 && d80g <= 0 && otherD <= 0) {
      errors["income.deductions80C"] = "Enter at least one deduction amount (80C, 80D, etc.)";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
