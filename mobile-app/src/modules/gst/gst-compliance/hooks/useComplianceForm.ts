import { useState, useEffect, useCallback, useRef } from "react";
import { Alert, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ComplianceFormData,
  ValidationErrors,
  validateComplianceForm,
} from "@/modules/gst/validation/complianceSchema";
import {
  cleanGstinInput,
  isValidGstin,
  isValidGstStateCode,
} from "@/modules/gst/utils/gstValidation";
import {
  submitComplianceRequest,
  SubmissionResult,
} from "@/modules/gst/services/gstComplianceService";
import { gstComplianceApi } from "@/modules/gst/services/gstComplianceApi";
import { removeDraftFromIndex } from "@/shared/hooks/useServiceDraft";
import { parseCreatedComplianceId, sanitizeComplianceSaveError } from "../utils/complianceResponse";
import { logger } from "@/core/logging/logger";
import {
  useComplianceDraftManager,
  getDraftKey,
  getCleanMobile,
} from "./useComplianceDraftManager";

export interface UseComplianceFormOptions {
  onValidationError?: (firstField: string) => void;
}

const FIELD_ORDER: (keyof ValidationErrors)[] = [
  "gstin", "financialYear", "requestType",
  "noticeNumber", "noticeIssueDate", "replyDueDate",
  "purchaseDoc", "salesDoc", "noticeDoc",
  "gstr2bRef", "reconciliationRemarks", "noticeRemarks",
];

const initialFormData: ComplianceFormData = {
  gstin: "", financialYear: "", requestType: "",
  purchaseDoc: null, salesDoc: null, noticeDoc: null,
  gstr2bRef: "", reconciliationRemarks: "",
  noticeNumber: "", noticeIssueDate: "", replyDueDate: "", noticeRemarks: "",
};

