import { apiClient } from '../../../core/api/apiClient';
import type { InsurancePlan, InsuranceApplication } from '../types/insurance.types';

export const insuranceApi = {
  getPlans: async (category?: string): Promise<InsurancePlan[]> => {
    try {
      const params = category ? { category } : undefined;
      return await apiClient.get<InsurancePlan[]>('/insurance/plans', { params });
    } catch {
      return [];
    }
  },

  createApplication: async (app: Partial<InsuranceApplication>): Promise<InsuranceApplication | null> => {
    try {
      return await apiClient.post<InsuranceApplication>('/insurance/applications', app);
    } catch {
      return null;
    }
  },
};
