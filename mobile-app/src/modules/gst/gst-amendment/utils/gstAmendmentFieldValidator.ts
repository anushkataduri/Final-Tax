import type { AmendmentFormData } from "../types/gstAmendmentTypes";
import { hasEmoji, validateAmendmentEmail, validatePanNumber } from "./gstAmendmentPrimitiveValidators";

const REQUIRED_MESSAGES: Partial<Record<keyof AmendmentFormData, string>> = {
  newLegalBusinessName: "Enter legal business name",
  newPrincipalAddress: "Enter business address",
  newAdditionalAddress: "Enter business address",
  newPrincipalCity: "Enter city or town",
  newAdditionalCity: "Enter city or town",
  newPrincipalDistrict: "Enter district",
  newPrincipalPincode: "Enter PIN code",
  newAdditionalPincode: "Enter PIN code",
  newBankName: "Enter bank name",
  newBankAccountNumber: "Enter bank account number",
  confirmBankAccountNumber: "Re-enter bank account number",
  newIfscCode: "Enter IFSC code",
  newSignatoryName: "Enter full name",
  newSignatoryPan: "Enter PAN number",
  newSignatoryDob: "Select date of birth",
  newSignatoryDesignation: "Enter designation",
  newSignatoryMobile: "Enter mobile number",
  newContactMobile: "Enter mobile number",
  newSignatoryEmail: "Enter email address",
  newContactEmail: "Enter email address",
};

const EMOJI_MESSAGES: Partial<Record<keyof AmendmentFormData, string>> = {
  newLegalBusinessName: "Enter a valid legal business name",
  newPrincipalAddress: "Enter a valid business address",
  newAdditionalAddress: "Enter a valid business address",
  newPrincipalCity: "Enter a valid city or town",
  newAdditionalCity: "Enter a valid city or town",
  newPrincipalDistrict: "Enter a valid district",
  newBankName: "Enter a valid bank name",
  newSignatoryName: "Enter a valid full name",
  newSignatoryDesignation: "Enter a valid designation",
  newSignatoryPan: "Enter a valid PAN number",
  newIfscCode: "Enter a valid IFSC code",
  newPrincipalPincode: "Enter a valid 6-digit PIN code",
  newAdditionalPincode: "Enter a valid 6-digit PIN code",
  newBankAccountNumber: "Enter a valid bank account number",
  confirmBankAccountNumber: "Enter a valid bank account number",
  newSignatoryMobile: "Enter a valid 10-digit mobile number",
  newContactMobile: "Enter a valid 10-digit mobile number",
  newSignatoryEmail: "Enter a valid email address",
  newContactEmail: "Enter a valid email address",
};

function validateDob(trimmed: string): string | null {
  if (trimmed.length < 8) return "Enter a valid date of birth";
  const parts = trimmed.split(/[-/]/);
  if (parts.length !== 3) return "Enter a valid date of birth";
  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);
  if (isNaN(day) || isNaN(month) || isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31) {
    return "Enter a valid date of birth";
  }
  const dobDate = new Date(year, month - 1, day);
  if (dobDate > new Date()) return "Date of birth cannot be in the future";
  const ageMs = Date.now() - dobDate.getTime();
  const age = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));
  if (age < 18) return "Enter a valid date of birth";
  return null;
}

/**
 * Universal single-source validator for every GST Amendment text field.
 * Handles both real-time typing and on-submit form validation.
 */
