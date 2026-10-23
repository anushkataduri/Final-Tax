import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { useTdsProgressStore } from "../../store/tdsProgressStore";
import { ifscService } from "@/modules/gst/services/ifscService";
import { logger } from "@/core/logging/logger";
import type { TdsCustomerIncomeFormData } from "../../types/customerIncome.types";
import type { TdsDocumentItem } from "../../types/tdsDocuments.types";
import { cleanIfsc } from "../../utils/tdsValidation";
import { validateCustomerIncomeForm, CustomerFormErrors } from "../../validation/tdsCustomerSchema";
import { tdsDraftService, INITIAL_TDS_FORM_DATA, getTdsCustId } from "../../services/tdsDraftService";
import { tdsApiService } from "../../services/tdsApiService";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { useTdsProfileSync } from "./useTdsProfileSync";
import { useTdsSaveProfile } from "./useTdsSaveProfile";
import { describeSaveError } from "./tdsFormHelpers";

type UpdateBankField = <K extends keyof TdsCustomerIncomeFormData["bank"]>(
  field: K,
  value: TdsCustomerIncomeFormData["bank"][K]
) => void;

type UpdateIncomeField = <K extends keyof TdsCustomerIncomeFormData["income"]>(
  field: K,
  value: TdsCustomerIncomeFormData["income"][K]
) => void;

