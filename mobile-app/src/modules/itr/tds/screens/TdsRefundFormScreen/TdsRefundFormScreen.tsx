import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { tdsCalculationService } from "../../services/tdsCalculationService";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { formatCurrency } from "../../utils/tdsValidation";
import {
  PersonalInfoSection,
  RefundBankAccountSection,
  IncomeTaxInfoSection,
  TdsTaxesPaidSection,
  TdsFormInputRefs,
} from "./TdsRefundFormSections";
import { useTdsProgressStore } from "../../store/tdsProgressStore";
import { styles } from "./TdsRefundFormScreen.styles";
import { useTdsRefundForm } from "./useTdsRefundForm";

export const TdsRefundFormScreen: React.FC = () => {
  const router = useRouter();
  const maxStepReached = useTdsProgressStore((s) => s.maxStepReached);
  const insets = useSafeAreaInsets();

  const {
    formData,
    errors,
    isIfscLoading,
    ifscError,
    isProfileLoading,
    profileFetchError,
    fetchAndPopulateProfile,
    handleSaveProfile,
    updateBank,
    updateIncome,
    handleIfscChange,
    handleContinue,
    draftGuard,
  } = useTdsRefundForm();

  const {
    showDraftModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = draftGuard;

  // Bank & Income Input refs
  const accHolderRef = useRef<TextInput>(null);
  const accNumRef = useRef<TextInput>(null);
  const confirmAccNumRef = useRef<TextInput>(null);
  const ifscRef = useRef<TextInput>(null);
  const salaryRef = useRef<TextInput>(null);
  const otherIncomeRef = useRef<TextInput>(null);
  const interestRef = useRef<TextInput>(null);
  const tdsRef = useRef<TextInput>(null);
  const tcsRef = useRef<TextInput>(null);
  const advanceTaxRef = useRef<TextInput>(null);
  const selfTaxRef = useRef<TextInput>(null);
  
  const inputRefs: TdsFormInputRefs = {
    accHolderRef,
    accNumRef,
    confirmAccNumRef,
    ifscRef,
    salaryRef,
    otherIncomeRef,
    interestRef,
    tdsRef,
    tcsRef,
    advanceTaxRef,
    selfTaxRef,
  };

  const liveCalculation = tdsCalculationService.calculate(formData);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Bar */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color={BrandColors.PRIMARY_BLUE_DARK} />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>TDS Refund</Text>
          <Text style={styles.headerSubtitle}>Step 1 of 5: Customer & Income</Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      {/* Main Form Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 85 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic Preliminary Estimate Pill */}
        <View style={styles.previewEstimateBanner}>
          <View style={styles.previewLeft}>
            <Text style={styles.previewLabel}>
              {liveCalculation.isAdditionalTaxPayable
                ? "Preliminary Tax Payable"
                : "Preliminary Estimated Refund"}
            </Text>
            <Text style={styles.previewAmount}>
              {liveCalculation.isAdditionalTaxPayable
                ? formatCurrency(liveCalculation.estimatedTaxPayable)
                : formatCurrency(liveCalculation.estimatedRefund)}
            </Text>
          </View>
          <View style={styles.previewRight}>
            <Text style={styles.previewTag}>AY 2025-26</Text>
          </View>
        </View>

        <PersonalInfoSection
          personal={formData.personal}
          isLoading={isProfileLoading}
          errorMessage={profileFetchError}
          onRetry={fetchAndPopulateProfile}
          onSaveProfile={handleSaveProfile}
        />

        <RefundBankAccountSection
          bank={formData.bank}
          errors={errors}
          inputs={inputRefs}
          isIfscLoading={isIfscLoading}
          ifscError={ifscError}
          updateBank={updateBank}
          onIfscChange={handleIfscChange}
        />

        <IncomeTaxInfoSection income={formData.income} inputs={inputRefs} updateIncome={updateIncome} />

        <TdsTaxesPaidSection
          income={formData.income}
          errors={errors}
          inputs={inputRefs}
          updateIncome={updateIncome}
        />
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 14 }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>{maxStepReached >= 3 ? "Update & Continue" : "Continue to Documents"}</Text>
          <Ionicons name="arrow-forward" size={18} color={BrandColors.WHITE} />
        </TouchableOpacity>
      </View>

      {/* Universal Save As Draft Confirmation Modal */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Application Progress?"
        message="You have unsaved changes in your TDS refund application. Save your progress so you can resume anytime without re-entering details."
        saveButtonText="Save as Draft & Exit"
        discardButtonText="Discard & Exit"
        cancelButtonText="Keep Editing"
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </KeyboardAvoidingView>
  );
};

export default TdsRefundFormScreen;


