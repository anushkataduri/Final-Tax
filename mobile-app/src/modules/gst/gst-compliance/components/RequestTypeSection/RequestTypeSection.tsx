import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/shared/hooks/useTheme";
import { BrandColors } from "@/shared/theme";
import {
  ComplianceFormData,
  UploadedDocInfo,
  ValidationErrors,
} from "@/modules/gst/validation/complianceSchema";
import {
  RECONCILIATION_ALLOWED_EXTENSIONS,
  NOTICE_ALLOWED_EXTENSIONS,
} from "@/modules/gst/utils/gstValidation";
import { FileUploadCard } from "@/modules/gst/gst-compliance/components/FileUploadCard/FileUploadCard";
import { NativeDatePickerInput } from "@/modules/gst/gst-compliance/components/NativeDatePickerInput/NativeDatePickerInput";
import { FloatingLabelInput } from "@/modules/gst/gst-compliance/components/FloatingLabelInput/FloatingLabelInput";
import { styles } from "@/modules/gst/gst-compliance/components/RequestTypeSection/RequestTypeSection.styles";

export interface RequestTypeSectionProps {
  formData: ComplianceFormData;
  errors: ValidationErrors;
  onUpdateField: <K extends keyof ComplianceFormData>(
    field: K,
    value: ComplianceFormData[K]
  ) => void;
  onClearError: (field: keyof ValidationErrors) => void;
  onScrollField?: (fieldName: string) => void;
}

