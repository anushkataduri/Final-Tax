import type { StoreApi } from "zustand";
import { normalizeMoneyInput } from "../utils/moneyInput";
import { validateHomeLoanRequirementForm } from "../homeLoan/validation/homeLoanValidation";
import type { HomeLoanRequirementFormData } from "../homeLoan/types/homeLoan.types";
import { createInitialHomeLoanFormData, type LoansStoreState } from "./loansStore.types";

type Set = StoreApi<LoansStoreState>["setState"];
type Get = StoreApi<LoansStoreState>["getState"];

const MONEY_FIELDS = new Set<keyof HomeLoanRequirementFormData>([
  "loanAmount", "requestedAmount", "approximatePropertyValue", "propertyValue",
]);

const MIRRORED_FIELDS: Partial<Record<keyof HomeLoanRequirementFormData, keyof HomeLoanRequirementFormData>> = {
  loanAmount: "requestedAmount",
  requestedAmount: "loanAmount",
  approximatePropertyValue: "propertyValue",
  propertyValue: "approximatePropertyValue",
};

export const createHomeLoanStoreActions = (set: Set, get: Get) => ({
  setHomeLoanField: <K extends keyof HomeLoanRequirementFormData>(
    field: K,
    value: HomeLoanRequirementFormData[K],
  ) =>
    set((state) => {
      const nextErrors = { ...state.homeLoanErrors };
      delete nextErrors[field];
      const isMoneyField = MONEY_FIELDS.has(field);
      const cleanValue = (
        isMoneyField && typeof value === "string" ? normalizeMoneyInput(value) : value
      ) as HomeLoanRequirementFormData[K];

      const updated: HomeLoanRequirementFormData = { ...state.homeLoanFormData, [field]: cleanValue };

      const mirroredField = MIRRORED_FIELDS[field];
      if (mirroredField) {
        (updated as Record<keyof HomeLoanRequirementFormData, unknown>)[mirroredField] = cleanValue;
        delete nextErrors[mirroredField];
      }

      return { homeLoanFormData: updated, homeLoanErrors: nextErrors };
    }),

  validateHomeLoanForm: (): boolean => {
    const { isValid, errors } = validateHomeLoanRequirementForm(get().homeLoanFormData);
    set({ homeLoanErrors: errors });
    return isValid;
  },

  clearHomeLoanErrors: () => set({ homeLoanErrors: {} }),

  resetHomeLoanFormData: () =>
    set({ homeLoanFormData: createInitialHomeLoanFormData(), homeLoanErrors: {} }),
});
