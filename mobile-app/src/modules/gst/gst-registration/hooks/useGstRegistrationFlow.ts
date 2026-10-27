import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Alert, type ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useApplicationStore } from "@/store/applicationStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useGstRegistrationDraftGuard } from "./useGstRegistrationDraftGuard";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { tokenManager, JwtUtils } from "@/core/authentication/tokenManager";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { gstApi } from "@/modules/gst/services/gstApi";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import { mapGstRegistrationPayload, mapDtoToGstBusinessFormData, mapDtoToDocuments } from "@/modules/gst/gst-registration/utils/gstRegistrationMapper";
import { GstBusinessFormData } from "@/modules/gst/gst-registration/components/GstBusinessStep/GstBusinessStep";
import { INITIAL_DOCUMENTS } from "@/modules/gst/gst-registration/components/GstUnifiedDocumentStep/GstUnifiedDocumentStep";
import { DocumentItem } from "@/modules/gst/gst-registration/components/GstUnifiedDocumentStep/GstUnifiedDocumentStep.types";
import {
  INITIAL_BUSINESS_DATA, isBackendGstId, extractGstId, resolveTargetGstId,
  isValidCustomerId,
  getFirstErrorScrollOffset, getFirstErrorSection, getFirstErrorField,
} from "@/modules/gst/gst-registration/utils/gstDraftLifecycle";
import { getErrorMessage } from "@/core/error-handling/errorMessage";
import { logger } from "@/core/logging/logger";

export { isBackendGstId, extractGstId, resolveTargetGstId };

