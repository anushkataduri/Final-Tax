import { GSTIN_REGEX } from "@/shared/validators/indianTaxValidators";
import { AmendmentFormData, AmendmentStep, SupportingDoc } from "../types/gstAmendmentTypes";

/** Valid statutory 2-digit Indian State / UT / Special Territory codes */
const VALID_STATE_CODES = new Set([
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
  "31", "32", "33", "34", "35", "36", "37", "38", "97", "99",
]);

export function validateGstinInput(
  gstin: string
): { isValid: true; error?: undefined } | { isValid: false; error: string } {
  const clean = gstin.trim().toUpperCase();
  if (!clean) {
    return { isValid: false, error: "Enter 15-character GSTIN" };
  }

  if (!GSTIN_REGEX.test(clean)) {
    return {
      isValid: false,
      error: "Enter a valid 15-character GSTIN",
    };
  }

  const stateCode = clean.slice(0, 2);
  if (!VALID_STATE_CODES.has(stateCode)) {
    return {
      isValid: false,
      error: "Enter a valid Indian State or UT code",
    };
  }

  return { isValid: true };
}

export function isFormDataDirty(
  currentStep: AmendmentStep,
  formData: AmendmentFormData,
  supportingDocOrDocs: SupportingDoc | Record<string, SupportingDoc | null> | null
): boolean {
  if (currentStep === "LANDING" || currentStep === "SUCCESS") return false;

  const hasDoc = Boolean(
    supportingDocOrDocs &&
      (typeof supportingDocOrDocs === "object" && "uri" in supportingDocOrDocs
        ? Boolean(supportingDocOrDocs.uri)
        : Object.values(supportingDocOrDocs).some((doc) => Boolean(doc?.uri)))
  );

  return Boolean(
    formData.newLegalBusinessName ||
      formData.newPrincipalAddress ||
      formData.newPrincipalCity ||
      formData.newPrincipalDistrict ||
      formData.newPrincipalState ||
      formData.newPrincipalPincode ||
      formData.newPrincipalNatureOfPremises ||
      formData.newAdditionalAddress ||
      formData.newAdditionalCity ||
      formData.newAdditionalPincode ||
      formData.newAdditionalNatureOfPremises ||
      formData.newBankName ||
      formData.newBankAccountNumber ||
      formData.confirmBankAccountNumber ||
      formData.newIfscCode ||
      formData.newAccountType ||
      formData.newSignatoryName ||
      formData.newSignatoryPan ||
      formData.newSignatoryDob ||
      formData.newSignatoryDesignation ||
      formData.newSignatoryMobile ||
      formData.newSignatoryEmail ||
      formData.newContactMobile ||
      formData.newContactEmail ||
      hasDoc
  );
}

export const isValidPincode = (pincode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
};

export const hasEmoji = (val: string): boolean => {
  const nonAscii = val.replace(/[\x00-\x7F]/g, "");
  if (!nonAscii) return false;
  return /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u.test(nonAscii);
};

/**
 * Universal single-source validator for every GST Amendment text field.
 * Handles both real-time typing and on-submit form validation.
 */
