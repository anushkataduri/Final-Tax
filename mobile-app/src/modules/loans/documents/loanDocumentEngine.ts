/**
 * Pure helpers over the existing `LoanDocumentItem` checklist model.
 *
 * Frontend orchestration only: no React state, storage, navigation or API calls.
 * A document counts as uploaded when it has a `fileUri`, exactly as the loan
 * document steps decide today.
 */
import type { LoanDocumentItem } from "../types/loans.types";

/**
 * - pending: nothing attached yet
 * - processing: a picker/camera is open for this document
 * - uploaded: a file is attached
 * - error: the last pick failed (e.g. file too large); the user can retry
 */
export type LoanDocumentStatus = "pending" | "processing" | "uploaded" | "error";

/** In-flight states that are never persisted on the document itself. */
export type TransientLoanDocumentStatus = Extract<LoanDocumentStatus, "processing" | "error">;

export interface AttachedLoanFile {
  uri: string;
  name: string;
  /** Display size, e.g. "1.4 MB". */
  sizeLabel: string;
}

export interface LoanDocumentProgress {
  totalDocuments: number;
  uploadedDocuments: number;
  totalRequired: number;
  uploadedRequired: number;
  /** Uploaded share of required documents, 0–100 (100 when nothing is required). */
  requiredPercent: number;
  /** True when every required document has a file. */
  isComplete: boolean;
}

const hasFile = (doc: LoanDocumentItem): boolean => Boolean(doc.fileUri);

/** Fresh, independent checklist from a shared template (templates are never mutated). */
export function createDocumentChecklist(template: readonly LoanDocumentItem[]): LoanDocumentItem[] {
  return template.map((doc) => ({ ...doc }));
}

/** Size label used by the shared-upload document steps: one decimal MB, "2.4 MB" when unknown. */
export function formatUploadedFileSize(sizeBytes?: number): string {
  return sizeBytes ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB` : "2.4 MB";
}

export function attachFileToDocument(
  documents: readonly LoanDocumentItem[],
  documentId: string,
  file: AttachedLoanFile,
  uploadedAt: string = new Date().toISOString()
): LoanDocumentItem[] {
  return documents.map((doc) =>
    doc.id === documentId
      ? { ...doc, fileUri: file.uri, fileName: file.name, fileSize: file.sizeLabel, uploadedAt }
      : doc
  );
}

export function detachFileFromDocument(
  documents: readonly LoanDocumentItem[],
  documentId: string
): LoanDocumentItem[] {
  return documents.map((doc) =>
    doc.id === documentId
      ? { ...doc, fileUri: undefined, fileName: undefined, fileSize: undefined, uploadedAt: undefined }
      : doc
  );
}

/** Required documents without a usable file (same rule as `validateLoanDocuments`). */
export function getMissingRequiredDocuments(documents: readonly LoanDocumentItem[]): LoanDocumentItem[] {
  return documents.filter((doc) => doc.required && (!doc.fileUri || doc.fileUri.trim() === ""));
}

export function getLoanDocumentProgress(documents: readonly LoanDocumentItem[]): LoanDocumentProgress {
  const required = documents.filter((doc) => doc.required);
  const uploadedRequired = required.filter(hasFile).length;

  return {
    totalDocuments: documents.length,
    uploadedDocuments: documents.filter(hasFile).length,
    totalRequired: required.length,
    uploadedRequired,
    requiredPercent: required.length > 0 ? Math.round((uploadedRequired / required.length) * 100) : 100,
    isComplete: getMissingRequiredDocuments(documents).length === 0,
  };
}

/** A pick in progress wins; otherwise an attached file means uploaded, then a recorded failure. */
export function getLoanDocumentStatus(
  doc: LoanDocumentItem,
  transientStatus?: TransientLoanDocumentStatus
): LoanDocumentStatus {
  if (transientStatus === "processing") return "processing";
  if (hasFile(doc)) return "uploaded";
  return transientStatus ?? "pending";
}
