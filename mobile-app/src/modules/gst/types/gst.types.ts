import { ServiceCardData } from "../../../shared/components/ServiceCard";

export type GstServiceItem = ServiceCardData;

export interface GstRegistrationDraft {
  createdGstId?: string;
  businessName: string;
  panNumber: string;
  constitution: string;
  state: string;
  city: string;
  pincode: string;
  [key: string]: unknown;
}

export interface GstFilingDraft {
  createdFilingId?: string;
  gstin: string;
  returnType: string;
  financialYear: string;
  period: string;
  [key: string]: unknown;
}
