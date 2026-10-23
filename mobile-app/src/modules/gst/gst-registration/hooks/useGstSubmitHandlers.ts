import { Alert, type ScrollView } from "react-native";
import { gstApi } from "@/modules/gst/services/gstApi";
import { mapGstRegistrationPayload } from "@/modules/gst/gst-registration/utils/gstRegistrationMapper";
import type { GstBusinessFormData } from "@/modules/gst/gst-registration/components/GstBusinessStep/GstBusinessStep";
import type { DocumentItem } from "@/modules/gst/gst-registration/components/GstUnifiedDocumentStep/GstUnifiedDocumentStep.types";
import { extractGstId, resolveTargetGstId, isValidCustomerId } from "@/modules/gst/gst-registration/utils/gstDraftLifecycle";
import { getErrorMessage } from "@/core/error-handling/errorMessage";
import { logger } from "@/core/logging/logger";
import type React from "react";
import type { NotificationState } from "@/store/notificationStore";
import type { ApplicationState } from "@/store/applicationStore";

interface GstDraftRef {
  createdGstId?: string;
  gstId?: string;
  businessData?: { gstId?: string };
  documentId?: string;
}

export interface GstSubmitDeps {
  businessData: GstBusinessFormData;
  documents: DocumentItem[];
  createdGstId: string;
  documentId: string;
  isEditMode: boolean;
  declared: boolean;
  params: { gstId?: string; id?: string; appId?: string };
  gstDraft: GstDraftRef | null | undefined;
  scrollViewRef: React.RefObject<ScrollView | null>;
  setCreatedGstId: (id: string) => void;
  setCreatedAppId: (id: string) => void;
  setBusinessData: React.Dispatch<React.SetStateAction<GstBusinessFormData>>;
  setDocumentId: (id: string) => void;
  setIsEditMode: (v: boolean) => void;
  setEditSection: (s: string | null) => void;
  setScreenIndex: React.Dispatch<React.SetStateAction<number>>;
  getResolvedCustomerId: () => Promise<string>;
  validateBusinessDetails: () => boolean;
  validateDocuments: () => boolean;
  syncDraft: (step?: number, gstId?: string, docs?: DocumentItem[]) => void;
  markSubmitted: () => void;
  clearGstDraft: () => void;
  addNotification: NotificationState["addNotification"];
  createApplication: ApplicationState["createApplication"];
}

