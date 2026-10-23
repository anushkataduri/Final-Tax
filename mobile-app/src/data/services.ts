import type { Service, ServiceCategoryId } from "@/types/domain";
import { GST_SERVICES } from "./services.gst";
import { ITR_SERVICES } from "./services.itr";
import { LOAN_SERVICES } from "./services.loans";
import { INSURANCE_SERVICES, BUSINESS_SERVICES } from "./services.insurance-business";

export { CATEGORIES } from "./services.categories";

export const SERVICES: Service[] = [
  ...GST_SERVICES,
  ...ITR_SERVICES,
  ...LOAN_SERVICES,
  ...INSURANCE_SERVICES,
  ...BUSINESS_SERVICES,
];

export const getServiceById = (id: string): Service | undefined =>
  SERVICES.find((service) => service.id === id);

export const getServicesByCategory = (category: ServiceCategoryId): Service[] =>
  SERVICES.filter((service) => service.category === category);
