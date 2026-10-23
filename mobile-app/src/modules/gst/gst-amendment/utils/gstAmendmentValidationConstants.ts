/**
 * Valid statutory 2-digit Indian State / UT codes: strictly 01 through 38.
 * Rejects 00, values below 01, values above 38, alphabetic characters, and incomplete codes.
 */
export const VALID_GSTIN_STATE_CODES = new Set(
  Array.from({ length: 38 }, (_, i) => String(i + 1).padStart(2, "0")),
);

/**
 * Allowed 4th character of PAN (taxpayer category):
 * P (Individual), C (Company), H (HUF), F (Firm/LLP), A (AOP),
 * B (BOI), T (Trust), L (Local Authority), J (Artificial Juridical Person), G (Government).
 */
export const ALLOWED_PAN_CATEGORIES = new Set(["P", "C", "H", "F", "A", "B", "T", "L", "J", "G"]);
