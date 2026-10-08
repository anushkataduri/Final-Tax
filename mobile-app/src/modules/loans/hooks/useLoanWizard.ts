import { useCallback, useState } from "react";

export interface UseLoanWizardOptions {
  /** Number of steps in this loan's flow (differs per loan product). */
  totalSteps: number;
  /** Zero-based step to start on, e.g. a restored draft's step. Defaults to 0. */
  initialStepIndex?: number;
  /**
   * Called with the current step before moving forward. Return `false` to stay
   * on the step (the caller shows its own errors). Loan rules live here, not in the hook.
   */
  validateStep?: (stepIndex: number) => boolean;
  /** Called by `handleBack` on the first step, e.g. to leave the screen or open the draft prompt. */
  onExitFromFirstStep?: () => void;
  /** Called after every step change, e.g. to scroll the form back to the top. */
  onStepChange?: (stepIndex: number) => void;
}

export interface LoanWizard {
  /** Zero-based index of the active step. */
  currentStepIndex: number;
  totalSteps: number;
  /** One-based step number for display ("Step 2 of 5"). */
  stepNumber: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  /** 0–100, matching the linear `LoanStepIndicator` fill. */
  progressPercent: number;
  /** Validates the current step and advances. Returns `true` only when the step changed. */
  goToNextStep: () => boolean;
  goToPreviousStep: () => void;
  /** Jumps to `stepIndex`, clamped to the valid range. Does not run validation. */
  goToStep: (stepIndex: number) => void;
  /** Previous step, or `onExitFromFirstStep` when already on the first step. */
  handleBack: () => void;
  resetWizard: () => void;
}

const clampStep = (stepIndex: number, totalSteps: number): number =>
  Math.min(Math.max(0, stepIndex), Math.max(0, totalSteps - 1));

/**
 * Step navigation shared by the loan application flows.
 * Holds only the step index; form data, API calls and documents stay with the screen.
 */
export function useLoanWizard({
  totalSteps,
  initialStepIndex = 0,
  validateStep,
  onExitFromFirstStep,
  onStepChange,
}: UseLoanWizardOptions): LoanWizard {
  const [currentStepIndex, setCurrentStepIndex] = useState(() => clampStep(initialStepIndex, totalSteps));

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex >= totalSteps - 1;

  const goToStep = useCallback(
    (stepIndex: number) => {
      const nextIndex = clampStep(stepIndex, totalSteps);
      setCurrentStepIndex(nextIndex);
      onStepChange?.(nextIndex);
    },
    [totalSteps, onStepChange]
  );

  const goToNextStep = useCallback((): boolean => {
    if (isLastStep) return false;
    if (validateStep && !validateStep(currentStepIndex)) return false;
    goToStep(currentStepIndex + 1);
    return true;
  }, [isLastStep, validateStep, currentStepIndex, goToStep]);

  const goToPreviousStep = useCallback(() => {
    if (isFirstStep) return;
    goToStep(currentStepIndex - 1);
  }, [isFirstStep, currentStepIndex, goToStep]);

  const handleBack = useCallback(() => {
    if (isFirstStep) {
      onExitFromFirstStep?.();
      return;
    }
    goToStep(currentStepIndex - 1);
  }, [isFirstStep, onExitFromFirstStep, currentStepIndex, goToStep]);

  const resetWizard = useCallback(() => goToStep(0), [goToStep]);

  return {
    currentStepIndex,
    totalSteps,
    stepNumber: currentStepIndex + 1,
    isFirstStep,
    isLastStep,
    progressPercent: totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleBack,
    resetWizard,
  };
}

export default useLoanWizard;
