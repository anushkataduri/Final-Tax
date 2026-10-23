import type { ServiceCategory } from "@/types/domain";

export const CATEGORIES: ServiceCategory[] = [
  {
    id: "GST",
    name: "GST Services",
    icon: "receipt-outline",
    count: 6,
    color: "#0B5ED7",
  },
  {
    id: "ITR",
    name: "ITR Services",
    icon: "cash-outline",
    count: 5,
    color: "#083B75",
  },
  {
    id: "LOANS",
    name: "Loans & Capital",
    icon: "business-outline",
    count: 9,
    color: "#F97316",
  },
  {
    id: "INSURANCE",
    name: "Insurance Solutions",
    icon: "shield-checkmark-outline",
    count: 9,
    color: "#10B981",
  },
  {
    id: "BUSINESS",
    name: "Business / Commercial",
    icon: "briefcase-outline",
    count: 13,
    color: "#8B5CF6",
  },
];
