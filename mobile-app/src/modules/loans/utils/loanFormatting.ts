/**
 * Loan display formatting.
 *
 * Currency formatting is owned by the shared formatter and only re-exported
 * here so loan code has a single import location.
 */
export {
  formatCurrencyINR,
  formatIndianNumberInput,
  toRawNumericString,
} from "../../../shared/formatters/currencyFormatter";

/**
 * Review-screen amount used by Home and Vehicle Loan: "—" when empty, values that are
 * already text ("₹…", ranges, "below …"/"above …") unchanged, otherwise "₹" + en-IN grouping.
 */
export function formatReviewAmount(val?: string | number): string {
  if (!val) return "—";
  const str = String(val).trim();
  const lower = str.toLowerCase();
  if (str.startsWith("₹") || str.includes("-") || lower.includes("below") || lower.includes("above")) {
    return str;
  }
  const num = Number(val);
  if (isNaN(num)) return str;
  return "₹" + num.toLocaleString("en-IN");
}

/** Review-screen amount used by Property Loan: digits only, "₹0" when empty, otherwise "₹" + en-IN grouping. */
export function formatReviewAmountDigits(val?: string | number): string {
  const num = Number((val || "").toString().replace(/[^0-9]/g, ""));
  if (!val || isNaN(num)) return "₹0";
  return "₹" + num.toLocaleString("en-IN");
}

const pluralise =(count: number, singular: string, plural: string): string =>
  `${count} ${count === 1 ? singular : plural}`;

/**
 * "30" -> "30 months (2 years 6 months)", "6" -> "6 months".
 * Returns "" for empty, non-numeric or non-positive input.
 */
export function formatTenureEquivalent(monthsStr: string): string {
  if (!monthsStr) return "";
  const months = parseInt(monthsStr, 10);
  if (isNaN(months) || months <= 0) return "";

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return pluralise(months, "month", "months");
  }

  if (remainingMonths === 0) {
    return `${months} months (${pluralise(years, "year", "years")})`;
  }

  return `${months} months (${pluralise(years, "year", "years")} ${pluralise(remainingMonths, "month", "months")})`;
}