export const useGstRegistrationFlow = (scrollViewRef: React.RefObject<ScrollView | null>) => {
  const router = useRouter();
  const params = useLocalSearchParams<{ gstId?: string; id?: string; appId?: string; isEdit?: string; edit?: string; step?: string }>();

  // State
  const [screenIndex, setScreenIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [declared, setDeclared] = useState(true);
  const [createdAppId, setCreatedAppId] = useState("");
  const [createdGstId, setCreatedGstId] = useState("");
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [businessErrors, setBusinessErrors] = useState<Record<string, string>>({});
  const [businessData, setBusinessData] = useState<GstBusinessFormData>(INITIAL_BUSINESS_DATA);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isFetchingReview, setIsFetchingReview] = useState(false);
  const [reviewFetchError, setReviewFetchError] = useState<string | null>(null);
  const hasFetchedReviewForRef = useRef("");
  const isFetchingReviewRef = useRef(false);
  const sectionPositionsRef = useRef<Record<string, number>>({ bank: 0, signatory: 0, consent: 0 });
  const fieldPositionsRef = useRef<Record<string, number>>({});
  const handleSectionLayout = useCallback((section: "bank" | "signatory" | "consent", y: number) => {
    sectionPositionsRef.current[section] = y; fieldPositionsRef.current[section] = y;
  }, []);
  const handleFieldLayout = useCallback((field: string, y: number) => { fieldPositionsRef.current[field] = y; }, []);

  // Store Hooks
  const { gstDraft, createApplication } = useApplicationStore();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const { customer: authCustomer, authenticatedUser: authUser } = useAuthStore();

  // Customer ID Resolution with Exception Handling (Bug 17)
  const getResolvedCustomerId = useCallback(async (): Promise<string> => {
    try {
      if (businessData.customerId?.trim()) return businessData.customerId.trim();
      const storeCustId = authCustomer?.customerId || authUser?.customerId || authUser?.custId || (authCustomer as any)?.custId;
      if (storeCustId && String(storeCustId).trim()) return String(storeCustId).trim();
      const u = authStorage.getUser();
      const s = authStorage.getSession();
      const storageCustId = u?.customerId || u?.custId || s?.activeCustId;
      if (storageCustId && String(storageCustId).trim()) return String(storageCustId).trim();
      const token = await tokenManager.getAccessToken();
      if (token) {
        const payload = JwtUtils.decodePayload(token);
        if (payload?.sub && typeof payload.sub === "string" && payload.sub.trim()) return payload.sub.trim();
      }
    } catch (err) { logger.warn("[useGstRegistrationFlow] Error resolving customer ID:", { error: err }); }
    return "";
  }, [authCustomer, authUser, businessData.customerId]);

  // Sync Customer ID onto Business Form
  useEffect(() => {
    let isMounted = true;
    getResolvedCustomerId().then((cid) => {
      if (cid && isMounted) setBusinessData((prev) => (prev.customerId === cid ? prev : { ...prev, customerId: prev.customerId || cid }));
    });
    return () => { isMounted = false; };
  }, [getResolvedCustomerId]);

  const { syncDraft, draftGuard, hasAnyDataEntered, clearGstDraft } = useGstRegistrationDraftGuard({
    businessData, documents, screenIndex, createdGstId, documentId,
    setBusinessData, setDocuments, setScreenIndex, setCreatedGstId, setDocumentId, setIsEditMode,
    params,
  });

  // Database Review Fetcher (Bug 14: Deduplication guard & clean loading lifecycle)
  const fetchRegistrationDetails = useCallback(async (gstIdToFetch?: string, docIdToFetch?: string) => {
    const activeGstId = gstIdToFetch || createdGstId || businessData.gstId || params.gstId || params.id || (params.appId?.startsWith("GST") ? params.appId : undefined);
    const activeDocId = docIdToFetch || documentId || gstDraft?.documentId;
    const fetchKey = `${activeGstId || ""}_${activeDocId || ""}`;
    if (isFetchingReviewRef.current || (fetchKey && hasFetchedReviewForRef.current === fetchKey)) return;

    isFetchingReviewRef.current = true;
    setIsFetchingReview(true);
    setReviewFetchError(null);
    try {
      if (activeGstId) {
        const dbBusiness = await gstApi.getBusiness(activeGstId);
        if (dbBusiness) setBusinessData((prev) => ({ ...prev, ...mapDtoToGstBusinessFormData(dbBusiness), gstId: activeGstId }));
      }
      if (activeDocId) {
        const dbDocs = await gstApi.getRegistrationDocuments(activeDocId);
        if (dbDocs) setDocuments((prev) => mapDtoToDocuments(dbDocs, prev));
      }
      hasFetchedReviewForRef.current = fetchKey;
    } catch (err) {
      const errMsg = getErrorMessage(err) || "Could not retrieve details from server.";
      setReviewFetchError(errMsg);
      logger.warn("[useGstRegistrationFlow] Could not retrieve documents from DB:", { error: errMsg });
    } finally {
      isFetchingReviewRef.current = false;
      setIsFetchingReview(false);
    }
  }, [createdGstId, businessData.gstId, params.gstId, params.id, params.appId, documentId, gstDraft?.documentId]);

  const handleRetryReviewFetch = useCallback(() => {
    hasFetchedReviewForRef.current = "";
    fetchRegistrationDetails();
  }, [fetchRegistrationDetails]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (screenIndex === 2) fetchRegistrationDetails(); }, [screenIndex, fetchRegistrationDetails]);

  // Form Interactions
  const handleBusinessChange = useCallback((fields: Partial<GstBusinessFormData>) => {
    setBusinessData((prev) => {
      const updated = { ...prev, ...fields };
      setBusinessErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        Object.keys(fields).forEach((k) => {
          const key = k as keyof GstBusinessFormData;
          if (key === "aadhaarConsent") {
            if (Boolean(updated.aadhaarConsent)) delete nextErrors.aadhaarConsent;
            else nextErrors.aadhaarConsent = "Please provide Aadhaar consent to continue.";
            return;
          }
          const rawVal = updated[key];
          const strVal = typeof rawVal === "boolean" ? String(rawVal) : (rawVal as string) || "";
          const ctx = updated as unknown as Record<string, string>;
          const currentErr = prevErrors[key];
          if (currentErr) {
            const err = GstValidators.validateBusinessField(key, strVal, ctx);
            if (err) nextErrors[key] = err; else delete nextErrors[key];
          } else if (strVal.trim().length > 0) {
            const validationErr = GstValidators.validateBusinessField(key, strVal, ctx);
            if (validationErr && !validationErr.toLowerCase().includes("required")) {
              nextErrors[key] = validationErr;
            }
          }
        });
        if (fields.bankAccountNumber !== undefined && nextErrors.confirmBankAccountNumber) {
          nextErrors.confirmBankAccountNumber = GstValidators.validateBusinessField("confirmBankAccountNumber", updated.confirmBankAccountNumber || "", updated as unknown as Record<string, string>);
        }
        return nextErrors;
      });
      return updated;
    });
  }, []);

  const handleBusinessBlur = useCallback((field: keyof GstBusinessFormData) => {
    const val = businessData[field];
    const ctx = businessData as unknown as Record<string, string>;
    const msg = GstValidators.validateBusinessField(field, typeof val === "boolean" ? String(val) : (val as string) || "", ctx);
    setBusinessErrors((prev) => {
      const next = { ...prev, [field]: msg };
      if (field === "bankAccountNumber" && prev.confirmBankAccountNumber) {
        next.confirmBankAccountNumber = GstValidators.validateBusinessField("confirmBankAccountNumber", businessData.confirmBankAccountNumber || "", ctx);
      }
      return next;
    });
  }, [businessData]);

  const handleUpdateDocuments = useCallback((updated: DocumentItem[]) => {
    setDocuments(updated);
    syncDraft(1, undefined, updated);
  }, [syncDraft]);

  // Validations
  const validateBusinessDetails = (): boolean => {
    const errs = GstValidators.validateBusinessForm(businessData as unknown as Record<string, string>);
    setBusinessErrors(errs);
    if (Object.keys(errs).length > 0) {
      const section = getFirstErrorSection(errs);
      if (section === "bank" || section === "signatory" || section === "consent") {
        setEditSection(section === "consent" ? "signatory" : section);
      }
      const firstField = getFirstErrorField(errs);
      setFocusedField(firstField);
      const positionsMap = { ...sectionPositionsRef.current, ...fieldPositionsRef.current };
      const targetY = getFirstErrorScrollOffset(errs, positionsMap);
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, targetY - 15), animated: true });
      }, 80);
      Alert.alert("Required Fields Missing", "Please enter all the required fields correctly to proceed.");
      return false;
    }
    return true;
  };

  const validateDocuments = (): boolean => {
    const mandatoryMissing = documents.filter((d) => d.required && !d.fileUri);
    if (mandatoryMissing.length > 0) {
      const missingNames = mandatoryMissing.map((d) => d.name).join("\n\u2022 ");
      Alert.alert("Required Documents Missing", `Please upload:\n\n\u2022 ${missingNames}`);
      return false;
    }
    return true;
  };

  // Flow Navigation
  const handleEditStep = (targetStepIndex: number, section?: string) => {
    setIsEditMode(true);
    setEditSection(section || null);
    setScreenIndex(targetStepIndex);
    setTimeout(() => {
      if (targetStepIndex === 0) {
        if (section === "business") {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        } else {
          const measuredY = section ? sectionPositionsRef.current[section] : 0;
          const fallbackY = section === "bank" ? 550 : section === "signatory" ? 1100 : 0;
          const targetY = typeof measuredY === "number" && measuredY > 0 ? measuredY : fallbackY;
          scrollViewRef.current?.scrollTo({ y: Math.max(0, targetY - 10), animated: true });
        }
      } else { scrollViewRef.current?.scrollTo({ y: 0, animated: true }); }
    }, 120);
  };

  const handleBack = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setEditSection(null);
      setScreenIndex(2);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    if (screenIndex === 3) { router.replace("/(main)/home"); return; }
    if (screenIndex > 0) {
      setScreenIndex((prev) => prev - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    if (hasAnyDataEntered()) draftGuard.openDraftModal();
    else router.back();
  };

  // Unified Step Submissions
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

  const submitBusinessStep = async () => {
    if (!validateBusinessDetails()) return;
    const custId = await getResolvedCustomerId();
    if (!isValidCustomerId(custId)) {
      setIsLoading(false);
      Alert.alert("Session Expired", "Unable to resolve your customer account. Please log in again to continue with registration.");
      return;
    }

    const targetGstId = resolveTargetGstId([
      createdGstId, businessData.gstId, params.gstId, params.id,
      params.appId, gstDraft?.createdGstId, gstDraft?.gstId, (gstDraft?.businessData as any)?.gstId,
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
        const errMsg = getErrorMessage(err);
        if (errMsg.includes("404") || errMsg.toLowerCase().includes("not found")) {
          logger.warn(`[useGstRegistrationFlow] targetGstId '${targetGstId}' not found on server, re-registering fresh...`);
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
      } else { syncDraft(nextStep); }
    }

    if (isEditMode) {
      setIsEditMode(false);
      setEditSection(null);
      Alert.alert("Success", "Business details updated successfully.");
    }
    setScreenIndex(nextStep);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const submitDocumentsStep = async () => {
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
        logger.warn("[useGstRegistrationFlow] Failed to update documents with documentId, falling back to upload:", { error: docErr });
      }
    }

    let activeGstId = createdGstId || businessData.gstId || "";
    if (!activeGstId) {
      activeGstId = await ensureBusinessRegistration();
    }

    try {
      const res = await gstApi.uploadAllDocuments(activeGstId, documents, businessData.addressProofType);
      const match = String(res).match(/Document ID:\s*([A-Za-z0-9_-]+)/i);
      if (match) setDocumentId(match[1]);
    } catch (uploadErr) {
      const errMsg = getErrorMessage(uploadErr);
      const isNotFound = errMsg.includes("404") || errMsg.toLowerCase().includes("not found");
      if (isNotFound) {
        logger.warn(`[useGstRegistrationFlow] Business ID '${activeGstId}' not found on backend (404). Re-registering business and retrying upload...`);
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

  const submitReviewStep = async () => {
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
        logger.warn("[useGstRegistrationFlow] Failed to update final registration details", { error: e });
      }
      try {
        await gstApi.submitFinalRegistration(targetGstId);
      } catch (subErr) {
        logger.warn("[useGstRegistrationFlow] Backend submit notification call failed", { error: subErr });
      }
    }

    const appId = createApplication(
      "gst-registration", "GST Registration", "GST",
      {
        ...businessData, gstId: targetGstId,
        applicantName: businessData.businessName || businessData.legalName || "Your Business",
        appliedDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      },
      documents.map((d) => ({ name: d.name, status: "Uploaded" as const, fileUri: d.fileUri, fileName: d.fileName, fileSize: d.fileSize })),
      0, "Pending", false, targetGstId || undefined,
    );
    const finalDisplayId = targetGstId || appId;
    setCreatedAppId(finalDisplayId);
    if (targetGstId) setCreatedGstId(targetGstId);
    draftGuard.markSubmitted();
    clearGstDraft();
    addNotification("GST Application Submitted", `Your GST Registration (ID: ${finalDisplayId}) has been successfully submitted and is under verification.`, "gst");
    setScreenIndex(3);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleContinue = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const stepHandlers: Record<number, () => Promise<void>> = { 0: submitBusinessStep, 1: submitDocumentsStep, 2: submitReviewStep };
      if (stepHandlers[screenIndex]) await stepHandlers[screenIndex]();
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err) || "An unexpected error occurred. Please try again.");
      logger.error("[useGstRegistrationFlow] GST Flow Error:", { error: err });
    } finally {
      setIsLoading(false);
    }
  };

  const resolvedBackendGstId = useMemo(() => {
    return resolveTargetGstId([createdGstId, businessData.gstId, createdAppId]);
  }, [createdGstId, businessData.gstId, createdAppId]);

  return {
    screenIndex, setScreenIndex, isLoading, declared, setDeclared,
    businessData, businessErrors, documents,
    createdAppId: resolvedBackendGstId || createdAppId,
    createdGstId: resolvedBackendGstId,
    draftGuard, handleBusinessChange, handleBusinessBlur, handleUpdateDocuments,
    handleContinue, handleBack,
    isEditMode, editSection, handleEditStep,
    fetchRegistrationDetails, isFetchingReview,
    reviewFetchError, handleRetryReviewFetch,
    handleSectionLayout, handleFieldLayout, focusedField,
  };
};
