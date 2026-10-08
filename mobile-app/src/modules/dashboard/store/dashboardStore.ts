import { create } from 'zustand';

interface DashboardState {
  refreshCount: number;
  triggerRefresh: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  refreshCount: 0,
  triggerRefresh: () => set((s) => ({ refreshCount: s.refreshCount + 1 })),
}));
