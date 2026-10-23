import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@/core/logging/logger";
import type { AmendmentStep, AmendmentFormData, SupportingDoc } from "../types/gstAmendmentTypes";

interface GstAmendmentDraftRestoreParams {
  customerMobile: string | undefined;
  gstAmendmentDraft: { formData?: unknown; step?: string } | null | undefined;
  params: { gstin?: string; section?: string; step?: string; resume?: string };
  savedDraftStepRef: React.MutableRefObject<AmendmentStep | null>;
  savedDraftSectionIdRef: React.MutableRefObject<string | null>;
  setGstin: (v: string) => void;
  setSelectedSectionId: (v: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<AmendmentFormData>>;
  setSectionDocs: React.Dispatch<React.SetStateAction<Record<string, SupportingDoc | null>>>;
  setAmendmentId: (v: number | null) => void;
  setDbReviewData: (v: Record<string, unknown> | null) => void;
  setCurrentStep: (v: AmendmentStep) => void;
}

export function useGstAmendmentDraftRestore({
  customerMobile,
  gstAmendmentDraft,
  params,
  savedDraftStepRef,
  savedDraftSectionIdRef,
  setGstin,
  setSelectedSectionId,
  setFormData,
  setSectionDocs,
  setAmendmentId,
  setDbReviewData,
  setCurrentStep,
}: GstAmendmentDraftRestoreParams) {
  const hasRestoredDraftRef = useRef(false);

  useEffect(() => {
    if (hasRestoredDraftRef.current) return;
    hasRestoredDraftRef.current = true;

    const restoreDraft = async () => {
      try {
        const clean = customerMobile ? String(customerMobile).replace(/\D/g, "") : "";
        let savedData: Record<string, unknown> = (gstAmendmentDraft?.formData as Record<string, unknown>) || {};
        let savedStep: AmendmentStep | undefined = gstAmendmentDraft?.step as AmendmentStep | undefined;

        if (!savedData.gstin && clean) {
          const draftKey = `@taxedge_draft_${clean}_gst-amendment`;
          const raw = await AsyncStorage.getItem(draftKey);
          if (raw) {
            const parsed = JSON.parse(raw) as { formData?: Record<string, unknown>; step?: string };
            savedData = parsed.formData || {};
            savedStep = parsed.step as AmendmentStep | undefined;
          }
        }

        savedDraftStepRef.current = (savedStep as AmendmentStep) || null;
        savedDraftSectionIdRef.current = (savedData.selectedSectionId as string) || null;

        const isExplicitResume = Boolean(params.resume === "true" || params.step);

        if (params.gstin) {
          setGstin(params.gstin);
        } else if (savedData.gstin) {
          setGstin(savedData.gstin as string);
        }

        if (params.section) {
          setSelectedSectionId(params.section);
        } else if (savedData.selectedSectionId) {
          setSelectedSectionId(savedData.selectedSectionId as string);
        }

        if (savedData && Object.keys(savedData).length > 0) {
          setFormData((prev) => ({ ...prev, ...savedData }));
          if (savedData._sectionDocs) {
            setSectionDocs(savedData._sectionDocs as Record<string, SupportingDoc | null>);
          }
          if (savedData.amendmentId) {
            setAmendmentId(savedData.amendmentId as number);
          }
          if (savedData.dbReviewData) {
            setDbReviewData(savedData.dbReviewData as Record<string, unknown>);
          }
        }

        if (isExplicitResume) {
          const targetStep = (params.step as AmendmentStep) || savedStep || "EDIT";
          if (targetStep !== "SUCCESS") {
            setCurrentStep(targetStep);
          }
        } else {
          setCurrentStep("LANDING");
        }
      } catch (err) {
        logger.warn("[useGstAmendmentDraftRestore] Error restoring draft:", { error: err });
      }
    };

    restoreDraft();
  }, [customerMobile, gstAmendmentDraft, params.gstin, params.resume, params.section, params.step]);
}
