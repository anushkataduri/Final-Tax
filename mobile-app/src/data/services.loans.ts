import type { Service } from "@/types/domain";

export const LOAN_SERVICES: Service[] = [
  {
    id: "business-loan",
    name: "Business Loan",
    category: "LOANS",
    description:
      "Secure funding to scale your business operations, buy equipment, or expand.",
    icon: "trending-up-outline",
    requiredDocs: [
      "PAN Card",
      "Aadhaar Card",
      "GST Registration",
      "2 Years ITR",
      "12 Months Bank Statement",
    ],
    formFields: [
      {
        name: "businessName",
        label: "Business Name",
        type: "text",
        required: true,
      },
      {
        name: "loanAmount",
        label: "Requested Loan Amount (₹)",
        type: "number",
        placeholder: "e.g. 1500000",
        required: true,
      },
      {
        name: "turnover",
        label: "Annual Turnover (₹)",
        type: "number",
        placeholder: "e.g. 5000000",
        required: true,
      },
      {
        name: "vintage",
        label: "Years in Business",
        type: "number",
        placeholder: "e.g. 3",
        required: true,
      },
    ],
  },
  {
    id: "personal-loan",
    name: "Personal Loan",
    category: "LOANS",
    description:
      "Quick personal loans with minimal documentation and attractive rates.",
    icon: "people-outline",
    requiredDocs: [
      "PAN Card",
      "Aadhaar Card",
      "3 Months Payslips",
      "6 Months Bank Statement",
    ],
    formFields: [
      {
        name: "monthlySalary",
        label: "Net Monthly Salary (₹)",
        type: "number",
        required: true,
      },
      {
        name: "loanAmount",
        label: "Loan Amount (₹)",
        type: "number",
        required: true,
      },
      {
        name: "employer",
        label: "Employer Name",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "working-capital",
    name: "Working Capital",
    category: "LOANS",
    description:
      "Funding to cover your day-to-day operational business expenses.",
    icon: "cash-outline",
    requiredDocs: [
      "PAN",
      "GST Certificate",
      "Audited Financials",
      "6 Months Bank Statements",
    ],
    formFields: [
      {
        name: "businessName",
        label: "Company Name",
        type: "text",
        required: true,
      },
      {
        name: "requiredLimit",
        label: "Required Limit (₹)",
        type: "number",
        required: true,
      },
    ],
  },
  {
    id: "home-loan",
    name: "Home Loan",
    category: "LOANS",
    description:
      "Competitive home loans for purchase, construction, or renovation.",
    icon: "home-outline",
    requiredDocs: [
      "PAN Card",
      "Aadhaar Card",
      "Property Documents",
      "Income Proof",
      "6 Months Bank Statement",
    ],
    formFields: [
      {
        name: "propertyValue",
        label: "Estimated Property Value (₹)",
        type: "number",
        required: true,
      },
      {
        name: "loanAmount",
        label: "Required Loan Amount (₹)",
        type: "number",
        required: true,
      },
    ],
  },
  {
    id: "property-loan",
    name: "Property Loan",
    category: "LOANS",
    description:
      "Mortgage and loan against property with attractive interest rates.",
    icon: "business-outline",
    requiredDocs: [
      "PAN Card",
      "Aadhaar Card",
      "Title Deed",
      "Tax Receipts",
      "Income Proof",
    ],
    formFields: [
      {
        name: "propertyType",
        label: "Property Type",
        type: "text",
        required: true,
      },
      {
        name: "loanAmount",
        label: "Required Loan Amount (₹)",
        type: "number",
        required: true,
      },
    ],
  },
  {
    id: "vehicle-loan",
    name: "Vehicle Loan",
    category: "LOANS",
    description:
      "Finance your new or pre-owned vehicle with fast approvals.",
    icon: "car-outline",
    requiredDocs: [
      "PAN Card",
      "Aadhaar Card",
      "Proforma Invoice / Quotation",
      "3 Months Payslips",
      "6 Months Bank Statement",
    ],
    formFields: [
      {
        name: "vehicleType",
        label: "Vehicle Type",
        type: "text",
        required: true,
      },
      {
        name: "loanAmount",
        label: "Loan Amount (₹)",
        type: "number",
        required: true,
      },
    ],
  },
  {
    id: "machinery-loan",
    name: "Machinery Loan",
    category: "LOANS",
    description:
      "Acquire equipment and industrial machinery with flexible repayment.",
    icon: "construct-outline",
    requiredDocs: [
      "PAN Card",
      "Aadhaar Card",
      "Machinery Quotation / Invoice",
      "Business ITR (2 Years)",
      "6 Months Bank Statement",
    ],
    formFields: [
      {
        name: "machineryName",
        label: "Machinery / Equipment Name",
        type: "text",
        required: true,
      },
      {
        name: "loanAmount",
        label: "Loan Amount (₹)",
        type: "number",
        required: true,
      },
    ],
  },
];
