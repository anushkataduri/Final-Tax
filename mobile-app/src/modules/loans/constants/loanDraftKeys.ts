/**
 * AsyncStorage keys of the loan drafts that are stored per device.
 *
 * These values are already persisted on users' devices and MUST stay
 * byte-identical to the keys used today:
 * - homeLoanDraftService            -> "@taxedge_home_loan_draft_v1"
 * - vehicleLoanDraftService         -> "@taxedge_vehicle_loan_draft_v1"
 * - WorkingCapitalScreen (inline)   -> "@taxedge_working_capital_draft_v1"
 *
 * Personal Loan is not listed: it uses the shared `useServiceDraft`
 * (customer-scoped key "@taxedge_draft_<mobile>_personal-loan").
 * Other loans have no drafts today.
 */
export const LOAN_DRAFT_STORAGE_KEYS = {
  homeLoan: "@taxedge_home_loan_draft_v1",
  vehicleLoan: "@taxedge_vehicle_loan_draft_v1",
  workingCapital: "@taxedge_working_capital_draft_v1",
} as const;

export type LoanDraftStorageKey = (typeof LOAN_DRAFT_STORAGE_KEYS)[keyof typeof LOAN_DRAFT_STORAGE_KEYS];
