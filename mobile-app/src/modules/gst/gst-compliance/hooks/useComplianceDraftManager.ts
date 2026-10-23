import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ComplianceFormData } from "@/modules/gst/validation/complianceSchema";
import { useAuthStore } from "@/store/authStore";
import { addDraftToIndex, removeDraftFromIndex } from "@/shared/hooks/useServiceDraft";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { logger } from "@/core/logging/logger";

export function getDraftKey(mobile: string): string {
  return `@taxedge_draft_${mobile}_gst-compliance`;
}

export function getCleanMobile(): string {
  const authState = useAuthStore.getState();
  const mobile =
    authState.customer?.mobile ||
    authState.authenticatedUser?.mobileNumber ||
    authState.mobileNumber;
  return mobile ? String(mobile).replace(/\D/g, "") : "";
}

const initialFormData: ComplianceFormData = {
  gstin: "", financialYear: "", requestType: "",
  purchaseDoc: null, salesDoc: null, noticeDoc: null,
  gstr2bRef: "", reconciliationRemarks: "",
  noticeNumber: "", noticeIssueDate: "", replyDueDate: "", noticeRemarks: "",
};

interface UseDraftManagerParams {
  formData: ComplianceFormData;
  currentStep: number;
  isSubmittedSuccess: boolean;
  setFormData: (updater: (prev: ComplianceFormData) => ComplianceFormData) => void;
  setErrors: (errors: Record<string, string>) => void;
  setCurrentStep: (step: number) => void;
  setIsEditMode: (v: boolean) => void;
}

export function useComplianceDraftManager({
  formData,
  currentStep,
  isSubmittedSuccess,
  setFormData,
  setErrors,
  setCurrentStep,
  setIsEditMode,
}: UseDraftManagerParams) {
  const [hasCheckedDraft, setHasCheckedDraft] = useState(false);

  useEffect(() => {
    if (hasCheckedDraft) return;
    const checkDraft = async () => {
      try {
        const mobile = getCleanMobile();
        if (!mobile) return;
        const raw = await AsyncStorage.getItem(getDraftKey(mobile));
        if (raw) {
          const draft = JSON.parse(raw) as { formData?: Partial<ComplianceFormData> };
          const saved = draft.formData || {};
          if (
            saved.gstin || saved.financialYear || saved.requestType ||
            saved.purchaseDoc || saved.salesDoc || saved.noticeDoc || saved.noticeNumber
          ) {
            setFormData((prev) => ({ ...prev, ...(saved as ComplianceFormData) }));
          }
        }
      } catch (err) {
        logger.debug("[useComplianceForm] Draft read fallback", { error: err });
      }
      setHasCheckedDraft(true);
    };
    checkDraft();
  }, [hasCheckedDraft, setFormData]);

  const isDirty = useCallback((): boolean => {
    if (isSubmittedSuccess) return false;
    return Boolean(
      formData.gstin || formData.financialYear || formData.requestType ||
      formData.purchaseDoc || formData.salesDoc || formData.noticeDoc || formData.noticeNumber
    );
  }, [formData, isSubmittedSuccess]);

  const saveCurrentDraft = useCallback(async () => {
    const mobile = getCleanMobile();
    if (mobile) {
      addDraftToIndex(mobile, "gst-compliance");
      await AsyncStorage.setItem(
        getDraftKey(mobile),
        JSON.stringify({
          serviceKey: "gst-compliance",
          serviceName: "GST Compliance",
          category: "GST",
          step: currentStep,
          formData,
          updatedAt: new Date().toISOString().split("T")[0],
        })
      );
    }
  }, [formData, currentStep]);

  const clearCurrentDraft = useCallback(async () => {
    const mobile = getCleanMobile();
    if (mobile) {
      removeDraftFromIndex(mobile, "gst-compliance");
      await AsyncStorage.removeItem(getDraftKey(mobile));
    }
    setFormData(() => initialFormData);
    setErrors({});
    setCurrentStep(0);
    setIsEditMode(false);
  }, [setFormData, setErrors, setCurrentStep, setIsEditMode]);

  const draftGuard = useUniversalDraftGuard({
    isDirty,
    onSaveDraft: saveCurrentDraft,
    onDiscardDraft: clearCurrentDraft,
    isSubmitted: () => isSubmittedSuccess,
  });

  return { draftGuard, saveCurrentDraft, clearCurrentDraft, getDraftKey, getCleanMobile };
}
