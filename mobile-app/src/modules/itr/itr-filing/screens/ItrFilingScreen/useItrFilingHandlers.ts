import { Alert } from "react-native";
import type { useRouter } from "expo-router";
import { ItrApiService } from "../../services/ItrApiService";
import type { ItrFilingFormData } from "../../types/itrFiling.types";
import type { ApplicationState } from "@/store/applicationStore";

type ItrRouter = ReturnType<typeof useRouter>;

interface ItrHandlerDeps {
  formData: ItrFilingFormData;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  setStep: (step: number) => void;
  setBackendIds: (ids: { itrId?: string; incomeId?: string; documentId?: string }) => void;
  markSubmitted: () => void;
  clearItrDraft: () => void;
  createApplication: ApplicationState["createApplication"];
  router: ItrRouter;
}

export function useItrFilingHandlers(deps: ItrHandlerDeps) {
  const {
    formData, isSubmitting, setIsSubmitting, setStep, setBackendIds,
    markSubmitted, clearItrDraft, createApplication, router,
  } = deps;

  const handleStep1Continue = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (!formData.itrId) {
        const response = await ItrApiService.savePersonalInfo(formData);
        if (response?.itrId) setBackendIds({ itrId: response.itrId });
      } else {
        try {
          await ItrApiService.updatePersonalInfo(formData.itrId, formData);
        } catch {
          const response = await ItrApiService.savePersonalInfo(formData);
          if (response?.itrId) setBackendIds({ itrId: response.itrId });
        }
      }
      setStep(1);
    } catch (e: unknown) {
      Alert.alert("Error", (e as Error)?.message || "Failed to save personal information to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep1Update = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (formData.itrId) await ItrApiService.updatePersonalInfo(formData.itrId, formData);
      setStep(3);
    } catch (e: unknown) {
      Alert.alert("Error", (e as Error)?.message || "Failed to update personal information on the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Continue = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (formData.itrId && !formData.incomeId) {
        const response = await ItrApiService.saveSalaryIncome(formData.itrId, formData);
        if (response?.incomeId) setBackendIds({ incomeId: response.incomeId });
      } else if (formData.incomeId) {
        await ItrApiService.updateSalaryIncome(formData.incomeId, formData);
      }
      setStep(2);
    } catch {
      Alert.alert("Error", "Failed to save income information to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Update = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (formData.incomeId) await ItrApiService.updateSalaryIncome(formData.incomeId, formData);
      setStep(3);
    } catch {
      Alert.alert("Error", "Failed to update income information on the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep3Continue = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (formData.itrId && !formData.documentId) {
        const response = await ItrApiService.saveDocuments(formData.itrId, formData);
        if (response?.documentId) setBackendIds({ documentId: response.documentId });
      } else if (formData.documentId) {
        await ItrApiService.updateDocuments(formData.documentId, formData);
      }
      setStep(3);
    } catch {
      Alert.alert("Error", "Failed to save document information to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep3Update = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (formData.documentId) await ItrApiService.updateDocuments(formData.documentId, formData);
      setStep(3);
    } catch {
      Alert.alert("Error", "Failed to update documents on the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const uploadedDocItems = formData.documents
        .filter((d) => Boolean(d.fileUri) || d.isProfileVerified)
        .map((d) => ({
          id: d.id,
          name: d.name,
          fileUri: d.fileUri || "verified://profile",
          status: "Uploaded" as const,
          uploadedAt: d.uploadedAt || new Date().toISOString(),
        }));

      const serviceTitle = `ITR Filing - ${formData.determinedForm.formTitle}`;

      const generatedAppId = createApplication(
        "itr-filing",
        serviceTitle,
        "ITR",
        {
          assessmentYear: formData.personalInfo.assessmentYear,
          filingType: formData.personalInfo.filingType,
          formType: formData.determinedForm.form,
          formTitle: formData.determinedForm.formTitle,
          pan: formData.personalInfo.pan,
          name: formData.personalInfo.name,
          mobile: formData.personalInfo.mobile,
          email: formData.personalInfo.email,
          residentialStatus: formData.personalInfo.residentialStatus,
          bankName: formData.bankDetails.bankName,
          accountNumber: formData.bankDetails.accountNumber,
          ifscCode: formData.bankDetails.ifscCode,
          accountType: formData.bankDetails.accountType,
          regime: formData.regime,
          grossTotalIncome: formData.calculation.grossTotalIncome,
          totalDeductions: formData.calculation.totalDeductions,
          taxableIncome: formData.calculation.taxableIncome,
          totalTaxLiability: formData.calculation.totalTaxLiability,
          totalTaxesPaid: formData.calculation.totalTaxesPaid,
          finalAmount: formData.calculation.finalAmount,
          finalType: formData.calculation.finalType,
          hasPreviousItr: formData.priorItrNotice.hasPreviousItr,
          previousAckNumber: formData.priorItrNotice.previousAckNumber,
          hasTaxNotice: formData.priorItrNotice.hasTaxNotice,
        },
        uploadedDocItems,
        999,
        "Pending"
      );

      markSubmitted();
      clearItrDraft();
      setIsSubmitting(false);

      const activeIncomeLabels = [
        formData.incomeSources.salary.enabled ? "Salary" : null,
        formData.incomeSources.business.enabled ? "Business" : null,
        formData.incomeSources.houseProperty.enabled ? "House Property" : null,
        formData.incomeSources.capitalGains.enabled ? "Capital Gains" : null,
        formData.incomeSources.otherSources.enabled ? "Other Income" : null,
      ].filter(Boolean) as string[];

      const incomeSourcesSummary = activeIncomeLabels.join(" • ") || "Declared Income";
      const verifiedOrUploadedCount = formData.documents.filter(
        (d) => Boolean(d.fileUri) || d.isProfileVerified
      ).length;
      const maskedBank = formData.bankDetails.bankName
        ? `${formData.bankDetails.bankName} •••• ${formData.bankDetails.accountNumber.slice(-4)}`
        : "Primary Refund Bank";

      router.replace({
        pathname: "/service/itr-success",
        params: {
          applicationId: generatedAppId,
          serviceTitle,
          assessmentYear: formData.personalInfo.assessmentYear,
          formType: formData.determinedForm.form,
          incomeType: incomeSourcesSummary,
          regime: formData.regime === "new" ? "New Tax Regime" : "Old Tax Regime",
          uploadedDocsCount: String(verifiedOrUploadedCount),
          totalDocsCount: String(formData.documents.length),
          refundBank: maskedBank,
        },
      } as never);
    } catch (err: unknown) {
      setIsSubmitting(false);
      Alert.alert("Submission Error", (err as Error)?.message || "Could not submit application. Please try again.");
    }
  };

  return {
    handleStep1Continue,
    handleStep1Update,
    handleStep2Continue,
    handleStep2Update,
    handleStep3Continue,
    handleStep3Update,
    handleSubmitApplication,
  };
}
