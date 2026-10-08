import React from "react";
import { GstDocumentCard } from "@/modules/gst/components/GstDocumentCard";
import { UploadedDocInfo } from "@/modules/gst/validation/complianceSchema";

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
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  title,
  description,
  required = false,
  uploadedDoc,
  onDocChange,
  error,
  onClearError,
}) => {
  return (
    <GstDocumentCard
      item={{
        id: title,
        name: title,
        subtitle: description,
        required,
        fileUri: uploadedDoc?.uri,
        fileName: uploadedDoc?.name,
        fileSize: uploadedDoc?.sizeFormatted,
        errorMessage: error,
      }}
      onUploadSuccess={(_id, asset) => {
        onDocChange({
          uri: asset.uri,
          name: asset.name,
          size: 1024,
          sizeFormatted: asset.size,
          mimeType: asset.mimeType,
        });
        onClearError?.();
      }}
      onRemove={() => {
        onDocChange(null);
        onClearError?.();
      }}
    />
  );
};

export default FileUploadCard;
