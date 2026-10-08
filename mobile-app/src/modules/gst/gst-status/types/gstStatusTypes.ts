export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  status: "completed" | "active" | "pending";
}

export interface GstApplicationStatusStepProps {
  appId?: string;
  appliedDate?: string;
  businessName?: string;
  serviceName?: string;
  estCompletion?: string;
  isFilingWorkflow?: boolean;
  onReuploadDocuments?: () => void;
}
