import type { Service } from "@/types/domain";

export const ITR_SERVICES: Service[] = [
  {
    id: "itr-filing",
    name: "ITR Filing",
    category: "ITR",
    description:
      "File your Income Tax Return. Safe, accurate, and optimized for maximum refunds.",
    icon: "calculator-outline",
    requiredDocs: [
      "PAN Card",
      "Aadhaar Card",
      "Form 16",
      "Bank Statement (Yearly)",
      "Investment Proofs",
    ],
    formFields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "As in Aadhaar",
        required: true,
      },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      {
        name: "incomeType",
        label: "Primary Income Type",
        type: "dropdown",
        options: [
          "Salaried",
          "Business/Professional",
          "Capital Gains",
          "House Property",
        ],
        required: true,
      },
      {
        name: "estimatedIncome",
        label: "Estimated Annual Income (₹)",
        type: "number",
        placeholder: "e.g. 800000",
        required: true,
      },
    ],
  },
  {
    id: "tds-refund",
    name: "TDS Refund Claim",
    category: "ITR",
    description: "Claim your TDS refunds and resolve mismatch notices.",
    icon: "arrow-down-circle-outline",
    requiredDocs: ["Form 26AS", "Form 16 / 16A", "PAN Card"],
    formFields: [
      { name: "pan", label: "PAN Card Number", type: "text", required: true },
      {
        name: "financialYear",
        label: "Financial Year",
        type: "dropdown",
        options: ["FY 2025-26", "FY 2024-25"],
        required: true,
      },
    ],
  },
];
