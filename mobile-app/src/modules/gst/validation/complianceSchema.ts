import {
  isValidGstin,
  isFileSizeValid,
  isFileTypeAllowed,
  RECONCILIATION_ALLOWED_EXTENSIONS,
  NOTICE_ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
} from "../utils/gstValidation";

export interface UploadedDocInfo {
  uri: string;
  name: string;
  size?: number;
  sizeFormatted: string;
  mimeType?: string;
}

export interface ComplianceFormData {
  gstin: string;
  financialYear: string;
  requestType: "Reconciliation Support" | "Notice Response" | "";
  // Reconciliation Support
  purchaseDoc: UploadedDocInfo | null;
  salesDoc: UploadedDocInfo | null;
  gstr2bRef: string;
  reconciliationRemarks: string;
  // Notice Response
  noticeNumber: string;
  noticeIssueDate: string;
  replyDueDate: string;
  noticeDoc: UploadedDocInfo | null;
  noticeRemarks: string;
}

export interface ValidationErrors {
  gstin?: string;
  financialYear?: string;
  requestType?: string;
  purchaseDoc?: string;
  salesDoc?: string;
  noticeNumber?: string;
  noticeIssueDate?: string;
  replyDueDate?: string;
  noticeDoc?: string;
  general?: string;
}

export function validateComplianceForm(data: ComplianceFormData): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  // Section 1: GSTIN
  if (!data.gstin.trim()) {
    errors.gstin = "Enter 15-character GSTIN";
  } else if (!isValidGstin(data.gstin)) {
    errors.gstin = "Invalid GSTIN (format: 29AAAAA0000A1Z5)";
  }

  // Section 1: Financial Year
  if (!data.financialYear) {
    errors.financialYear = "Select Financial Year";
  }

  // Section 1: Request Type
  if (!data.requestType) {
    errors.requestType = "Select Request Type";
  }

  // Dynamic Validation: Reconciliation Support
  if (data.requestType === "Reconciliation Support") {
    if (!data.purchaseDoc) {
      errors.purchaseDoc = "Upload Purchase Register";
    } else {
      if (!isFileSizeValid(data.purchaseDoc.size)) {
        errors.purchaseDoc = "Purchase Register exceeds maximum 20 MB size limit";
      } else if (!isFileTypeAllowed(data.purchaseDoc.name, RECONCILIATION_ALLOWED_EXTENSIONS)) {
        errors.purchaseDoc = "Purchase Register must be PDF, Excel or Image (JPG, PNG)";
      }
    }

    if (data.salesDoc) {
      if (!isFileSizeValid(data.salesDoc.size)) {
        errors.salesDoc = "Sales Register exceeds maximum 20 MB size limit";
      } else if (!isFileTypeAllowed(data.salesDoc.name, RECONCILIATION_ALLOWED_EXTENSIONS)) {
        errors.salesDoc = "Sales Register must be PDF, Excel or Image (JPG, PNG)";
      }
    }
  }

  // Dynamic Validation: Notice Response
  if (data.requestType === "Notice Response") {
    const cleanedNotice = (data.noticeNumber || "").trim().toUpperCase();
    if (!cleanedNotice) {
      errors.noticeNumber = "Enter Notice Number";
    } else if (cleanedNotice.length < 5) {
      errors.noticeNumber = "Notice Number must be at least 5 characters";
    } else if (!/^[A-Z0-9\/-]{5,30}$/.test(cleanedNotice)) {
      errors.noticeNumber = "Invalid Notice Number (5-30 alphanumeric characters, e.g. ZA290422000001Z)";
    }

    if (!data.noticeIssueDate.trim()) {
      errors.noticeIssueDate = "Select Notice Issue Date";
    }

    if (!data.replyDueDate.trim()) {
      errors.replyDueDate = "Select Reply Due Date";
    }

    if (!data.noticeDoc) {
      errors.noticeDoc = "Upload Notice Copy";
    } else {
      if (!isFileSizeValid(data.noticeDoc.size)) {
        errors.noticeDoc = "Notice Copy exceeds maximum 20 MB size limit";
      } else if (!isFileTypeAllowed(data.noticeDoc.name, NOTICE_ALLOWED_EXTENSIONS)) {
        errors.noticeDoc = "Notice Copy must be PDF, JPG or PNG";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
