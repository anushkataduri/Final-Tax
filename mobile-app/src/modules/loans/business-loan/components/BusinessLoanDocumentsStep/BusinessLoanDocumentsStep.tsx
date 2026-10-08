import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal, Alert, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LoanDocumentItem, LoanDetailsFormData, LoanBusinessFormData } from "../../../types/loans.types";
import type { LoanDocuments } from "../../../hooks/useLoanDocuments";
import { DocumentUploadBottomSheet } from "../../../../../shared/components/DocumentUploadBottomSheet";
import { BrandColors } from "../../../../../shared/theme";
import {
  getApplicableBusinessDocuments,
  BusinessDocItemConfig,
  ID_ALIASES,
} from "../../constants/businessLoanDocuments";
import { styles } from "./BusinessLoanDocumentsStep.styles";

export interface BusinessLoanDocumentsStepProps {
  /** Document checklist state from `useLoanDocuments`, owned by the screen. */
  loanDocuments: LoanDocuments;
  /** Step 1 loan details to evaluate conditional requirements (e.g. loan purpose). */
  loanDetails?: LoanDetailsFormData;
  /** Step 2 business details to evaluate constitution and GST status. */
  businessDetails?: LoanBusinessFormData;
}

const ICON_COLORS = {
  accent: BrandColors.PRIMARY_ORANGE,
  view: BrandColors.TEXT_PRIMARY,
  delete: "#DC2626",
  close: BrandColors.TEXT_SECONDARY,
  verified: "#166534",
} as const;

export const BusinessLoanDocumentsStep: React.FC<BusinessLoanDocumentsStepProps> = ({
  loanDocuments,
  loanDetails,
  businessDetails,
}) => {
  const { documents, openUpload, removeDocument, uploadSheetProps } = loanDocuments;
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    uri: string;
    name: string;
    size: string;
  } | null>(null);

  // Dynamically compute the concise core + conditional document checklist
  const applicableDocs = useMemo(
    () => getApplicableBusinessDocuments({ loanDetails, businessDetails }),
    [loanDetails, businessDetails]
  );

  const requiredDocs = useMemo(
    () => applicableDocs.filter((doc) => doc.section === "required"),
    [applicableDocs]
  );

  const conditionalDocs = useMemo(
    () => applicableDocs.filter((doc) => doc.section === "conditional"),
    [applicableDocs]
  );

  const findUploadedDoc = (itemId: string): LoanDocumentItem | undefined => {
    const aliases = ID_ALIASES[itemId] || [itemId, itemId.replace(/^doc-/, ""), `doc-${itemId}`];
    return documents.find(
      (d) =>
        aliases.includes(d.id) ||
        aliases.includes(d.id.replace(/^doc-/, ""))
    );
  };

  const resolveDocumentId = (itemId: string): string => {
    const found = findUploadedDoc(itemId);
    if (found) return found.id;
    const aliases = ID_ALIASES[itemId] || [itemId];
    const matchInChecklist = documents.find((d) => aliases.includes(d.id));
    return matchInChecklist?.id ?? itemId;
  };

  const handleOpenUploadSheet = (item: BusinessDocItemConfig) => {
    openUpload(resolveDocumentId(item.id), item.title);
  };

  const handleView = (item: BusinessDocItemConfig) => {
    const docRecord = findUploadedDoc(item.id);
    if (!docRecord?.fileUri) return;

    setPreviewDoc({
      title: item.title,
      uri: docRecord.fileUri,
      name: docRecord.fileName || `${item.title.replace(/\s+/g, "_")}.pdf`,
      size: docRecord.fileSize || "Verified",
    });
    setViewModalVisible(true);
  };

  const handleDeleteFile = (docId: string, docTitle: string) => {
    Alert.alert(
      "Delete Document",
      `Are you sure you want to delete ${docTitle}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeDocument(resolveDocumentId(docId)),
        },
      ]
    );
  };

  const isImageUri = (uri?: string) => {
    if (!uri) return false;
    const lower = uri.toLowerCase();
    return (
      lower.includes("ph://") ||
      lower.includes("content://") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".jpeg")
    );
  };

  const renderDocCard = (item: BusinessDocItemConfig) => {
    const docRecord = findUploadedDoc(item.id);
    const isUploaded = Boolean(docRecord?.fileUri && docRecord.fileUri.trim() !== "");

    return (
      <View key={item.id} style={styles.docCard}>
        <View style={styles.docCardLeft}>
          <View style={[styles.iconSquare, styles[item.iconStyle]]}>
            <Ionicons name={item.iconName} size={18} color={item.iconColor} />
          </View>

          <View style={styles.docTextCol}>
            <View style={styles.docTitleRow}>
              <Text style={styles.docTitle}>{item.title}</Text>
              {item.isRequired && <Text style={styles.requiredStar}>*</Text>}
              {item.isOptional && (
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
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleView(item)}
                style={styles.viewBtn}
              >
                <Ionicons name="eye-outline" size={13} color={ICON_COLORS.view} />
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleDeleteFile(item.id, item.title)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={13} color={ICON_COLORS.delete} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleOpenUploadSheet(item)}
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

  const uploadedRequiredCount = requiredDocs.filter((d) => {
    const doc = findUploadedDoc(d.id);
    return Boolean(doc?.fileUri && doc.fileUri.trim() !== "");
  }).length;

  const uploadedConditionalCount = conditionalDocs.filter((d) => {
    const doc = findUploadedDoc(d.id);
    return Boolean(doc?.fileUri && doc.fileUri.trim() !== "");
  }).length;

  return (
    <View style={styles.container}>
      {/* Top Header Row */}
      <View style={styles.topHeaderRow}>
        <View style={styles.titleCol}>
          <Text style={styles.sectionTitle}>Document Verification</Text>
          <Text style={styles.sectionSubtitle}>
            Upload required documents based on your business constitution and loan purpose.
          </Text>
        </View>

        <View style={styles.formatsNoticeBox}>
          <Ionicons name="information-circle-outline" size={14} color={ICON_COLORS.accent} />
          <Text style={styles.formatsNoticeText}>
            Accepted: PDF, JPG, PNG{"\n"}Max file size: 5 MB
          </Text>
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

      {/* 2. Conditional & Supporting Documents Section */}
      {conditionalDocs.length > 0 && (
        <>
          <View style={styles.sectionDivider}>
            <Text style={styles.sectionDividerTitle}>Conditional Documents</Text>
            <View style={styles.sectionDividerBadge}>
              <Text style={styles.sectionDividerBadgeText}>
                {uploadedConditionalCount} / {conditionalDocs.length} Uploaded
              </Text>
            </View>
          </View>

          {conditionalDocs.map(renderDocCard)}
        </>
      )}

      {/* Upload sheet: Files/Drive (PDF, Word, Excel), Gallery, Camera */}
      <DocumentUploadBottomSheet {...uploadSheetProps} />

      {/* Document View / Preview Modal */}
      <Modal
        visible={viewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewModalVisible(false)}
      >
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
                <Image
                  source={{ uri: previewDoc?.uri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
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

            <TouchableOpacity
              style={styles.closePreviewBtn}
              onPress={() => setViewModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.closePreviewBtnText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BusinessLoanDocumentsStep;