export const RequestTypeSection: React.FC<RequestTypeSectionProps> = ({
  formData,
  errors,
  onUpdateField,
  onClearError,
  onScrollField,
}) => {
  const { isDark } = useTheme();

  if (!formData.requestType) return null;

  const cardBg = isDark ? "#0F172A" : "#F8FAFC";

  if (formData.requestType === "Reconciliation Support") {
    return (
      <Animated.View
        entering={FadeInDown.duration(280)}
        exiting={FadeOutUp.duration(200)}
        style={styles.sectionContainer}
      >
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBox, isDark && styles.sectionIconBoxDark]}>
              <Ionicons name="git-compare-outline" size={18} color={BrandColors.PRIMARY_ORANGE} />
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={[styles.sectionMainTitle, isDark && styles.sectionMainTitleDark]}>
                Reconciliation Documents & Details
              </Text>
              <Text style={[styles.sectionSubtitle, isDark && styles.sectionSubtitleDark]}>
                Purchase & Sales registers against GSTR-2B
              </Text>
            </View>
          </View>

        {/* 1. Purchase Register (Required - Image 1 Card) */}
        <FileUploadCard
          title="Purchase Register"
          description="Upload purchase register or Excel/CSV records"
          required
          allowedExtensions={RECONCILIATION_ALLOWED_EXTENSIONS}
          uploadedDoc={formData.purchaseDoc}
          onDocChange={(doc: UploadedDocInfo | null) => {
            onUpdateField("purchaseDoc", doc);
            if (doc) onClearError("purchaseDoc");
          }}
          error={errors.purchaseDoc}
          onClearError={() => onClearError("purchaseDoc")}
        />

        {/* 2. Sales Register (Optional - Image 1 Card) */}
        <FileUploadCard
          title="Sales Register"
          description="Upload sales register or outward supplies statement (Optional)"
          required={false}
          allowedExtensions={RECONCILIATION_ALLOWED_EXTENSIONS}
          uploadedDoc={formData.salesDoc}
          onDocChange={(doc: UploadedDocInfo | null) => {
            onUpdateField("salesDoc", doc);
            if (doc) onClearError("salesDoc");
          }}
          error={errors.salesDoc}
          onClearError={() => onClearError("salesDoc")}
        />

        {/* 3. GSTR-2B Reference (Optional Floating Label) */}
        <FloatingLabelInput
          label="GSTR-2B Reference"
          floatingLabel="GSTR-2B Reference"
          placeholder="Enter GSTR-2B reference or ARN"
          value={formData.gstr2bRef}
          onChangeText={(text) => onUpdateField("gstr2bRef", text)}
          autoCapitalize="characters"
          cardBackground={cardBg}
          onClear={() => onUpdateField("gstr2bRef", "")}
          onFocusScroll={() => onScrollField?.("gstr2bRef")}
        />

        {/* 4. Remarks (Optional Floating Label Multiline) */}
        <FloatingLabelInput
          label="Remarks (Optional)"
          floatingLabel="Remarks (Optional)"
          placeholder="Tell us anything our CA should know..."
          value={formData.reconciliationRemarks}
          onChangeText={(text) => onUpdateField("reconciliationRemarks", text)}
          multiline
          numberOfLines={3}
          cardBackground={cardBg}
          onFocusScroll={() => onScrollField?.("reconciliationRemarks")}
        />
        </View>
      </Animated.View>
    );
  }

  // Notice Response Form
  return (
    <Animated.View
      entering={FadeInDown.duration(280)}
      exiting={FadeOutUp.duration(200)}
      style={styles.sectionContainer}
    >
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionIconBox, isDark && styles.sectionIconBoxDark]}>
            <Ionicons name="document-text-outline" size={18} color={BrandColors.PRIMARY_ORANGE} />
          </View>
          <View style={styles.sectionTitleWrap}>
            <Text style={[styles.sectionMainTitle, isDark && styles.sectionMainTitleDark]}>
              Notice Details & Documents
            </Text>
            <Text style={[styles.sectionSubtitle, isDark && styles.sectionSubtitleDark]}>
              Notice numbers, critical dates & notice copy
            </Text>
          </View>
        </View>

      {/* 1. Notice Number (Required Floating Label) */}
      <FloatingLabelInput
        label="Notice Number"
        floatingLabel="Notice Number"
        placeholder="Enter notice number"
        required
        value={formData.noticeNumber}
        onChangeText={(text) => {
          const formatted = text.replace(/[^a-zA-Z0-9\/-]/g, "").toUpperCase();
          onUpdateField("noticeNumber", formatted);
          if (formatted) onClearError("noticeNumber");
        }}
        autoCapitalize="characters"
        maxLength={30}
        error={errors.noticeNumber}
        cardBackground={cardBg}
        onClear={() => {
          onUpdateField("noticeNumber", "");
          onClearError("noticeNumber");
        }}
        onFocusScroll={() => onScrollField?.("noticeNumber")}
      />

      {/* 2. Notice Issue Date (Required) */}
      <NativeDatePickerInput
        label="Notice Issue Date"
        value={formData.noticeIssueDate}
        onChange={(date) => {
          onUpdateField("noticeIssueDate", date);
          onClearError("noticeIssueDate");
        }}
        required
        error={errors.noticeIssueDate}
        placeholder="Select Notice Issue Date"
      />

      {/* 3. Reply Due Date (Required) */}
      <NativeDatePickerInput
        label="Reply Due Date"
        value={formData.replyDueDate}
        onChange={(date) => {
          onUpdateField("replyDueDate", date);
          onClearError("replyDueDate");
        }}
        required
        error={errors.replyDueDate}
        placeholder="Select Reply Due Date"
      />

      {/* 4. Upload Notice Copy (Required - Image 1 Card) */}
      <FileUploadCard
        title="Upload Notice Copy"
        description="Upload official GST notice or assessment order"
        required
        allowedExtensions={NOTICE_ALLOWED_EXTENSIONS}
        uploadedDoc={formData.noticeDoc}
        onDocChange={(doc: UploadedDocInfo | null) => {
          onUpdateField("noticeDoc", doc);
          if (doc) onClearError("noticeDoc");
        }}
        error={errors.noticeDoc}
        onClearError={() => onClearError("noticeDoc")}
      />

      {/* 5. Remarks (Optional Floating Label Multiline) */}
      <FloatingLabelInput
        label="Remarks (Optional)"
        floatingLabel="Remarks (Optional)"
        placeholder="Add any important information for our CA"
        value={formData.noticeRemarks}
        onChangeText={(text) => onUpdateField("noticeRemarks", text)}
        multiline
        numberOfLines={3}
        cardBackground={cardBg}
        onFocusScroll={() => onScrollField?.("noticeRemarks")}
      />
      </View>
    </Animated.View>
  );
};

export default RequestTypeSection;
