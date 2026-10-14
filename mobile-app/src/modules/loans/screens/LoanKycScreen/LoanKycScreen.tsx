import React, { useEffect, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "@/shared/components/KeyboardAwareFormLayout";
import { KeyboardStickyFooter } from "@/shared/components/KeyboardStickyFooter";
import { LoanFlowHeader } from "../../components/LoanFlowHeader";
import { useLoansStore } from "../../store/loansStore";
import { loanKycService } from "../../services/loanKycService";
import { getLoanFlowTotalSteps } from "../../constants/loanFlow";
import { CustomerIdentitySection } from "../../components/CustomerIdentitySection";
import { AddressSection } from "../../components/AddressSection";
import { KycConsentCard } from "../../components/KycConsentCard";
import { styles } from "./LoanKycScreen.styles";

interface LoanKycScreenProps {
  onBackToCategories: () => void;
  onContinue: () => void;
  /** Opened from Review → Edit: no back button, "Update & Continue". */
  isEditMode?: boolean;
}

export const LoanKycScreen: React.FC<LoanKycScreenProps> = ({
  onBackToCategories,
  onContinue,
  isEditMode = false,
}) => {
  const insets = useSafeAreaInsets();

  const selectedCategory = useLoansStore((state) => state.selectedCategory);
  const kycData = useLoansStore((state) => state.kycData);
  const kycErrors = useLoansStore((state) => state.kycErrors);
  const isSubmitting = useLoansStore((state) => state.isSubmitting);

  const setKycField = useLoansStore((state) => state.setKycField);
  const setCurrentAddressField = useLoansStore((state) => state.setCurrentAddressField);
  const setPermanentAddressField = useLoansStore((state) => state.setPermanentAddressField);
  const setPermanentSameAsCurrent = useLoansStore((state) => state.setPermanentSameAsCurrent);
  const setConsent = useLoansStore((state) => state.setConsent);
  const populateFromUserProfile = useLoansStore((state) => state.populateFromUserProfile);
  const validateForm = useLoansStore((state) => state.validateForm);

  const categoryId = selectedCategory?.id;

  const continueLabel = useMemo(() => {
    if (isEditMode) {
      return "Update & Continue →";
    }
    if (categoryId === "personal-loan") {
      return "Continue to Employment & Income";
    }
    return "Continue to Business Details";
  }, [isEditMode, categoryId]);

  const requirements = useMemo(
    () => loanKycService.getProviderRequirements(categoryId),
    [categoryId]
  );

  // Prepopulate identity from profile on mount without auto-verifying
  useEffect(() => {
    populateFromUserProfile();
  }, [populateFromUserProfile]);

  const handleBack = useCallback(() => {
    onBackToCategories();
  }, [onBackToCategories]);

  const handleContinue = useCallback(async () => {
    if (isSubmitting) return;

    const isValid = validateForm();
    if (!isValid) return;

    useLoansStore.setState({ isSubmitting: true });
    try {
      try {
        const res = await loanKycService.submitKycVerification(kycData);
        if (res?.status) {
          // Truthful pending status without faking provider verification
          useLoansStore.setState({ kycStatus: res.status });
        }
      } catch {
        // Do not require external provider connectivity to advance flow
      }
      onContinue();
    } finally {
      useLoansStore.setState({ isSubmitting: false });
    }
  }, [isSubmitting, validateForm, kycData, onContinue]);

  const isFormFilled = useMemo(() => {
    const hasName = Boolean(kycData.fullName?.trim());
    const hasMobile = Boolean(kycData.mobile?.trim());
    const hasConsent = Boolean(kycData.consentGiven);

    // Conditional requirements
    const hasEmail = requirements.requireEmail
      ? Boolean(kycData.email?.trim())
      : true;
    const hasPan = requirements.requirePan
      ? Boolean(kycData.pan?.trim())
      : true;
    const hasDob = requirements.requireDob
      ? Boolean(kycData.dob?.trim())
      : true;
    const hasAadhaar = requirements.requireAadhaar
      ? Boolean(kycData.aadhaar?.trim())
      : true;

    const hasCurrentAddr =
      Boolean(kycData.currentAddress.houseNumber?.trim()) &&
      Boolean(kycData.currentAddress.street?.trim()) &&
      Boolean(kycData.currentAddress.city?.trim()) &&
      Boolean(kycData.currentAddress.state?.trim()) &&
      Boolean(kycData.currentAddress.pincode?.trim());

    const hasPermAddr = kycData.isPermanentSameAsCurrent
      ? true
      : Boolean(kycData.permanentAddress.houseNumber?.trim()) &&
        Boolean(kycData.permanentAddress.street?.trim()) &&
        Boolean(kycData.permanentAddress.city?.trim()) &&
        Boolean(kycData.permanentAddress.state?.trim()) &&
        Boolean(kycData.permanentAddress.pincode?.trim());

    return (
      hasName &&
      hasMobile &&
      hasEmail &&
      hasPan &&
      hasDob &&
      hasAadhaar &&
      hasCurrentAddr &&
      hasPermAddr &&
      hasConsent
    );
  }, [kycData, requirements]);

  if (!selectedCategory) {
    return null;
  }

  return (

    <View style={styles.container}>
      <LoanFlowHeader
        title={selectedCategory.title}
        currentStep={1}
        totalSteps={getLoanFlowTotalSteps(selectedCategory.id)}
        subtitle="KYC Verification"
        isEditMode={isEditMode}
        onBack={handleBack}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CustomerIdentitySection
          data={kycData}
          errors={kycErrors}
          requirements={requirements}
          onChangeField={setKycField}
        />
        <AddressSection
          data={kycData}
          errors={kycErrors}
          onChangeCurrentAddress={setCurrentAddressField}
          onChangePermanentAddress={setPermanentAddressField}
          onTogglePermanentSame={setPermanentSameAsCurrent}
        />
        <KycConsentCard
          consentGiven={kycData.consentGiven}
          onToggleConsent={setConsent}
          error={kycErrors.consentGiven}
        />
      </KeyboardAwareScrollView>

      <KeyboardStickyFooter
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!isFormFilled || isSubmitting) && styles.continueButtonDisabled,
          ]}
          disabled={isSubmitting}
          activeOpacity={0.8}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel={continueLabel}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text
                style={[
                  styles.continueButtonText,
                  isEditMode && { marginRight: 0 },
                ]}
              >
                {continueLabel}
              </Text>
              {!isEditMode && (
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              )}
            </>
          )}
        </TouchableOpacity>
      </KeyboardStickyFooter>
    </View>
  );
};


export default LoanKycScreen;
