import { create } from "zustand";
import type { DocumentItem, DocumentWorkflowStatus, KycOverallStatus } from "../types/documentTypes";

export interface CategoryCardData {
  id: string;
  name: string;
  description: string;
  requiredDocuments: string[];
  icon: string;
  tint: string;
  tintBg: string;
}

export const CATEGORY_DEFINITIONS: CategoryCardData[] = [
  { id: "kyc", name: "KYC Documents", description: "Identity and citizenship verification records", requiredDocuments: ["PAN Card", "Aadhaar Card"], icon: "phone-portrait-outline", tint: "#083B75", tintBg: "#EFF6FF" },
  { id: "gst", name: "GST Documents", description: "Monthly returns, business proofs and sales/purchase registers", requiredDocuments: ["GST Certificate", "Business Proof", "Sales Register", "Purchase Register", "Address Proof", "E-Way Bills Master", "GSTR-1 Summary", "GSTR-3B Copy"], icon: "receipt-outline", tint: "#EA580C", tintBg: "#FFF1E6" },
  { id: "itr", name: "ITR Documents", description: "Income tax returns, salary certificates and tax deductions", requiredDocuments: ["Form 16", "ITR Acknowledgement", "Bank Statement", "Form 26AS", "AIS / TIS Summary", "Tax Computation Sheet"], icon: "reader-outline", tint: "#083B75", tintBg: "#EFF6FF" },
  { id: "loans", name: "Loan Documents", description: "Credit sanctions, loan agreements, EMI schedules and NOCs", requiredDocuments: ["Loan Sanction Letter", "Bank Statement (12M)", "Income Proof", "Property Valuation", "CIBIL Report", "Promoters Net Worth", "Executed Agreement", "EMI Schedule", "Machinery Deed", "Clearance NOC"], icon: "business-outline", tint: "#EA580C", tintBg: "#FFF1E6" },
  { id: "business", name: "Business & Commercial", description: "Company incorporation, MoA, AoA and trade licenses", requiredDocuments: ["Certificate of Incorporation (CIN)", "Memorandum of Association (MoA)", "Articles of Association (AoA)", "Board Resolution", "Shop & Establishment License", "Import Export Code (IEC)", "Trademark Registration"], icon: "briefcase-outline", tint: "#083B75", tintBg: "#EFF6FF" },
  { id: "insurance", name: "Insurance", description: "Group health, keyman, fire and transit insurance policies", requiredDocuments: ["Group Health Policy", "Property Fire Insurance", "D&O Liability Policy", "Marine Cargo Transit", "Keyman Term Life Policy", "Commercial Fleet Insurance"], icon: "shield-outline", tint: "#EA580C", tintBg: "#FFF1E6" },
  { id: "financial", name: "Financial Statements", description: "Audited balance sheets, P&L accounts and cash flows", requiredDocuments: ["Audited Balance Sheet", "Profit & Loss Statement", "Independent Audit Report", "Consolidated Bank Statement"], icon: "stats-chart-outline", tint: "#083B75", tintBg: "#EFF6FF" },
  { id: "agreements", name: "Agreements", description: "Office leases, partnership deeds and master contracts", requiredDocuments: ["Commercial Lease Agreement", "Master Service Agreement (MSA)"], icon: "document-text-outline", tint: "#EA580C", tintBg: "#FFF1E6" },
  { id: "certificates", name: "Certificates", description: "Government recognitions, MSME Udyam and quality certs", requiredDocuments: ["MSME Udyam Certificate", "ISO 9001 Certificate", "Startup India Recognition"], icon: "ribbon-outline", tint: "#083B75", tintBg: "#EFF6FF" },
  { id: "receipts", name: "Payment Receipts", description: "Tax challans, professional fees and payment vouchers", requiredDocuments: ["Advance Tax Challan Q1", "Advance Tax Challan Q2", "GST Service Invoice", "ITR Filing Receipt", "MCA ROC Challan", "TDS Filing Challan", "Professional Tax Receipt", "Trademark Application Fee", "Commercial Deposit Receipt", "DSC Purchase Invoice", "Software Annual Invoice", "Statutory Audit Receipt"], icon: "wallet-outline", tint: "#EA580C", tintBg: "#FFF1E6" },
  { id: "completed", name: "Completed Files", description: "Final assessment orders and approved certificates", requiredDocuments: ["ITR Final Assessment Order", "GST Approval Order (REG-06)", "MCA DIR-3 KYC Approved", "Bank Loan Closure NOC", "TDS Form 16A Certificate"], icon: "checkmark-circle-outline", tint: "#083B75", tintBg: "#EFF6FF" },
];

const initialDocs: Record<string, DocumentItem[]> = {
  kyc: [],
  gst: [],
  itr: [],
  loans: [],
  business: [],
  insurance: [],
  financial: [],
  agreements: [],
  certificates: [],
  receipts: [],
  completed: [],
};

