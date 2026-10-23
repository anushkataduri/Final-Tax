/**
 * Hook: useGstFilingRestore
 * Encapsulates one-time hydration of GST Filing state from store drafts,
 * existing application records, and URL search parameters.
 */

import { useEffect } from "react";
import { useApplicationStore } from "@/store/applicationStore";
import { FilingDocItem } from "@/modules/gst/gst-filing/config/gstFilingDocumentsConfig";
import { GstFilingPeriodData } from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/GstFilingPeriodStep";
import { syncPreviousAppDocuments } from "@/modules/gst/gst-filing/hooks/gstFilingHelpers";

interface UseGstFilingRestoreProps {
  params: {
    appId?: string;
    step?: string;
    filingId?: string;
    id?: string;
  };
  setFilingId: (id: string | null | ((prev: string | null) => string | null)) => void;
  setCreatedAppId: (id: string) => void;
  setCurrentStep: (step: number) => void;
  setPeriodData: React.Dispatch<React.SetStateAction<GstFilingPeriodData>>;
  setDocuments: React.Dispatch<React.SetStateAction<FilingDocItem[]>>;
}

export function useGstFilingRestore({
  params,
  setFilingId,
  setCreatedAppId,
  setCurrentStep,
  setPeriodData,
  setDocuments,
}: UseGstFilingRestoreProps) {
  const gstFilingDraft = useApplicationStore((state) => state.gstFilingDraft);

  useEffect(() => {
    const restoreTimer = setTimeout(() => {
      const routeFilingId =
        params.filingId ||
        params.id ||
        (params.appId?.startsWith("FIL") ? params.appId : undefined);
      if (routeFilingId) {
        setFilingId(routeFilingId);
      }

      if (params.appId) {
        const existingApp = useApplicationStore
          .getState()
          .applications.find((a) => a.id === params.appId);
        if (existingApp) {
          setCreatedAppId(existingApp.id);
          const fData = (existingApp.formData || {}) as Record<string, unknown>;
          const s = (v: unknown): string | undefined => typeof v === "string" ? v : undefined;
          if (fData.filingId || fData.gstfilingId || existingApp.id.startsWith("FIL")) {
            setFilingId(s(fData.filingId) || s(fData.gstfilingId) || existingApp.id);
          }
          setPeriodData((prev) => ({
            ...prev,
            gstin: s(fData.gstin) || prev.gstin,
            businessName:
              s(fData.businessName) ||
              s(fData.tradeName) ||
              s(fData.applicantName) ||
              prev.businessName,
            tradeName: s(fData.tradeName) || s(fData.businessName) || prev.tradeName,
            taxpayerScheme: s(fData.taxpayerScheme) || prev.taxpayerScheme,
            filingNature: (s(fData.filingNature) || prev.filingNature) as "Regular Return" | "Nil Return" | undefined,
            financialYear: s(fData.financialYear) || prev.financialYear,
            filingPeriod:
              s(fData.filingPeriod) || s(fData.filingMonth) || prev.filingPeriod,
            filingMonth:
              s(fData.filingMonth) || s(fData.filingPeriod) || prev.filingMonth,
            filingType: s(fData.filingType) || prev.filingType,
            filingFrequency: s(fData.filingFrequency) || prev.periodType,
            periodType: s(fData.filingFrequency) || prev.periodType,
            calculationMethod:
              (s(fData.calculationMethod) as "ca_assisted" | "manual_estimates" | undefined) ||
              (fData.taxablePurchases || fData.taxableSales || fData.turnover || fData.eligibleItc
                ? "manual_estimates"
                : prev.calculationMethod),
            taxableSales: s(fData.taxableSales) || s(fData.turnover) || prev.taxableSales,
            turnover: s(fData.turnover) || s(fData.taxableSales) || prev.turnover,
            taxablePurchases: s(fData.taxablePurchases) || prev.taxablePurchases,
            eligibleItc: s(fData.eligibleItc) || prev.eligibleItc,
          }));

          if (
            Array.isArray(existingApp.documents) &&
            existingApp.documents.length > 0
          ) {
            setDocuments((prevDocs) =>
              syncPreviousAppDocuments(prevDocs, existingApp.documents),
            );
          }

          if (params.step) {
            const stepNum = parseInt(params.step, 10);
            if (!isNaN(stepNum)) setCurrentStep(stepNum);
          } else {
            setCurrentStep(2);
          }
          return;
        }
      }

      if (gstFilingDraft) {
        if (gstFilingDraft.createdFilingId) {
          setFilingId((prev) => prev || gstFilingDraft.createdFilingId || null);
        }
        if (gstFilingDraft.periodData) {
          setPeriodData((prev) => ({ ...prev, ...gstFilingDraft.periodData }));
        }
        if (gstFilingDraft.documents && gstFilingDraft.documents.length > 0) {
          setDocuments(gstFilingDraft.documents as FilingDocItem[]);
        }
        if (
          typeof gstFilingDraft.stepIndex === "number" &&
          gstFilingDraft.stepIndex < 4 &&
          !params.step
        ) {
          setCurrentStep(gstFilingDraft.stepIndex);
        }
      }
    }, 0);

    return () => clearTimeout(restoreTimer);
  }, [gstFilingDraft, params.appId, params.filingId, params.id, params.step, setCreatedAppId, setCurrentStep, setDocuments, setFilingId, setPeriodData]);
}
