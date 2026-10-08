import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApplicationStore } from "@/store/applicationStore";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";

import { useGstAmendmentWorkflow } from "../../hooks/useGstAmendmentWorkflow";
import {
  GstAmendmentLanding,
  GstCoreAmendmentEdit,
  GstNonCoreAmendmentEdit,
  GstAmendmentReview,
  GstAmendmentSuccess,
  GstAmendmentPicker,
} from "../../components";

export function GstAmendmentScreen() {
  const insets = useSafeAreaInsets();
  const workflow = useGstAmendmentWorkflow();

  return (
    <>
      {workflow.currentStep === "LANDING" && (
        <GstAmendmentLanding
          gstin={workflow.gstin}
          onGstinChange={workflow.handleGstinChange}
          errorGstin={workflow.errors.gstin}
          onSelectSection={workflow.handleSelectSection}
          onBack={() => workflow.router.back()}
          scrollViewRef={workflow.scrollViewRef}
          insets={insets}
        />
      )}

      {workflow.currentStep === "EDIT" && workflow.selectedSection.type === "core" && (
        <GstCoreAmendmentEdit
          selectedSection={workflow.selectedSection}
          registeredDetails={workflow.registeredDetails}
          formData={workflow.formData}
          errors={workflow.errors}
          supportingDoc={workflow.supportingDoc}
          isProofsExpanded={workflow.isProofsExpanded}
          insets={insets}
          scrollViewRef={workflow.scrollViewRef}
          onBack={workflow.handleBackFromEdit}
          onUpdateField={workflow.updateFormField}
          onClearError={workflow.clearError}
          onOpenPicker={workflow.openPickerModal}
          onBrowseFiles={workflow.handleBrowseFiles}
          onScanFile={workflow.handleScanFile}
          onDeleteDoc={() => workflow.setSupportingDoc(null)}
          onToggleExpandProofs={() => workflow.setIsProofsExpanded((prev) => !prev)}
          onReviewChanges={workflow.handleReviewChanges}
          isEditMode={workflow.isEditMode}
          isSaving={workflow.isSavingRecord}
        />
      )}

      {workflow.currentStep === "EDIT" && workflow.selectedSection.type === "non-core" && (
        <GstNonCoreAmendmentEdit
          selectedSection={workflow.selectedSection}
          registeredDetails={workflow.registeredDetails}
          formData={workflow.formData}
          errors={workflow.errors}
          supportingDoc={workflow.supportingDoc}
          isProofsExpanded={workflow.isProofsExpanded}
          insets={insets}
          scrollViewRef={workflow.scrollViewRef}
          onBack={workflow.handleBackFromEdit}
          onUpdateField={workflow.updateFormField}
          onClearError={workflow.clearError}
          onOpenPicker={workflow.openPickerModal}
          onBrowseFiles={workflow.handleBrowseFiles}
          onScanFile={workflow.handleScanFile}
          onDeleteDoc={() => workflow.setSupportingDoc(null)}
          onToggleExpandProofs={() => workflow.setIsProofsExpanded((prev) => !prev)}
          onReviewChanges={workflow.handleReviewChanges}
          isEditMode={workflow.isEditMode}
          isSaving={workflow.isSavingRecord}
        />
      )}

      {workflow.currentStep === "REVIEW" && (
        <GstAmendmentReview
          gstin={workflow.gstin}
          selectedSection={workflow.selectedSection}
          formData={workflow.formData}
          registeredDetails={workflow.registeredDetails}
          supportingDoc={workflow.supportingDoc}
          declared={workflow.declared}
          onToggleDeclared={() => workflow.setDeclared((prev) => !prev)}
          isSubmitting={workflow.isSubmitting}
          insets={insets}
          scrollViewRef={workflow.scrollViewRef}
          onEdit={workflow.handleEditFromReview}
          onSubmit={workflow.handleSubmitAmendment}
          amendmentId={workflow.amendmentId}
          dbReviewData={workflow.dbReviewData}
        />
      )}

      {workflow.currentStep === "SUCCESS" && workflow.submissionResult && (
        <GstAmendmentSuccess
          submissionResult={workflow.submissionResult}
          insets={insets}
          onTrack={() => {
            if (workflow.submissionResult) {
              useApplicationStore.getState().setSelectedApplicationId(workflow.submissionResult.appId);
              workflow.router.push(`/application/${workflow.submissionResult.appId}`);
            }
          }}
          onOpenApplications={() => workflow.router.push("/(main)/applications")}
        />
      )}

      <GstAmendmentPicker
        pickerModal={workflow.pickerModal}
        onClose={workflow.closePickerModal}
      />

      <UniversalDraftModal
        visible={workflow.draftGuard.showDraftModal}
        title="Save Amendment Draft?"
        message="You have unsaved changes in your GST amendment request. Save your progress so you can resume anytime."
        saveButtonText="Save as Draft & Exit"
        discardButtonText="Discard & Exit"
        cancelButtonText="Keep Editing"
        onSaveAndExit={workflow.draftGuard.handleSaveAndExit}
        onDiscardAndExit={workflow.draftGuard.handleDiscardAndExit}
        onCancel={workflow.draftGuard.handleCancel}
      />
    </>
  );
}

export default GstAmendmentScreen;
