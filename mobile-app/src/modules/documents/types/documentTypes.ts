export type DocumentWorkflowStatus =
  | "NOT_UPLOADED"
  | "UPLOADING"
  | "UPLOADED"
  | "UNDER_VERIFICATION"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "Not Uploaded"
  | "Uploading"
  | "Uploaded"
  | "Under Verification"
  | "Under Review"
  | "Verified"
  | "Rejected";

export type KycOverallStatus = "NOT_STARTED" | "UNDER_VERIFICATION" | "VERIFIED" | "REJECTED";

export interface DocumentItem {
  id: string;
  name: string;
  fileName?: string;
  fileSize?: string;
  fileSizeMb?: number;
  uploadDate?: string;
  fileType?: "pdf" | "jpg" | "png" | "docx" | "xlsx";
  status: DocumentWorkflowStatus;
  progress?: number;
  rejectionReason?: string;
  fileUri?: string;
  isKyc?: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  requiredDocuments: string[];
}
