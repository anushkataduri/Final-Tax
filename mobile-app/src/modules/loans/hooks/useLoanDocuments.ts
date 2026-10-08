import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, type ScrollView } from "react-native";
import { useDocumentUploadHelper } from "../../../shared/hooks/useDocumentUploadHelper";
import type { DocumentUploadBottomSheetProps } from "../../../shared/components/DocumentUploadBottomSheet";
import type { DocumentPreviewModalProps } from "../components/DocumentPreviewModal";
import type { LoanDocumentItem } from "../types/loans.types";
import { validateLoanDocuments } from "../validation/loansSchema";
import { pickLoanDocumentFromFiles } from "../services/documentUploadHelper";
import {
  attachFileToDocument,
  createDocumentChecklist,
  detachFileFromDocument,
  formatUploadedFileSize,
  getLoanDocumentProgress,
  getLoanDocumentStatus,
  getMissingRequiredDocuments,
  type LoanDocumentProgress,
  type LoanDocumentStatus,
  type TransientLoanDocumentStatus,
} from "../documents/loanDocumentEngine";

/** `useDocumentUploadHelper` default; kept in sync so its alert titles can be reproduced. */
const DEFAULT_MAX_SIZE_MB = 10;

/** The exact message `useDocumentUploadHelper` reports for an oversized file. */
const tooLargeMessage = (maxSizeMB: number): string => `File size exceeds maximum limit of ${maxSizeMB}MB.`;

