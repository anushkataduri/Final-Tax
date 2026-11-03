import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useRevisedProgressStore } from "@/modules/itr/revisedItr/store/revisedProgressStore";
import {
  CommonPostSubmissionScreen,
  PostSubmissionConfig,
} from "../../components/submission/CommonPostSubmissionScreen";

export interface ApplicationSuccessScreenProps {
  config?: PostSubmissionConfig;
  onTrackStatus?: () => void;
  onDownloadAcknowledgement?: () => void;
}

export const ApplicationSuccessScreen: React.FC<ApplicationSuccessScreenProps> = ({
  config: providedConfig,
  onTrackStatus,
  onDownloadAcknowledgement,
}) => {
  const params = useLocalSearchParams<{
    applicationId?: string;
    serviceType?: string;
    serviceTitle?: string;
    formType?: string;
    assessmentYear?: string;
    incomeType?: string;
    regime?: string;
    uploadedDocsCount?: string;
    totalDocsCount?: string;
    refundBank?: string;
    originalAckNumber?: string;
    revisionReason?: string;
    status?: string;
  }>();

  const storeDocuments = useRevisedProgressStore((s) => s.documents);
  const isRevised = params.serviceType === "revised" || params.serviceTitle === "Revised ITR";

  const resolvedConfig: PostSubmissionConfig =
    providedConfig ||
    (isRevised
      ? {
        moduleType: "revised-itr",
        referenceId: params.applicationId || "",
        headerTitle: "Revised ITR",
        headerSubtitle: "Application Received",
        title: "Your Revised ITR application has been received.",
        description:
          "Your documents and revised tax information have been received. A Tax Executive will review them before preparing your return.",
        assessmentYear: params.assessmentYear || "AY 2025–26",
        formType: params.formType || "Revised ITR",
        incomeType: params.incomeType || "Revised Return Filing",
        revisionReason: params.revisionReason,
        originalAckNumber: params.originalAckNumber,
        uploadedDocsCount: storeDocuments
          ? storeDocuments.filter((d) => d.status === "uploaded" || !!d.fileUri).length
          : params.uploadedDocsCount || "0",
        totalDocsCount: storeDocuments
          ? storeDocuments.length
          : params.totalDocsCount || "0",
        status: params.status || "Received",
      }
      : {
        moduleType: "itr",
        referenceId: params.applicationId || "",
        headerTitle: params.serviceTitle || "ITR Filing",
        headerSubtitle: "Application Received",
        title: "Your application has been received!",
        description:
          "Your documents and tax information have been received. A Tax Executive will review them before preparing your return.",
        assessmentYear: params.assessmentYear || "AY 2025–26",
        formType: params.formType || "ITR Form",
        incomeType: params.incomeType || "Declared Income",
        taxRegime: params.regime || "New Tax Regime",
        uploadedDocsCount: params.uploadedDocsCount || "0",
        totalDocsCount: params.totalDocsCount || "0",
        refundBank: params.refundBank || "Verified Primary Bank",
        status: params.status || "Received",
      });

  return (
    <CommonPostSubmissionScreen
      config={resolvedConfig}
      onTrackStatus={onTrackStatus}
      onDownloadAcknowledgement={onDownloadAcknowledgement}
    />
  );
};

export default ApplicationSuccessScreen;