interface DocumentVaultState {
  categoryDocs: Record<string, DocumentItem[]>;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  getKycStatus: () => KycOverallStatus;
  getDocumentsForCategory: (categoryId: string, includeKyc?: boolean) => DocumentItem[];
  uploadDocument: (categoryId: string, docIdOrName: string, file: { name: string; size?: number; uri?: string }) => void;
  reuploadDocument: (categoryId: string, docId: string) => void;
  deleteDocument: (categoryId: string, docId: string) => void;
  setDocumentStatus: (categoryId: string, docId: string, status: DocumentWorkflowStatus) => void;
}

export const useDocumentVaultStore = create<DocumentVaultState>((set, get) => ({
  categoryDocs: initialDocs,
  selectedCategoryId: "kyc",
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),

  getKycStatus: () => {
    const kyc = get().categoryDocs["kyc"] || [];
    const pan = kyc.find((d) => d.name.toLowerCase().includes("pan"));
    const aadhaar = kyc.find((d) => d.name.toLowerCase().includes("aadhaar"));

    if (pan?.status === "REJECTED" || aadhaar?.status === "REJECTED") return "REJECTED";
    if (pan?.status === "VERIFIED" && aadhaar?.status === "VERIFIED") return "VERIFIED";
    if (pan?.status === "UNDER_VERIFICATION" || aadhaar?.status === "UNDER_VERIFICATION") return "UNDER_VERIFICATION";
    return "NOT_STARTED";
  },

  getDocumentsForCategory: (categoryId: string, includeKyc = false) => {
    const docs = get().categoryDocs[categoryId] || [];
    if (includeKyc && categoryId !== "kyc") {
      const kycDocs = get().categoryDocs["kyc"] || [];
      return [...kycDocs.filter((k) => k.isKyc), ...docs];
    }
    return docs;
  },

  uploadDocument: (categoryId, docIdOrName, file) => {
    set((state) => {
      const currentDocs = state.categoryDocs[categoryId] || [];
      const existingIdx = currentDocs.findIndex(
        (d) => d.id === docIdOrName || d.name === docIdOrName
      );

      const rawBytes = file.size || 1024 * 1024 * 1.8;
      const sizeInMb = rawBytes / (1024 * 1024);
      const sizeStr = sizeInMb < 0.1 ? "< 0.1 MB" : `${sizeInMb.toFixed(1)} MB`;

      const fileName = file.name || "Document.pdf";
      const ext = fileName.split(".").pop()?.toLowerCase();
      const fileType =
        ext === "docx" || ext === "doc"
          ? "docx"
          : ext === "xlsx" || ext === "xls"
          ? "xlsx"
          : ext === "jpg" || ext === "jpeg" || ext === "png"
          ? "jpg"
          : "pdf";

      const now = new Date();
      const dateStr = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const newDoc: DocumentItem = {
        id:
          existingIdx >= 0
            ? currentDocs[existingIdx].id
            : `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name:
          existingIdx >= 0
            ? currentDocs[existingIdx].name
            : fileName.replace(/\.[^/.]+$/, ""),
        fileName: fileName,
        fileSize: sizeStr,
        fileSizeMb: +sizeInMb.toFixed(1),
        uploadDate: dateStr,
        fileType: fileType,
        status: "Verified",
        progress: 100,
        fileUri: file.uri,
        isKyc: categoryId === "kyc",
      };

      const updated =
        existingIdx >= 0
          ? currentDocs.map((d, i) => (i === existingIdx ? newDoc : d))
          : [newDoc, ...currentDocs];

      return {
        categoryDocs: {
          ...state.categoryDocs,
          [categoryId]: updated,
        },
      };
    });
  },

  reuploadDocument: (categoryId, docId) => {
    set((state) => {
      const currentDocs = state.categoryDocs[categoryId] || [];
      return {
        categoryDocs: {
          ...state.categoryDocs,
          [categoryId]: currentDocs.map((d) =>
            d.id === docId ? { ...d, status: "NOT_UPLOADED", progress: 0, rejectionReason: undefined } : d
          ),
        },
      };
    });
  },

  deleteDocument: (categoryId, docId) => {
    set((state) => {
      const currentDocs = state.categoryDocs[categoryId] || [];
      return {
        categoryDocs: {
          ...state.categoryDocs,
          [categoryId]: currentDocs.filter((d) => d.id !== docId),
        },
      };
    });
  },

  setDocumentStatus: (categoryId, docId, status) => {
    set((state) => {
      const currentDocs = state.categoryDocs[categoryId] || [];
      return {
        categoryDocs: {
          ...state.categoryDocs,
          [categoryId]: currentDocs.map((d) => (d.id === docId ? { ...d, status } : d)),
        },
      };
    });
  },
}));
