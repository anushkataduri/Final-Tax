import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { DocumentUploadBottomSheet } from "../../../../../shared/components/DocumentUploadBottomSheet";
import type { LoanDocumentCategory } from "../../../types/loans.types";
import type { LoanDocuments } from "../../../hooks/useLoanDocuments";
import { getDocumentIconName } from "../../../utils/documentIcon";
import { getProgressWidth } from "../../../styles/loanScreenLayout.styles";
import { styles, getIconBoxBackground, MSME_DOC_SUCCESS_COLOR } from "./MsmeLoanDocumentsStep.styles";

export interface MsmeLoanDocumentsStepProps {
  /** Document checklist state from `useLoanDocuments`, owned by the screen. */
  loanDocuments: LoanDocuments;
}

const CATEGORIES: LoanDocumentCategory[] = [
  "Identity & Address",
  "Income & Banking",
  "Business & Tax",
  "Collateral & Others",
];

export const MsmeLoanDocumentsStep: React.FC<MsmeLoanDocumentsStepProps> = ({ loanDocuments }) => {
  const { documents, progress, openUpload, uploadSheetProps } = loanDocuments;
  const { uploadedRequired, totalRequired, requiredPercent } = progress;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MSME Enterprise Documents</Text>
      <Text style={styles.sectionSubtitle}>
        Upload Udyam registration certificate, GST returns, and current bank statements for priority sector evaluation.
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
          <View
            style={[
              styles.progressBarFill,
              requiredPercent === 100 && styles.progressBarFillComplete,
              getProgressWidth(requiredPercent),
            ]}
          />
        </View>
      </View>

      {/* Categorized Document List */}
      {CATEGORIES.map((category) => {
        const categoryDocs = documents.filter((d) => d.category === category);
        if (categoryDocs.length === 0) return null;

        return (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryHeader}>{category}</Text>
            {categoryDocs.map((doc) => {
              const isUploaded = Boolean(doc.fileUri);

              return (
                <View key={doc.id} style={[styles.docCard, isUploaded && styles.docCardUploaded]}>
                  <View style={styles.docLeft}>
                    <View style={[styles.iconBox, getIconBoxBackground(doc.iconBg)]}>
                      <Ionicons
                        name={getDocumentIconName(doc.iconName)}
                        size={20}
                        color={doc.iconColor || BrandColors.PRIMARY_BLUE}
                      />
                    </View>

                    <View style={styles.docInfo}>
                      <View style={styles.docNameRow}>
                        <Text style={styles.docName}>{doc.name}</Text>
                        {doc.required ? (
                          <View style={styles.requiredBadge}>
                            <Text style={styles.requiredText}>Required</Text>
                          </View>
                        ) : (
                          <View style={styles.optionalBadge}>
                            <Text style={styles.optionalText}>Optional</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.docSubtitle} numberOfLines={2}>
                        {doc.subtitle}
                      </Text>

                      {isUploaded && (
                        <View style={styles.fileMetaRow}>
                          <Ionicons name="checkmark-circle" size={14} color={MSME_DOC_SUCCESS_COLOR} />
                          <Text style={styles.fileNameText} numberOfLines={1}>
                            {doc.fileName || "Uploaded"}
                          </Text>
                          <Text style={styles.fileSizeText}>({doc.fileSize || "1.8 MB"})</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {isUploaded ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => openUpload(doc.id)}
                      style={styles.replaceButton}
                    >
                      <Ionicons name="refresh" size={14} color={MSME_DOC_SUCCESS_COLOR} />
                      <Text style={styles.replaceButtonText}>Replace</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => openUpload(doc.id)}
                      style={styles.uploadButton}
                    >
                      <Ionicons name="cloud-upload-outline" size={14} color={BrandColors.PRIMARY_BLUE} />
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
    </View>
  );
};

export default MsmeLoanDocumentsStep;
