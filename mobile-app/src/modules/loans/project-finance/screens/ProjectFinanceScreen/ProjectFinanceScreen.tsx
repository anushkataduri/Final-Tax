import React, { useRef, useCallback } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProjectFinanceSuccessModal } from "../../components";
import { ProjectFinanceStepRenderer } from "./ProjectFinanceStepRenderer";
import { useProjectFinanceState } from "./useProjectFinanceState";
import { validateStep1, validateStep2 } from "../../utils/projectFinanceValidators";
import { validateStep3, validateStep4 } from "../../utils/step3And4Validators";
import {
  validateStep5,
  validateStep6,
  validateStep7,
} from "../../utils/step5To7Validators";
import { useLoanWizard } from "../../../hooks/useLoanWizard";
import { LoanProgressHeader, LOAN_PROGRESS_CONFIG } from "@/shared/components/LoanProgressHeader";
import { LoanNavigation } from "@/shared/components/LoanNavigation";
import { getBottomBarPadding, getSafeAreaTopPadding } from "../../../styles/loanScreenLayout.styles";
import { styles } from "./ProjectFinanceScreen.styles";

const STEP_TITLES = LOAN_PROGRESS_CONFIG.projectFinance.steps;

export const ProjectFinanceScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const state = useProjectFinanceState();

  /** Runs the existing Project Finance validator for a step; returns its error message, if any. */
  const getStepError = (stepIndex: number): string | null => {
    switch (stepIndex) {
      case 0:
        return validateStep1({
          applicantDetails: state.applicantDetails,
          registeredAddress: state.registeredAddress,
          promoters: state.promoters,
          projectClassification: state.projectClassification,
        });
      case 1:
        return validateStep2({
          projectLocation: state.projectLocation,
          landDetails: state.landDetails,
          parcels: state.parcels,
          rightOfWay: state.rightOfWay,
          utilities: state.utilities,
          technicalDetails: state.technicalDetails,
          capacityProduction: state.capacityProduction,
          machineries: state.machineries,
          rawMaterials: state.rawMaterials,
          epcExecution: state.epcExecution,
          milestones: state.milestones,
          manpower: state.manpower,
        });
      case 2:
        return validateStep3({
          projectCost: state.projectCost,
          meansOfFinance: state.meansOfFinance,
          disbursementSchedule: state.disbursementSchedule,
        });
      case 3:
        return validateStep4({
          products: state.products,
          marketDetails: state.marketDetails,
          customers: state.customers,
          projectionSetup: state.projectionSetup,
          workingCapital: state.workingCapital,
        });
      case 4:
        // Step 3 totals feed the Step 5 checks (suggested loan, own contribution).
        return validateStep5({
          loanRequirement: state.loanRequirement,
          repaymentDetails: state.repaymentDetails,
          repaymentSources: state.repaymentSources,
          totalProjectCostFromScreen3: state.projectCost.totalProjectCost,
          ownContributionFromScreen3: state.meansOfFinance.promotersEquity,
        });
      case 5:
        return validateStep6({
          securities: state.securities,
          regulatoryCompliance: state.regulatoryCompliance,
        });
      case 6:
        return validateStep7({
          documents: state.documents,
          agreeAccuracy: state.agreeAccuracy,
          agreeVerification: state.agreeVerification,
        });
      default:
        return null;
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const err = getStepError(stepIndex);
    if (err) {
      Alert.alert("Missing / Invalid Information", err);
      return false;
    }
    return true;
  };

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const wizard = useLoanWizard({
    totalSteps: STEP_TITLES.length,
    validateStep,
    onExitFromFirstStep: () => router.back(),
    onStepChange: scrollToTop,
  });
  const { currentStepIndex } = wizard;

  // Last step: validate, then show the success modal (no API call, as before).
  const handleNextOrSubmit = () => {
    if (!wizard.isLastStep) {
      wizard.goToNextStep();
      return;
    }
    if (validateStep(currentStepIndex)) {
      state.setShowSuccessModal(true);
    }
  };

  return (
    <View style={[styles.safeArea, getSafeAreaTopPadding(insets.top)]}>
      {/* Unified Loan Progress Header */}
      <LoanProgressHeader
        title={LOAN_PROGRESS_CONFIG.projectFinance.title}
        currentStep={currentStepIndex + 1}
        totalSteps={STEP_TITLES.length}
        subtitle={STEP_TITLES[currentStepIndex]}
        onBack={wizard.handleBack}
      />

      <View style={styles.mainContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProjectFinanceStepRenderer
            currentStepIndex={currentStepIndex}
            state={state}
            setCurrentStepIndex={wizard.goToStep}
          />
        </ScrollView>

        {/* Sticky Bottom Action Bar */}
        <LoanNavigation
          onNext={handleNextOrSubmit}
          isFirstStep={wizard.isFirstStep}
          isLastStep={wizard.isLastStep}
          nextText={wizard.isLastStep ? "Submit Application" : "Save & Continue"}
          containerStyle={getBottomBarPadding(insets.bottom, 14)}
        />
      </View>

      {/* Success Modal */}
      <ProjectFinanceSuccessModal
        visible={state.showSuccessModal}
        onClose={() => {
          state.setShowSuccessModal(false);
          router.back();
        }}
      />
    </View>
  );
};

export default ProjectFinanceScreen;
