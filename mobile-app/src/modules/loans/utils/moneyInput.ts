/**
 * Whole-rupee amount from typed or pasted text. Everything after the first "." is dropped,
 * so "50,000.75" becomes "50000" (not "5000075"). Returns digits only, or "".
 */
export const toWholeRupees = (text: string): string =>
  (text.split(".")[0] ?? "").replace(/\D/g, "");