/** Reads a size label such as "6.20 MB", "850 KB" or "1.2 GB" as megabytes (0 when unreadable). */
const sizeLabelToMB = (label: string): number => {
  const match = label.match(/([\d.]+)\s*(KB|MB|GB)?/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = (match[2] || "MB").toUpperCase();
  if (unit === "GB") return value * 1024;
  if (unit === "KB") return value / 1024;
  return value;
};

/**
 * Which files the "Files / Drive" option accepts.
 * - "standard": the shared upload helper's picker (PDF and images).
 * - "withOfficeDocuments": the existing loans picker `pickLoanDocumentFromFiles`
 *   (PDF, images, DOC, DOCX, XLS, XLSX) for flows that already accept Office files.
 * Camera and gallery always go through the shared helper.
 */
export type LoanDocumentFileTypes = "standard" | "withOfficeDocuments";

export interface UseLoanDocumentsOptions {
  /** The loan's document checklist template (copied, never mutated). */
  template: readonly LoanDocumentItem[];
  /** Form scroll view; the upload sheet scrolls the tapped document into view. */
  scrollRef?: React.RefObject<ScrollView | null>;
  maxSizeMB?: number;
  /** Show the native crop/rotate editor after a photo (passed to the upload helper). */
  allowsEditing?: boolean;
  /** Documents that may only be attached from Files/Drive (gallery and camera hidden). */
  fileOnlyDocumentIds?: readonly string[];
  /** Defaults to "standard". */
  fileTypes?: LoanDocumentFileTypes;
  /**
   * Also apply `maxSizeMB` to files from the "withOfficeDocuments" picker, which does not
   * check size itself. Off by default so flows that never limited those files keep doing so.
   */
  enforceSizeLimitOnOfficeFiles?: boolean;
}

export interface LoanDocuments {
  documents: LoanDocumentItem[];
  /** Replace the whole list, e.g. when restoring a draft. */
  setDocuments: (documents: LoanDocumentItem[]) => void;
  resetDocuments: () => void;
  progress: LoanDocumentProgress;
  missingRequiredDocuments: LoanDocumentItem[];
  /** Existing loan validation (`validateLoanDocuments`). */
  validateDocuments: () => { isValid: boolean; missingDocs: string[] };
  getDocumentStatus: (documentId: string) => LoanDocumentStatus;
  /** Record a document row's y-offset (from `onLayout`) so the sheet can scroll to it. */
  registerDocumentPosition: (documentId: string, y: number) => void;
  /** `title` defaults to the document's name. */
  openUpload: (documentId: string, title?: string) => void;
  /** Re-opens the upload sheet for a document whose last pick failed. */
  retryUpload: (documentId: string) => void;
  removeDocument: (documentId: string) => void;
  /** Spread onto the shared `DocumentUploadBottomSheet`. */
  uploadSheetProps: DocumentUploadBottomSheetProps;
  openPreview: (documentId: string) => void;
  /** Spread onto the loans `DocumentPreviewModal`. */
  previewModalProps: DocumentPreviewModalProps;
}

/**
 * Document checklist state for a loan flow, wired to the shared upload engine
 * (`useDocumentUploadHelper` + `DocumentUploadBottomSheet`). Picking, permissions,
 * size limits and scrolling are all done by that engine; this hook only keeps
 * the checklist and per-document status in step with it.
 */
export function useLoanDocuments({
  template,
  scrollRef,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  allowsEditing,
  fileOnlyDocumentIds = [],
  fileTypes = "standard",
  enforceSizeLimitOnOfficeFiles = false,
}: UseLoanDocumentsOptions): LoanDocuments {
  const [documents, setDocuments] = useState<LoanDocumentItem[]>(() => createDocumentChecklist(template));
  const [transientStatus, setTransientStatus] = useState<Record<string, TransientLoanDocumentStatus>>({});
  const [previewDocumentId, setPreviewDocumentId] = useState<string | null>(null);
  const documentPositions = useRef<Record<string, number>>({});

  const setStatus = useCallback((documentId: string | undefined, status: TransientLoanDocumentStatus | null) => {
    if (!documentId) return;
    setTransientStatus((prev) => {
      const rest = Object.fromEntries(Object.entries(prev).filter(([id]) => id !== documentId));
      return status ? { ...rest, [documentId]: status } : rest;
    });
  }, []);

  const uploadHelper = useDocumentUploadHelper({
    scrollRef,
    maxSizeMB,
    allowsEditing,
    onProcessingStart: (documentId) => setStatus(documentId, "processing"),
    onCancel: (documentId) => setStatus(documentId, null),
    onSuccess: (file, documentId) => {
      if (!documentId) return;
      setStatus(documentId, null);
      setDocuments((prev) =>
        attachFileToDocument(prev, documentId, {
          uri: file.uri,
          name: file.name,
          sizeLabel: formatUploadedFileSize(file.size),
        })
      );
    },
    // Supplying onError suppresses the helper's own alert, so the same alerts are shown here.
    onError: (message, documentId) => reportUploadError(message, documentId),
  });

  function reportUploadError(message: string, documentId?: string) {
    setStatus(documentId, "error");
    const isTooLarge = message === tooLargeMessage(maxSizeMB);
    Alert.alert(isTooLarge ? "File Too Large" : "Upload Error", message);
  }

  /** Files/Drive through the existing loans picker, which also accepts Word and Excel files. */
  const pickOfficeFiles = async () => {
    const documentId = uploadHelper.activeDocKey;
    uploadHelper.closeUploadSheet();
    if (!documentId) return;
    setStatus(documentId, "processing");
    const file = await pickLoanDocumentFromFiles();
    setStatus(documentId, null);
    if (!file) return;
    if (enforceSizeLimitOnOfficeFiles && sizeLabelToMB(file.size) > maxSizeMB) {
      reportUploadError(tooLargeMessage(maxSizeMB), documentId);
      return;
    }
    setDocuments((prev) =>
      attachFileToDocument(prev, documentId, { uri: file.uri, name: file.name, sizeLabel: file.size })
    );
  };

  const openUpload = useCallback(
    (documentId: string, title?: string) => {
      const doc = documents.find((item) => item.id === documentId);
      uploadHelper.openUploadSheet(documentId, title ?? doc?.name, documentPositions.current[documentId]);
    },
    [documents, uploadHelper]
  );

  const retryUpload = useCallback(
    (documentId: string) => {
      setStatus(documentId, null);
      openUpload(documentId);
    },
    [setStatus, openUpload]
  );

  const removeDocument = useCallback(
    (documentId: string) => {
      setStatus(documentId, null);
      setDocuments((prev) => detachFileFromDocument(prev, documentId));
    },
    [setStatus]
  );

  const resetDocuments = useCallback(() => {
    setTransientStatus({});
    setPreviewDocumentId(null);
    setDocuments(createDocumentChecklist(template));
  }, [template]);

  const registerDocumentPosition = useCallback((documentId: string, y: number) => {
    documentPositions.current[documentId] = y;
  }, []);

  const getDocumentStatus = useCallback(
    (documentId: string): LoanDocumentStatus => {
      const doc = documents.find((item) => item.id === documentId);
      return doc ? getLoanDocumentStatus(doc, transientStatus[documentId]) : "pending";
    },
    [documents, transientStatus]
  );

  const progress = useMemo(() => getLoanDocumentProgress(documents), [documents]);
  const missingRequiredDocuments = useMemo(() => getMissingRequiredDocuments(documents), [documents]);
  const validateDocuments = useCallback(() => validateLoanDocuments(documents), [documents]);

  const isFileOnly = fileOnlyDocumentIds.includes(uploadHelper.activeDocKey ?? "");
  const previewDocument = documents.find((doc) => doc.id === previewDocumentId) ?? null;

  return {
    documents,
    setDocuments,
    resetDocuments,
    progress,
    missingRequiredDocuments,
    validateDocuments,
    getDocumentStatus,
    registerDocumentPosition,
    openUpload,
    retryUpload,
    removeDocument,
    uploadSheetProps: {
      visible: uploadHelper.isSheetVisible,
      documentTitle: uploadHelper.currentDocTitle,
      maxSizeBytesText: `${maxSizeMB} MB`,
      onClose: uploadHelper.closeUploadSheet,
      onPickFiles: fileTypes === "withOfficeDocuments" ? pickOfficeFiles : uploadHelper.pickFiles,
      onPickGallery: uploadHelper.pickGallery,
      onTakePhoto: uploadHelper.takePhoto,
      allowGallery: !isFileOnly,
      allowCamera: !isFileOnly,
    },
    openPreview: setPreviewDocumentId,
    previewModalProps: {
      visible: previewDocument !== null,
      document: previewDocument,
      onClose: () => setPreviewDocumentId(null),
    },
  };
}

export default useLoanDocuments;
