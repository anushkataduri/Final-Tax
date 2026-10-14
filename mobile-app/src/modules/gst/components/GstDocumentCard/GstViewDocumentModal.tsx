import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Sharing from "expo-sharing";
import { resolveDocType } from "../../gst-compliance/utils/gstPreviewUtils";
import { styles } from "./GstViewDocumentModal.styles";

export interface GstViewDocumentModalProps {
  visible: boolean;
  title: string;
  fileUri?: string;
  fileName?: string;
  fileSize?: string;
  fileTypeLabel?: string;
  mimeType?: string;
  onClose: () => void;
}

export const GstViewDocumentModal: React.FC<GstViewDocumentModalProps> = ({
  visible,
  title,
  fileUri,
  fileName,
  fileSize,
  fileTypeLabel,
  mimeType,
  onClose,
}) => {
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isIframeError, setIsIframeError] = useState<boolean>(false);
  const [isImageError, setIsImageError] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setActionError(null);
    setIsIframeError(false);
    setIsImageError(false);
    setIsSharing(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActionError(null);
      setIsIframeError(false);
      setIsImageError(false);
      setIsSharing(false);
    }
  }, [visible, fileUri]);

  useEffect(() => {
    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      fileUri?.startsWith("blob:")
    ) {
      fetch(fileUri, { method: "HEAD" }).catch(() => {
        setIsIframeError(true);
      });
    }
  }, [fileUri]);

  const docType = resolveDocType({
    name: fileName,
    uri: fileUri,
    mimeType,
    fileTypeLabel,
  });

  const isWebRenderableUri = Boolean(
    Platform.OS === "web" &&
      fileUri &&
      /^(blob:|https?:|data:)/i.test(fileUri)
  );

  const handleOpenInNewTab = useCallback(() => {
    if (Platform.OS === "web" && typeof window !== "undefined" && fileUri) {
      if (/^(blob:|https?:|data:)/i.test(fileUri)) {
        const opened = window.open(fileUri, "_blank", "noopener,noreferrer");
        if (!opened) {
          setActionError("Pop-up was blocked. Please allow pop-ups to open the document.");
        }
      } else {
        setActionError("Direct browser opening is not supported for this file scheme.");
      }
    }
  }, [fileUri]);

  const handleOpenOrShare = useCallback(async () => {
    if (!fileUri) {
      setActionError("Document location is unavailable.");
      return;
    }
    setActionError(null);
    setIsSharing(true);
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined") {
          if (/^(blob:|https?:|data:)/i.test(fileUri)) {
            const opened = window.open(fileUri, "_blank", "noopener,noreferrer");
            if (!opened) {
              setActionError("Pop-up was blocked. Please allow pop-ups to open the document.");
            }
          } else {
            setActionError("Direct browser opening is not supported for this file scheme.");
          }
        }
        return;
      }

      const available = await Sharing.isAvailableAsync();
      if (!available) {
        setActionError("Sharing is not supported on this device.");
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: docType.resolvedMime,
        dialogTitle: fileName || title,
        UTI: docType.uti,
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Unable to open or share document.";
      const isCancelled =
        errorMsg.toLowerCase().includes("cancel") ||
        errorMsg.toLowerCase().includes("dismiss");
      if (!isCancelled) {
        setActionError("Unable to open file in external viewer. Please try again.");
      }
    } finally {
      setIsSharing(false);
    }
  }, [fileUri, docType, fileName, title]);

  const renderPreviewContent = () => {
    if (!fileUri) {
      return (
        <View style={styles.fallbackBox}>
          <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
          <Text style={styles.fallbackTitle}>Document Unavailable</Text>
          <Text style={styles.fallbackNotice}>
            The document location is missing or the file session has expired.
          </Text>
        </View>
      );
    }

    if (docType.isImage) {
      if (isImageError) {
        return (
          <View style={styles.fallbackBox}>
            <Ionicons name="image-outline" size={44} color="#EF4444" />
            <Text style={styles.fallbackTitle}>Image Preview Unavailable</Text>
            <Text style={styles.fallbackNotice}>
              Could not display the image preview. You can open it externally below.
            </Text>
            <TouchableOpacity
              style={styles.openActionButton}
              activeOpacity={0.8}
              onPress={handleOpenOrShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="open-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.openActionButtonText}>Open Image</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <Image
          source={{ uri: fileUri }}
          style={styles.previewImage}
          resizeMode="contain"
          onError={() => setIsImageError(true)}
        />
      );
    }

    if (Platform.OS === "web" && isWebRenderableUri && docType.isPdf) {
      if (isIframeError) {
        return (
          <View style={styles.fallbackBox}>
            <Ionicons name="alert-circle-outline" size={40} color="#DC2626" />
            <Text style={styles.fallbackTitle}>Preview Unavailable</Text>
            <Text style={styles.fallbackNotice}>
              Inline browser preview failed or file session expired.
            </Text>
            <TouchableOpacity
              style={styles.openActionButton}
              activeOpacity={0.8}
              onPress={handleOpenInNewTab}
            >
              <Ionicons name="open-outline" size={16} color="#FFFFFF" />
              <Text style={styles.openActionButtonText}>Open in New Tab</Text>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <View style={styles.webPdfBox}>
          {React.createElement("iframe", {
            src: fileUri,
            title: fileName || title,
            onError: () => setIsIframeError(true),
            style: { width: "100%", height: 260, border: "none", borderRadius: 8 },
          })}
          <View style={styles.webActionRow}>
            <TouchableOpacity
              style={styles.webOpenTabButton}
              activeOpacity={0.75}
              onPress={handleOpenInNewTab}
            >
              <Ionicons name="open-outline" size={14} color="#1D4ED8" />
              <Text style={styles.webOpenTabButtonText}>Open in New Tab</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.fallbackBox}>
        <Ionicons
          name={docType.isSpreadsheet ? "grid-outline" : "document-text-outline"}
          size={48}
          color="#083B75"
        />
        <Text style={styles.fallbackTitle}>{docType.typeLabel}</Text>
        <Text style={styles.fallbackNotice}>
          {docType.isSpreadsheet
            ? "Spreadsheet files cannot be rendered inline. Open or view using your device or browser."
            : Platform.OS === "web"
            ? "Inline browser preview is unavailable for this file URI scheme."
            : "Inline PDF preview is not supported on this device. Open using the device viewer below."}
        </Text>
        <TouchableOpacity
          style={styles.openActionButton}
          activeOpacity={0.8}
          onPress={handleOpenOrShare}
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="open-outline" size={16} color="#FFFFFF" />
              <Text style={styles.openActionButtonText}>
                {Platform.OS === "web" ? "Open Document File" : "Open / View File..."}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title} numberOfLines={2} ellipsizeMode="middle">
                  {title}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Preview Area */}
              <View style={styles.previewBox}>
                {renderPreviewContent()}
              </View>

              {/* Action Error Banner */}
              {actionError ? (
                <View style={styles.actionErrorBox}>
                  <Ionicons name="alert-circle" size={14} color="#DC2626" />
                  <Text style={styles.actionErrorText}>{actionError}</Text>
                </View>
              ) : null}

              {/* Meta Info */}
              <View style={styles.metaContainer}>
                <Text
                  style={styles.fileNameText}
                  numberOfLines={2}
                  ellipsizeMode="middle"
                >
                  {fileName || "Document File"}
                </Text>
                <Text style={styles.fileMetaText}>
                  {`${docType.typeLabel} • ${fileSize || "Uploaded"}`}
                </Text>
              </View>

              {/* Done Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleClose}
                style={styles.doneButton}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default GstViewDocumentModal;

