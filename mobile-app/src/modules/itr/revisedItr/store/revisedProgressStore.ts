import { create } from "zustand";
import { RevisedFormFields, RevisedDocumentItem } from "../types/revisedItr.types";

interface RevisedProgressStore {
  maxStepReached: number;
  setMaxStepReached: (step: number) => void;
  formData: RevisedFormFields | null;
  setFormData: (data: Partial<RevisedFormFields>) => void;
  documents: RevisedDocumentItem[] | null;
  setDocuments: (docs: RevisedDocumentItem[]) => void;
  reset: () => void;
}

export const useRevisedProgressStore = create<RevisedProgressStore>((set) => ({
  maxStepReached: 1,
  setMaxStepReached: (step) =>
    set((state) => ({ maxStepReached: Math.max(state.maxStepReached, step) })),
  formData: null,
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } as RevisedFormFields })),
  documents: null,
  setDocuments: (docs) => set({ documents: docs }),
  reset: () => set({ maxStepReached: 1, formData: null, documents: null }),
}));
