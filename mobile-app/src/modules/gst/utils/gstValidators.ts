import { isFutureDate } from "@/shared/formatters/dateFormatter";
import {
  validateFullName,
} from "@/shared/validators/indianTaxValidators";
import { isNotEmpty, PaymentValidators } from "@/shared/validators/paymentValidators";
import { isIanaDelegatedTld } from "./ianaTldData";

/**
 * GST & Tax Validation Utilities
 * Follows standard Indian Government format rules for PAN, Aadhaar, GSTIN, IFSC, etc.
 */

/**
 * Exception-safe date parser supporting both DD-MM-YYYY and ISO YYYY-MM-DD formats.
 */
export const parseAnyDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const clean = value.trim();
  // 1. Try DD-MM-YYYY or DD/MM/YYYY
  const ddmmMatch = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(clean);
  if (ddmmMatch) {
    const day = Number(ddmmMatch[1]);
    const month = Number(ddmmMatch[2]) - 1;
    const year = Number(ddmmMatch[3]);
    const d = new Date(year, month, day);
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
      return d;
    }
  }
  // 2. Try YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = /^(\d{4})[-/](\d{2})[-/](\d{2})$/.exec(clean);
  if (ymdMatch) {
    const year = Number(ymdMatch[1]);
    const month = Number(ymdMatch[2]) - 1;
    const day = Number(ymdMatch[3]);
    const d = new Date(year, month, day);
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
      return d;
    }
  }
  return null;
};

/**
 * RFC 5322-compliant local part pattern (no spaces, no consecutive dots, max 64 chars).
 */
const EMAIL_LOCAL_REGEX = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;

/**
 * Domain label pattern: 1-63 alphanumeric chars or internal hyphens.
 */
const DOMAIN_LABEL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

/**
 * Strict email validation for GST Registration & Compliance modules.
 * Ensures:
 * 1. Single '@' separating local part and domain.
 * 2. Local part: <= 64 chars, no spaces, no consecutive/leading/trailing dots (RFC 5322).
 * 3. Domain: <= 253 chars, at least one dot, valid DNS labels (1-63 chars, alphanumeric with internal hyphens).
 * 4. TLD: Must be an active delegated Top-Level Domain in the official IANA Root Zone Database.
 *    Strictly verifies 2-letter ccTLDs, generic TLDs, and IDN Punycode TLDs against delegated data.
 *    Strictly rejects appended suffixes such as .comabc, .com123, or .orgxyz.
 *
 * Note: Validating IANA delegation verifies syntax and root-level delegation; it does not query live
 * DNS records, verify full-domain registration, or confirm mailbox existence.
 */
export function isValidGstEmail(raw?: string | null): boolean {
  if (!raw) return false;
  const email = raw.trim();
  if (!email || email.length > 150) return false;

  // No whitespace allowed inside the email
  if (/\s/.test(email)) return false;

  // Must contain exactly one '@'
  const atIndex = email.indexOf("@");
  if (atIndex === -1 || atIndex !== email.lastIndexOf("@")) return false;

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  // Validate local part
  if (!local || local.length > 64) return false;
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (!EMAIL_LOCAL_REGEX.test(local)) return false;

  // Validate domain part
  if (!domain || domain.length > 253) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;

  // Every label must be non-empty and syntactically valid
  const allLabelsValid = labels.every(
    (label) => label.length >= 1 && label.length <= 63 && DOMAIN_LABEL_REGEX.test(label)
  );
  if (!allLabelsValid) return false;

  // Validate final Top-Level Domain (TLD) against official IANA Root Zone Database
  const tld = labels[labels.length - 1].toLowerCase();
  return isIanaDelegatedTld(tld);
}