export function useGstSubmitHandlers(deps: GstSubmitDeps) {
  const {
    businessData, documents, createdGstId, documentId, isEditMode, declared,
    params, gstDraft, scrollViewRef,
    setCreatedGstId, setCreatedAppId, setBusinessData, setDocumentId, setIsEditMode, setEditSection, setScreenIndex,
    getResolvedCustomerId, validateBusinessDetails, validateDocuments,
    syncDraft, markSubmitted, clearGstDraft, addNotification, createApplication,
  } = deps;

  const ensureBusinessRegistration = async (): Promise<string> => {
    const custId = await getResolvedCustomerId();
    if (!isValidCustomerId(custId)) {
      throw new Error("Unable to resolve your customer account. Please log in again to continue with registration.");
    }
    const payload = mapGstRegistrationPayload(businessData, custId);
    const res = await gstApi.submitRegistration(payload);
    const newGstId = extractGstId(res);
    if (newGstId) {
      setCreatedGstId(newGstId);
      setBusinessData((prev) => ({ ...prev, gstId: newGstId }));
      syncDraft(1, newGstId);
      return newGstId;
    }
    throw new Error("Failed to register business details with server. Please verify Step 1 and try again.");
  };

  const submitBusinessStep = async (): Promise<void> => {
    if (!validateBusinessDetails()) return;
    const custId = await getResolvedCustomerId();
    if (!isValidCustomerId(custId)) {
      Alert.alert("Session Expired", "Unable to resolve your customer account. Please log in again to continue with registration.");
      return;
    }

    const targetGstId = resolveTargetGstId([
      createdGstId, businessData.gstId, params.gstId, params.id,
      params.appId, gstDraft?.createdGstId, gstDraft?.gstId, gstDraft?.businessData?.gstId,
    ]);
    const payload = mapGstRegistrationPayload(businessData, custId, targetGstId);
    const nextStep = isEditMode ? 2 : 1;

    if (targetGstId) {
      try {
        await gstApi.updateRegistration(targetGstId, payload);
        setCreatedGstId(targetGstId);
        setBusinessData((prev) => ({ ...prev, gstId: targetGstId }));
        syncDraft(nextStep, targetGstId);
      } catch (err) {
        const errMsg = getErrorMessage(err) || "";
        if (errMsg.includes("404") || errMsg.toLowerCase().includes("not found")) {
          logger.warn("[useGstSubmitHandlers] GST ID not found on server, re-registering fresh");
          const freshGstId = await ensureBusinessRegistration();
          syncDraft(nextStep, freshGstId);
        } else {
          throw err;
        }
      }
    } else {
      const response = await gstApi.submitRegistration(payload);
      const newGstId = extractGstId(response);
      if (newGstId) {
        setCreatedGstId(newGstId);
        setBusinessData((prev) => ({ ...prev, gstId: newGstId }));
        syncDraft(nextStep, newGstId);
      } else {
        syncDraft(nextStep);
      }
    }

    if (isEditMode) {
      setIsEditMode(false);
      setEditSection(null);
      Alert.alert("Success", "Business details updated successfully.");
    }
    setScreenIndex(nextStep);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const submitDocumentsStep = async (): Promise<void> => {
    if (!validateDocuments()) return;
    const nextStep = 2;
    syncDraft(nextStep);

    if (documentId) {
      try {
        await gstApi.updateAllDocuments(documentId, documents, businessData.addressProofType);
        if (isEditMode) { setIsEditMode(false); setEditSection(null); }
        setScreenIndex(nextStep);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        return;
      } catch (docErr) {
        logger.warn("[useGstSubmitHandlers] Failed to update documents with documentId, falling back to upload", { error: docErr });
      }
    }

    let activeGstId = createdGstId || businessData.gstId || "";
    if (!activeGstId) activeGstId = await ensureBusinessRegistration();

    try {
      const res = await gstApi.uploadAllDocuments(activeGstId, documents, businessData.addressProofType);
      const match = String(res).match(/Document ID:\s*([A-Za-z0-9_-]+)/i);
      if (match) setDocumentId(match[1]);
    } catch (uploadErr) {
      const errMsg = getErrorMessage(uploadErr) || "";
      const isNotFound = errMsg.includes("404") || errMsg.toLowerCase().includes("not found");
      if (isNotFound) {
        logger.warn("[useGstSubmitHandlers] Business ID not found on backend (404). Re-registering and retrying upload");
        const freshGstId = await ensureBusinessRegistration();
        const res = await gstApi.uploadAllDocuments(freshGstId, documents, businessData.addressProofType);
        const match = String(res).match(/Document ID:\s*([A-Za-z0-9_-]+)/i);
        if (match) setDocumentId(match[1]);
      } else {
        throw uploadErr;
      }
    }

    if (isEditMode) { setIsEditMode(false); setEditSection(null); }
    setScreenIndex(nextStep);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const submitReviewStep = async (): Promise<void> => {
    if (!declared) {
      Alert.alert("Declaration Required", "Please accept the declaration to submit your application.");
      return;
    }
    const targetGstId = resolveTargetGstId([
      createdGstId, businessData.gstId, gstDraft?.createdGstId,
      gstDraft?.businessData?.gstId, params.gstId, params.id,
    ]) || createdGstId || businessData.gstId || "";

    if (targetGstId) {
      try {
        const custId = await getResolvedCustomerId();
        await gstApi.updateRegistration(targetGstId, mapGstRegistrationPayload(businessData, custId, targetGstId));
      } catch (e) {
        logger.warn("[useGstSubmitHandlers] Failed to update final registration details", { error: e });
      }
      try {
        await gstApi.submitFinalRegistration(targetGstId);
      } catch (subErr) {
        logger.warn("[useGstSubmitHandlers] Backend submit notification call failed", { error: subErr });
      }
    }

    const appId = createApplication(
      "gst-registration", "GST Registration", "GST",
      { ...businessData, gstId: targetGstId, applicantName: businessData.businessName || businessData.legalName || "Your Business", appliedDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
      documents.map((d) => ({ name: d.name, status: "Uploaded", fileUri: d.fileUri, fileName: d.fileName, fileSize: d.fileSize })),
      0, "Pending", false, targetGstId || undefined,
    );
    const finalDisplayId = targetGstId || appId;
    setCreatedAppId(finalDisplayId);
    if (targetGstId) setCreatedGstId(targetGstId);
    markSubmitted();
    clearGstDraft();
    addNotification("GST Application Submitted", "Your GST Registration has been successfully submitted and is under verification.", "gst");
    setScreenIndex(3);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return { submitBusinessStep, submitDocumentsStep, submitReviewStep };
}
