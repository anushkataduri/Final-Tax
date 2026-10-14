import type { LoanCategory } from "../types/loanCategory.types";

/** The eight loan categories shown on the Loans main screen, in approved display order. */
export const LOAN_CATEGORIES: readonly LoanCategory[] = [
  {
    id: "business-loan",
    title: "Business & Working Capital Loans",
    description: "Grow your business with flexible financing options.",
    image: require("../../../../assets/images/services/loans/business_working_capital.png"),
    tint: "#EA580C",
    tintBg: "#FEF0E6",
  },
  {
    id: "personal-loan",
    title: "Personal Loan",
    description: "Meet your personal needs with quick financial support.",
    image: require("../../../../assets/images/services/loans/personal_loan.png"),
    tint: "#DC2626",
    tintBg: "#FDEBEB",
  },
  {
    id: "home-loan",
    title: "Home Loan",
    description: "Make your dream home a reality with flexible options.",
    image: require("../../../../assets/images/services/loans/home_loan.png"),
    tint: "#16A34A",
    tintBg: "#F0FDF4",
  },
  {
    id: "property-loan",
    title: "Property Loan",
    description: "Unlock the value of your property for financial needs.",
    image: require("../../../../assets/images/services/loans/property_loan.png"),
    tint: "#4F46E5",
    tintBg: "#EEF0FF",
  },
  {
    id: "vehicle-loan",
    title: "Vehicle Loan",
    description: "Finance your vehicle with easy loan options.",
    image: require("../../../../assets/images/services/loans/vehicle_loan.png"),
    tint: "#2563EB",
    tintBg: "#EAF1FE",
  },
  {
    id: "machinery-loan",
    title: "Machinery Loans",
    description: "Get loans for machinery and equipment.",
    image: require("../../../../assets/images/services/loans/machinery_loan.png"),
    tint: "#D97706",
    tintBg: "#FEF3C7",
  },
  {
    id: "msme-loan",
    title: "MSME Loans",
    description: "Support for small and medium enterprises.",
    image: require("../../../../assets/images/services/loans/msme_loan.png"),
    tint: "#EA580C",
    tintBg: "#FEF0E6",
  },
  {
    id: "project-finance",
    title: "Project Finance",
    description: "Funding for large projects and infrastructure.",
    image: require("../../../../assets/images/services/loans/project_finance.png"),
    tint: "#7C3AED",
    tintBg: "#F1ECFE",
  },
];
