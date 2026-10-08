import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, Alert, Image, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LoanDocumentItem } from "../../../types/loans.types";
import type { LoanDocuments } from "../../../hooks/useLoanDocuments";
import { DocumentUploadBottomSheet } from "../../../../../shared/components/DocumentUploadBottomSheet";
import { useDocumentUploadHelper } from "../../../../../shared/hooks/useDocumentUploadHelper";
import { BrandColors } from "../../../../../shared/theme";
import { styles } from "./PersonalLoanDocumentsStep.styles";

export interface PersonalLoanDocumentsStepProps {
  loanDocuments?: LoanDocuments;
  documents?: LoanDocumentItem[];
  onDocumentUploaded?: (docId: string, fileUri: string, fileName: string, fileSize: string) => void;
  onDocumentRemoved?: (docId: string) => void;
  scrollRef?: React.RefObject<ScrollView | null>;
}

const ICON_COLORS = {
  accent: BrandColors.PRIMARY_ORANGE,
  view: BrandColors.TEXT_PRIMARY,
  delete: "#DC2626",
  close: BrandColors.TEXT_SECONDARY,
  verified: "#166534",
} as const;

interface DocCardStyleConfig {
  iconName: keyof typeof Ionicons.glyphMap;
  iconStyle: "iconSquareBlue" | "iconSquarePurple" | "iconSquareGreen" | "iconSquareRed" | "iconSquareOrange" | "iconSquarePink";
  iconColor: string;
}

const getDocStyleConfig = (docId: string): DocCardStyleConfig => {
  const cleanId = docId.replace(/^doc-/, "");
  switch (cleanId) {
    case "pan": return { iconName: "document-text", iconStyle: "iconSquareBlue", iconColor: "#2563EB" };
    case "aadhaar": return { iconName: "card-outline", iconStyle: "iconSquarePurple", iconColor: "#7C3AED" };
    case "bank-statements": return { iconName: "business-outline", iconStyle: "iconSquareOrange", iconColor: BrandColors.PRIMARY_ORANGE || "#FF7A00" };
    case "salary-slips": return { iconName: "receipt-outline", iconStyle: "iconSquareGreen", iconColor: "#16A34A" };
    case "address-proof": return { iconName: "home-outline", iconStyle: "iconSquareRed", iconColor: "#DC2626" };
    case "photograph": return { iconName: "camera-outline", iconStyle: "iconSquarePurple", iconColor: "#7C3AED" };
    default: return { iconName: "document-attach-outline", iconStyle: "iconSquareBlue", iconColor: "#2563EB" };
  }
};