export function validateAmendmentFieldValue(
  field: keyof AmendmentFormData,
  value: string,
  allData: AmendmentFormData,
  isTouched = true,
): string | null {
  const trimmed = (value || "").trim();

  if (!trimmed) {
    if (!isTouched) return null;
    return REQUIRED_MESSAGES[field] ?? null;
  }

  if (hasEmoji(value)) return EMOJI_MESSAGES[field] ?? null;

  switch (field) {
    case "newLegalBusinessName": {
      if (trimmed.length > 100) return "Legal business name exceeds the maximum length";
      if (!/[a-zA-Z\p{L}]/u.test(trimmed)) return "Enter a valid legal business name";
      if (/^\d+$/.test(trimmed.replace(/[\s.&',\-/]/g, ""))) return "Enter a valid legal business name";
      if (!/^[a-zA-Z0-9\p{L}\s.&',\-\/]+$/u.test(trimmed)) return "Enter a valid legal business name";
      return null;
    }

    case "newPrincipalAddress":
    case "newAdditionalAddress": {
      if (trimmed.length < 5) return "Business address is too short";
      if (trimmed.length > 200) return "Business address exceeds the maximum length";
      if (/^\d+$/.test(trimmed.replace(/[\s,.\-/#()&':;]/g, ""))) return "Enter a valid business address";
      if (!/[a-zA-Z\p{L}]/u.test(trimmed)) return "Enter a valid business address";
      if (!/^[a-zA-Z0-9\p{L}\s,.\-/#()&':;]+$/u.test(trimmed)) return "Enter a valid business address";
      return null;
    }

    case "newPrincipalCity":
    case "newAdditionalCity": {
      if (trimmed.length > 50) return "City or town exceeds the maximum length";
      if (trimmed.length < 2) return "Enter a valid city or town";
      if (/\d/.test(trimmed)) return "Enter a valid city or town";
      if (!/^[a-zA-Z\p{L}\s.'-]{2,50}$/u.test(trimmed)) return "Enter a valid city or town";
      return null;
    }

    case "newPrincipalDistrict": {
      if (trimmed.length > 50) return "District exceeds the maximum length";
      if (trimmed.length < 2 || /\d/.test(trimmed)) return "Enter a valid district";
      if (!/^[a-zA-Z\p{L}\s.'-]{2,50}$/u.test(trimmed)) return "Enter a valid district";
      return null;
    }

    case "newPrincipalPincode":
    case "newAdditionalPincode":
      return /^[1-9][0-9]{5}$/.test(trimmed) ? null : "Enter a valid 6-digit PIN code";

    case "newBankName": {
      if (trimmed.length > 100) return "Bank name exceeds the maximum length";
      if (trimmed.length < 2 || /\d/.test(trimmed)) return "Enter a valid bank name";
      if (!/^[a-zA-Z\p{L}\s.&'-]{2,100}$/u.test(trimmed)) return "Enter a valid bank name";
      return null;
    }

    case "newBankAccountNumber": {
      if (/[^0-9]/.test(trimmed) || /^0+$/.test(trimmed)) return "Enter a valid bank account number";
      if (trimmed.length < 9 || trimmed.length > 18) return "Enter a valid bank account number";
      return null;
    }

    case "confirmBankAccountNumber": {
      if (/[^0-9]/.test(trimmed) || trimmed.length < 9 || trimmed.length > 18) {
        return "Enter a valid bank account number";
      }
      if (allData.newBankAccountNumber && trimmed !== allData.newBankAccountNumber.trim()) {
        return "Bank account numbers do not match";
      }
      return null;
    }

    case "newIfscCode":
      return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(trimmed.toUpperCase())
        ? null
        : "Enter a valid IFSC code";

    case "newSignatoryName": {
      if (trimmed.length > 100) return "Full name exceeds the maximum length";
      if (trimmed.length < 2 || /\d/.test(trimmed)) return "Enter a valid full name";
      if (!/^[a-zA-Z\p{L}\s.'-]{2,100}$/u.test(trimmed)) return "Enter a valid full name";
      return null;
    }

    case "newSignatoryPan":
      return validatePanNumber(trimmed, isTouched);

    case "newSignatoryDob":
      return validateDob(trimmed);

    case "newSignatoryDesignation": {
      if (trimmed.length > 50) return "Designation exceeds the maximum length";
      if (trimmed.length < 2 || !/[a-zA-Z\p{L}]/u.test(trimmed) || /^\d+$/.test(trimmed)) {
        return "Enter a valid designation";
      }
      if (!/^[a-zA-Z0-9\p{L}\s.'\/-]{2,50}$/u.test(trimmed)) return "Enter a valid designation";
      return null;
    }

    case "newSignatoryMobile":
    case "newContactMobile": {
      const digits = trimmed.replace(/\D/g, "");
      return digits.length === 10 && /^[6-9]\d{9}$/.test(digits)
        ? null
        : "Enter a valid 10-digit mobile number";
    }

    case "newSignatoryEmail":
    case "newContactEmail":
      return validateAmendmentEmail(trimmed) ? null : "Enter a valid email address";

    default:
      return null;
  }
}
