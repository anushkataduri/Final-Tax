import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useApplicationStore } from "@/store/applicationStore";
import {
  CommonPostSubmissionScreen,
  TdsRefundPostSubmissionConfig,
} from "@/modules/itr/components/submission/CommonPostSubmissionScreen";
import { TdsRefundStatusScreenParams } from "../../types/tdsStatus.types";

export interface TdsRefundStatusScreenProps {
  config?: TdsRefundPostSubmissionConfig;
  onTrackStatus?: () => void;
  onDownloadAcknowledgement?: () => void;
}

export const TdsRefundStatusScreen: React.FC<TdsRefundStatusScreenProps> = ({
  config: providedConfig,
  onTrackStatus,
  onDownloadAcknowledgement,
}) => {
  const params = useLocalSearchParams() as unknown as TdsRefundStatusScreenParams;
  const tdsDraft = useApplicationStore((state) => state.tdsDraft);

  const draftForm = (tdsDraft?.formData || {}) as Record<string, any>;

  const bankName =
    draftForm?.bankDetails?.bankName ||
    draftForm?.bankName ||
    "Verified Primary Bank";

  const refundEstimate =
    draftForm?.estimatedRefund ||
    draftForm?.refundAmount ||
    (params as any)?.refundEstimate;

  const resolvedConfig: TdsRefundPostSubmissionConfig = providedConfig || {
    moduleType: "tds-refund",
    referenceId: params.applicationId || "",
    serviceName: params.serviceName || "TDS Refund",
    assessmentYear: params.assessmentYear || "AY 2025–26",
    submissionDate:
      params.appliedDate ||
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    estimatedRefund: refundEstimate,
    refundBank: bankName,
    uploadedDocsCount: Array.isArray(draftForm?.documents) ? draftForm.documents.length : 0,
    totalDocsCount: Array.isArray(draftForm?.documents) ? draftForm.documents.length : 0,
    status: "Under Verification",
    primaryCta: {
      label: "Track My Claim",
      destination: "/(main)/applications",
    },
    secondaryCta: {
      label: "Go Home",
      destination: "/(main)/home",
    },
  };

  return (
    <CommonPostSubmissionScreen
      config={resolvedConfig}
      onTrackStatus={onTrackStatus}
      onDownloadAcknowledgement={onDownloadAcknowledgement}
    />
  );
};

export default TdsRefundStatusScreen;
