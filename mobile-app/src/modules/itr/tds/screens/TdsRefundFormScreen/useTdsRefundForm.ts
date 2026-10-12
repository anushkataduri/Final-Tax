import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { useCustomerStore } from "@/modules/customer/store/customerStore";
import { useTdsProgressStore } from "../../store/tdsProgressStore";
import { authApi } from "@/modules/authentication/services/authApi";
import { ifscService } from "@/modules/gst/services/ifscService";
import type { Customer } from "@/shared/types/domain";
import {
  TdsCustomerIncomeFormData,
  PersonalDetails,
} from "../../types/customerIncome.types";
import { cleanIfsc } from "../../utils/tdsValidation";
import {
  validateCustomerIncomeForm,
  CustomerFormErrors,
} from "../../validation/tdsCustomerSchema";
import {
  tdsDraftService,
  INITIAL_TDS_FORM_DATA,
  getTdsCustId,
} from "../../services/tdsDraftService";
import { tdsApiService } from "../../services/tdsApiService";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { ApiError } from "@/core/api/apiError";
import { UpdateBankField, UpdateIncomeField } from "./TdsRefundFormSections.types";
import { useTdsProfileSync } from "./useTdsProfileSync";

const describeSaveError = (err: unknown): string => {
  if (err instanceof ApiError) {
    if (err.code === "NETWORK_ERROR") return err.message;
    if (err.statusCode === 401) {
      return "Your session has expired. Please log in again and retry.";
    }
    if (err.statusCode === 403) {
      return `${err.message}\n\nThe server refused this request. Please log in again; if it persists, the TDS service may not be available on this server.`;
    }
    return err.message;
  }
  return (err as any)?.message || "Failed to save your TDS details. Please try again.";
};

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
  const [isEditing, setIsEditing] = useState(isEditingParam === "true");
  const [ifscError, setIfscError] = useState<string | null>(null);

  const { isProfileLoading, profileFetchError, fetchAndPopulateProfile } = useTdsProfileSync(setFormData);

  const initialSnapshotRef = useRef<string | null>(null);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const isSavingRef = useRef(false);

  const documentsRef = useRef<any[]>([]);

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

      let backendApp: any = null;
      try {
        const routeAppId = (paramId || paramAppId) as string | undefined;
        const existingAppId = routeAppId || (await tdsDraftService.getApplicationId());
        if (existingAppId) {
          await tdsDraftService.saveApplicationId(existingAppId);
        }
        backendApp = custId
          ? await tdsApiService.fetchFullTdsApplication(custId, existingAppId || undefined)
          : null;
        if (backendApp?.tdsRefundId) {
          await tdsDraftService.saveApplicationId(backendApp.tdsRefundId);
        }
      } catch (err) {
        console.warn("[TDS Screen] Backend fetch warning:", err);
      }

      setFormData((prev) => {
        const mergedBank = { ...prev.bank, ...(backendApp?.bank || {}), ...(draftBank || {}) };
        const mergedIncome = { ...prev.income, ...(backendApp?.income || {}), ...(draftIncome || {}) };
        const mergedBusiness = { ...prev.business, ...(backendApp?.business || {}), ...(draftBusiness || {}) };
        
        initialSnapshotRef.current = JSON.stringify({ bank: mergedBank, income: mergedIncome, business: mergedBusiness });
        
        return {
          ...prev,
          bank: mergedBank,
          income: mergedIncome,
          business: mergedBusiness,
          personal: freshPersonal || prev.personal,
        };
      });
    }
    loadData();
  }, []);

  const handleSaveProfile = async (updated: PersonalDetails) => {
    const cleanMob = updated.mobileNumber ? updated.mobileNumber.replace(/\D/g, "").slice(-10) : "";
    const normalizedPersonal: PersonalDetails = {
      ...updated,
      mobileNumber: cleanMob || updated.mobileNumber,
    };

    const nextFormState: TdsCustomerIncomeFormData = {
      ...formData,
      personal: normalizedPersonal,
      bank: {
        ...formData.bank,
        accountHolderName: formData.bank.accountHolderName || normalizedPersonal.fullName,
      },
    };

    setFormData(nextFormState);

    const currentCust = useAuthStore.getState().customer;
    const currentAuthUser = useAuthStore.getState().authenticatedUser;

    const updatedCustomer: Customer = {
      name: normalizedPersonal.fullName,
      email: normalizedPersonal.email,
      mobile: cleanMob || normalizedPersonal.mobileNumber,
      pan: normalizedPersonal.pan,
      aadhaar: normalizedPersonal.aadhaar,
      dob: normalizedPersonal.dob,
      customerType: currentCust?.customerType || "Individual",
      addressLine1: normalizedPersonal.residentialAddress,
      addressLine2: currentCust?.addressLine2 || "",
      city: normalizedPersonal.city,
      state: normalizedPersonal.state,
      pincode: normalizedPersonal.pinCode,
      address: `${normalizedPersonal.residentialAddress}, ${normalizedPersonal.city}, ${normalizedPersonal.state} - ${normalizedPersonal.pinCode}`,
      customerId: currentCust?.customerId || (currentAuthUser as any)?.customerId || (currentAuthUser as any)?.custId || "",
      avatarUri: currentCust?.avatarUri || null,
      profileCompleted: true,
      hasPasscode: currentCust?.hasPasscode ?? Boolean(currentAuthUser?.passcode),
    };

    useAuthStore.setState({ customer: updatedCustomer, profileCompleted: true });
    try {
      useCustomerStore.getState().setProfile(updatedCustomer);
    } catch {}

    try {
      const existingUser = authStorage.getUser() || {};
      authStorage.saveUser({
        ...existingUser,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        mobileNumber: updatedCustomer.mobile,
        pan: updatedCustomer.pan,
        aadhaar: updatedCustomer.aadhaar,
        dob: updatedCustomer.dob,
        address: `${updatedCustomer.addressLine1 || ""} ${updatedCustomer.addressLine2 || ""}`.trim(),
        addressLine1: updatedCustomer.addressLine1,
        addressLine2: updatedCustomer.addressLine2,
        city: updatedCustomer.city,
        state: updatedCustomer.state,
        pincode: updatedCustomer.pincode,
        customerType: updatedCustomer.customerType,
      } as any);

      if (cleanMob) {
        authStorage.saveSession({
          ...authStorage.getSession(),
          isLoggedIn: true,
          activeMobile: cleanMob,
        });
      }
    } catch {}

    try {
      console.log("🚀 [TDS Form] Calling authApi.updateCustomerProfile for customer:", updatedCustomer.mobile);
      const updateResult = await authApi.updateCustomerProfile({
        custId: updatedCustomer.customerId || undefined,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        mobileNumber: updatedCustomer.mobile,
        pan: updatedCustomer.pan,
        aadhaar: updatedCustomer.aadhaar,
        dob: updatedCustomer.dob,
        addressLine1: updatedCustomer.addressLine1,
        addressLine2: updatedCustomer.addressLine2,
        city: updatedCustomer.city,
        state: updatedCustomer.state,
        pincode: updatedCustomer.pincode,
        address: updatedCustomer.address,
      });

      if (updateResult.success) {
        console.log("✅ [TDS Form] Customer profile updated successfully on backend!");
      } else {
        console.warn("⚠️ [TDS Form] Customer profile update warning from backend:", updateResult.message);
      }
    } catch (err: any) {
      console.warn("⚠️ [TDS Form] Error sending customer update to backend:", err?.message);
    }

    await tdsDraftService.saveFormDraft(nextFormState);
  };

  const updateBank: UpdateBankField = (field, value) => {
    setHasUserEdited(true);
    setFormData((prev) => ({
      ...prev,
      bank: { ...prev.bank, [field]: value },
    }));

    const errorKey = `bank.${field}` as keyof CustomerFormErrors;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const updateIncome: UpdateIncomeField = (field, value) => {
    setHasUserEdited(true);
    setFormData((prev) => ({
      ...prev,
      income: { ...prev.income, [field]: value },
    }));

    const errorKey = `income.${field}` as keyof CustomerFormErrors;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
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
          bank: {
            ...prev.bank,
            ifscCode: cleaned,
            bankName: details.bank,
            branchName: details.branch,
            isIfscVerified: true,
          },
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
        bank: {
          ...prev.bank,
          bankName: "",
          branchName: "",
          isIfscVerified: false,
        },
      }));
    }
  };

  const updateBusiness = (field: string, value: string) => {
    setHasUserEdited(true);
    setFormData((prev) => ({
      ...prev,
      business: { ...prev.business, [field]: value },
    }));

    const errorKey = `business.${field}` as keyof CustomerFormErrors;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const handleContinue = async () => {
    const activeDocs =
      documentsRef.current && documentsRef.current.length > 0
        ? documentsRef.current
        : documents;

    const validation = validateCustomerIncomeForm(formData);
    const hasMissingMandatoryDocs = activeDocs.some((doc) => doc.isMandatory && doc.status !== 'uploaded');

    if (!validation.isValid || hasMissingMandatoryDocs) {
      if (!validation.isValid) setErrors(validation.errors);
      
      if (hasMissingMandatoryDocs) {
        Alert.alert(
          "Incomplete Documents",
          "Please upload all mandatory documents (PAN and Aadhaar) to proceed."
        );
      } else {
        Alert.alert(
          "Incomplete Information",
          "Please complete all required fields correctly to proceed."
        );
      }
      return;
    }

    if (isSavingRef.current) return;
    isSavingRef.current = true;

    await tdsDraftService.saveFormDraft(formData);
    await tdsDraftService.saveDocumentsDraft(activeDocs);

    try {
      const custId = getTdsCustId(formData.personal.mobileNumber);
      const draftAppId = await tdsDraftService.getApplicationId();
      let targetId = ((paramId || paramAppId || draftAppId) as string | undefined)?.trim();

      // Fallback: If editing and no targetId found, attempt lookup by custId
      if (!targetId && custId) {
        try {
          const existingDb = await tdsApiService.getBankAccountByCustId(custId);
          if (existingDb?.id) {
            targetId = existingDb.id;
            await tdsDraftService.saveApplicationId(targetId);
          }
        } catch (findErr) {
          console.warn("[TDS Form] Cust ID lookup fallback warning:", findErr);
        }
      }

      console.log(`🚀 [TDS Form] handleContinue -> isEditing: ${isEditing}, targetId: ${targetId}`);

      let savedTdsId: string;
      if (isEditing && targetId) {
        console.log(`🌐 [TDS Form] Updating record via PUT /tds-refund/update/${targetId}`);
        savedTdsId = await tdsApiService.updateBankAccount(
          targetId,
          formData.bank,
          custId,
          formData.business,
          activeDocs as any,
          formData.personal,
        );

        // Auxiliary updates
        try {
          await tdsApiService.saveIncomeTaxInfo(formData.income, targetId);
        } catch (e) {
          console.warn("[TDS Form] saveIncomeTaxInfo auxiliary update warning:", e);
        }
        try {
          await tdsApiService.saveTdsTaxesPaid(formData.income, custId, targetId);
        } catch (e) {
          console.warn("[TDS Form] saveTdsTaxesPaid auxiliary update warning:", e);
        }
        const hasUploadedDocs = (activeDocs as any[]).some(
          (d) => d.status === "uploaded" || Boolean(d.fileUri),
        );
        if (hasUploadedDocs) {
          try {
            await tdsApiService.saveDocuments(activeDocs as any, targetId);
          } catch (e) {
            console.warn("[TDS Form] saveDocuments auxiliary update warning:", e);
          }
        }
      } else {
        savedTdsId = await tdsApiService.saveFullTdsApplication(
          formData,
          activeDocs as any,
          custId,
          targetId,
        );
      }

      await tdsDraftService.saveApplicationId(savedTdsId || targetId || "");
    } catch (err) {
      console.error("[TDS Screen] Backend update/save failed:", err);
      Alert.alert("Unable to Save Application", describeSaveError(err));
      return;
    } finally {
      isSavingRef.current = false;
    }

    draftGuard.markSubmitted();
    
      if (useTdsProgressStore.getState().maxStepReached >= 3) {
        router.push("/service/tds-estimate" as any);
      } else {
        useTdsProgressStore.getState().setMaxStepReached(3); // Setting to 3 to simulate passing documents
        router.push("/service/tds-estimate" as any);
      }

  };

  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    async function loadDocs() {
      const { INITIAL_TDS_DOCUMENTS } = await import("../../constants/tdsDocuments.constants");
      const draftDocs = await tdsDraftService.getDocumentsDraft();
      if (draftDocs && draftDocs.length > 0) {
        const mergedDocs = INITIAL_TDS_DOCUMENTS.map(initialDoc => {
          const draftDoc = draftDocs.find((d: any) => d.id === initialDoc.id);
          return draftDoc ? { ...initialDoc, ...draftDoc, title: initialDoc.title, subtitle: initialDoc.subtitle } : initialDoc;
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

  const handleUploadSuccess = (id: string, payload: any) => {
    setDocuments((prev) => {
      const next = prev.map((doc) => doc.id === id ? { ...doc, status: "uploaded", fileUri: payload.uri, fileName: payload.name } : doc);
      documentsRef.current = next;
      return next;
    });
  };
  const handleUploadError = (id: string, errorMessage: string) => {
    setDocuments((prev) => {
      const next = prev.map((doc) => doc.id === id ? { ...doc, status: "not_uploaded", errorMessage } : doc);
      documentsRef.current = next;
      return next;
    });
  };
  const handleRemove = (id: string) => {
    setDocuments((prev) => {
      const next = prev.map((doc) => doc.id === id ? { ...doc, status: "not_uploaded", fileUri: undefined } : doc);
      documentsRef.current = next;
      return next;
    });
  };

  return {
    formData,
    errors,
    isIfscLoading,
    ifscError,
    isProfileLoading,
    isEditing,
    profileFetchError,
    fetchAndPopulateProfile,
    handleSaveProfile,
    updateBusiness,
    updateBank,
    updateIncome,
    handleIfscChange,
    handleContinue,
    draftGuard,
    documents,
    handleUploadSuccess,
    handleUploadError,
    handleRemove,
  };

};

