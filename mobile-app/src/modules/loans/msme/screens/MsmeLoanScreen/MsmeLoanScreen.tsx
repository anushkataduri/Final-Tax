import React, { useCallback } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "@/shared/components/KeyboardAwareFormLayout";
import { KeyboardStickyFooter } from "@/shared/components/KeyboardStickyFooter";
import { LoanFlowHeader } from "../../../components/LoanFlowHeader";
import { getContinueLabel } from "../../../constants/continueLabels";
import { getLoanFlowTotalSteps } from "../../../constants/loanFlow";
import { useLoansStore } from "../../../store/loansStore";
import { MsmeBusinessDetailsSection } from "./MsmeBusinessDetailsSection";
import { MsmeBusinessActivitySection } from "./MsmeBusinessActivitySection";
import { MsmeAddressSection } from "./MsmeAddressSection";
import { MsmeRegistrationSection } from "./MsmeRegistrationSection";
import { MsmeBusinessInfoSection } from "./MsmeBusinessInfoSection";
import { styles } from "./MsmeLoanScreen.styles";

export interface MsmeLoanScreenProps {
  onBackToKyc: () => void;
  onContinue: () => void;
  isEditMode?: boolean;
  isRevisit?: boolean;
}

export const MsmeLoanScreen: React.FC<MsmeLoanScreenProps> = ({
  onBackToKyc,
  onContinue,
  isEditMode = false,
  isRevisit = false,
}) => {
  const insets = useSafeAreaInsets();
  const form = useLoansStore((state) => state.msmeFormData);
  const errors = useLoansStore((state) => state.msmeErrors);
  const setField = useLoansStore((state) => state.setMsmeLoanField);
  const setAddressField = useLoansStore((state) => state.setMsmeAddressField);
  const validateForm = useLoansStore((state) => state.validateMsmeLoanForm);

  const handleContinue = useCallback(() => {
    if (validateForm()) onContinue();
  }, [onContinue, validateForm]);

  const continueLabel = getContinueLabel(isEditMode || isRevisit, "Continue →");

  return (
    <View style={styles.container}>
      <LoanFlowHeader
        title="MSME Loan"
        currentStep={2}
        totalSteps={getLoanFlowTotalSteps("msme-loan")}
        subtitle="MSME & Business Details"
        isEditMode={isEditMode}
        onBack={onBackToKyc}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MsmeBusinessDetailsSection
          form={form}
          errors={errors}
          setField={setField}
        />
        <MsmeBusinessActivitySection
          form={form}
          errors={errors}
          setField={setField}
        />
        <MsmeAddressSection
          address={form.operatingAddress}
          errors={errors}
          setAddressField={setAddressField}
        />
        <MsmeRegistrationSection
          form={form}
          errors={errors}
          setField={setField}
        />
        <MsmeBusinessInfoSection
          form={form}
          errors={errors}
          setField={setField}
        />
      </KeyboardAwareScrollView>

      <KeyboardStickyFooter>
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={continueLabel}
          >
            <Text style={styles.continueButtonText}>{continueLabel}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardStickyFooter>
    </View>
  );
};

export default MsmeLoanScreen;