export const useTdsRefundForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<TdsCustomerIncomeFormData>(INITIAL_TDS_FORM_DATA);
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [isIfscLoading, setIsIfscLoading] = useState(false);
  const { isEditing: isEditingParam, id: paramId, applicationId: paramAppId } = useLocalSearchParams<{
    isEditing?: string;
    id?: string;
    applicationId?: string;
  }>();
  const [isEditing, _setIsEditing] = useState(isEditingParam === "true");
  const [ifscError, setIfscError] = useState<string | null>(null);

  const { isProfileLoading, profileFetchError, fetchAndPopulateProfile } = useTdsProfileSync(setFormData);
  const { handleSaveProfile } = useTdsSaveProfile({ formData, setFormData });

  const initialSnapshotRef = useRef<string | null>(null);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const isSavingRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  const documentsRef = useRef<TdsDocumentItem[]>([]);

  const draftGuard = useUniversalDraftGuard({
    isDirty: () => {
      if (!initialSnapshotRef.current) return false;
      const currentSnapshot = JSON.stringify({ bank: formData.bank, income: formData.income });
      return hasUserEdited || currentSnapshot !== initialSnapshotRef.current;
    },
    onSaveDraft: async () => {
      await tdsDraftService.saveFormDraft(formData);
      await tdsDraftService.saveDocumentsDraft(documentsRef.current);
    },
    onDiscardDraft: async () => {
      await tdsDraftService.clearDraft();
    },
    saveDestination: "/service/itr",
    discardDestination: "/service/itr",
  });

  useEffect(() => {
    async function loadData() {
      const freshPersonal = await fetchAndPopulateProfile();

      const currentMobile = useAuthStore.getState().customer?.mobile ||
        authStorage.getSession().activeMobile ||
        useAuthStore.getState().mobileNumber ||
        freshPersonal?.mobileNumber;

      const custId = getTdsCustId(freshPersonal?.mobileNumber);

      let draftBank = null;
      let draftIncome = null;
      let draftBusiness = null;
      const savedDraft = await tdsDraftService.getFormDraft();

      if (savedDraft) {
        const isSameCustomer = !savedDraft.personal?.mobileNumber ||
          !currentMobile ||
          savedDraft.personal.mobileNumber.replace(/\D/g, "") === currentMobile.replace(/\D/g, "");

        if (isSameCustomer) {
          draftBank = savedDraft.bank;
          draftIncome = savedDraft.income;
          draftBusiness = savedDraft.business;
        } else {
          await tdsDraftService.clearDraft();
        }
      }

      let backendApp: Record<string, unknown> | null = null;
      try {
        const routeAppId = (paramId || paramAppId) as string | undefined;
        const existingAppId = routeAppId || (await tdsDraftService.getApplicationId());
        if (existingAppId) await tdsDraftService.saveApplicationId(existingAppId);
        backendApp = custId
          ? await tdsApiService.fetchFullTdsApplication(custId, existingAppId || undefined) as unknown as Record<string, unknown>
          : null;
        if (backendApp?.tdsRefundId) {
          await tdsDraftService.saveApplicationId(backendApp.tdsRefundId as string);
        }
      } catch (err: unknown) {
        logger.warn("[TDS Form] Backend fetch warning", { error: err });
      }

      setFormData((prev) => {
        const mergedBank = { ...prev.bank, ...(backendApp?.bank as object || {}), ...(draftBank || {}) };
        const mergedIncome = { ...prev.income, ...(backendApp?.income as object || {}), ...(draftIncome || {}) };
        const mergedBusiness = { ...prev.business, ...(backendApp?.business as object || {}), ...(draftBusiness || {}) };

        initialSnapshotRef.current = JSON.stringify({ bank: mergedBank, income: mergedIncome, business: mergedBusiness });

        return {
          ...prev,
          bank: mergedBank as TdsCustomerIncomeFormData["bank"],
          income: mergedIncome as TdsCustomerIncomeFormData["income"],
          business: mergedBusiness as TdsCustomerIncomeFormData["business"],
          personal: freshPersonal || prev.personal,
        };
      });
    }
    loadData();
  }, []);

  const updateBank: UpdateBankField = (field, value) => {
    setHasUserEdited(true);
    setFormData((prev) => ({ ...prev, bank: { ...prev.bank, [field]: value } }));
    const errorKey = `bank.${field}` as keyof CustomerFormErrors;
    if (errors[errorKey]) setErrors((prev) => { const next = { ...prev }; delete next[errorKey]; return next; });
  };

  const updateIncome: UpdateIncomeField = (field, value) => {
    setHasUserEdited(true);
    setFormData((prev) => ({ ...prev, income: { ...prev.income, [field]: value } }));
    const errorKey = `income.${field}` as keyof CustomerFormErrors;
    if (errors[errorKey]) setErrors((prev) => { const next = { ...prev }; delete next[errorKey]; return next; });
  };

  const handleIfscChange = async (val: string) => {
    const cleaned = cleanIfsc(val);
    updateBank("ifscCode", cleaned);

    if (cleaned.length === 11) {
      setIsIfscLoading(true);
      setIfscError(null);
      try {
        const details = await ifscService.lookup(cleaned);
        setFormData((prev) => ({
          ...prev,
          bank: { ...prev.bank, ifscCode: cleaned, bankName: details.bank, branchName: details.branch, isIfscVerified: true },
        }));
        setIfscError(null);
      } catch {
        setIfscError("Invalid IFSC code. Please check branch details.");
        updateBank("isIfscVerified", false);
      } finally {
        setIsIfscLoading(false);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        bank: { ...prev.bank, bankName: "", branchName: "", isIfscVerified: false },
      }));
    }
  };

  const updateBusiness = (field: string, value: string) => {
    setHasUserEdited(true);
    setFormData((prev) => ({ ...prev, business: { ...prev.business, [field]: value } }));
    const errorKey = `business.${field}` as keyof CustomerFormErrors;
    if (errors[errorKey]) setErrors((prev) => { const next = { ...prev }; delete next[errorKey]; return next; });
  };

  const handleContinue = async () => {
    const activeDocs = documentsRef.current.length > 0 ? documentsRef.current : documents;
    const validation = validateCustomerIncomeForm(formData);
    const hasMissingMandatoryDocs = activeDocs.some((doc) => doc.isMandatory && doc.status !== "uploaded");

    if (!validation.isValid || hasMissingMandatoryDocs) {
      if (!validation.isValid) setErrors(validation.errors);
      Alert.alert(
        hasMissingMandatoryDocs ? "Incomplete Documents" : "Incomplete Information",
        hasMissingMandatoryDocs
          ? "Please upload all mandatory documents (PAN and Aadhaar) to proceed."
          : "Please complete all required fields correctly to proceed."
      );
      return;
    }
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);
    await tdsDraftService.saveFormDraft(formData);
    await tdsDraftService.saveDocumentsDraft(activeDocs);
    try {
      const custId = getTdsCustId(formData.personal.mobileNumber);
      const draftAppId = await tdsDraftService.getApplicationId();
      let targetId = ((paramId || paramAppId || draftAppId) as string | undefined)?.trim();

      if (!targetId && custId) {
        try {
          const existingDb = await tdsApiService.getBankAccountByCustId(custId) as Record<string, unknown> | null;
          if (existingDb?.id) {
            targetId = existingDb.id as string;
            await tdsDraftService.saveApplicationId(targetId);
          }
        } catch (findErr: unknown) {
          logger.warn("[TDS Form] Cust ID lookup fallback warning", { error: findErr });
        }
      }

      let savedTdsId: string;
      if (isEditing && targetId) {
        savedTdsId = await tdsApiService.updateBankAccount(
          targetId, formData.bank, custId, formData.business,
          activeDocs as never, formData.personal,
        );
        try { await tdsApiService.saveIncomeTaxInfo(formData.income, targetId); } catch (e: unknown) { logger.warn("[TDS Form] saveIncomeTaxInfo warning", { error: e }); }
        try { await tdsApiService.saveTdsTaxesPaid(formData.income, custId, targetId); } catch (e: unknown) { logger.warn("[TDS Form] saveTdsTaxesPaid warning", { error: e }); }
        const hasUploadedDocs = activeDocs.some((d) => d.status === "uploaded" || Boolean(d.fileUri));
        if (hasUploadedDocs) {
          try { await tdsApiService.saveDocuments(activeDocs as never, targetId); } catch (e: unknown) { logger.warn("[TDS Form] saveDocuments warning", { error: e }); }
        }
      } else {
        savedTdsId = await tdsApiService.saveFullTdsApplication(formData, activeDocs as never, custId, targetId);
      }
      await tdsDraftService.saveApplicationId(savedTdsId || targetId || "");
    } catch (err: unknown) {
      logger.error("[TDS Form] Backend update/save failed", { error: err });
      Alert.alert("Unable to Save Application", describeSaveError(err));
      return;
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
    draftGuard.markSubmitted();
    if (useTdsProgressStore.getState().maxStepReached < 3) {
      useTdsProgressStore.getState().setMaxStepReached(3);
    }
    router.push("/service/tds-estimate" as never);
  };

  const [documents, setDocuments] = useState<TdsDocumentItem[]>([]);

  useEffect(() => {
    async function loadDocs() {
      const { INITIAL_TDS_DOCUMENTS } = await import("../../constants/tdsDocuments.constants");
      const draftDocs = await tdsDraftService.getDocumentsDraft();
      if (draftDocs && draftDocs.length > 0) {
        const mergedDocs: TdsDocumentItem[] = INITIAL_TDS_DOCUMENTS.map((initialDoc: TdsDocumentItem) => {
          const draftDoc = draftDocs.find((d) => d.id === initialDoc.id);
          if (!draftDoc) return initialDoc;
          // Normalize status: TdsDocStatus only allows "not_uploaded" | "uploaded"
          const safeStatus: TdsDocumentItem["status"] =
            draftDoc.status === "uploaded" ? "uploaded" : "not_uploaded";
          return {
            ...initialDoc,
            ...draftDoc,
            iconType: initialDoc.iconType,  // preserve typed TdsDocIconType union
            title: initialDoc.title,
            subtitle: initialDoc.subtitle,
            status: safeStatus,
          } as TdsDocumentItem;
        });
        setDocuments(mergedDocs);
        documentsRef.current = mergedDocs;
      } else {
        setDocuments(INITIAL_TDS_DOCUMENTS);
        documentsRef.current = INITIAL_TDS_DOCUMENTS;
      }
    }
    loadDocs();
  }, []);

  const handleUploadSuccess = (id: string, payload: { uri: string; name: string }) => {
    setDocuments((prev) => {
      const next = prev.map((doc) => doc.id === id ? { ...doc, status: "uploaded" as const, fileUri: payload.uri, fileName: payload.name } : doc);
      documentsRef.current = next;
      return next;
    });
  };

  const handleUploadError = (id: string, errorMessage: string) => {
    setDocuments((prev) => {
      const next = prev.map((doc) => doc.id === id ? { ...doc, status: "not_uploaded" as const, errorMessage } : doc);
      documentsRef.current = next;
      return next;
    });
  };

  const handleRemove = (id: string) => {
    setDocuments((prev) => {
      const next = prev.map((doc) => doc.id === id ? { ...doc, status: "not_uploaded" as const, fileUri: undefined } : doc);
      documentsRef.current = next;
      return next;
    });
  };

  return {
    formData, errors, isIfscLoading, ifscError, isProfileLoading,
    isEditing, profileFetchError, fetchAndPopulateProfile,
    handleSaveProfile, updateBusiness, updateBank, updateIncome,
    handleIfscChange, handleContinue, isSaving, draftGuard,
    documents, handleUploadSuccess, handleUploadError, handleRemove,
  };
};
