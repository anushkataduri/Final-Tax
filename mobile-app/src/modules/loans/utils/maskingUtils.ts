/**
 * Display masking shared by the loan slices.
 *
 * Each function reproduces the implementation most loan components already
 * use, character for character. A few components still carry their own
 * variant (Property Loan review PAN, Business Loan Aadhaar, Business/Home
 * Loan account masking); those are intentionally not represented here.
 */

const EMPTY_VALUE = "—";

export interface PanMaskOptions {
  /** Leading characters left visible (default 2). */
  visibleStart?: number;
  /** Trailing characters left visible (default 2). */
  visibleEnd?: number;
}

/**
 * "ABCDE1234F" -> "ABXXXX4F". Values shorter than 5 characters are shown as-is.
 * Property Loan's review shows more of the PAN: `{ visibleStart: 5, visibleEnd: 1 }` -> "ABCDEXXXXF".
 */
export function maskPan(pan?: string, { visibleStart = 2, visibleEnd = 2 }: PanMaskOptions = {}): string {
  if (!pan || pan.length < 5) return pan || EMPTY_VALUE;
  return `${pan.slice(0, visibleStart)}XXXX${pan.slice(-visibleEnd)}`;
}

/** "9876543210" -> "+91 98XXXXXX10". Values shorter than 6 characters are shown as-is. */
export function maskMobile(mobile?: string): string {
  if (!mobile || mobile.length < 6) return mobile || EMPTY_VALUE;
  return `+91 ${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`;
}

/** "123412341234" -> "XXXX-XXXX-1234". Values shorter than 8 characters are shown as-is. */
export function maskAadhaar(aadhaar?: string): string {
  if (!aadhaar || aadhaar.length < 8) return aadhaar || EMPTY_VALUE;
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
}

/** "123456789012" -> "XXXXXX9012". Values shorter than 5 characters are shown as-is. */
export function maskAccountNumber(accountNumber?: string): string {
  if (!accountNumber || accountNumber.length < 5) return accountNumber || EMPTY_VALUE;
  return `XXXXXX${accountNumber.slice(-4)}`;
}
