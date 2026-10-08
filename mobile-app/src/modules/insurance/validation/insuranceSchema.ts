export const insuranceSchema = {
  isValidPlan(planId: string): boolean {
    return Boolean(planId);
  },
};