export function useComplianceForm(options?: UseComplianceFormOptions) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [hasEnteredReview, setHasEnteredReview] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<ComplianceFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [complianceId, setComplianceId] = useState<string | null>(null);
  const [dbReviewData, setDbReviewData] = useState<Record<string, unknown> | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);

  const isMountedRef = useRef<boolean>(true);
  const activeSaveIdRef = useRef<string | null>(null);
  const modifiedDocsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const { draftGuard } = useComplianceDraftManager({
    formData, currentStep, isSubmittedSuccess,
    setFormData, setErrors, setCurrentStep, setIsEditMode,
  });

  const updateField = useCallback(
    <K extends keyof ComplianceFormData>(field: K, value: ComplianceFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (field === "purchaseDoc" || field === "salesDoc" || field === "noticeDoc") {
        modifiedDocsRef.current.add(field);
      }
    },
    []
  );

  const clearError = useCallback((field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }, []);

  const setFieldError = useCallback(
    (field: keyof ValidationErrors, message: string) => {
      setErrors((prev) => ({ ...prev, [field]: message }));
    },
    []
  );

  const handleGstinChange = useCallback(
    (text: string) => {
      const cleaned = cleanGstinInput(text);
      updateField("gstin", cleaned);
      if (cleaned.length === 15) {
        if (!isValidGstStateCode(cleaned.slice(0, 2))) {
          setErrors((prev) => ({ ...prev, gstin: "Invalid State/UT code in GSTIN (format: 29AAAAA0000A1Z5)" }));
        } else if (!isValidGstin(cleaned)) {
          setErrors((prev) => ({ ...prev, gstin: "Invalid GSTIN format (e.g. 29AAAAA0000A1Z5)" }));
        } else {
          clearError("gstin");
        }
      } else {
        clearError("gstin");
      }
    },
    [updateField, clearError]
  );

  const handleEditStep = useCallback((section?: string) => {
    setIsEditMode(true);
    setHasEnteredReview(true);
    setEditSection(section || null);
    modifiedDocsRef.current.clear();
    setCurrentStep(0);
  }, []);

  const handleReturnToReview = useCallback(() => {
    if (isSaving || isSubmitting) return;
    setIsEditMode(false);
    setHasEnteredReview(true);
    setEditSection(null);
    setCurrentStep(1);
  }, [isSaving, isSubmitting]);

  const handleContinue = useCallback(async () => {
    if (currentStep === 0) {
      const { isValid, errors: validationErrors } = validateComplianceForm(formData);
      const activeErrors = { ...errors, ...validationErrors };
      if (!isValid || Object.keys(activeErrors).length > 0) {
        Keyboard.dismiss();
        setErrors(activeErrors);
        const errorList = Object.values(activeErrors).filter(Boolean);
        const firstField = FIELD_ORDER.find((f) => Boolean(activeErrors[f]));
        if (firstField && options?.onValidationError) options.onValidationError(firstField);
        Alert.alert(
          "Required Fields Missing",
          errorList.length > 0 ? errorList.map((e) => `• ${e}`).join("\n") : "Please fill in all required fields highlighted in red."
        );
        return;
      }
      if (isSaving) return;

      setIsSaving(true);
      try {
        let activeId = complianceId;

        if (activeId) {
          const changedDocs = Array.from(modifiedDocsRef.current);
          logger.debug("[Compliance Review] Updating record in DB", { gstin: formData.gstin, activeId, changedDocs });
          try {
            await gstComplianceApi.updateCompliance(formData.gstin, activeId, formData, changedDocs);
            modifiedDocsRef.current.clear();
          } catch (updateErr: unknown) {
            const status = (updateErr as { response?: { status?: number }; status?: number })?.response?.status
              ?? (updateErr as { status?: number })?.status;
            const msg = (updateErr as { message?: string })?.message ?? "";
            const isNotFound = status === 404 || msg.includes("404") || msg.toLowerCase().includes("not found");

            if (isNotFound) {
              logger.warn("[Compliance Review] Stale compliance ID not found (404). Auto-recovering.", { activeId });
              const res: unknown = await gstComplianceApi.createCompliance(formData);
              const parsedId = parseCreatedComplianceId(res);
              if (parsedId) { activeId = parsedId; setComplianceId(parsedId); }
              modifiedDocsRef.current.clear();
            } else {
              throw updateErr;
            }
          }
        } else {
          logger.debug("[Compliance Review] Saving new compliance record in DB");
          const res: unknown = await gstComplianceApi.createCompliance(formData);
          const parsedId = parseCreatedComplianceId(res);
          if (parsedId) { activeId = parsedId; setComplianceId(parsedId); }
        }

        if (isEditMode) {
          setIsEditMode(false);
          setEditSection(null);
          setDbReviewData((prev) => ({
            ...(prev ?? {}),
            gstin: formData.gstin,
            financialYear: formData.financialYear,
            requestType: formData.requestType === "Reconciliation Support" ? "RECONCILIATION_SUPPORT" : "NOTICE_RESPONSE",
            gstr2bNumber: formData.gstr2bRef,
            noticeNumber: formData.noticeNumber,
            noticeIssueDate: formData.noticeIssueDate,
            replyDueDate: formData.replyDueDate,
            message: formData.requestType === "Reconciliation Support" ? formData.reconciliationRemarks : formData.noticeRemarks,
          }));
        }
        setHasEnteredReview(true);
        setCurrentStep(1);

        if (activeId) {
          const targetId = activeId;
          activeSaveIdRef.current = targetId;
          void gstComplianceApi.getCompliance(formData.gstin, targetId)
            .then((fetchedDto) => {
              if (activeSaveIdRef.current === targetId && isMountedRef.current) {
                setDbReviewData(fetchedDto as Record<string, unknown>);
              }
            })
            .catch((fetchErr) => {
              logger.debug("[Compliance Review] Non-blocking background fetch skipped", { error: fetchErr });
            });
        }
      } catch (err: unknown) {
        logger.error("[useComplianceForm] Error saving compliance record", { error: err });
        Alert.alert("Save Failed", sanitizeComplianceSaveError(err));
      } finally {
        setIsSaving(false);
      }
    } else {
      setShowConfirmModal(true);
    }
  }, [currentStep, isEditMode, formData, complianceId, errors, isSaving, options]);

  const handleBack = useCallback(() => {
    if (isEditMode && currentStep === 0) handleReturnToReview();
    else if (currentStep === 1) setCurrentStep(0);
    else router.back();
  }, [isEditMode, currentStep, handleReturnToReview, router]);

  const confirmSubmitRef = useRef<() => Promise<void>>(async () => {});

  const handleConfirmSubmit = useCallback(async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      const result: SubmissionResult = await submitComplianceRequest(formData, complianceId);
      if (result.success) {
        setIsSubmittedSuccess(true);
        setHasEnteredReview(false);
        draftGuard.markSubmitted();
        const mobile = getCleanMobile();
        if (mobile) {
          removeDraftFromIndex(mobile, "gst-compliance");
          AsyncStorage.removeItem(getDraftKey(mobile)).catch((e) => {
            logger.debug("[useComplianceForm] Failed to remove draft key", { error: e });
          });
        }
        router.replace({
          pathname: "/service/gst-compliance-success",
          params: {
            referenceId: result.referenceId, requestType: formData.requestType,
            gstin: formData.gstin, submittedAt: result.submittedAt,
            estimatedResponse: result.estimatedResponse,
          },
        });
      } else {
        Alert.alert("Submission Failed", result.error || "Unable to submit your request. Please check your connection and retry.", [
          { text: "Cancel", style: "cancel" },
          { text: "Retry", onPress: () => { void confirmSubmitRef.current?.(); } },
        ]);
      }
    } catch (err: unknown) {
      logger.warn("[useComplianceForm] Network/submission failure", { error: err });
      Alert.alert("Network Error", "Could not communicate with the server. Please verify your internet connection.", [
        { text: "Cancel", style: "cancel" },
        { text: "Retry", onPress: () => { void confirmSubmitRef.current?.(); } },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, complianceId, router, draftGuard]);

  useEffect(() => { confirmSubmitRef.current = handleConfirmSubmit; }, [handleConfirmSubmit]);

  const getButtonText = useCallback((): string => {
    if (isEditMode && currentStep === 0) return "Update & Review";
    if (currentStep === 0) return "Continue to Review";
    return "Submit Compliance Request";
  }, [currentStep, isEditMode]);

  const resetNavigationState = useCallback(() => {
    setHasEnteredReview(false);
    setIsEditMode(false);
    setEditSection(null);
    setCurrentStep(0);
  }, []);

  return {
    currentStep, setCurrentStep, isEditMode, editSection, setEditSection,
    hasEnteredReview, setHasEnteredReview, resetNavigationState,
    formData, errors, isSubmitting, isSaving, complianceId, dbReviewData,
    showConfirmModal, setShowConfirmModal, draftGuard, updateField, clearError,
    setFieldError, handleGstinChange, handleEditStep, handleContinue,
    handleBack, handleReturnToReview, handleConfirmSubmit, getButtonText,
  };
}
