import { AmendmentFormData, AmendmentStep, SupportingDoc } from "../types/gstAmendmentTypes";

/**
 * Valid statutory 2-digit Indian State / UT codes: strictly 01 through 38.
 * Rejects 00, values below 01, values above 38, alphabetic characters, and incomplete codes.
 */
export const VALID_GSTIN_STATE_CODES = new Set(
  Array.from({ length: 38 }, (_, i) => String(i + 1).padStart(2, "0"))
);

/**
 * Allowed 4th character of PAN (taxpayer category):
 * P (Individual), C (Company), H (HUF), F (Firm/LLP), A (AOP),
 * B (BOI), T (Trust), L (Local Authority), J (Artificial Juridical Person), G (Government).
 */
export const ALLOWED_PAN_CATEGORIES = new Set([
  "P", "C", "H", "F", "A", "B", "T", "L", "J", "G"
]);

/**
 * Validates a 10-character PAN number according to statutory structure:
 * - Positions 1–3: Alphabetic characters A–Z
 * - Position 4: One of P, C, H, F, A, B, T, L, J, G
 * - Position 5: Alphabetic character A–Z
 * - Positions 6–9: Numeric digits 0–9
 * - Position 10: Alphabetic character A–Z
 */
export function validatePanNumber(pan: string, isTouched = true): string | null {
  const clean = (pan || "").trim().toUpperCase();
  if (!clean) {
    return isTouched ? "Enter PAN number" : null;
  }

  if (clean.length !== 10) {
    return "Enter a valid PAN number";
  }

  const chars1to3 = clean.slice(0, 3);
  const fourth = clean[3];
  const fifth = clean[4];
  const digits6to9 = clean.slice(5, 9);
  const tenth = clean[9];

  // Must have 3 letters, 1 category char, 1 letter, 4 digits, 1 letter
  if (
    !/^[A-Z]{3}$/.test(chars1to3) ||
    !/^[A-Z]$/.test(fifth) ||
    !/^\d{4}$/.test(digits6to9) ||
    !/^[A-Z]$/.test(tenth)
  ) {
    return "Enter a valid PAN number";
  }

  // Validate 4th character against exact allowed categories
  if (!ALLOWED_PAN_CATEGORIES.has(fourth)) {
    return "Enter a valid PAN holder category";
  }

  return null;
}

/**
 * Validates a 15-character GSTIN structure:
 * - Positions 1–2: State code (01 to 38)
 * - Positions 3–12: 10-char PAN structure (Pos 6 is 4th char of PAN, must be in allowlist)
 * - Position 13: Entity registration code [1-9A-Z]
 * - Position 14: Mandatory letter 'Z'
 * - Position 15: Alphanumeric check character [0-9A-Z]
 */
