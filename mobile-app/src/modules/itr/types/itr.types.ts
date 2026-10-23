import { ServiceCardData } from "../../../shared/components/ServiceCard";

export type ItrServiceItem = ServiceCardData;

export interface ItrFilingDraft {
  assessmentYear?: string;
  profession?: string;
  incomeDetails?: Record<string, unknown>;
  deductions?: Record<string, unknown>;
  documents?: string[];
  status?: string;
  [key: string]: unknown;
}
