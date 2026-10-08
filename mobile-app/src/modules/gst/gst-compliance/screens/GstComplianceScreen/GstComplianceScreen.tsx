import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/shared/hooks/useTheme";
import { BrandColors } from "@/shared/theme";
import { ComplianceHeader } from "@/modules/gst/gst-compliance/components/ComplianceHeader/ComplianceHeader";
import {
  BottomSheetSelector,
  SelectorOption,
} from "@/modules/gst/gst-compliance/components/BottomSheetSelector/BottomSheetSelector";
import { RequestTypeSection } from "@/modules/gst/gst-compliance/components/RequestTypeSection/RequestTypeSection";
import { FloatingLabelInput } from "@/modules/gst/gst-compliance/components/FloatingLabelInput/FloatingLabelInput";
import { ComplianceConfirmModal } from "@/modules/gst/gst-compliance/components/ComplianceModals/ComplianceModals";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { GstComplianceReviewStep } from "@/modules/gst/gst-compliance/components/GstComplianceReviewStep/GstComplianceReviewStep";
import { useComplianceForm } from "@/modules/gst/gst-compliance/hooks/useComplianceForm";
import {
  styles,
  getRootBgStyle,
} from "@/modules/gst/gst-compliance/screens/GstComplianceScreen/GstComplianceScreen.styles";

const FINANCIAL_YEARS: SelectorOption[] = [
  { label: "2025-26", value: "2025-26", icon: "calendar-outline" },
  { label: "2024-25", value: "2024-25", icon: "calendar-outline" },
  { label: "2023-24", value: "2023-24", icon: "calendar-outline" },
  { label: "2022-23", value: "2022-23", icon: "calendar-outline" },
];

const REQUEST_TYPES: SelectorOption[] = [
  {
    label: "Reconciliation Support",
    value: "Reconciliation Support",
    icon: "git-compare-outline",
    subtitle: "Reconcile Purchase & Sales registers against GSTR-2B",
  },
  {
    label: "Notice Response",
    value: "Notice Response",
    icon: "document-text-outline",
    subtitle: "Expert CA response drafting for GST department notices",
  },
];

