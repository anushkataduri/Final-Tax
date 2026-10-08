import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./GstDocumentCard.styles";
import { GstViewDocumentModal } from "./GstViewDocumentModal";
import { GstRemoveConfirmModal } from "./GstRemoveConfirmModal";
import { GstUploadSourceModal } from "./GstUploadSourceModal";

export interface GstDocumentItem {
  id: string;
  name: string;
  subtitle?: string;
  required?: boolean;
  fileUri?: string;
  fileName?: string;
  fileSize?: string;
  fileTypeLabel?: string;
  mimeType?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
  iconColor?: string;
  category?: string;
  status?: "idle" | "uploading" | "uploaded" | "error";
  errorMessage?: string;
}

export interface GstDocumentCardProps {
  item: GstDocumentItem;
  onUploadSuccess: (
    id: string,
    asset: {
      uri: string;
      name: string;
      size: string;
      mimeType?: string;
      fileTypeLabel?: string;
    }
  ) => void;
  onUploadError?: (id: string, message: string) => void;
  onRemove: (id: string) => void;
  isDropdownSelector?: boolean;
  dropdownValue?: string;
  onDropdownPress?: () => void;
  triggerUploadKey?: number;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const GstDocumentCard: React.FC<GstDocumentCardProps> = ({
  item,
  onUploadSuccess,
  onUploadError,
  onRemove,
  isDropdownSelector = false,
  dropdownValue,
  onDropdownPress,
  triggerUploadKey,
}) => {
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    if (triggerUploadKey && triggerUploadKey > 0) {
      setShowSourceModal(true);
    }
  }, [triggerUploadKey]);

  const isUploaded = Boolean(item.fileUri);
  const isBusy = item.status === "uploading";
  const hasError = Boolean(item.errorMessage);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0.01 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const processFileAsset = (asset: {
    uri: string;
    name?: string;
    size?: number;
    mimeType?: string;
  }) => {
    const fileName = asset.name || `${item.id}_document.pdf`;
    const extension = fileName.split(".").pop()?.toUpperCase() || "PDF";

    if (asset.size && asset.size > MAX_FILE_SIZE_BYTES) {
      const err = "File exceeds 10 MB limit. Please select a smaller file.";
      onUploadError?.(item.id, err);
      return;
    }

    onUploadSuccess(item.id, {
      uri: asset.uri,
      name: fileName,
      size: formatFileSize(asset.size),
      mimeType: asset.mimeType,
      fileTypeLabel: extension,
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
        processFileAsset(result.assets[0]);
      }
    } catch {
      onUploadError?.(item.id, "Could not open document picker. Please try again.");
    }
  };

  const handleTakePhoto = async () => {
    setShowSourceModal(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        onUploadError?.(item.id, "Camera permission is required to take photos.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        processFileAsset({
          uri: asset.uri,
          name: `${item.id}_camera_${Date.now()}.jpg`,
          size: asset.fileSize,
          mimeType: asset.mimeType || "image/jpeg",
        });
      }
    } catch {
      onUploadError?.(item.id, "Could not open camera. Please try again.");
    }
  };

  const handleConfirmRemove = () => {
    setShowRemoveModal(false);
    onRemove(item.id);
  };

  return (
    <View
      style={[
        styles.card,
        isUploaded && styles.cardUploaded,
        hasError && styles.cardError,
      ]}
    >
      <View style={styles.cardMainRow}>
        {/* Document Icon Box */}
        <View
          style={[
            styles.iconBox,
            isUploaded && styles.iconBoxUploaded,
            item.iconBg && !isUploaded ? { backgroundColor: item.iconBg } : null,
          ]}
        >
          <Ionicons
            name={
              isUploaded
                ? "document-text"
                : item.iconName || "document-text-outline"
            }
            size={22}
            color={
              isUploaded
                ? "#16A34A"
                : item.iconColor || "#2563EB"
            }
          />
        </View>

        {/* Text Column */}
        <View style={styles.textColumn}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>{item.name}</Text>
            {item.required && <Text style={styles.requiredStar}>*</Text>}
          </View>

          {isDropdownSelector ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onDropdownPress}
              style={styles.dropdownBtn}
            >
              <Text style={styles.dropdownText} numberOfLines={1}>
                {dropdownValue || item.subtitle || "Select type"}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#083B75" />
            </TouchableOpacity>
          ) : (
            <Text style={styles.subtitleText} numberOfLines={1}>
              {item.subtitle}
            </Text>
          )}

          {/* Uploaded File Row - Green Checkmark + Filename + Size */}
          {isUploaded && (
            <View style={styles.uploadedFileInfoRow}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#059669"
                style={styles.checkCircle}
              />
              <Text style={styles.uploadedFileName} numberOfLines={1}>
                {`${item.fileName || "Uploaded document"} (${item.fileSize || "0.01 MB"})`}
              </Text>
            </View>
          )}
        </View>

        {/* Right Pill Upload Button (when NOT uploaded) */}
        {!isUploaded && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              if (isDropdownSelector && onDropdownPress) {
                onDropdownPress();
              } else {
                setShowSourceModal(true);
              }
            }}
            style={styles.uploadPillBtn}
            disabled={isBusy}
          >
            {isBusy ? (
              <ActivityIndicator size="small" color="#4338CA" />
            ) : (
              <>
                <Ionicons name="arrow-up" size={14} color="#4338CA" />
                <Text style={styles.uploadPillBtnText}>Upload File</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Uploaded Action Buttons Row: View, Change, Delete */}
      {isUploaded && (
        <View style={styles.uploadedActionsRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowViewModal(true)}
            style={styles.viewButton}
          >
            <Ionicons name="eye-outline" size={14} color="#1E40AF" />
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowSourceModal(true)}
            style={styles.changeButton}
          >
            <Ionicons name="swap-horizontal" size={14} color="#C2410C" />
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowRemoveModal(true)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={15} color="#DC2626" />
          </TouchableOpacity>
        </View>
      )}

      {/* Error Row */}
      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color="#DC2626" />
          <Text style={styles.errorText}>{item.errorMessage}</Text>
        </View>
      )}

      {/* Modals */}
      <GstUploadSourceModal
        visible={showSourceModal}
        documentTitle={item.name}
        onChooseFiles={handleChooseFiles}
        onTakePhoto={handleTakePhoto}
        onClose={() => setShowSourceModal(false)}
      />

      <GstRemoveConfirmModal
        visible={showRemoveModal}
        title="Remove Document?"
        message={`Are you sure you want to remove "${item.name}"? You can upload a new one at any time.`}
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowRemoveModal(false)}
      />

      <GstViewDocumentModal
        visible={showViewModal}
        title={item.name}
        fileUri={item.fileUri}
        fileName={item.fileName}
        fileSize={item.fileSize}
        fileTypeLabel={item.fileTypeLabel}
        onClose={() => setShowViewModal(false)}
      />
    </View>
  );
};

export default GstDocumentCard;
