import type { Service } from "@/types/domain";

export const GST_SERVICES: Service[] = [
  {
    id: "gst-registration",
    name: "GST Registration",
    category: "GST",
    description:
      "Get your Goods and Services Tax registration completed quickly and securely.",
    icon: "document-text-outline",
    requiredDocs: [
      "PAN Card",
      "Aadhaar Card",
      "Business Address Proof",
      "Bank Statement",
      "Passport Photo",
    ],
    formFields: [
      {
        name: "businessName",
        label: "Business Legal Name",
        type: "text",
        placeholder: "As in PAN",
        required: true,
      },
      {
        name: "pan",
        label: "PAN of Business / Proprietor",
        type: "text",
        placeholder: "ABCDE1234F",
        required: true,
      },
      {
        name: "constitution",
        label: "Constitution of Business",
        type: "dropdown",
        options: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd"],
        required: true,
      },
      {
        name: "commencementDate",
        label: "Date of Commencement",
        type: "date",
        required: true,
      },
    ],
  },
  {
    id: "gst-filing",
    name: "GST Filing",
    category: "GST",
    description: "Assistance with filing GSTR-1, GSTR-3B, and annual returns.",
    icon: "checkmark-circle-outline",
    requiredDocs: [
      "Sales Register",
      "Purchase Register",
      "Previous GSTR Filing copy",
    ],
    formFields: [
      {
        name: "gstin",
        label: "GSTIN",
        type: "text",
        placeholder: "22AAAAA1111A1Z1",
        required: true,
      },
      {
        name: "filingPeriod",
        label: "Filing Period",
        type: "dropdown",
        options: ["July 2026", "August 2026", "Q2 2026"],
        required: true,
      },
    ],
  },
  {
    id: "gst-compliance",
    name: "GST Compliance",
    category: "GST",
    description:
      "Complete GST compliance audit, e-way bills setup, and support.",
    icon: "shield-outline",
    requiredDocs: ["PAN Card", "GST Registration Certificate"],
    formFields: [
      {
        name: "gstin",
        label: "GSTIN",
        type: "text",
        placeholder: "22AAAAA1111A1Z1",
        required: true,
      },
      {
        name: "contactPerson",
        label: "Contact Person Name",
        type: "text",
        required: true,
      },
    ],
  },
];