export function validateGstinInput(
  gstin: string
): { isValid: true; error?: undefined } | { isValid: false; error: string } {
  const clean = (gstin || "").trim().toUpperCase();
  if (!clean) {
    return { isValid: false, error: "Enter GSTIN" };
  }

  if (clean.length !== 15) {
    return {
      isValid: false,
      error: "Enter a valid 15-character GSTIN",
    };
  }

  // 1. State code check (Positions 1-2)
  const stateCode = clean.slice(0, 2);
  if (!VALID_GSTIN_STATE_CODES.has(stateCode)) {
    return {
      isValid: false,
      error: "Enter a valid GSTIN state code",
    };
  }

  // 2. Embedded PAN check (Positions 3-12)
  const panSegment = clean.slice(2, 12);
  const chars1to3 = panSegment.slice(0, 3);
  const panCategory = panSegment[3]; // Pos 6 of GSTIN
  const fifth = panSegment[4];
  const digits6to9 = panSegment.slice(5, 9);
  const tenth = panSegment[9];

  if (
    !/^[A-Z]{3}$/.test(chars1to3) ||
    !/^[A-Z]$/.test(fifth) ||
    !/^\d{4}$/.test(digits6to9) ||
    !/^[A-Z]$/.test(tenth) ||
    !ALLOWED_PAN_CATEGORIES.has(panCategory)
  ) {
    return {
      isValid: false,
      error: "Enter a valid PAN segment in GSTIN",
    };
  }

  // 3. Entity code check (Position 13)
  const entityCode = clean[12];
  if (!/^[1-9A-Z]$/.test(entityCode)) {
    return {
      isValid: false,
      error: "Enter a valid GSTIN entity code",
    };
  }

  // 4. Default 14th character must be 'Z'
  const defaultZ = clean[13];
  if (defaultZ !== "Z") {
    return {
      isValid: false,
      error: "Enter a valid 15-character GSTIN",
    };
  }

  // 5. Check character check (Position 15)
  const checkChar = clean[14];
  if (!/^[0-9A-Z]$/.test(checkChar)) {
    return {
      isValid: false,
      error: "Enter a valid GSTIN check character",
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
 * Strict validator for email addresses in the GST Amendment module.
 * Rejects invalid domain endings, typos appended to .com (e.g. .comjdjdidi, .comm),
 * invalid TLDs, consecutive dots, spaces, and numbers in the top-level domain.
 */
export function validateAmendmentEmail(raw: string): boolean {
  const email = (raw || "").trim();
  if (!email || email.length > 100) return false;
  if (/\s/.test(email)) return false;

  const atIndex = email.indexOf("@");
  if (atIndex === -1 || atIndex !== email.lastIndexOf("@")) return false;

  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1);

  if (!localPart || !domainPart) return false;
  if (localPart.length > 64) return false;

  // Local part cannot start/end with dot or contain consecutive dots
  if (localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) {
    return false;
  }
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
    return false;
  }

  // Domain cannot start/end with dot or hyphen or contain consecutive dots
  if (domainPart.startsWith(".") || domainPart.endsWith(".") || domainPart.includes("..")) {
    return false;
  }
  if (domainPart.startsWith("-") || domainPart.endsWith("-")) {
    return false;
  }

  const domainLabels = domainPart.split(".");
  if (domainLabels.length < 2) return false;

  for (const label of domainLabels) {
    if (!label || label.length > 63) return false;
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label)) {
      return false;
    }
  }

  // Top-Level Domain (TLD) is the final segment
  const tld = domainLabels[domainLabels.length - 1].toLowerCase();

  // TLD must consist strictly of letters (no digits or symbols) between 2 and 10 characters
  if (!/^[a-zA-Z]{2,10}$/.test(tld)) {
    return false;
  }

  // Reject accidental typo extensions starting with "com" followed by extra characters (e.g. "comjdjdidi", "comm", "comxyz")
  if (/^com[a-z]+/i.test(tld)) {
    return false;
  }

  // Reject typo extensions on other common TLDs (e.g. "orgxyz", "netxyz", "inxyz", "eduxyz")
  if (/^(?:org|net|gov|edu|biz|info|mil)[a-z]+/i.test(tld)) {
    return false;
  }

  // If domain is a well-known email provider, validate that provider's domain structure
  const provider = domainLabels[domainLabels.length - 2].toLowerCase();
  if (["gmail", "hotmail", "outlook", "icloud"].includes(provider)) {
    if (tld !== "com" || domainLabels.length !== 2) {
      return false;
    }
  }

  return true;
}

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
      if (/^\d+$/.test(trimmed.replace(/[\s.&',\-/]/g, ""))) return "Enter a valid legal business name";
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
      const strippedOfPunctuationAndSpace = trimmed.replace(/[\s,.\-/#()&':;]/g, "");
      if (/^\d+$/.test(strippedOfPunctuationAndSpace)) {
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
      return validatePanNumber(trimmed, isTouched);
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
      if (/^\d+$/.test(trimmed)) return "Enter a valid designation";
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
      if (!validateAmendmentEmail(trimmed)) {
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
      errs.newPrincipalState = "Select state or union territory";
    }

    const pinErr = validateAmendmentFieldValue("newPrincipalPincode", formData.newPrincipalPincode, formData, true);
    if (pinErr) errs.newPrincipalPincode = pinErr;

    if (!formData.newPrincipalNatureOfPremises) {
      errs.newPrincipalNatureOfPremises = "Select nature of possession";
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
      errs.newAdditionalNatureOfPremises = "Select nature of possession";
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
      errs.newAccountType = "Select account type";
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
    errs.supportingDoc = "Upload supporting document";
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
