import Ionicons from "@expo/vector-icons/Ionicons";
import { LoanDocumentItem, LoanDetailsFormData, LoanBusinessFormData } from "../../types/loans.types";
import { BrandColors } from "@/shared/theme";

export interface BusinessDocItemConfig {
  id: string;
  title: string;
  subtitle: string;
  section: "required" | "conditional";
  isRequired: boolean;
  isOptional?: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  iconStyle:
    | "iconSquareBlue"
    | "iconSquarePurple"
    | "iconSquareGreen"
    | "iconSquareRed"
    | "iconSquareOrange"
    | "iconSquarePink";
  iconColor: string;
}

export const ID_ALIASES: Record<string, string[]> = {
  pan: ["pan", "doc-pan"],
  "identity-kyc": ["identity-kyc", "doc-identity-kyc", "aadhaar", "doc-aadhaar"],
  "business-proof": ["business-proof", "doc-business-proof"],
  "address-proof": ["address-proof", "doc-address"],
  "bank-statements": ["bank-statements", "doc-bank-statements"],
  itr: ["itr", "doc-itr"],
  "balance-sheet": ["balance-sheet", "doc-audited-bs", "doc-balance-sheet"],
  "pnl-statement": ["pnl-statement", "doc-pnl"],
  "gst-certificate": ["gst-certificate", "doc-gst-cert"],
  "gst-returns": ["gst-returns", "doc-gst-returns"],
  "kyc-directors": ["kyc-directors", "doc-kyc"],
  "project-report": ["project-report", "doc-expansion"],
  "udyam-certificate": ["udyam-certificate", "doc-udyam"],
  "cash-flow": ["cash-flow", "doc-cashflow"],
};

export const BUSINESS_LOAN_DOCUMENTS_TEMPLATE: LoanDocumentItem[] = [
  {
    id: "pan",
    name: "PAN Card",
    subtitle: "Entity PAN card or Promoter PAN card",
    required: true,
    iconName: "card",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Identity & Address",
  },
  {
    id: "identity-kyc",
    name: "Identity / KYC Proof",
    subtitle: "Aadhaar / Voter ID / Passport of applicant or promoter",
    required: true,
    iconName: "finger-print",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Identity & Address",
  },
  {
    id: "business-proof",
    name: "Business Registration Proof",
    subtitle: "COI / Trade License / Partnership Deed / Shop Act",
    required: true,
    iconName: "briefcase",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Business & Tax",
  },
  {
    id: "address-proof",
    name: "Business Address Proof",
    subtitle: "Electricity bill / Rent agreement / Property tax document",
    required: true,
    iconName: "home",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Identity & Address",
  },
  {
    id: "bank-statements",
    name: "Bank Statements (6–12 Months)",
    subtitle: "Primary operative / current account statement in PDF",
    required: true,
    iconName: "business",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Income & Banking",
  },
  {
    id: "itr",
    name: "Business ITR (Last 2–3 Years)",
    subtitle: "ITR-V and computation of income for last 2–3 assessment years",
    required: true,
    iconName: "receipt",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Business & Tax",
  },
  {
    id: "balance-sheet",
    name: "Audited Balance Sheet",
    subtitle: "CA-certified / audited balance sheet for applicable period",
    required: true,
    iconName: "pie-chart",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Business & Tax",
  },
  {
    id: "pnl-statement",
    name: "Profit & Loss Statement",
    subtitle: "CA-certified / audited P&L statement with schedules",
    required: true,
    iconName: "trending-up",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Business & Tax",
  },
  {
    id: "gst-certificate",
    name: "GST Certificate (REG-06)",
    subtitle: "GST registration certificate with all annexures",
    required: false,
    iconName: "ribbon",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Business & Tax",
  },
  {
    id: "gst-returns",
    name: "GST Returns (Last 12 Months)",
    subtitle: "Filed GSTR-3B & GSTR-1 returns for last 12 months",
    required: false,
    iconName: "analytics",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Business & Tax",
  },
  {
    id: "kyc-directors",
    name: "Director / Partner / Proprietor KYC",
    subtitle: "PAN, Aadhaar and photo of authorized signatories / partners",
    required: true,
    iconName: "people",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Identity & Address",
  },
  {
    id: "project-report",
    name: "Project Report / Business Plan",
    subtitle: "Projected financials, cost estimate & business expansion plan",
    required: false,
    iconName: "document-attach",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Business & Tax",
  },
  {
    id: "udyam-certificate",
    name: "Udyam Registration Certificate",
    subtitle: "MSME registration certificate (Optional)",
    required: false,
    iconName: "shield-checkmark",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Business & Tax",
  },
  {
    id: "cash-flow",
    name: "Cash Flow Statement",
    subtitle: "Latest financial year cash flow statement (Optional)",
    required: false,
    iconName: "document-text",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE || "#EA580C",
    category: "Business & Tax",
  },
];

