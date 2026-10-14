import React, { useCallback, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { LoanCategoryCard } from "../../components/LoanCategoryCard";
import { LoansHeader } from "../../components/LoansHeader";
import { LOAN_CATEGORIES } from "../../constants/loanCategories";
import type { LoanCategory } from "../../types/loanCategory.types";
import { useLoansStore, type LoanStep } from "../../store/loansStore";
import { LoanKycScreen } from "../LoanKycScreen";
import { BusinessLoanScreen } from "../../businessWorkingCapital";
import { PersonalLoanScreen } from "../../personalLoan";
import { LoanDocumentUploadScreen } from "../LoanDocumentUploadScreen";
import { LoanReviewScreen } from "../LoanReviewScreen";
import { LoanUnderReviewScreen } from "../LoanUnderReviewScreen";
import { styles } from "./LoansMainScreen.styles";

/** Steps in which the customer may have unsaved work. */
const IN_PROGRESS_STEPS: readonly LoanStep[] = [
  "kyc",
  "business-details",
  "personal-employment",
  "documents",
  "review",
];

export const LoansMainScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const selectedCategory = useLoansStore((state) => state.selectedCategory);
  const activeStep = useLoansStore((state) => state.activeStep);
  const selectCategory = useLoansStore((state) => state.selectCategory);
  const returnToReview = useLoansStore((state) => state.returnToReview);
  const setActiveStep = useLoansStore((state) => state.setActiveStep);
  const editFromReview = useLoansStore((state) => state.editFromReview);
  const advanceTo = useLoansStore((state) => state.advanceTo);
  const retreatTo = useLoansStore((state) => state.retreatTo);
  const resetAll = useLoansStore((state) => state.resetAll);

  // Shared TaxEdge "Save as Draft & Exit / Discard & Exit / Keep Editing" prompt.
  // The application lives in the loans store, so saving keeps it there for this session.
  const draftGuard = useUniversalDraftGuard({
    isDirty: () => IN_PROGRESS_STEPS.includes(useLoansStore.getState().activeStep),
    onSaveDraft: () => undefined,
    onDiscardDraft: resetAll,
    isSubmitted: () => useLoansStore.getState().activeStep === "submitted",
  });

  // A finished application must not reappear the next time Loans is opened.
  useEffect(
    () => () => {
      if (useLoansStore.getState().activeStep === "submitted") {
        useLoansStore.getState().resetAll();
      }
    },
    []
  );

  const handleCategoryPress = useCallback(
    (category: LoanCategory) => {
      selectCategory(category);
    },
    [selectCategory]
  );

  const handleDone = useCallback(() => {
    draftGuard.markSubmitted();
    resetAll();
    router.replace("/(main)/home");
  }, [draftGuard, resetAll, router]);

  const renderStep = (): React.ReactElement => {
    if (selectedCategory) {
      switch (activeStep) {
        case "kyc":
          return (
            <LoanKycScreen
              onBackToCategories={() => retreatTo("categories")}
              onContinue={() =>
                advanceTo(
                  selectedCategory.id === "personal-loan"
                    ? "personal-employment"
                    : "business-details"
                )
              }
              isEditMode={returnToReview}
            />
          );
        case "personal-employment":
          return (
            <PersonalLoanScreen
              onBackToKyc={() => retreatTo("kyc")}
              onContinue={() => advanceTo("documents")}
              isEditMode={returnToReview}
            />
          );
        case "business-details":
          return (
            <BusinessLoanScreen
              onBackToKyc={() => retreatTo("kyc")}
              onContinue={() => advanceTo("documents")}
              isEditMode={returnToReview}
            />
          );
        case "documents":
          return (
            <LoanDocumentUploadScreen
              onBackToBusinessDetails={() =>
                retreatTo(
                  selectedCategory.id === "personal-loan"
                    ? "personal-employment"
                    : "business-details"
                )
              }
              onContinue={() => advanceTo("review")}
              isEditMode={returnToReview}
            />
          );
        case "review":
          return (
            <LoanReviewScreen
              onBack={() => setActiveStep("documents")}
              onEditKyc={() => editFromReview("kyc")}
              onEditBusiness={() =>
                editFromReview(
                  selectedCategory.id === "personal-loan"
                    ? "personal-employment"
                    : "business-details"
                )
              }
              onEditDocuments={() => editFromReview("documents")}
              onSubmitSuccess={() => setActiveStep("submitted")}
            />
          );
        case "submitted":
          return (
            <LoanUnderReviewScreen
              onContactSupport={() => router.push("/chat/support")}
              onDone={handleDone}
            />
          );
        default:
          break;
      }
    }

    return (
      <View style={styles.container}>
        <LoansHeader onBack={() => router.back()} />
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardList}>
            {LOAN_CATEGORIES.map((category) => (
              <LoanCategoryCard
                key={category.id}
                category={category}
                onPress={handleCategoryPress}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      {renderStep()}
      <UniversalDraftModal
        visible={draftGuard.showDraftModal}
        title="Save Loan Application?"
        message="Save your progress so you can continue your loan application without re-entering details."
        onSaveAndExit={draftGuard.handleSaveAndExit}
        onDiscardAndExit={draftGuard.handleDiscardAndExit}
        onCancel={draftGuard.handleCancel}
      />
    </>
  );
};

export default LoansMainScreen;
