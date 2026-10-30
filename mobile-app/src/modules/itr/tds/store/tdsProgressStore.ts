import { create } from "zustand";

interface TdsProgressStore {
  maxStepReached: number;
  setMaxStepReached: (step: number) => void;
  reset: () => void;
}

export const useTdsProgressStore = create<TdsProgressStore>((set) => ({
  maxStepReached: 1,
  setMaxStepReached: (step) =>
    set((state) => ({ maxStepReached: Math.max(state.maxStepReached, step) })),
  reset: () => set({ maxStepReached: 1 }),
}));