export interface GetApplicableDocumentsOptions {
  loanDetails?: LoanDetailsFormData;
  businessDetails?: LoanBusinessFormData;
}

/**
 * Dynamically computes the core + conditional document checklist based on
 * the applicant's business constitution, GST registration, and loan purpose.
 */
export function getApplicableBusinessDocuments({
  loanDetails,
  businessDetails,
}: GetApplicableDocumentsOptions): BusinessDocItemConfig[] {
  const result: BusinessDocItemConfig[] = [];

  // ==========================================
  // 1. CORE DOCUMENTS (Always Required)
  // ==========================================
  result.push(
    {
      id: "pan",
      title: "PAN Card",
      subtitle: "Entity PAN card & Promoter/Director PAN card",
      section: "required",
      isRequired: true,
      iconName: "document-text",
      iconStyle: "iconSquareBlue",
      iconColor: "#2563EB",
    },
    {
      id: "identity-kyc",
      title: "Identity / KYC Proof",
      subtitle: "Aadhaar / Voter ID / Passport of applicant / promoter",
      section: "required",
      isRequired: true,
      iconName: "card-outline",
      iconStyle: "iconSquarePurple",
      iconColor: "#7C3AED",
    },
    {
      id: "business-proof",
      title: "Business Registration Proof",
      subtitle: "COI / Trade License / Partnership Deed / Shop Act",
      section: "required",
      isRequired: true,
      iconName: "folder-open-outline",
      iconStyle: "iconSquareOrange",
      iconColor: BrandColors.PRIMARY_ORANGE || "#FF7A00",
    },
    {
      id: "address-proof",
      title: "Business Address Proof",
      subtitle: "Utility bill / Rent agreement / Property tax document",
      section: "required",
      isRequired: true,
      iconName: "home-outline",
      iconStyle: "iconSquareRed",
      iconColor: "#DC2626",
    },
    {
      id: "bank-statements",
      title: "Bank Statements (6–12 Months)",
      subtitle: "Primary operative current account statements in PDF",
      section: "required",
      isRequired: true,
      iconName: "business-outline",
      iconStyle: "iconSquareOrange",
      iconColor: BrandColors.PRIMARY_ORANGE || "#FF7A00",
    },
    {
      id: "itr",
      title: "Business ITR (Last 2–3 Years)",
      subtitle: "ITR-V and computation for last 2–3 assessment years",
      section: "required",
      isRequired: true,
      iconName: "document-attach-outline",
      iconStyle: "iconSquarePurple",
      iconColor: "#7C3AED",
    },
    {
      id: "balance-sheet",
      title: "Audited Balance Sheet",
      subtitle: "CA audited balance sheet for applicable financial period",
      section: "required",
      isRequired: true,
      iconName: "pie-chart-outline",
      iconStyle: "iconSquarePink",
      iconColor: "#DB2777",
    },
    {
      id: "pnl-statement",
      title: "Profit & Loss Statement",
      subtitle: "CA-certified P&L statement with schedules",
      section: "required",
      isRequired: true,
      iconName: "bar-chart-outline",
      iconStyle: "iconSquarePurple",
      iconColor: "#7C3AED",
    }
  );

  // ==========================================
  // 2. CONDITIONAL DOCUMENTS
  // ==========================================

  // A. GST Documents: Only visible & required if GST registered
  const isGstRegistered = Boolean(businessDetails?.gstin?.trim());
  if (isGstRegistered) {
    result.push(
      {
        id: "gst-certificate",
        title: "GST Certificate (REG-06)",
        subtitle: "GST registration certificate with all annexures",
        section: "conditional",
        isRequired: true,
        iconName: "document-text-outline",
        iconStyle: "iconSquareGreen",
        iconColor: "#16A34A",
      },
      {
        id: "gst-returns",
        title: "GST Returns (Last 12 Months)",
        subtitle: "Filed GSTR-3B & GSTR-1 returns for last 12 months",
        section: "conditional",
        isRequired: true,
        iconName: "analytics-outline",
        iconStyle: "iconSquareOrange",
        iconColor: BrandColors.PRIMARY_ORANGE || "#FF7A00",
      }
    );
  }

  // B. Constitution-Aware KYC
  const constitution = businessDetails?.businessConstitution?.trim();
  let kycTitle = "Promoter / Signatory KYC";
  let kycSubtitle = "PAN, Aadhaar and photo of key authorized persons";

  if (constitution === "Proprietorship") {
    kycTitle = "Proprietor KYC";
    kycSubtitle = "PAN, Aadhaar and photo of the proprietor";
  } else if (constitution === "Partnership") {
    kycTitle = "Partner KYC";
    kycSubtitle = "PAN, Aadhaar and photo of all managing partners";
  } else if (constitution === "LLP") {
    kycTitle = "Designated Partner KYC";
    kycSubtitle = "PAN, Aadhaar, DPIN and photo of designated partners";
  } else if (constitution === "Private Limited" || constitution === "Public Limited") {
    kycTitle = "Director / Signatory KYC";
    kycSubtitle = "PAN, Aadhaar, DIN and photo of directors / signatories";
  }

  result.push({
    id: "kyc-directors",
    title: kycTitle,
    subtitle: kycSubtitle,
    section: "conditional",
    isRequired: true,
    iconName: "people-outline",
    iconStyle: "iconSquareGreen",
    iconColor: "#16A34A",
  });

  // C. Loan Purpose: Business Expansion Document
  const purpose = loanDetails?.purpose?.toLowerCase() || "";
  const isExpansion = purpose.includes("expansion");
  if (isExpansion) {
    result.push({
      id: "project-report",
      title: "Project Report / Business Plan",
      subtitle: "Projected financials, cost estimate & business expansion plan",
      section: "conditional",
      isRequired: true,
      iconName: "document-attach-outline",
      iconStyle: "iconSquareBlue",
      iconColor: "#2563EB",
    });
  }

  // D. Udyam Registration Certificate: Optional
  result.push({
    id: "udyam-certificate",
    title: "Udyam Registration Certificate",
    subtitle: "MSME registration certificate (Optional)",
    section: "conditional",
    isRequired: false,
    isOptional: true,
    iconName: "briefcase-outline",
    iconStyle: "iconSquareGreen",
    iconColor: "#16A34A",
  });

  // E. Cash Flow Statement: Conditional / Optional (not universally mandatory)
  result.push({
    id: "cash-flow",
    title: "Cash Flow Statement",
    subtitle: "Cash flow statement for latest financial year (Optional)",
    section: "conditional",
    isRequired: false,
    isOptional: true,
    iconName: "document-outline",
    iconStyle: "iconSquareBlue",
    iconColor: "#2563EB",
  });

  return result;
}