export const PersonalLoanDocumentsStep: React.FC<PersonalLoanDocumentsStepProps> = ({
  loanDocuments,
  documents: propsDocs,
  onDocumentUploaded,
  onDocumentRemoved,
  scrollRef,
}) => {
  const [internalDocs, setInternalDocs] = useState<LoanDocumentItem[]>(propsDocs || []);
  const documents = loanDocuments?.documents || propsDocs || internalDocs;
  const documentPositions = useRef<Record<string, number>>({});
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; uri: string; name: string; size: string } | null>(null);

  const fallbackUploadHelper = useDocumentUploadHelper({
    scrollRef,
    onSuccess: (file, docId) => {
      if (!docId) return;
      const size = file.size ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "1.8 MB";
      if (onDocumentUploaded) {
        onDocumentUploaded(docId, file.uri, file.name, size);
      } else {
        setInternalDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, fileUri: file.uri, fileName: file.name, fileSize: size } : d)));
      }
    },
  });

  const uploadSheetProps = loanDocuments?.uploadSheetProps || {
    visible: fallbackUploadHelper.isSheetVisible,
    documentTitle: fallbackUploadHelper.currentDocTitle,
    maxSizeBytesText: "5 MB",
    onClose: fallbackUploadHelper.closeUploadSheet,
    onPickFiles: fallbackUploadHelper.pickFiles,
    onPickGallery: fallbackUploadHelper.pickGallery,
    onTakePhoto: fallbackUploadHelper.takePhoto,
    allowGallery: true,
    allowCamera: true,
  };

  const openUpload = (docId: string, title: string) => {
    if (loanDocuments) {
      loanDocuments.openUpload(docId, title);
    } else {
      fallbackUploadHelper.openUploadSheet(docId, title, documentPositions.current[docId]);
    }
  };

  const handleRemove = (docId: string) => {
    if (loanDocuments) {
      loanDocuments.removeDocument(docId);
    } else if (onDocumentRemoved) {
      onDocumentRemoved(docId);
    } else {
      setInternalDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, fileUri: undefined, fileName: undefined, fileSize: undefined } : d)));
    }
  };

  const handleView = (doc: LoanDocumentItem) => {
    if (!doc.fileUri) return;
    setPreviewDoc({
      title: doc.name,
      uri: doc.fileUri,
      name: doc.fileName || `${doc.name.replace(/\s+/g, "_")}.pdf`,
      size: doc.fileSize || "Verified",
    });
    setViewModalVisible(true);
  };

  const handleDeleteFile = (docId: string, docTitle: string) => {
    Alert.alert("Delete Document", `Are you sure you want to delete ${docTitle}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => handleRemove(docId) },
    ]);
  };

  const isImageUri = (uri?: string) => {
    if (!uri) return false;
    const lower = uri.toLowerCase();
    return lower.includes("ph://") || lower.includes("content://") || lower.endsWith(".jpg") || lower.endsWith(".png") || lower.endsWith(".jpeg");
  };


  const requiredDocs = documents.filter((d) => d.required);
  const conditionalDocs = documents.filter((d) => !d.required);

  const uploadedRequiredCount = requiredDocs.filter((d) => Boolean(d.fileUri && d.fileUri.trim() !== "")).length;
  const uploadedConditionalCount = conditionalDocs.filter((d) => Boolean(d.fileUri && d.fileUri.trim() !== "")).length;

  const renderDocCard = (item: LoanDocumentItem) => {
    const isUploaded = Boolean(item.fileUri && item.fileUri.trim() !== "");
    const styleConfig = getDocStyleConfig(item.id);

    return (
      <View
        key={item.id}
        style={styles.docCard}
        onLayout={(event) => {
          documentPositions.current[item.id] = event.nativeEvent.layout.y;
        }}
      >
        <View style={styles.docCardLeft}>
          <View style={[styles.iconSquare, styles[styleConfig.iconStyle]]}>
            <Ionicons name={styleConfig.iconName} size={18} color={styleConfig.iconColor} />
          </View>

          <View style={styles.docTextCol}>
            <View style={styles.docTitleRow}>
              <Text style={styles.docTitle}>{item.name}</Text>
              {item.required && <Text style={styles.requiredStar}>*</Text>}
              {!item.required && (
                <View style={styles.optionalBadge}>
                  <Text style={styles.optionalText}>Optional</Text>
                </View>
              )}
            </View>

            <Text style={styles.docSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          </View>
        </View>

        <View style={styles.docCardRight}>
          {isUploaded ? (
            <>
              <TouchableOpacity activeOpacity={0.7} onPress={() => handleView(item)} style={styles.viewBtn}>
                <Ionicons name="eye-outline" size={13} color={ICON_COLORS.view} />
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleDeleteFile(item.id, item.name)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={13} color={ICON_COLORS.delete} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openUpload(item.id, item.name)}
              style={styles.uploadBtn}
            >
              <Ionicons name="cloud-upload-outline" size={14} color={ICON_COLORS.accent} />
              <Text style={styles.uploadBtnText}>Upload</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header Row */}
      <View style={styles.topHeaderRow}>
        <View style={styles.titleCol}>
          <Text style={styles.sectionTitle}>Document Verification</Text>
          <Text style={styles.sectionSubtitle}>
            Upload required documents based on your personal applicant profile.
          </Text>
        </View>

        <View style={styles.formatsNoticeBox}>
          <Ionicons name="information-circle-outline" size={14} color={ICON_COLORS.accent} />
          <Text style={styles.formatsNoticeText}>Accepted: PDF, JPG, PNG{"\n"}Max file size: 5 MB</Text>
        </View>
      </View>

      {/* 1. Required Documents Section */}
      <View style={styles.sectionDivider}>
        <Text style={styles.sectionDividerTitle}>Required Documents</Text>
        <View style={styles.sectionDividerBadge}>
          <Text style={styles.sectionDividerBadgeText}>
            {uploadedRequiredCount} / {requiredDocs.length} Completed
          </Text>
        </View>
      </View>

      {requiredDocs.map(renderDocCard)}

      {/* 2. Optional / Conditional Documents Section */}
      {conditionalDocs.length > 0 && (
        <>
          <View style={styles.sectionDivider}>
            <Text style={styles.sectionDividerTitle}>Optional Documents</Text>
            <View style={styles.sectionDividerBadge}>
              <Text style={styles.sectionDividerBadgeText}>
                {uploadedConditionalCount} / {conditionalDocs.length} Uploaded
              </Text>
            </View>
          </View>
          {conditionalDocs.map(renderDocCard)}
        </>
      )}

      {/* 3. Bottom Information & Security Box */}
      <View style={styles.bottomInfoContainer}>
        <View style={styles.bottomInfoIconSquare}>
          <Ionicons name="shield-checkmark-outline" size={22} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
        </View>
        <View style={styles.bottomInfoTextCol}>
          <Text style={styles.bottomInfoTitle}>Secure Verification & Instant Processing</Text>
          <Text style={styles.bottomInfoDescription}>
            Your uploaded personal documents are 256-bit encrypted and safely stored. Verified KYC & income proofs help accelerate your personal loan evaluation and instant sanction.
          </Text>
        </View>
      </View>

      {/* Upload Sheet */}
      <DocumentUploadBottomSheet {...uploadSheetProps} />

      {/* Document View / Preview Modal */}
      <Modal visible={viewModalVisible} transparent animationType="fade" onRequestClose={() => setViewModalVisible(false)}>
        <View style={styles.viewModalBackdrop}>
          <View style={styles.viewModalContent}>
            <View style={styles.previewHeader}>
              <View style={styles.previewTitleRow}>
                <Ionicons name="document-text" size={20} color={ICON_COLORS.accent} />
                <Text style={styles.previewTitle}>{previewDoc?.title || "Document Preview"}</Text>
              </View>
              <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={ICON_COLORS.close} />
              </TouchableOpacity>
            </View>

            <View style={styles.previewCard}>
              {isImageUri(previewDoc?.uri) ? (
                <Image source={{ uri: previewDoc?.uri }} style={styles.previewImage} resizeMode="contain" />
              ) : (
                <View style={styles.previewPdfBox}>
                  <Ionicons name="document-attach" size={48} color={ICON_COLORS.accent} />
                  <View style={styles.previewBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={ICON_COLORS.verified} />
                    <Text style={styles.previewBadgeText}>Document Uploaded & Verified</Text>
                  </View>
                  <Text style={styles.previewFileName}>{previewDoc?.name}</Text>
                  <Text style={styles.previewMetaText}>Size: {previewDoc?.size}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.closePreviewBtn} onPress={() => setViewModalVisible(false)} activeOpacity={0.8}>
              <Text style={styles.closePreviewBtnText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PersonalLoanDocumentsStep;