export function validateAmendmentFieldValue(
  field: keyof AmendmentFormData,
  value: string,
  allData: AmendmentFormData,
  isTouched = true
): string | null {
  const trimmed = (value || "").trim();

  // If empty and touched, show the field's direct required prompt
  if (!trimmed) {
    if (!isTouched) return null;
    switch (field) {
      case "newLegalBusinessName": return "Enter legal business name";
      case "newPrincipalAddress":
      case "newAdditionalAddress": return "Enter business address";
      case "newPrincipalCity":
      case "newAdditionalCity": return "Enter city or town";
      case "newPrincipalDistrict": return "Enter district";
      case "newPrincipalPincode":
      case "newAdditionalPincode": return "Enter PIN code";
      case "newBankName": return "Enter bank name";
      case "newBankAccountNumber": return "Enter bank account number";
      case "confirmBankAccountNumber": return "Re-enter bank account number";
      case "newIfscCode": return "Enter IFSC code";
      case "newSignatoryName": return "Enter full name";
      case "newSignatoryPan": return "Enter PAN number";
      case "newSignatoryDob": return "Select date of birth";
      case "newSignatoryDesignation": return "Enter designation";
      case "newSignatoryMobile":
      case "newContactMobile": return "Enter mobile number";
      case "newSignatoryEmail":
      case "newContactEmail": return "Enter email address";
      default: return null;
    }
  }

  // Reject emojis across all amendment fields
  if (hasEmoji(value)) {
    switch (field) {
      case "newLegalBusinessName": return "Enter a valid legal business name";
      case "newPrincipalAddress":
      case "newAdditionalAddress": return "Enter a valid business address";
      case "newPrincipalCity":
      case "newAdditionalCity": return "Enter a valid city or town";
      case "newPrincipalDistrict": return "Enter a valid district";
      case "newBankName": return "Enter a valid bank name";
      case "newSignatoryName": return "Enter a valid full name";
      case "newSignatoryDesignation": return "Enter a valid designation";
      case "newSignatoryPan": return "Enter a valid PAN number";
      case "newIfscCode": return "Enter a valid IFSC code";
      case "newPrincipalPincode":
      case "newAdditionalPincode": return "Enter a valid 6-digit PIN code";
      case "newBankAccountNumber":
      case "confirmBankAccountNumber": return "Enter a valid bank account number";
      case "newSignatoryMobile":
      case "newContactMobile": return "Enter a valid 10-digit mobile number";
      case "newSignatoryEmail":
      case "newContactEmail": return "Enter a valid email address";
      default: return null;
    }
  }

  switch (field) {
    case "newLegalBusinessName": {
      if (trimmed.length > 100) return "Legal business name exceeds the maximum length";
      if (!/[a-zA-Z\p{L}]/u.test(trimmed)) return "Enter a valid legal business name";
      if (/^\d+$/.test(trimmed)) return "Enter a valid legal business name";
      if (!/^[a-zA-Z0-9\p{L}\s.&',\-\/]+$/u.test(trimmed)) {
        return "Enter a valid legal business name";
      }
      return null;
    }

    case "newPrincipalAddress":
    case "newAdditionalAddress": {
      if (trimmed.length < 5) return "Business address is too short";
      if (trimmed.length > 200) return "Business address exceeds the maximum length";
      // Address cannot be digits only regardless of length
      if (/^\d+$/.test(trimmed.replace(/[\s,.\-/#()&':;]/g, ""))) {
        return "Enter a valid business address";
      }
      if (!/[a-zA-Z\p{L}]/u.test(trimmed)) return "Enter a valid business address";
      if (!/^[a-zA-Z0-9\p{L}\s,.\-/#()&':;]+$/u.test(trimmed)) {
        return "Enter a valid business address";
      }
      return null;
    }

    case "newPrincipalCity":
    case "newAdditionalCity": {
      if (trimmed.length > 50) return "City or town exceeds the maximum length";
      if (trimmed.length < 2) return "Enter a valid city or town";
      if (/\d/.test(trimmed)) return "Enter a valid city or town";
      if (!/[a-zA-Z\p{L}]/u.test(trimmed)) return "Enter a valid city or town";
      if (!/^[a-zA-Z\p{L}\s.'-]{2,50}$/u.test(trimmed)) return "Enter a valid city or town";
      return null;
    }

    case "newPrincipalDistrict": {
      if (trimmed.length > 50) return "District exceeds the maximum length";
      if (trimmed.length < 2) return "Enter a valid district";
      if (/\d/.test(trimmed)) return "Enter a valid district";
      if (!/[a-zA-Z\p{L}]/u.test(trimmed)) return "Enter a valid district";
      if (!/^[a-zA-Z\p{L}\s.'-]{2,50}$/u.test(trimmed)) return "Enter a valid district";
      return null;
    }

    case "newPrincipalPincode":
    case "newAdditionalPincode": {
      if (!/^[1-9][0-9]{5}$/.test(trimmed)) return "Enter a valid 6-digit PIN code";
      return null;
    }

    case "newBankName": {
      if (trimmed.length > 100) return "Bank name exceeds the maximum length";
      if (trimmed.length < 2) return "Enter a valid bank name";
      if (/\d/.test(trimmed)) return "Enter a valid bank name";
      if (!/^[a-zA-Z\p{L}\s.&'-]{2,100}$/u.test(trimmed)) return "Enter a valid bank name";
      return null;
    }

    case "newBankAccountNumber": {
      if (/[^0-9]/.test(trimmed)) return "Enter a valid bank account number";
      if (/^0+$/.test(trimmed)) return "Enter a valid bank account number";
      if (trimmed.length < 9 || trimmed.length > 18) return "Enter a valid bank account number";
      return null;
    }

    case "confirmBankAccountNumber": {
      if (/[^0-9]/.test(trimmed)) return "Enter a valid bank account number";
      if (trimmed.length < 9 || trimmed.length > 18) return "Enter a valid bank account number";
      if (allData.newBankAccountNumber && trimmed !== allData.newBankAccountNumber.trim()) {
        return "Bank account numbers do not match";
      }
      return null;
    }

    case "newIfscCode": {
      const upper = trimmed.toUpperCase();
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(upper)) return "Enter a valid IFSC code";
      return null;
    }

    case "newSignatoryName": {
      if (trimmed.length > 100) return "Full name exceeds the maximum length";
      if (trimmed.length < 2) return "Enter a valid full name";
      if (/\d/.test(trimmed)) return "Enter a valid full name";
      if (!/^[a-zA-Z\p{L}\s.'-]{2,100}$/u.test(trimmed)) return "Enter a valid full name";
      return null;
    }

    case "newSignatoryPan": {
      const upper = trimmed.toUpperCase();
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(upper)) return "Enter a valid PAN number";
      return null;
    }

    case "newSignatoryDob": {
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
      const now = new Date();
      if (dobDate > now) return "Date of birth cannot be in the future";
      const ageDiffMs = now.getTime() - dobDate.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 18) return "Enter a valid date of birth";
      return null;
    }

    case "newSignatoryDesignation": {
      if (trimmed.length > 50) return "Designation exceeds the maximum length";
      if (trimmed.length < 2) return "Enter a valid designation";
      if (!/[a-zA-Z\p{L}]/u.test(trimmed)) return "Enter a valid designation";
      if (!/^[a-zA-Z0-9\p{L}\s.'\/-]{2,50}$/u.test(trimmed)) return "Enter a valid designation";
      return null;
    }

    case "newSignatoryMobile":
    case "newContactMobile": {
      const clean = trimmed.replace(/\D/g, "");
      if (clean.length !== 10 || !/^[6-9]\d{9}$/.test(clean)) {
        return "Enter a valid 10-digit mobile number";
      }
      return null;
    }

    case "newSignatoryEmail":
    case "newContactEmail": {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(trimmed)) {
        return "Enter a valid email address";
      }
      return null;
    }

    default:
      return null;
  }
}

/** Field rules per amendment section; each adds messages to `errs`. */
const SECTION_RULES: Record<string, (formData: AmendmentFormData, errs: Record<string, string>) => void> = {
  "legal-name": (formData, errs) => {
    const err = validateAmendmentFieldValue("newLegalBusinessName", formData.newLegalBusinessName, formData, true);
    if (err) errs.newLegalBusinessName = err;
  },
  "principal-place": (formData, errs) => {
    const addrErr = validateAmendmentFieldValue("newPrincipalAddress", formData.newPrincipalAddress, formData, true);
    if (addrErr) errs.newPrincipalAddress = addrErr;

    const cityErr = validateAmendmentFieldValue("newPrincipalCity", formData.newPrincipalCity, formData, true);
    if (cityErr) errs.newPrincipalCity = cityErr;

    const distErr = validateAmendmentFieldValue("newPrincipalDistrict", formData.newPrincipalDistrict, formData, true);
    if (distErr) errs.newPrincipalDistrict = distErr;

    if (!formData.newPrincipalState) {
      errs.newPrincipalState = "Select State / UT";
    }

    const pinErr = validateAmendmentFieldValue("newPrincipalPincode", formData.newPrincipalPincode, formData, true);
    if (pinErr) errs.newPrincipalPincode = pinErr;

    if (!formData.newPrincipalNatureOfPremises) {
      errs.newPrincipalNatureOfPremises = "Select Nature of Premises";
    }
  },
  "additional-place": (formData, errs) => {
    const addrErr = validateAmendmentFieldValue("newAdditionalAddress", formData.newAdditionalAddress, formData, true);
    if (addrErr) errs.newAdditionalAddress = addrErr;

    const cityErr = validateAmendmentFieldValue("newAdditionalCity", formData.newAdditionalCity, formData, true);
    if (cityErr) errs.newAdditionalCity = cityErr;

    const pinErr = validateAmendmentFieldValue("newAdditionalPincode", formData.newAdditionalPincode, formData, true);
    if (pinErr) errs.newAdditionalPincode = pinErr;

    if (!formData.newAdditionalNatureOfPremises) {
      errs.newAdditionalNatureOfPremises = "Select Nature of Premises";
    }
  },
  "bank-accounts": (formData, errs) => {
    const bankErr = validateAmendmentFieldValue("newBankName", formData.newBankName, formData, true);
    if (bankErr) errs.newBankName = bankErr;

    const accErr = validateAmendmentFieldValue("newBankAccountNumber", formData.newBankAccountNumber, formData, true);
    if (accErr) errs.newBankAccountNumber = accErr;

    const confErr = validateAmendmentFieldValue("confirmBankAccountNumber", formData.confirmBankAccountNumber, formData, true);
    if (confErr) errs.confirmBankAccountNumber = confErr;

    const ifscErr = validateAmendmentFieldValue("newIfscCode", formData.newIfscCode, formData, true);
    if (ifscErr) errs.newIfscCode = ifscErr;

    if (!formData.newAccountType) {
      errs.newAccountType = "Select Account Type";
    }
  },
  "authorised-signatories": (formData, errs) => {
    const nameErr = validateAmendmentFieldValue("newSignatoryName", formData.newSignatoryName, formData, true);
    if (nameErr) errs.newSignatoryName = nameErr;

    const panErr = validateAmendmentFieldValue("newSignatoryPan", formData.newSignatoryPan, formData, true);
    if (panErr) errs.newSignatoryPan = panErr;

    const dobErr = validateAmendmentFieldValue("newSignatoryDob", formData.newSignatoryDob, formData, true);
    if (dobErr) errs.newSignatoryDob = dobErr;

    const desigErr = validateAmendmentFieldValue("newSignatoryDesignation", formData.newSignatoryDesignation, formData, true);
    if (desigErr) errs.newSignatoryDesignation = desigErr;

    const mobErr = validateAmendmentFieldValue("newSignatoryMobile", formData.newSignatoryMobile, formData, true);
    if (mobErr) errs.newSignatoryMobile = mobErr;

    const emailErr = validateAmendmentFieldValue("newSignatoryEmail", formData.newSignatoryEmail, formData, true);
    if (emailErr) errs.newSignatoryEmail = emailErr;
  },
  "contact-details": (formData, errs) => {
    const mobErr = validateAmendmentFieldValue("newContactMobile", formData.newContactMobile, formData, true);
    if (mobErr) errs.newContactMobile = mobErr;

    const emailErr = validateAmendmentFieldValue("newContactEmail", formData.newContactEmail, formData, true);
    if (emailErr) errs.newContactEmail = emailErr;
  },
};

export function validateSectionForm(
  sectionId: string,
  formData: AmendmentFormData,
  supportingDoc: SupportingDoc | null
): { isValid: boolean; errors: Record<string, string> } {
  const errs: Record<string, string> = {};

  if (Object.prototype.hasOwnProperty.call(SECTION_RULES, sectionId)) {
    SECTION_RULES[sectionId](formData, errs);
  }

  if (!supportingDoc || !supportingDoc.uri) {
    errs.supportingDoc = "Upload supporting proof";
  }

  return {
    isValid: Object.keys(errs).length === 0,
    errors: errs,
  };
}

/**
 * Real-time field validator for keystroke / blur feedback.
 * Returns error string or null if valid.
 */
export function validateFieldRealtime(
  field: keyof AmendmentFormData,
  value: string,
  allData: AmendmentFormData
): string | null {
  return validateAmendmentFieldValue(field, value, allData, true);
}
