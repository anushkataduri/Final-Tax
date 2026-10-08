import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { DocumentUploadBottomSheet } from "../../../../../shared/components/DocumentUploadBottomSheet";
import { LoanDocumentItem, LoanDocumentCategory } from "../../../types/loans.types";
import type { LoanDocuments } from "../../../hooks/useLoanDocuments";
import { DocumentPreviewModal } from "../../../components/DocumentPreviewModal";
import { getDocumentIconName } from "../../../utils/documentIcon";
import {
  styles,
  getProgressFillDynamic,
  getDocIconBoxDynamic,
} from "./PropertyLoanDocumentsStep.styles";

export interface PropertyLoanDocumentsStepProps {
  /** Document checklist state from `useLoanDocuments`, owned by the screen. */
  loanDocuments: LoanDocuments;
}

const CATEGORIES: LoanDocumentCategory[] = [
  "Property & Collateral",
  "Identity & Address",
  "Income & Banking",
  "Business & Tax",
  "Collateral & Others",
];

const ICON_COLORS = {
  uploaded: "#16A34A",
  view: "#2563EB",
  delete: "#DC2626",
} as const;

export const PropertyLoanDocumentsStep: React.FC<PropertyLoanDocumentsStepProps> = ({ loanDocuments }) => {
  const { documents, progress, openUpload, removeDocument, openPreview, uploadSheetProps, previewModalProps } =
    loanDocuments;
  const { uploadedRequired, totalRequired, requiredPercent } = progress;

  const handleDeleteDocument = (doc: LoanDocumentItem) => {
    Alert.alert(
      "Delete Document",
      `Are you sure you want to remove ${doc.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeDocument(doc.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Property Title & Financial Dossier</Text>
      <Text style={styles.sectionSubtitle}>
        Checklist for Loan Against Property. Upload title deeds, sanctioned plan, and tax returns.
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Mandatory Document Progress</Text>
          <Text style={styles.progressCount}>
            {uploadedRequired} of {totalRequired} ({requiredPercent}%)
          </Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={getProgressFillDynamic(requiredPercent)} />
        </View>
      </View>

      {/* Categorized Document List */}
      {CATEGORIES.map((category) => {
        const categoryDocs = documents.filter((d) => d.category === category);
        if (categoryDocs.length === 0) return null;

        const getCategoryIcon = (cat: string) => {
          switch (cat) {
            case "Property & Collateral":
              return "home";
            case "Identity & Address":
              return "person";
            case "Income & Banking":
              return "cash";
            case "Business & Tax":
              return "briefcase";
            default:
              return "document-text";
          }
        };

        return (
          <View key={category} style={styles.categoryContainer}>
            <View style={styles.categoryHeaderRow}>
              <View style={styles.categoryIconBox}>
                <Ionicons
                  name={getCategoryIcon(category)}
                  size={14}
                  color={BrandColors.PRIMARY_ORANGE || "#FF7A00"}
                />
              </View>
              <Text style={styles.categoryHeader}>{category}</Text>
            </View>
            {categoryDocs.map((doc) => {
              const isUploaded = Boolean(doc.fileUri);

              return (
                <View key={doc.id} style={[styles.docCard, isUploaded && styles.docCardUploaded]}>
                  <View style={styles.docLeft}>
                    <View style={[styles.iconBox, getDocIconBoxDynamic(doc.iconBg)]}>
                      <Ionicons
                        name={getDocumentIconName(doc.iconName)}
                        size={20}
                        color={doc.iconColor || BrandColors.PRIMARY_ORANGE}
                      />
                    </View>

                    <View style={styles.docInfo}>
                      <View style={styles.docNameRow}>
                        <Text style={styles.docName}>{doc.name}</Text>
                        {doc.required && <Text style={styles.starText}>*</Text>}
                      </View>

                      <Text style={styles.docSubtitle} numberOfLines={2}>
                        {doc.subtitle}
                      </Text>

                      {isUploaded && (
                        <View style={styles.fileMetaRow}>
                          <Ionicons name="checkmark-circle" size={14} color={ICON_COLORS.uploaded} />
                          <Text style={styles.fileNameText} numberOfLines={1}>
                            {doc.fileName || "Uploaded"}
                          </Text>
                          <Text style={styles.fileSizeText}>({doc.fileSize || "2.8 MB"})</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Actions Right */}
                  {isUploaded ? (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => openPreview(doc.id)}
                        style={styles.viewButton}
                      >
                        <Ionicons name="eye-outline" size={14} color={ICON_COLORS.view} />
                        <Text style={styles.viewButtonText}>View</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleDeleteDocument(doc)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={14} color={ICON_COLORS.delete} />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => openUpload(doc.id)}
                      style={styles.uploadButton}
                    >
                      <Ionicons name="cloud-upload-outline" size={14} color={BrandColors.PRIMARY_ORANGE} />
                      <Text style={styles.uploadButtonText}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}

      <DocumentUploadBottomSheet {...uploadSheetProps} />
      <DocumentPreviewModal {...previewModalProps} />
    </View>
  );
};

export default PropertyLoanDocumentsStep;
