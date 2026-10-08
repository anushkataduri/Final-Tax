import { create } from 'zustand';
import type { InsurancePlan } from '../types/insurance.types';
import type { InsuranceMember, NomineeDetails } from '../types/member.types';

interface InsuranceState {
  selectedPlan: InsurancePlan | null;
  members: InsuranceMember[];
  nominee: NomineeDetails | null;
  setSelectedPlan: (plan: InsurancePlan | null) => void;
  addMember: (member: InsuranceMember) => void;
  updateMember: (id: string, member: Partial<InsuranceMember>) => void;
  removeMember: (id: string) => void;
  setNominee: (nominee: NomineeDetails) => void;
  resetInsurance: () => void;
}

export const useInsuranceStore = create<InsuranceState>((set) => ({
  selectedPlan: null,
  members: [],
  nominee: null,
  setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
  addMember: (member) => set((s) => ({ members: [...s.members, member] })),
  updateMember: (id, data) => set((s) => ({
    members: s.members.map((m) => (m.id === id ? { ...m, ...data } : m)),
  })),
  removeMember: (id) => set((s) => ({
    members: s.members.filter((m) => m.id !== id),
  })),
  setNominee: (nominee) => set({ nominee }),
  resetInsurance: () => set({ selectedPlan: null, members: [], nominee: null }),
}));
