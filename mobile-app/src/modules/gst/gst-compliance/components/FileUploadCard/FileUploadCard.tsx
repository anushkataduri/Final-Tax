import React from "react";
import * as FileSystem from "expo-file-system";
import { GstDocumentCard } from "@/modules/gst/components/GstDocumentCard";
import { UploadedDocInfo } from "@/modules/gst/validation/complianceSchema";
import { MAX_FILE_SIZE_BYTES } from "@/modules/gst/utils/gstValidation";
import { resolveDocType } from "../../utils/gstPreviewUtils";

export interface FileUploadCardProps {
  title: string;
  description?: string;
  required?: boolean;
  allowedExtensions?: string[];
  supportedFormatsText?: string;
  maxSizeBytes?: number;
  uploadedDoc: UploadedDocInfo | null;
  onDocChange: (doc: UploadedDocInfo | null) => void;
  error?: string;
  onClearError?: () => void;
  onError?: (message: string) => void;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  title,
  description,
  required = false,
  maxSizeBytes,
  uploadedDoc,
  onDocChange,
  error,
  onClearError,
  onError,
}) => {
  const effectiveMaxSize = maxSizeBytes ?? MAX_FILE_SIZE_BYTES;
  const maxMb = Math.round(effectiveMaxSize / (1024 * 1024));
  const docTypeInfo = uploadedDoc ? resolveDocType(uploadedDoc) : null;

  return (
    <GstDocumentCard
      maxSizeBytes={effectiveMaxSize}
      item={{
        id: title,
        name: title,
        subtitle: description,
        required,
        fileUri: uploadedDoc?.uri,
        fileName: uploadedDoc?.name,
        fileSize: uploadedDoc?.sizeFormatted,
        fileTypeLabel: docTypeInfo?.typeLabel,
        mimeType: uploadedDoc?.mimeType || docTypeInfo?.resolvedMime,
        errorMessage: error,
      }}
      onUploadSuccess={async (_id, asset) => {
        try {
          const fileInfo = await FileSystem.getInfoAsync(asset.uri);
          if (
            !fileInfo.exists ||
            typeof fileInfo.size !== "number" ||
            fileInfo.size <= 0
          ) {
            onError?.("Unable to verify document file size. Please re-select the document.");
            return;
          }

          if (fileInfo.size > effectiveMaxSize) {
            onError?.(`File exceeds ${maxMb} MB limit. Please select a smaller file.`);
            return;
          }

          onDocChange({
            uri: asset.uri,
            name: asset.name,
            size: fileInfo.size,
            sizeFormatted: asset.size,
            mimeType: asset.mimeType,
          });
          onClearError?.();
        } catch {
          onError?.("Unable to verify document file size. Please re-select the document.");
        }
      }}
      onUploadError={(_id, message) => {
        onError?.(message);
      }}
      onRemove={() => {
        onDocChange(null);
        onClearError?.();
      }}
    />
  );
};

export default FileUploadCard;
