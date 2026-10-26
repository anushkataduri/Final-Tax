/**
 * Centralized GSTIN & Tax Validator
 * Standard statutory pattern for 15-character Indian Goods and Services Tax Identification Number (GSTIN).
 * Format: 2-digit state code + 10-char PAN + 1-char entity number + 'Z' + 1-char check digit.
 */

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/**
 * Valid Indian State and Union Territory codes:
 * 01 to 38 (Domestic states and UTs) plus 97 (Other Territory) and 99 (Centre Jurisdiction).
 */
export const VALID_GSTIN_STATE_CODES: ReadonlySet<string> = new Set([
  ...Array.from({ length: 38 }, (_, i) => String(i + 1).padStart(2, "0")),
  "97",
  "99",
]);

/**
 * Valid PAN 4th character categories (taxpayer constitution).
 * P - Individual, C - Company, H - HUF, F - Firm/LLP, A - AOP,
 * B - BOI, T - Trust, L - Local Authority, J - Artificial Juridical Person, G - Government.
 */
export const ALLOWED_PAN_CATEGORIES: ReadonlySet<string> = new Set([
  "P", "C", "H", "F", "A", "B", "T", "L", "J", "G",
]);

/**
 * Checks if a 2-digit code is a recognized GST state/UT code.
 */
export function isValidGstinStateCode(code: string): boolean {
  if (!code) return false;
  return VALID_GSTIN_STATE_CODES.has(code.trim());
}

/**
 * Extracts the 10-character PAN segment from a 15-character GSTIN.
 * Positions 3 to 12 (0-indexed indices 2..12).
 */
export function extractPanFromGstin(gstin: string): string | null {
  const clean = (gstin || "").trim().toUpperCase();
  if (clean.length < 12) return null;
  return clean.slice(2, 12);
}

/**
 * Verifies consistency between a GSTIN and an independently provided PAN.
 */
export function verifyGstinPanConsistency(gstin: string, pan: string): boolean {
  const extracted = extractPanFromGstin(gstin);
  if (!extracted || !pan) return false;
  return extracted === pan.trim().toUpperCase();
}

/**
 * Comprehensive GSTIN validation with real-time statutory feedback.
 */
export function validateGstin(gstin: string, isTouched = true): string | null {
  const clean = (gstin || "").trim().toUpperCase();

  if (!clean) {
    return isTouched ? "Enter GSTIN" : null;
  }

  // Real-time State Code check: evaluate once at least 2 digits are entered
  if (clean.length >= 2) {
    const stateCode = clean.slice(0, 2);
    if (!isValidGstinStateCode(stateCode)) {
      return "Enter a valid GSTIN state code (01-38, 97, or 99)";
    }
  }

  if (clean.length < 15) {
    return isTouched ? "GSTIN must contain 15 characters" : null;
  }

  if (clean.length > 15) {
    return "GSTIN must contain 15 characters";
  }

  // Regex check for statutory structure
  if (!GSTIN_REGEX.test(clean)) {
    return "Enter a valid GSTIN";
  }

  // Position 6: 4th char of PAN must be a recognized taxpayer category
  const panCategory = clean[5];
  if (!ALLOWED_PAN_CATEGORIES.has(panCategory)) {
    return "Enter a valid GSTIN";
  }

  return null;
}

/**
 * Boolean validator for GSTIN format.
 */
export function isValidGstin(gstin: string): boolean {
  return validateGstin(gstin, true) === null;
}
