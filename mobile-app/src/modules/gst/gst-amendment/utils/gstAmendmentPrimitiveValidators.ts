import { VALID_GSTIN_STATE_CODES, ALLOWED_PAN_CATEGORIES } from "./gstAmendmentValidationConstants";

/**
 * Validates a 10-character PAN number according to statutory structure:
 * Positions 1–3: A–Z  |  4: category char  |  5: A–Z  |  6–9: digits  |  10: A–Z
 */
export function validatePanNumber(pan: string, isTouched = true): string | null {
  const clean = (pan || "").trim().toUpperCase();
  if (!clean) return isTouched ? "Enter PAN number" : null;
  if (clean.length !== 10) return "Enter a valid PAN number";

  const chars1to3 = clean.slice(0, 3);
  const fourth = clean[3];
  const fifth = clean[4];
  const digits6to9 = clean.slice(5, 9);
  const tenth = clean[9];

  if (
    !/^[A-Z]{3}$/.test(chars1to3) ||
    !/^[A-Z]$/.test(fifth) ||
    !/^\d{4}$/.test(digits6to9) ||
    !/^[A-Z]$/.test(tenth)
  ) {
    return "Enter a valid PAN number";
  }
  if (!ALLOWED_PAN_CATEGORIES.has(fourth)) return "Enter a valid PAN holder category";
  return null;
}

/**
 * Validates a 15-character GSTIN structure.
 * Positions 1–2: state code (01–38)  |  3–12: embedded PAN  |  13: entity code [1-9A-Z]  |
 * 14: must be 'Z'  |  15: check char [0-9A-Z]
 */
export function validateGstinInput(
  gstin: string,
): { isValid: true; error?: undefined } | { isValid: false; error: string } {
  const clean = (gstin || "").trim().toUpperCase();
  if (!clean) return { isValid: false, error: "Enter GSTIN" };
  if (clean.length !== 15) return { isValid: false, error: "Enter a valid 15-character GSTIN" };

  const stateCode = clean.slice(0, 2);
  if (!VALID_GSTIN_STATE_CODES.has(stateCode)) {
    return { isValid: false, error: "Enter a valid GSTIN state code" };
  }

  const panSegment = clean.slice(2, 12);
  if (
    !/^[A-Z]{3}$/.test(panSegment.slice(0, 3)) ||
    !/^[A-Z]$/.test(panSegment[4]) ||
    !/^\d{4}$/.test(panSegment.slice(5, 9)) ||
    !/^[A-Z]$/.test(panSegment[9]) ||
    !ALLOWED_PAN_CATEGORIES.has(panSegment[3])
  ) {
    return { isValid: false, error: "Enter a valid PAN segment in GSTIN" };
  }

  if (!/^[1-9A-Z]$/.test(clean[12])) {
    return { isValid: false, error: "Enter a valid GSTIN entity code" };
  }
  if (clean[13] !== "Z") return { isValid: false, error: "Enter a valid 15-character GSTIN" };
  if (!/^[0-9A-Z]$/.test(clean[14])) {
    return { isValid: false, error: "Enter a valid GSTIN check character" };
  }
  return { isValid: true };
}

export const isValidPincode = (pincode: string): boolean =>
  /^[1-9][0-9]{5}$/.test(pincode.trim());

export const hasEmoji = (val: string): boolean => {
  const nonAscii = val.replace(/[\x00-\x7F]/g, "");
  if (!nonAscii) return false;
  return /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u.test(nonAscii);
};

/**
 * Strict email validator: rejects typo TLDs (e.g. ".comxyz"), invalid characters,
 * consecutive dots, and well-known provider domain mismatches.
 */
export function validateAmendmentEmail(raw: string): boolean {
  const email = (raw || "").trim();
  if (!email || email.length > 100 || /\s/.test(email)) return false;

  const atIndex = email.indexOf("@");
  if (atIndex === -1 || atIndex !== email.lastIndexOf("@")) return false;

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (!local || !domain || local.length > 64) return false;

  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false;

  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) return false;
  if (domain.startsWith("-") || domain.endsWith("-")) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;
  for (const label of labels) {
    if (!label || label.length > 63) return false;
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label)) return false;
  }

  const tld = labels[labels.length - 1].toLowerCase();
  if (!/^[a-zA-Z]{2,10}$/.test(tld)) return false;
  // Reject typo extensions: ".comxyz", ".orgabc", etc.
  if (/^(?:com|org|net|gov|edu|biz|info|mil)[a-z]+/i.test(tld)) return false;

  const provider = labels[labels.length - 2].toLowerCase();
  if (["gmail", "hotmail", "outlook", "icloud"].includes(provider)) {
    if (tld !== "com" || labels.length !== 2) return false;
  }
  return true;
}
