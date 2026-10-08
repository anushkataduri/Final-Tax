import React from "react";
import { View, Text, TouchableOpacity, Modal, Image, TouchableWithoutFeedback } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./ViewDocumentModal.styles";

interface ViewDocumentModalProps {
  visible: boolean;
  title: string;
  fileUri?: string;
  fileName?: string;
  fileSize?: string;
  fileTypeLabel?: string;
  onClose: () => void;
}

export const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({
  visible,
  title,
  fileUri,
  fileName,
  fileSize,
  fileTypeLabel,
  onClose,
}) => {
  const isImage =
    fileUri &&
    (fileUri.endsWith(".jpg") ||
      fileUri.endsWith(".jpeg") ||
      fileUri.endsWith(".png") ||
      fileTypeLabel === "JPG" ||
      fileTypeLabel === "PNG" ||
      fileTypeLabel === "JPEG");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Preview Area - Zero inline styles */}
              <View style={styles.previewBox}>
                {isImage && fileUri ? (
                  <Image source={{ uri: fileUri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderBox}>
                    <Ionicons name="document-text-outline" size={54} color="#083B75" />
                    <Text style={styles.placeholderText}>
                      {fileTypeLabel || "PDF"} Document
                    </Text>
                  </View>
                )}
              </View>

              {/* Meta Info */}
              <View style={styles.metaContainer}>
                <Text style={styles.fileNameText} numberOfLines={1}>
                  {fileName || "Document File"}
                </Text>
                <Text style={styles.fileMetaText}>
                  {`${fileTypeLabel || "FILE"} • ${fileSize || "Uploaded"}`}
                </Text>
              </View>

              {/* Done Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
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

export default ViewDocumentModal;
