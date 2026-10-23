import { useState, useEffect } from "react";
import { useApplicationStore } from "@/store/applicationStore";
import { logger } from "@/core/logging/logger";
import type { TdsCustomerIncomeFormData } from "../../types/customerIncome.types";
import type { TdsChecklistItem } from "../../types/checklist.types";
import type { TaxCalculationBreakdown } from "../../types/estimate.types";
import { tdsDraftService, INITIAL_TDS_FORM_DATA } from "../../services/tdsDraftService";
import { tdsCalculationService } from "../../services/tdsCalculationService";
import { tdsApiService } from "../../services/tdsApiService";
import { useTdsProgressStore } from "../../store/tdsProgressStore";

interface UseTdsEstimateDataResult {
  formData: TdsCustomerIncomeFormData;
  documents: TdsChecklistItem[];
  calculation: TaxCalculationBreakdown | null;
  isLoading: boolean;
  currentAppId: string | null;
  setCurrentAppId: (id: string | null) => void;
}

export function useTdsEstimateData(
  routeId?: string,
  routeAppId?: string
): UseTdsEstimateDataResult {
  const [formData, setFormData] = useState<TdsCustomerIncomeFormData>(INITIAL_TDS_FORM_DATA);
  const [documents, setDocuments] = useState<TdsChecklistItem[]>([]);
  const [calculation, setCalculation] = useState<TaxCalculationBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAppId, setCurrentAppId] = useState<string | null>((routeId || routeAppId) ?? null);

  useEffect(() => {
    useTdsProgressStore.getState().setMaxStepReached(3);

    let isMounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const savedForm = await tdsDraftService.getFormDraft();
        const savedDocs = await tdsDraftService.getDocumentsDraft();
        const existingAppId = routeId || routeAppId || (await tdsDraftService.getApplicationId()) || undefined;

        if (existingAppId && isMounted) setCurrentAppId(existingAppId);

        const custId = savedForm.personal?.mobileNumber
          ? savedForm.personal.mobileNumber.replace(/\D/g, "")
          : "CUST-DEFAULT";

        let finalForm: TdsCustomerIncomeFormData = {
          ...savedForm,
          business: { ...(savedForm.business ?? { legalName: "", pan: "", aadhaar: "", mobileNumber: "" }) },
          bank: { ...savedForm.bank },
          personal: { ...savedForm.personal },
          income: { ...savedForm.income },
        };
        let finalDocs: TdsChecklistItem[] = Array.isArray(savedDocs) && savedDocs.length > 0 ? [...savedDocs] : [];

        let dbDetails: Record<string, unknown> | null = null;
        if (existingAppId) {
          try {
            dbDetails = await tdsApiService.getTdsRefund(existingAppId) as unknown as Record<string, unknown>;
          } catch (getErr) {
            logger.debug("[TdsEstimateData] Could not fetch application by ID", { error: getErr });
          }
        }

        if (!dbDetails && custId !== "CUST-DEFAULT") {
          try {
            dbDetails = await tdsApiService.getBankAccountByCustId(custId) as unknown as Record<string, unknown>;
          } catch (custErr) {
            logger.debug("[TdsEstimateData] Could not fetch by custId", { error: custErr });
          }
        }

        if (dbDetails) {
          if (typeof dbDetails.id === "string" && isMounted) {
            setCurrentAppId(dbDetails.id);
            await tdsDraftService.saveApplicationId(dbDetails.id);
          }

          finalForm = {
            ...finalForm,
            business: {
              legalName: (dbDetails.legalBusinessName as string) || finalForm.business?.legalName || "",
              pan: (dbDetails.businessPan as string) || finalForm.business?.pan || "",
              aadhaar: (dbDetails.aadhaarNumber as string) || finalForm.business?.aadhaar || "",
              mobileNumber: (dbDetails.mobileNumber as string) || finalForm.business?.mobileNumber || "",
            },
            bank: {
              accountHolderName: (dbDetails.accountHolderName as string) || finalForm.bank?.accountHolderName || "",
              accountNumber: (dbDetails.accountNumber as string) || finalForm.bank?.accountNumber || "",
              confirmAccountNumber: (dbDetails.confirmAccountNumber as string) || (dbDetails.accountNumber as string) || finalForm.bank?.confirmAccountNumber || "",
              ifscCode: (dbDetails.ifscCode as string) || finalForm.bank?.ifscCode || "",
              bankName: (dbDetails.bankName as string) || finalForm.bank?.bankName || "",
              branchName: (dbDetails.branchName as string) || finalForm.bank?.branchName || "",
              accountType: ((dbDetails.accountType as string)?.toLowerCase() === "current" ? "current" : "savings") as TdsCustomerIncomeFormData["bank"]["accountType"],
              isIfscVerified: Boolean(dbDetails.bankName),
            },
            personal: {
              ...finalForm.personal,
              fullName: finalForm.personal?.fullName || (dbDetails.accountHolderName as string) || (dbDetails.legalBusinessName as string) || "",
              pan: finalForm.personal?.pan || (dbDetails.businessPan as string) || "",
              mobileNumber: finalForm.personal?.mobileNumber || (dbDetails.mobileNumber as string) || "",
              aadhaar: finalForm.personal?.aadhaar || (dbDetails.aadhaarNumber as string) || "",
            },
          };

          if (dbDetails.businessPanDocument) {
            const existing = finalDocs.find((d) => d.id === "pan");
            if (existing) {
              existing.status = "uploaded";
              existing.fileName = existing.fileName || "Business_PAN.pdf";
            } else {
              finalDocs.push({ id: "pan", title: "Business PAN", subtitle: "Stored in Database", status: "uploaded", fileName: "Business_PAN.pdf", isMandatory: true } as TdsChecklistItem);
            }
          }

          if (dbDetails.aadhaarDocument) {
            const existing = finalDocs.find((d) => d.id === "aadhaar");
            if (existing) {
              existing.status = "uploaded";
              existing.fileName = existing.fileName || "Aadhaar_Card.pdf";
            } else {
              finalDocs.push({ id: "aadhaar", title: "Aadhaar Card", subtitle: "Stored in Database", status: "uploaded", fileName: "Aadhaar_Card.pdf", isMandatory: true } as TdsChecklistItem);
            }
          }
        }

        try {
          const backendApp = await tdsApiService.fetchFullTdsApplication(custId, existingAppId);
          if (backendApp?.income) {
            finalForm = { ...finalForm, income: { ...finalForm.income, ...backendApp.income } };
          }
        } catch (err) {
          logger.debug("[TdsEstimateData] Backend auxiliary fetch skipped", { error: err });
        }

        if (isMounted) {
          setFormData(finalForm);
          setDocuments(finalDocs);
          setCalculation(tdsCalculationService.calculate(finalForm));
          useApplicationStore.getState().saveTdsDraft({ step: "ESTIMATE" });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return { formData, documents, calculation, isLoading, currentAppId, setCurrentAppId };
}
