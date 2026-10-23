import type { Service } from "@/types/domain";

export const INSURANCE_SERVICES: Service[] = [
  {
    id: "health-insurance",
    name: "Health Insurance",
    category: "INSURANCE",
    description: "Get comprehensive medical cover for you and your family.",
    icon: "heart-outline",
    requiredDocs: [
      "Aadhaar Card",
      "PAN Card",
      "Previous Insurance Policy (if any)",
    ],
    formFields: [
      {
        name: "insuredCount",
        label: "Number of members to insure",
        type: "number",
        required: true,
      },
      {
        name: "eldestAge",
        label: "Age of eldest member",
        type: "number",
        required: true,
      },
      {
        name: "preExisting",
        label: "Any pre-existing illness?",
        type: "dropdown",
        options: ["No", "Yes"],
        required: true,
      },
    ],
  },
  {
    id: "life-insurance",
    name: "Life Insurance",
    category: "INSURANCE",
    description:
      "Protect your family's financial future with term or endowment life policies.",
    icon: "rose-outline",
    requiredDocs: ["Aadhaar Card", "PAN Card", "Income Proof (Payslips/ITR)"],
    formFields: [
      {
        name: "sumAssured",
        label: "Desired Sum Assured (₹)",
        type: "number",
        placeholder: "e.g. 10000000",
        required: true,
      },
      {
        name: "tobacco",
        label: "Do you consume tobacco?",
        type: "dropdown",
        options: ["No", "Yes"],
        required: true,
      },
      {
        name: "occupation",
        label: "Occupation Type",
        type: "dropdown",
        options: ["Salaried", "Self-Employed", "Business Owner"],
        required: true,
      },
    ],
  },
];

export const BUSINESS_SERVICES: Service[] = [
  {
    id: "company-registration",
    name: "Company Registration",
    category: "BUSINESS",
    description:
      "Incorporate your Private Limited or One Person Company (OPC) end-to-end.",
    icon: "business-outline",
    requiredDocs: [
      "PAN of all directors",
      "Aadhaar of all directors",
      "Proof of Registered Office",
      "NOC from Owner",
    ],
    formFields: [
      {
        name: "proposedName1",
        label: "Proposed Name Option 1",
        type: "text",
        required: true,
      },
      {
        name: "proposedName2",
        label: "Proposed Name Option 2",
        type: "text",
        required: false,
      },
      {
        name: "directorsCount",
        label: "Number of Directors",
        type: "number",
        placeholder: "Minimum 2",
        required: true,
      },
      {
        name: "businessActivity",
        label: "Brief Business Activity Description",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "accounting-bookkeeping",
    name: "Accounting & Bookkeeping",
    category: "BUSINESS",
    description:
      "Professional accounting services, ledger maintenance, and financial reporting.",
    icon: "server-outline",
    requiredDocs: ["Bank Statements", "Sales Invoices", "Purchase Bills"],
    formFields: [
      {
        name: "businessName",
        label: "Business Name",
        type: "text",
        required: true,
      },
      {
        name: "monthlyTransactions",
        label: "Approx. Monthly Transactions",
        type: "number",
        required: true,
      },
    ],
  },
];
