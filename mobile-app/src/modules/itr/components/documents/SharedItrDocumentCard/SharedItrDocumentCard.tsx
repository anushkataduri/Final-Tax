import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

// Import existing icon component
import { DocumentUploadIcon } from "../DocumentUploadIcons";

// Import existing Modals
import { UploadSourceModal } from "@/modules/itr/tds/components/documents/UploadSourceModal";
import { RemoveConfirmModal } from "@/modules/itr/tds/components/documents/RemoveConfirmModal";
import { ViewDocumentModal } from "@/modules/itr/tds/components/documents/ViewDocumentModal";

import { styles } from "./SharedItrDocumentCard.styles";

const DEFAULT_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx", "json"];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export interface SharedDocumentItem {
  id: string;
  title: string;
  subtitle?: string;
  isMandatory?: boolean;
  status?: string;
  fileUri?: string;
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
  errorMessage?: string;
  iconType?: any;
}

interface SharedItrDocumentCardProps {
  item: SharedDocumentItem;
  variant?: "default" | "inline";
  onUploadSuccess: (
    id: string,
    payload: { uri: string; name: string; size: string; mimeType?: string; fileTypeLabel?: string }
  ) => void;
  onRemove: (id: string) => void;
}

export const SharedItrDocumentCard: React.FC<SharedItrDocumentCardProps> = ({
  item,
  variant = "default",
  onUploadSuccess,
  onRemove,
}) => {
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const isUploaded = item.status === "uploaded" || !!item.fileUri;
  const hasError = item.status === "rejected" || !!item.errorMessage;

  const onUploadError = (err: string) => {
    Alert.alert("Upload Error", err);
  };

  const validateAndProcessFile = (
    asset: { uri: string; name?: string; size?: number; mimeType?: string },
    defaultName: string
  ) => {
    const fileName = asset.name || defaultName;
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    const allowed = DEFAULT_EXTENSIONS;
    const isValidFormat = allowed.includes(extension);

    if (!isValidFormat) {
      onUploadError(`Unsupported file (.${extension || "unknown"}). Accepted: PDF, JPG, PNG`);
      return;
    }

    if (asset.size && asset.size > MAX_FILE_SIZE_BYTES) {
      onUploadError("File exceeds 10 MB limit. Please select a smaller file.");
      return;
    }

    const sizeInMb = asset.size
      ? `${(asset.size / (1024 * 1024)).toFixed(2)} MB`
      : "2.4 MB";

    onUploadSuccess(item.id, {
      uri: asset.uri,
      name: fileName,
      size: sizeInMb,
      mimeType: asset.mimeType,
      fileTypeLabel: extension.toUpperCase() || "FILE",
    });
  };

  const handleChooseFiles = async () => {
    setShowSourceModal(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["*/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        validateAndProcessFile(result.assets[0], `${item.id}_document.pdf`);
      }
    } catch {
      onUploadError("Could not open document picker. Please try again.");
    }
  };

  const handleTakePhoto = async () => {
    setShowSourceModal(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        onUploadError("Camera permission is required to capture documents.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        validateAndProcessFile(
          result.assets[0],
          `${item.id}_camera_${Date.now()}.jpg`
        );
      }
    } catch {
      onUploadError("Could not open camera. Please try again.");
    }
  };

  const handleConfirmRemove = () => {
    setShowRemoveModal(false);
    onRemove(item.id);
  };

  const renderModals = () => (
    <>
      <UploadSourceModal
        visible={showSourceModal}
        documentTitle={item.title}
        maxSizeText="Maximum file size: 10 MB"
        onChooseFiles={handleChooseFiles}
        onSelectGallery={() => {}}
        onTakePhoto={handleTakePhoto}
        onClose={() => setShowSourceModal(false)}
      />

      <RemoveConfirmModal
        visible={showRemoveModal}
        title={item.title}
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowRemoveModal(false)}
      />

      {item.fileUri && (
        <ViewDocumentModal
          visible={showViewModal}
          fileUri={item.fileUri}
          title={item.title}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </>
  );

  if (variant === "inline") {
    return (
      <View style={{ flexDirection: "column" }}>
        {!isUploaded ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowSourceModal(true)}
            style={[styles.uploadButton, { alignSelf: 'center', marginLeft: 0, marginVertical: 0, paddingVertical: 4, paddingHorizontal: 12, minWidth: 0, height: 32, borderRadius: 16 }]}
          >
            <Ionicons name="arrow-up" size={14} color="#4338CA" />
            <Text style={[styles.uploadButtonText, { fontSize: 12 }]}>Upload</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <Text numberOfLines={1} style={{ fontSize: 11, color: '#059669', maxWidth: 100 }}>
              {item.fileName || "Uploaded"}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <TouchableOpacity onPress={() => setShowViewModal(true)} style={[styles.viewButton, { paddingHorizontal: 8, paddingVertical: 4, height: 32, borderRadius: 16 }]}>
                <Ionicons name="eye-outline" size={14} color="#1E3A8A" />
              </TouchableOpacity>
  
              <TouchableOpacity onPress={() => setShowSourceModal(true)} style={[styles.changeButton, { paddingHorizontal: 8, paddingVertical: 4, height: 32, borderRadius: 16 }]}>
                <Ionicons name="swap-horizontal" size={14} color="#D97706" />
              </TouchableOpacity>
  
              <TouchableOpacity onPress={() => setShowRemoveModal(true)} style={[styles.trashButton, { width: 32, height: 32, borderRadius: 10 }]}>
                <Ionicons name="trash-outline" size={14} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {hasError && (
          <View style={[styles.inlineErrorRow, { paddingHorizontal: 0, marginTop: 4, borderTopWidth: 0, paddingTop: 0 }]}>
            <Ionicons name="alert-circle" size={14} color="#DC2626" style={styles.errorIcon} />
            <Text style={styles.inlineErrorText}>{item.errorMessage || "Error uploading."}</Text>
          </View>
        )}

        {renderModals()}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        isUploaded && styles.cardUploaded,
        hasError && styles.cardError,
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, isUploaded && styles.iconContainerUploaded]}>
          {isUploaded ? (
            <Ionicons name="document-text" size={22} color="#16A34A" />
          ) : (
            <DocumentUploadIcon type={item.iconType || "business_income"} />
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {item.title}
            {item.isMandatory ? (
              <Text style={styles.requiredAsterisk}> *</Text>
            ) : (
              <Text style={styles.optionalLabel}> (optional)</Text>
            )}
          </Text>

          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle || `Document for verification`}
          </Text>

          {isUploaded && (
            <View style={styles.uploadedFileRow}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#059669"
                style={styles.checkDot}
              />
              <Text style={styles.uploadedFileName} numberOfLines={1}>
                {`${item.fileName || "Uploaded document"} (${item.fileSize || "2.4 MB"})`}
              </Text>
            </View>
          )}
        </View>

        {!isUploaded && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowSourceModal(true)}
            style={styles.uploadButton}
          >
            <Ionicons name="arrow-up" size={14} color="#4338CA" />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        )}
      </View>

      {isUploaded && (
        <View style={styles.uploadedActionsRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowViewModal(true)}
            style={styles.viewButton}
          >
            <Ionicons name="eye-outline" size={15} color="#1E3A8A" />
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowSourceModal(true)}
            style={styles.changeButton}
          >
            <Ionicons name="swap-horizontal" size={15} color="#D97706" />
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowRemoveModal(true)}
            style={styles.trashButton}
          >
            <Ionicons name="trash-outline" size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>
      )}

      {hasError && (
        <View style={styles.inlineErrorRow}>
          <Ionicons name="alert-circle" size={14} color="#DC2626" style={styles.errorIcon} />
          <Text style={styles.inlineErrorText}>{item.errorMessage || "Document was rejected. Please re-upload."}</Text>
        </View>
      )}

      <UploadSourceModal
        visible={showSourceModal}
        documentTitle={item.title}
        maxSizeText="Maximum file size: 10 MB"
        onChooseFiles={handleChooseFiles}
        onSelectGallery={() => {}}
        onTakePhoto={handleTakePhoto}
        onClose={() => setShowSourceModal(false)}
      />

      <RemoveConfirmModal
        visible={showRemoveModal}
        title={item.title}
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowRemoveModal(false)}
      />

      {item.fileUri && (
        <ViewDocumentModal
          visible={showViewModal}
          fileUri={item.fileUri}
          title={item.title}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </View>
  );
};
