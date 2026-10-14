import type { LoanCategoryId } from "../types/loanCategory.types";

/**
 * Screens in each application, including the final Under Review screen.
 * Business: KYC, Business details, Documents, Review, Under Review.
 * Personal: KYC, Employment & Income, Documents, Review, Under Review.
 */
export const getLoanFlowTotalSteps = (_categoryId?: LoanCategoryId): number => 5;