export function GstComplianceScreen() {
  const { isDark } = useTheme();

  const {
    currentStep,
    setCurrentStep,
    isEditMode,
    formData,
    errors,
    isSubmitting,
    isSaving,
    complianceId,
    dbReviewData,
    showConfirmModal,
    setShowConfirmModal,
    draftGuard,
    updateField,
    clearError,
    handleGstinChange,
    handleEditStep,
    handleContinue,
    handleBack,
    handleConfirmSubmit,
    getButtonText,
  } = useComplianceForm();

  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to top when switching steps
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentStep]);

  const handleScrollField = (fieldName: string) => {
    if (fieldName === "gstin") {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else if (fieldName === "gstr2bRef") {
      scrollViewRef.current?.scrollTo({ y: 320, animated: true });
    } else if (fieldName === "reconciliationRemarks") {
      scrollViewRef.current?.scrollTo({ y: 440, animated: true });
    } else if (fieldName === "noticeNumber") {
      scrollViewRef.current?.scrollTo({ y: 180, animated: true });
    } else if (fieldName === "noticeRemarks") {
      scrollViewRef.current?.scrollTo({ y: 520, animated: true });
    }
  };

  const [showFyModal, setShowFyModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);

  return (
    <View style={[styles.root, getRootBgStyle(isDark)]}>
      {/* Top Header Bar with ITR-style step indicator */}
      <ComplianceHeader
        title={currentStep === 1 ? "Review Compliance Request" : "GST Compliance"}
        currentStep={currentStep + 1}
        totalSteps={2}
        stepLabel={currentStep === 1 ? "Review & Submit" : "Request Details"}
        onBackPress={handleBack}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          bounces={false}
        >
          {/* Edit Mode Top Banner */}
          {isEditMode && currentStep === 0 && (
            <View
              style={[
                styles.editModeBanner,
                isDark && styles.editModeBannerDark,
              ]}
            >
              <View style={styles.editModeBannerLeft}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={isDark ? "#FED7AA" : "#C2410C"}
                />
                <Text
                  style={[
                    styles.editModeBannerText,
                    isDark && styles.editModeBannerTextDark,
                  ]}
                >
                  Editing Application Details
                </Text>
              </View>
              <TouchableOpacity
                style={styles.returnToReviewBtn}
                onPress={() => setCurrentStep(1)}
                activeOpacity={0.8}
              >
                <Text style={styles.returnToReviewBtnText}>Back to Review</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 0: Input Form & Upload Cards */}
          {currentStep === 0 && (
            <>
              {/* Business & Filing Details Card */}
              <View
                style={[
                  styles.card,
                  isDark ? styles.cardDark : styles.cardLight,
                ]}
              >
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconBox, isDark && styles.sectionIconBoxDark]}>
                    <Ionicons name="document-text-outline" size={18} color={BrandColors.PRIMARY_ORANGE} />
                  </View>
                  <View style={styles.sectionTitleWrap}>
                    <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                      Business & Filing Details
                    </Text>
                    <Text style={[styles.sectionSubtitle, isDark && styles.sectionSubtitleDark]}>
                      GSTIN, Financial Year & Request Type
                    </Text>
                  </View>
                </View>

                {/* 1. GSTIN Floating Label */}
                <FloatingLabelInput
                  label="GSTIN"
                  floatingLabel="GSTIN"
                  placeholder="Enter 15-character GSTIN"
                  required
                  value={formData.gstin}
                  onChangeText={handleGstinChange}
                  autoCapitalize="characters"
                  maxLength={15}
                  autoCorrect={false}
                  error={errors.gstin}
                  cardBackground={isDark ? "#1E293B" : BrandColors.WHITE}
                  rightElement={
                    formData.gstin.length === 15 && !errors.gstin ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#16A34A"
                      />
                    ) : null
                  }
                  onClear={() => {
                    updateField("gstin", "");
                    clearError("gstin");
                  }}
                  onFocusScroll={() => handleScrollField("gstin")}
                />

                {/* 2. Financial Year Selector */}
                <View style={styles.fieldGroup}>
                  <Text
                    style={[
                      styles.label,
                      isDark && styles.labelDark,
                    ]}
                  >
                    Financial Year <Text style={styles.star}>*</Text>
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowFyModal(true)}
                    style={[
                      styles.selectorBox,
                      isDark && styles.selectorBoxDark,
                      Boolean(errors.financialYear) && styles.selectorBoxError,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        isDark && styles.selectorTextDark,
                        !formData.financialYear &&
                          (isDark
                            ? styles.selectorPlaceholderDark
                            : styles.selectorPlaceholder),
                      ]}
                    >
                      {formData.financialYear || "Select Financial Year"}
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={isDark ? "#94A3B8" : "#64748B"}
                    />
                  </TouchableOpacity>
                  {errors.financialYear ? (
                    <Text style={styles.errorText}>
                      {errors.financialYear}
                    </Text>
                  ) : null}
                </View>

                {/* 3. Request Type Selector */}
                <View style={styles.fieldGroup}>
                  <Text
                    style={[
                      styles.label,
                      isDark && styles.labelDark,
                    ]}
                  >
                    Request Type <Text style={styles.star}>*</Text>
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowTypeModal(true)}
                    style={[
                      styles.selectorBox,
                      isDark && styles.selectorBoxDark,
                      Boolean(errors.requestType) && styles.selectorBoxError,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        isDark && styles.selectorTextDark,
                        !formData.requestType &&
                          (isDark
                            ? styles.selectorPlaceholderDark
                            : styles.selectorPlaceholder),
                      ]}
                    >
                      {formData.requestType || "Select Request Type"}
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={isDark ? "#94A3B8" : "#64748B"}
                    />
                  </TouchableOpacity>
                  {errors.requestType ? (
                    <Text style={styles.errorText}>{errors.requestType}</Text>
                  ) : null}
                </View>
              </View>

              {/* Dynamic Section (Reconciliation vs Notice Response + Image 1 Document Cards) */}
              <RequestTypeSection
                formData={formData}
                errors={errors}
                onUpdateField={updateField}
                onClearError={clearError}
                onScrollField={handleScrollField}
              />
            </>
          )}

          {/* Step 1: Review Application Screen with Edit Buttons */}
          {currentStep === 1 && (
            <GstComplianceReviewStep
              formData={formData}
              dbData={dbReviewData}
              complianceId={complianceId}
              onEditStep={handleEditStep}
            />
          )}

          {/* Primary Action Button (Continue / Update & Review / Submit) */}
          <View style={styles.submitWrapper}>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                (isSubmitting || isSaving) && styles.submitBtnDisabled,
              ]}
              activeOpacity={0.85}
              onPress={handleContinue}
              disabled={isSubmitting || isSaving}
            >
              {isSubmitting || isSaving ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>
                    {isSubmitting ? "Submitting Request..." : "Please wait..."}
                  </Text>
                </View>
              ) : (
                <Text style={styles.submitBtnText}>{getButtonText()}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Financial Year Selector Modal */}
      <BottomSheetSelector
        visible={showFyModal}
        title="Select Financial Year"
        options={FINANCIAL_YEARS}
        selectedValue={formData.financialYear}
        onSelect={(val) => {
          updateField("financialYear", val);
          clearError("financialYear");
        }}
        onClose={() => setShowFyModal(false)}
      />

      {/* Request Type Selector Modal */}
      <BottomSheetSelector
        visible={showTypeModal}
        title="Select Request Type"
        options={REQUEST_TYPES}
        selectedValue={formData.requestType}
        onSelect={(val) => {
          updateField(
            "requestType",
            val as "Reconciliation Support" | "Notice Response"
          );
          clearError("requestType");
        }}
        onClose={() => setShowTypeModal(false)}
      />

      {/* Confirmation Modal Before Submission */}
      <ComplianceConfirmModal
        visible={showConfirmModal}
        isDark={isDark}
        requestType={formData.requestType}
        gstin={formData.gstin}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
      />

      {/* Universal Draft Modal */}
      <UniversalDraftModal
        visible={draftGuard.showDraftModal}
        onSaveAndExit={draftGuard.handleSaveAndExit}
        onDiscardAndExit={draftGuard.handleDiscardAndExit}
        onCancel={draftGuard.handleCancel}
      />
    </View>
  );
}

export default GstComplianceScreen;
