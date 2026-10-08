import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/shared/hooks/useTheme";
import { BrandColors } from "@/shared/theme";
import {
  ComplianceFormData,
  UploadedDocInfo,
} from "@/modules/gst/validation/complianceSchema";
import { styles } from "@/modules/gst/gst-compliance/components/GstComplianceReviewStep/GstComplianceReviewStep.styles";

export interface GstComplianceReviewStepProps {
  formData: ComplianceFormData;
  dbData?: any;
  complianceId?: string | null;
  onEditStep: (section?: string) => void;
}

interface ReviewRowProps {
  label: string;
  value: string;
  isDark: boolean;
  multiline?: boolean;
  isMissing?: boolean;
}

const ReviewRow: React.FC<ReviewRowProps> = ({
  label,
  value,
  isDark,
  multiline = false,
  isMissing = false,
}) => (
  <View style={styles.row}>
    <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
    <Text
      style={[
        styles.value,
        isDark && styles.valueDark,
        multiline && styles.valueMultiline,
        isMissing && styles.valueMissing,
      ]}
      numberOfLines={multiline ? undefined : 1}
    >
      {value || "-"}
    </Text>
  </View>
);

export const GstComplianceReviewStep: React.FC<GstComplianceReviewStepProps> = ({
  formData,
  dbData,
  complianceId,
  onEditStep,
}) => {
  const { isDark } = useTheme();
  const [previewDoc, setPreviewDoc] = useState<UploadedDocInfo | null>(null);

  const displayRequestType = dbData?.requestType
    ? dbData.requestType === "RECONCILIATION_SUPPORT"
      ? "Reconciliation Support"
      : "Notice Response"
    : formData.requestType;

  const isRecon = displayRequestType === "Reconciliation Support";

  const renderEditButton = (section?: string) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onEditStep(section)}
      style={styles.editBtn}
    >
      <Ionicons name="pencil" size={12} color={BrandColors.PRIMARY_ORANGE} />
      <Text style={styles.editBtnText}>Edit</Text>
    </TouchableOpacity>
  );

  const renderDocRow = (
    title: string,
    doc: UploadedDocInfo | null,
    required: boolean = true
  ) => {
    const isUploaded = Boolean(doc);
    return (
      <View style={[styles.docRow, isDark && styles.docRowDark]}>
        <View style={styles.docLeft}>
          <View
            style={[
              styles.docIconWrap,
              !isUploaded && styles.docIconWrapEmpty,
            ]}
          >
            <Ionicons
              name={
                isUploaded
                  ? doc?.name.toLowerCase().endsWith(".pdf")
                    ? "document-text"
                    : "image"
                  : "alert-circle"
              }
              size={18}
              color={isUploaded ? "#16A34A" : "#EF4444"}
            />
          </View>
          <View style={styles.docTextCol}>
            <Text
              style={[styles.docTitleText, isDark && styles.docTitleTextDark]}
            >
              {title}
            </Text>
            {isUploaded && doc ? (
              <Text
                style={[styles.docMetaText, isDark && styles.docMetaTextDark]}
                numberOfLines={1}
              >
                {doc.name} ({doc.sizeFormatted})
              </Text>
            ) : (
              <Text style={styles.docStatusMissing}>
                {required ? "Missing (Required)" : "Not Attached (Optional)"}
              </Text>
            )}
          </View>
        </View>

        {isUploaded && doc ? (
          <TouchableOpacity
            style={[styles.docViewBtn, isDark && styles.docViewBtnDark]}
            activeOpacity={0.7}
            onPress={() => setPreviewDoc(doc)}
          >
            <Ionicons
              name="eye-outline"
              size={14}
              color={isDark ? "#93C5FD" : "#1D4ED8"}
            />
            <Text
              style={[
                styles.docViewBtnText,
                isDark && styles.docViewBtnTextDark,
              ]}
            >
              View
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. CA Readiness Banner */}
      <View style={[styles.readyCard, isDark && styles.readyCardDark]}>
        <View style={styles.readyIconBox}>
          <Ionicons name="shield-checkmark" size={18} color="#059669" />
        </View>
        <View style={styles.readyTextCol}>
          <Text style={[styles.readyHeading, isDark && styles.readyHeadingDark]}>
            Ready for CA Review & Filing
          </Text>
          <Text style={[styles.readySub, isDark && styles.readySubDark]}>
            TaxEdge CA compliance desk will verify your records and prepare the official response.
          </Text>
        </View>
      </View>

      {/* 2. Business & Compliance Summary Card */}
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
            Request & Filing Details
          </Text>
          {renderEditButton("details")}
        </View>
        <View style={[styles.divider, isDark && styles.dividerDark]} />

        <ReviewRow
          label="GSTIN"
          value={dbData?.gstin ?? formData.gstin}
          isDark={isDark}
        />
        <ReviewRow
          label="Financial Year"
          value={dbData?.financialYear ?? formData.financialYear}
          isDark={isDark}
        />
        <ReviewRow
          label="Request Type"
          value={displayRequestType}
          isDark={isDark}
        />
      </View>

      {/* 3. Section Specific Details Card */}
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
            {isRecon ? "Reconciliation Parameters" : "Notice Details"}
          </Text>
          {renderEditButton(isRecon ? "recon" : "notice")}
        </View>
        <View style={[styles.divider, isDark && styles.dividerDark]} />

        {isRecon ? (
          <>
            <ReviewRow
              label="GSTR-2B Ref / Period"
              value={dbData?.gstr2bNumber ?? formData.gstr2bRef ?? "Not specified"}
              isDark={isDark}
            />
            <ReviewRow
              label="Remarks"
              value={dbData?.message ?? formData.reconciliationRemarks ?? "None"}
              isDark={isDark}
              multiline
            />
          </>
        ) : (
          <>
            <ReviewRow
              label="Notice / Order No."
              value={dbData?.noticeNumber ?? formData.noticeNumber}
              isDark={isDark}
            />
            <ReviewRow
              label="Notice Issue Date"
              value={dbData?.noticeIssueDate ?? formData.noticeIssueDate}
              isDark={isDark}
            />
            <ReviewRow
              label="Reply Due Date"
              value={dbData?.replyDueDate ?? formData.replyDueDate}
              isDark={isDark}
            />
            <ReviewRow
              label="Remarks / Grounds"
              value={dbData?.message ?? formData.noticeRemarks ?? "None"}
              isDark={isDark}
              multiline
            />
          </>
        )}
      </View>

      {/* 4. Uploaded Documents Card */}
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
            Attached Documents
          </Text>
          {renderEditButton("documents")}
        </View>
        <View style={[styles.divider, isDark && styles.dividerDark]} />

        {isRecon ? (
          <>
            {renderDocRow("Purchase Register", formData.purchaseDoc, true)}
            {renderDocRow("Sales Register", formData.salesDoc, false)}
          </>
        ) : (
          renderDocRow("Notice Copy", formData.noticeDoc, true)
        )}
      </View>

      {/* 5. Document Preview Modal */}
      <Modal
        visible={Boolean(previewDoc)}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewDoc(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setPreviewDoc(null)}
        >
          <View
            style={[
              styles.previewCard,
              isDark && styles.previewCardDark,
            ]}
          >
            <View
              style={[
                styles.previewHeader,
                isDark && styles.previewHeaderDark,
              ]}
            >
              <Text
                style={[
                  styles.previewTitle,
                  isDark && styles.previewTitleDark,
                ]}
                numberOfLines={1}
              >
                {previewDoc?.name || "Document Preview"}
              </Text>
              <TouchableOpacity onPress={() => setPreviewDoc(null)}>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.previewContent}>
              {previewDoc &&
              (previewDoc.name.toLowerCase().endsWith(".jpg") ||
                previewDoc.name.toLowerCase().endsWith(".jpeg") ||
                previewDoc.name.toLowerCase().endsWith(".png")) ? (
                <Image
                  source={{ uri: previewDoc.uri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.pdfFallbackBox}>
                  <Ionicons
                    name="document-text"
                    size={56}
                    color={BrandColors.PRIMARY_BLUE_ACCENT}
                  />
                  <Text style={styles.pdfFallbackText}>
                    {previewDoc?.name}
                  </Text>
                  <Text style={styles.pdfFallbackText}>
                    Verified & ready for Chartered Accountant processing.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default GstComplianceReviewStep;
