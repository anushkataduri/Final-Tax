import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { KeyboardAwareScrollView } from "@/shared/components/KeyboardAwareFormLayout";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Step0CategorySelect } from "../../components/Step0CategorySelect/Step0CategorySelect";
import { ItrStepIndicator } from "../../components/ItrStepIndicator/ItrStepIndicator";
import { Step1PersonalInfo } from "../../components/Step1PersonalInfo/Step1PersonalInfo";
import { Step2IncomeSources } from "../../components/Step2IncomeSources/Step2IncomeSources";
import { Step4DocumentChecklist } from "../../components/Step4DocumentChecklist/Step4DocumentChecklist";
import { Step5TaxSummaryReview } from "../../components/Step5TaxSummaryReview/Step5TaxSummaryReview";
import { useITRStore } from "@/modules/itr/store/itrStore";
import { useApplicationStore } from "@/store/applicationStore";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { useItrFilingWorkflow } from "../../hooks/useItrFilingWorkflow";
import { styles } from "./ItrFilingScreen.styles";

export const ItrFilingScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<any>(null);

  // Store bindings
  const currentStep = useITRStore((state) => state.currentStep);
  const maxStepReached = useITRStore((state) => state.maxStepReached);
  const setStep = useITRStore((state) => state.setStep);
  const setBackendIds = useITRStore((state) => state.setBackendIds);
  const formData = useITRStore((state) => state.formData);

  const setCategory = useITRStore((state) => state.setCategory);
  const setPersonalInfo = useITRStore((state) => state.setPersonalInfo);
  const selectRefundBank = useITRStore((state) => state.selectRefundBank);
  const addBankAccount = useITRStore((state) => state.addBankAccount);
  const updateBankAccount = useITRStore((state) => state.updateBankAccount);
  const setPriorItrNotice = useITRStore((state) => state.setPriorItrNotice);
  const importPriorItrData = useITRStore((state) => state.importPriorItrData);
  const setIncomeSalary = useITRStore((state) => state.setIncomeSalary);
  const setIncomeHouseProperty = useITRStore((state) => state.setIncomeHouseProperty);
  const setIncomeBusiness = useITRStore((state) => state.setIncomeBusiness);
  const setIncomeCapitalGains = useITRStore((state) => state.setIncomeCapitalGains);
  const setIncomeOtherSources = useITRStore((state) => state.setIncomeOtherSources);
  const setDeclarationAccepted = useITRStore((state) => state.setDeclarationAccepted);
  const updateDocument = useITRStore((state) => state.updateDocument);

  const saveItrDraft = useITRStore((state) => state.saveItrDraft);
  const clearItrDraft = useITRStore((state) => state.clearItrDraft);
  const resetForm = useITRStore((state) => state.resetForm);

  const createApplication = useApplicationStore((state) => state.createApplication);

  const [isCategoryConfirmed, setIsCategoryConfirmed] = useState<boolean>(() => currentStep > 0);

  // Universal Draft Guard Hook
  const {
    showDraftModal,
    openDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () => {
      const hasIncome = formData.calculation.grossTotalIncome > 0;
      const hasDocs = formData.documents.some((d) => Boolean(d.fileUri));
      const hasCategory = Boolean(formData.category);
      const hasPersonal = Boolean(
        formData.personalInfo.assessmentYear ||
        formData.personalInfo.residentialStatus ||
        formData.personalInfo.filingType
      );
      return hasIncome || hasDocs || currentStep > 0 || isCategoryConfirmed || hasCategory || hasPersonal;
    },
    onSaveDraft: () => {
      saveItrDraft();
    },
    onDiscardDraft: () => {
      clearItrDraft();
      resetForm();
    },
    isSubmitted: () => currentStep >= 4,
  });

  const {
    isSubmitting,
    handleStep1Continue,
    handleStep1Update,
    handleStep2Continue,
    handleStep2Update,
    handleStep3Continue,
    handleStep3Update,
    handleSubmitApplication,
  } = useItrFilingWorkflow({
    formData,
    setStep,
    setBackendIds,
    createApplication,
    markSubmitted,
    clearItrDraft,
    resetForm,
  });

  // Scroll to top on step transition
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentStep]);

  // Restore saved draft and last saved step on entry, then sync profile
  useEffect(() => {
    async function init() {
      const restored = await useITRStore.getState().restoreItrDraft();
      if (restored) {
        const restoredStep = useITRStore.getState().currentStep;
        if (restoredStep > 0) {
          setIsCategoryConfirmed(true);
        }
      } else {
        useITRStore.getState().resetForm();
        setIsCategoryConfirmed(false);
      }
      await useITRStore.getState().fetchAndPopulateUserProfile();
    }
    init();
  }, []);

  const handleBack = useCallback(() => {
    if (!isCategoryConfirmed) {
      const hasData =
        formData.calculation.grossTotalIncome > 0 ||
        formData.documents.some((d) => Boolean(d.fileUri)) ||
        Boolean(formData.category) ||
        Boolean(formData.personalInfo.assessmentYear || formData.personalInfo.residentialStatus || formData.personalInfo.filingType);
      if (hasData) {
        openDraftModal();
      } else {
        router.back();
      }
      return;
    }
    if (currentStep > 0) {
      setStep(currentStep - 1);
    } else {
      setIsCategoryConfirmed(false);
    }
  }, [isCategoryConfirmed, formData, openDraftModal, router, currentStep, setStep]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        const hasData =
          currentStep > 0 ||
          isCategoryConfirmed ||
          Boolean(formData.category) ||
          formData.calculation.grossTotalIncome > 0 ||
          formData.documents.some((d) => Boolean(d.fileUri)) ||
          Boolean(formData.personalInfo.pan || formData.personalInfo.assessmentYear);
        if (hasData) {
          openDraftModal();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [currentStep, isCategoryConfirmed, formData, openDraftModal])
  );

  if (!isCategoryConfirmed) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <FocusAwareStatusBar barStyle="dark-content" />
        <View style={styles.categoryHeader}>
          {currentStep === 4 ? (
            <View style={styles.headerSpacer} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.headerLeftBtn}
              onPress={handleBack}
            >
              <Ionicons name="chevron-back" size={20} color="#0F172A" />
            </TouchableOpacity>
          )}
          <Text style={styles.categoryHeaderTitle}>ITR Filing</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerRightBtn}
            onPress={() =>
              Alert.alert("TaxEdge Support", "Need help with your ITR? Contact support@taxedge.in")
            }
          >
            <Ionicons name="settings-outline" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        <Step0CategorySelect
          selectedCategory={formData.category}
          accountType={formData.accountType}
          onSelectCategory={setCategory}
          onStartApplication={() => {
            setIsCategoryConfirmed(true);
            setStep(0);
          }}
        />

        <UniversalDraftModal
          visible={showDraftModal}
          onSaveAndExit={handleSaveAndExit}
          onDiscardAndExit={handleDiscardAndExit}
          onCancel={handleCancel}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FocusAwareStatusBar barStyle="dark-content" />

      {/* Top Header & Step Progress Bar */}
      <ItrStepIndicator
        currentStep={currentStep}
        totalSteps={4}
        stepTitle={formData.determinedForm.form}
        hideBackButton={maxStepReached >= 3 && currentStep < 3}
        onBack={handleBack}
        onSettings={() => Alert.alert("TaxEdge Support", "Need help with your ITR? Contact support@taxedge.in")}
        onSaveDraft={openDraftModal}
      />

      {/* Main Content Area */}
      <KeyboardAwareScrollView
        ref={scrollViewRef as any}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Personal Information, AY & Bank (Pre-filled from DB/GST) */}
        {currentStep === 0 && (
          <Step1PersonalInfo
            isLoading={isSubmitting}
            isEditing={maxStepReached >= 3}
            personalInfo={formData.personalInfo}
            onUpdatePersonalInfo={setPersonalInfo}
            bankDetails={formData.bankDetails}
            bankAccountsList={formData.bankAccountsList}
            onSelectRefundBank={selectRefundBank}
            onAddBankAccount={addBankAccount}
            onUpdateBankAccount={updateBankAccount}
            priorItrNotice={formData.priorItrNotice}
            onUpdatePriorItrNotice={setPriorItrNotice}
            onImportPriorItrData={importPriorItrData}
            onContinue={handleStep1Continue}
            onUpdateAndContinue={handleStep1Update}
          />
        )}

        {/* Step 2: Income Sources & Smart ITR Form Determination */}
        {currentStep === 1 && (
          <Step2IncomeSources
            isLoading={isSubmitting}
            isEditing={maxStepReached >= 3}
            sources={formData.incomeSources}
            determinedForm={formData.determinedForm}
            gstReconciliation={formData.gstReconciliation}
            category={formData.category}
            onSwitchCategory={setCategory}
            onUpdateSalary={setIncomeSalary}
            onUpdateHouseProperty={setIncomeHouseProperty}
            onUpdateBusiness={setIncomeBusiness}
            onUpdateCapitalGains={setIncomeCapitalGains}
            onUpdateOtherSources={setIncomeOtherSources}
            onContinue={handleStep2Continue}
            onUpdateAndContinue={handleStep2Update}
          />
        )}

        {/* Step 3: Dynamic Document Checklist & Upload */}
        {currentStep === 2 && (
          <Step4DocumentChecklist
            isLoading={isSubmitting}
            isEditing={maxStepReached >= 3}
            documents={formData.documents}
            onUpdateDocument={updateDocument}
            onContinue={handleStep3Continue}
            onUpdateAndContinue={handleStep3Update}
          />
        )}

        {/* Step 4: Tax Calculation Engine & Pre-Submission Review */}
        {currentStep === 3 && (
          <Step5TaxSummaryReview
            formData={formData}
            isSubmitting={isSubmitting}
            onEditStep={(stepIdx) => setStep(stepIdx)}
            onToggleDeclaration={setDeclarationAccepted}
            onSubmit={handleSubmitApplication}
          />
        )}
      </KeyboardAwareScrollView>

      {/* Universal Draft Guard Modal */}
      <UniversalDraftModal
        visible={showDraftModal}
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default ItrFilingScreen;