export const GstValidators = {
  isValidBusinessName: (value: string): boolean => {
    const clean = value.trim();
    if (!clean || clean !== value || /\s{2,}/.test(clean)) return false;
    return /^[\p{L}\p{N}]+(?:[ .,&'()\/-][\p{L}\p{N}]+)*$/u.test(clean);
  },

  isValidBranchName: (value: string): boolean => {
    const clean = value.trim();
    if (!clean || clean !== value || /\s{2,}/.test(clean)) return false;
    return /^[\p{L}\p{N}]+(?:[ .,&'()\/-][\p{L}\p{N}]+)*$/u.test(clean);
  },

  /**
   * Validates Indian PAN Number: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
   */
  isValidPan: (pan: string): boolean => {
    const cleanPan = pan.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(cleanPan);
  },

  /**
   * Validates 12-digit Indian Aadhaar Number (allows spaces/dashes)
   */
  isValidAadhaar: (aadhaar: string): boolean => {
    const cleanAadhaar = aadhaar.replace(/[\s-]/g, "");
    return /^\d{12}$/.test(cleanAadhaar);
  },

  /**
   * Validates 10-digit Indian Mobile Number starting with 6, 7, 8, or 9
   */
  isValidMobile: (mobile: string): boolean => {
    const cleanMobile = mobile.replace(/^(\+91|0|\s)/g, "").replace(/[\s-]/g, "");
    return /^[6-9]\d{9}$/.test(cleanMobile);
  },

  /**
   * Validates Email Address format using strict RFC syntax and recognized TLD rules.
   */
  isValidEmail: (email: string): boolean => {
    return isValidGstEmail(email);
  },

  isBankAccountMatch: (account: string, confirmation: string): boolean =>
    account.trim() === confirmation.trim(),

  /**
   * Validates Indian 15-character GSTIN (e.g. 29PAVAN1234K1Z5)
   */
  isValidGstin: (gstin: string): boolean => {
    const cleanGstin = gstin.trim().toUpperCase();
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(cleanGstin);
  },

  /**
   * Validates 11-character Indian IFSC Code (e.g. HDFC0001234, SBIN0001234)
   */
  isValidIfsc: (ifsc: string): boolean => {
    const cleanIfsc = ifsc.trim().toUpperCase();
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(cleanIfsc);
  },

  /**
   * Validates Bank Account Number (between 9 and 18 digits)
   */
  isValidBankAccount: (account: string): boolean => {
    const cleanAcc = account.trim().replace(/[\s-]/g, "");
    return /^\d{9,18}$/.test(cleanAcc);
  },

  // Payment instrument and generic length checks live in the shared layer.
  isValidUpi: PaymentValidators.isValidUpi,
  isNotEmpty,
  isValidCardNumber: PaymentValidators.isValidCardNumber,
  isValidExpiry: PaymentValidators.isValidExpiry,
  isValidCvv: PaymentValidators.isValidCvv,
  validateCard: PaymentValidators.validateCard,
  validateNetBanking: PaymentValidators.validateNetBanking,

  /**
   * Functional field-level validator for GST Business Step
   */
  validateBusinessField: (field: string, value: string): string => {
    switch (field) {
      case "legalName":
        if (!value.trim()) return "Legal Name is required";
        if (!GstValidators.isValidBusinessName(value)) return "Enter a valid legal business name";
        return "";
      case "businessName":
      case "registeredBusinessName":
        if (!value.trim()) return "Business / Trade Name is required";
        if (!GstValidators.isValidBusinessName(value)) return "Enter a valid business or trade name";
        return "";
      case "businessType":
        if (!GstValidators.isNotEmpty(value, 2)) return "Please select a business type";
        return "";
      case "natureOfBusiness":
        if (!GstValidators.isNotEmpty(value, 2)) return "Please select nature of business";
        return "";
      case "businessStartDate":
        if (!GstValidators.isNotEmpty(value, 1)) return "Business start date is required";
        {
          const startDate = parseAnyDate(value);
          if (!startDate) return "Enter a valid date in DD-MM-YYYY format";
          if (isFutureDate(startDate)) return "Commencement date cannot be in the future";
        }
        return "";
      case "reasonForRegistration":
        if (!GstValidators.isNotEmpty(value, 2)) return "Please select a reason";
        return "";
      case "compositionScheme":
        if (!GstValidators.isNotEmpty(value, 2)) return "Please select an option";
        return "";
      case "aadhaarConsent":
        if (value !== "true") return "You must consent to Aadhaar authentication";
        return "";
      case "businessAddress":
        if (!GstValidators.isNotEmpty(value, 5)) return "Full business address with pincode is required";
        return "";
      case "placeOfBusiness":
        if (!GstValidators.isNotEmpty(value, 2)) return "Please select a place type";
        return "";
      case "city":
        if (!GstValidators.isNotEmpty(value, 2)) return "City is required";
        return "";
      case "district":
        if (!GstValidators.isNotEmpty(value, 2)) return "District is required";
        return "";
      case "state":
        if (!GstValidators.isNotEmpty(value, 2)) return "State is required";
        return "";
      case "pinCode":
        if (!/^\d{6}$/.test(value)) return "Enter a valid 6-digit PIN code";
        return "";
      case "hsnCode":
        if (!/^\d{4,8}$/.test(value)) return "HSN/SAC code must be 4 to 8 digits";
        return "";
      case "accountHolderName":
        if (!value.trim()) return "Account holder name is required";
        if (!validateFullName(value)) return "Enter a valid account holder name";
        return "";
      case "bankAccountNumber":
        if (!value.trim()) return "Bank account number is required";
        if (!GstValidators.isValidBankAccount(value)) return "Enter a valid bank account number (9 to 18 digits)";
        return "";
      case "confirmBankAccountNumber":
        if (!value.trim()) return "Confirm account number is required";
        if (!GstValidators.isValidBankAccount(value)) return "Enter a valid bank account number";
        return "";
      case "ifscCode":
        if (!value.trim()) return "IFSC code is required";
        if (!GstValidators.isValidIfsc(value)) return "Enter a valid 11-digit IFSC code (e.g. HDFC0001234)";
        return "";
      case "bankName":
        if (!GstValidators.isNotEmpty(value, 2)) return "Bank name is required";
        return "";
      case "branchName":
        if (!value.trim()) return "Branch name is required";
        if (!GstValidators.isValidBranchName(value)) return "Enter a valid branch name";
        return "";
      case "accountType":
        if (!GstValidators.isNotEmpty(value, 2)) return "Account type is required";
        return "";
      case "signatoryName":
        if (!value.trim()) return "Signatory name is required";
        if (!validateFullName(value)) return "Enter a valid signatory name";
        return "";
      case "signatoryPan":
        if (!GstValidators.isValidPan(value)) return "Enter a valid 10-character PAN";
        return "";
      case "signatoryDob": {
        if (!GstValidators.isNotEmpty(value, 1)) return "Date of birth is required";
        const dob = parseAnyDate(value);
        if (!dob) return "Enter a valid date in DD-MM-YYYY format";
        if (isFutureDate(dob)) return "Date of birth cannot be in the future";
        return "";
      }
      case "signatoryDesignation":
        if (!GstValidators.isNotEmpty(value, 2)) return "Designation is required";
        return "";
      case "signatoryMobile":
        if (!GstValidators.isValidMobile(value)) return "Enter a valid 10-digit mobile number";
        return "";
      case "signatoryEmail":
        if (!isValidGstEmail(value)) return "Enter a valid email address";
        return "";
      default:
        return "";
    }
  },

  /**
   * Functional whole-form validator for Business Details using reduce (no loops)
   */
  validateBusinessForm: (data: Record<string, string>): Record<string, string> => {
    const fields = [
      "legalName",
      "businessName",
      "businessType",
      "natureOfBusiness",
      "placeOfBusiness",
      "businessStartDate",
      "reasonForRegistration",
      "compositionScheme",
      "businessAddress",
      "city",
      "district",
      "state",
      "pinCode",
      "hsnCode",
      "accountHolderName",
      "bankAccountNumber",
      "confirmBankAccountNumber",
      "ifscCode",
      "bankName",
      "branchName",
      "accountType",
      "signatoryName",
      "signatoryPan",
      "signatoryDob",
      "signatoryDesignation",
      "signatoryMobile",
      "signatoryEmail",
      "aadhaarConsent",
    ];
    const errors = fields.reduce<Record<string, string>>((acc, key) => {
      const rawValue = data[key] || (key === "businessName" ? data["registeredBusinessName"] : "");
      const value = typeof rawValue === "boolean" ? String(rawValue) : String(rawValue || "");
      const error = GstValidators.validateBusinessField(key, value);
      return error ? { ...acc, [key]: error } : acc;
    }, {});

    if (
      !errors.bankAccountNumber &&
      !errors.confirmBankAccountNumber &&
      !GstValidators.isBankAccountMatch(data.bankAccountNumber, data.confirmBankAccountNumber)
    ) {
      errors.confirmBankAccountNumber = "Account numbers do not match.";
    }

    return errors;
  },
};
