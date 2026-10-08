/**
 * Configuration: GST Filing Pricing
 * Centralized fee structure for Regular and Nil GST Return filings.
 * Reuses existing business fee amounts without hardcoded ad-hoc values.
 */

export interface GstFilingFeeStructure {
  readonly caFee: number;
  readonly platformGst: number;
  readonly totalPayable: number;
  readonly formattedAmount: string;
}

export const GST_FILING_PRICING: Record<"REGULAR" | "NIL", GstFilingFeeStructure> = {
  REGULAR: {
    caFee: 1986,
    platformGst: 358,
    totalPayable: 2344,
    formattedAmount: "₹2,344",
  },
  NIL: {
    caFee: 1986,
    platformGst: 358,
    totalPayable: 2344,
    formattedAmount: "₹2,344",
  },
} as const;

/**
 * Returns the fee structure based on filing nature.
 */
export function getGstFilingPricing(
  filingNature?: string | null,
): GstFilingFeeStructure {
  if (filingNature === "Nil Return") {
    return GST_FILING_PRICING.NIL;
  }
  return GST_FILING_PRICING.REGULAR;
}
