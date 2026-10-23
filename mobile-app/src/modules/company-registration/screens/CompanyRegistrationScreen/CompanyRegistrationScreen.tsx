import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from '@/shared/components/KeyboardAwareFormLayout';
import { KeyboardStickyFooter } from '@/shared/components/KeyboardStickyFooter';
import { LoanStepIndicator } from '@/shared/components/LoanStepIndicator';
import { UniversalDraftModal } from '@/shared/components/UniversalDraftModal';
import { useUniversalDraftGuard } from '@/shared/hooks/useUniversalDraftGuard';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { LinearGradient } from 'expo-linear-gradient';

import { StepCompanyType } from '../../components/steps/StepCompanyType';
import { StepCombinedDetails } from '../../components/steps/StepCombinedDetails';
import { StepRegisteredOffice } from '../../components/steps/StepRegisteredOffice';
import { StepPromoters } from '../../components/steps/StepPromoters';
import { StepCapitalShareholding } from '../../components/steps/StepCapitalShareholding';
import { StepDocumentsKYC } from '../../components/steps/StepDocumentsKYC';
import { StepReviewApplication } from '../../components/steps/StepReviewApplication';
import { StepSubmissionSuccess } from '../../components/steps/StepSubmissionSuccess';
import { useCompanyRegistrationHandlers } from './useCompanyRegistrationHandlers';
import { styles } from './CompanyRegistrationScreen.styles';

const STEP_NAMES = [
  'Company Structure',
  'Company Details & Names',
  'Registered Office Details',
  'Promoter / Director Details',
  'Shareholding & Capital',
  'Documents & KYC Checklist',
  'Review Application',
  'Submission Success',
];

export const CompanyRegistrationScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const draft = useCompanyRegistrationStore((state) => state.draft);
  const setStep = useCompanyRegistrationStore((state) => state.setStep);
  const editingStep = useCompanyRegistrationStore((state) => state.editingStep);
  const startEditingStep = useCompanyRegistrationStore((state) => state.startEditingStep);
  const clearEditingStep = useCompanyRegistrationStore((state) => state.clearEditingStep);
  const submitRegistrationSuccess = useCompanyRegistrationStore((state) => state.submitRegistrationSuccess);
  const resetRegistration = useCompanyRegistrationStore((state) => state.resetRegistration);
  const setFieldErrors = useCompanyRegistrationStore((state) => state.setFieldErrors);
  const registrationId = useCompanyRegistrationStore((state) => state.registrationId);
  const setRegistrationId = useCompanyRegistrationStore((state) => state.setRegistrationId);
  const registeredOfficeId = useCompanyRegistrationStore((state) => state.registeredOfficeId);
  const setRegisteredOfficeId = useCompanyRegistrationStore((state) => state.setRegisteredOfficeId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = draft.currentStep;
  const totalSteps = STEP_NAMES.length;
  const isEditing = editingStep !== null && editingStep === currentStep;

  useEffect(() => {
    const initialDraftState = useCompanyRegistrationStore.getState().draft;
    if (initialDraftState.status === 'Submitted' || initialDraftState.currentStep === 7) {
      resetRegistration();
    }
    return () => {
      clearEditingStep();
      const currentDraftState = useCompanyRegistrationStore.getState().draft;
      if (currentDraftState.status === 'Submitted' || currentDraftState.currentStep === 7) {
        useCompanyRegistrationStore.getState().resetRegistration();
      }
    };
  }, [clearEditingStep, resetRegistration]);

  const { showDraftModal, handleSaveAndExit, handleDiscardAndExit, handleCancel } =
    useUniversalDraftGuard({
      isDirty: () => currentStep > 0 || !!draft.company.companyType,
      onSaveDraft: () => { clearEditingStep(); },
      onDiscardDraft: () => { resetRegistration(); },
      isSubmitted: () => draft.status === 'Submitted' || currentStep === 7,
      discardDestination: '/(main)/home',
    });

  const { handleNext, handleUpdateAndContinue } = useCompanyRegistrationHandlers({
    draft,
    currentStep,
    totalSteps,
    isEditing,
    isSubmitting,
    setIsSubmitting,
    registrationId,
    registeredOfficeId,
    setRegistrationId,
    setRegisteredOfficeId,
    setFieldErrors,
    startEditingStep,
    clearEditingStep,
    submitRegistrationSuccess,
    setStep,
  });

  const handleHeaderBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <StepCompanyType />;
      case 1: return <StepCombinedDetails />;
      case 2: return <StepRegisteredOffice />;
      case 3: return <StepPromoters />;
      case 4: return <StepCapitalShareholding />;
      case 5: return <StepDocumentsKYC />;
      case 6: return <StepReviewApplication />;
      case 7: return <StepSubmissionSuccess />;
      default: return <StepCompanyType />;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LoanStepIndicator
        variant="linear"
        title="Company Incorporation"
        subtitle={STEP_NAMES[currentStep] || ''}
        currentStepIndex={currentStep}
        totalSteps={totalSteps}
        onBack={currentStep >= 6 || isEditing ? undefined : handleHeaderBack}
        onSettings={() =>
          Alert.alert(
            "Company Incorporation Assistance",
            "Need help with your incorporation application? Contact support@taxedge.in or your assigned compliance officer."
          )
        }
      />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </KeyboardAwareScrollView>

      {currentStep < 7 && (
        <KeyboardStickyFooter style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16), justifyContent: 'flex-end' }]}>
          {isEditing ? (
            <TouchableOpacity
              style={[styles.updateBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleUpdateAndContinue}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF8A00', '#FF5500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <View style={styles.btnContentRow}>
                    <Text style={styles.updateBtnText}>Update and Continue</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={styles.btnIcon} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleNext}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF8A00', '#FF5500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.nextBtnText}>
                    {currentStep === 6 ? 'Submit Application' : 'Continue →'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </KeyboardStickyFooter>
      )}

      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Filing Progress?"
        message="You have unsaved changes in your application. Save your progress so you can resume anytime without re-entering details."
        saveButtonText="Save as Draft & Exit"
        discardButtonText="Discard & Exit"
        cancelButtonText="Keep Editing"
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default CompanyRegistrationScreen;
