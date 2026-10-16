import { FilingDocItem } from "../config/gstFilingDocumentsConfig";
import { getFilingPeriodsForFrequency } from "../components/GstFilingPeriodStep/gstPeriodUtils";

/**
 * 38 statutory domestic Indian States and Union Territories (GST Portal standard: 01 to 38).
 * Rejects: 00, out-of-range (> 38), and non-numeric codes.
 */
export const VALID_GSTIN_STATE_CODES = new Set(
  Array.from({ length: 38 }, (_, i) => String(i + 1).padStart(2, "0"))
);

/**
 * Valid PAN categories (4th character of PAN, position 6 of GSTIN).
 * P - Individual, C - Company, H - HUF, F - Firm/LLP, A - AOP,
 * B - BOI, T - Trust, L - Local Authority, J - Artificial Juridical Person, G - Government.
 */
export const ALLOWED_PAN_CATEGORIES = new Set([
  "P", "C", "H", "F", "A", "B", "T", "L", "J", "G"
]);

/** Permitted upper monetary ceiling for estimated figures: ₹999 Crore (9,99,99,99,999) */
export const MAX_ESTIMATED_AMOUNT = 9999999999;

/**
 * Validates a GSTIN string with granular real-time feedback.
 *
 * @param gstin Raw or cleaned GSTIN string
 * @param isTouched Whether the field has been touched or a form submit was attempted
 */
export function validateGstin(gstin: string, isTouched = true): string | null {
  const clean = (gstin || "").trim().toUpperCase();

  if (!clean) {
    return isTouched ? "Enter GSTIN" : null;
  }

  // Real-time State Code check: evaluate as soon as 2 digits are present
  if (clean.length >= 2) {
    const stateCode = clean.slice(0, 2);
    if (!VALID_GSTIN_STATE_CODES.has(stateCode)) {
      return "Enter a valid GSTIN state code";
    }
  }

  if (clean.length < 15) {
    return isTouched ? "GSTIN must contain 15 characters" : null;
  }

  if (clean.length > 15) {
    return "GSTIN must contain 15 characters";
  }

  // Full 15-character statutory structure validation
  // Position 1-2: State code
  const stateCode = clean.slice(0, 2);
  if (!VALID_GSTIN_STATE_CODES.has(stateCode)) {
    return "Enter a valid GSTIN state code";
  }

  // Position 3-12: Embedded PAN (10 chars)
  const chars1to3 = clean.slice(2, 5);
  const panCategory = clean[5]; // Position 6 of GSTIN (4th char of PAN)
  const fifth = clean[6];
  const digits6to9 = clean.slice(7, 11);
  const tenth = clean[11];

  if (
    !/^[A-Z]{3}$/.test(chars1to3) ||
    !/^[A-Z]$/.test(fifth) ||
    !/^\d{4}$/.test(digits6to9) ||
    !/^[A-Z]$/.test(tenth) ||
    !ALLOWED_PAN_CATEGORIES.has(panCategory)
  ) {
    return "Enter a valid GSTIN";
  }

  // Position 13: Entity registration number (1-9 or A-Z)
  const entityCode = clean[12];
  if (!/^[1-9A-Z]$/.test(entityCode)) {
    return "Enter a valid GSTIN";
  }

  // Position 14: Mandatory letter 'Z'
  if (clean[13] !== "Z") {
    return "Enter a valid GSTIN";
  }

  // Position 15: Check character (alphanumeric)
  const checkChar = clean[14];
  if (!/^[0-9A-Z]$/.test(checkChar)) {
    return "Enter a valid GSTIN";
  }

  return null;
}

/**
 * Validates monetary amounts for estimated sales, purchases, and ITC.
 * Prevents overflow, JSON parsing failures, negative numbers, and malformed decimals.
 */
export function validateEstimatedAmount(
  value: string | number | undefined | null,
  fieldName = "amount",
  isRequired = false
): string | null {
  if (value === undefined || value === null) {
    return isRequired ? `Enter ${fieldName}` : null;
  }

  const rawStr = String(value).replace(/,/g, "").trim();

  if (!rawStr) {
    return isRequired ? `Enter ${fieldName}` : null;
  }

  if (rawStr.startsWith("-")) {
    return "Amount cannot be negative";
  }

  // Decimal check: allow up to 2 decimal places
  if (!/^\d+(\.\d{1,2})?$/.test(rawStr)) {
    return "Enter a valid amount";
  }

  const num = parseFloat(rawStr);

  if (!Number.isFinite(num) || isNaN(num)) {
    return "Enter a valid amount";
  }

  if (num < 0) {
    return "Amount cannot be negative";
  }

  if (num > MAX_ESTIMATED_AMOUNT) {
    return "Amount exceeds the permitted limit";
  }

  return null;
}

/**
 * Validates Filing Frequency and Return Period combination.
 */
export function validatePeriodSelection(
  periodType?: string,
  financialYear?: string,
  filingPeriod?: string
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!periodType || !periodType.trim()) {
    errors.periodType = "Please select a filing frequency";
  }

  if (!financialYear || !financialYear.trim()) {
    errors.financialYear = "Please select a financial year";
  }

  const periodVal = (filingPeriod || "").trim();
  if (!periodVal) {
    errors.filingPeriod = "Please select a filing return period";
  } else if (periodType && financialYear) {
    const validPeriods = getFilingPeriodsForFrequency(periodType, financialYear);
    if (!validPeriods.includes(periodVal)) {
      errors.filingPeriod = "Selected period is invalid for the chosen frequency";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates document completeness according to filing nature.
 * For Regular Return, all 12 checklist documents are strictly mandatory.
 * For Nil Return, documents are not required.
 */
export function validateFilingDocuments(
  documents: readonly FilingDocItem[],
  filingNature: string
): { isValid: boolean; missingCount: number; missingNames: string[] } {
  if (filingNature === "Nil Return") {
    return { isValid: true, missingCount: 0, missingNames: [] };
  }

  const missing = documents.filter((d) => !d.fileUri || d.fileUri.trim() === "");
  return {
    isValid: missing.length === 0,
    missingCount: missing.length,
    missingNames: missing.map((d) => d.name),
  };
}
