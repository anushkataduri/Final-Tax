import type { Application } from "@/types/domain";

export type StatusCategory =
  | "ALL"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "UNDER_VERIFICATION";

export type NormalizedStatus = StatusCategory | "OTHER";

const COMPLETED_KEYWORDS = [
  "complete",
  "approved",
  "disbursed",
  "sanctioned",
  "certificate issued",
  "documents issued",
  "policy issued",
  "closed",
  "return filed",
  "e-verified",
  "everified",
] as const;

const VERIFICATION_KEYWORDS = [
  "under verification",
  "under review",
  "under scrutiny",
  "officer review",
  "officer scrutiny",
  "internal tax review",
  "ca review",
  "verification",
  "scrutiny",
  "submitted",
  "kyc pending",
  "documents under verification",
  "new request",
] as const;

const IN_PROGRESS_KEYWORDS = [
  "in progress",
  "progress",
  "processing",
  "document collection",
  "pending payment",
  "payment pending",
  "documents pending",
  "ready for filing",
  "return preparation",
  "data preparation",
  "customer approval",
  "customer review",
  "draft",
  "pending",
] as const;

export function normalizeApplicationStatus(status?: string): NormalizedStatus {
  if (!status || typeof status !== "string") {
    return "OTHER";
  }
  const s = status.trim().toLowerCase().replace(/_/g, " ");
  if (!s) {
    return "OTHER";
  }

  // Preserve terminal non-success statuses without falsely counting them
  if (
    s.includes("reject") ||
    s.includes("fail") ||
    s.includes("cancel") ||
    s.includes("suspend")
  ) {
    return "OTHER";
  }

  if (COMPLETED_KEYWORDS.some((kw) => s.includes(kw))) {
    return "COMPLETED";
  }

  if (s === "review" || VERIFICATION_KEYWORDS.some((kw) => s.includes(kw))) {
    return "UNDER_VERIFICATION";
  }

  if (IN_PROGRESS_KEYWORDS.some((kw) => s.includes(kw))) {
    return "IN_PROGRESS";
  }

  return "OTHER";
}

export function matchesStatusFilter(
  status: string | undefined,
  filter: StatusCategory
): boolean {
  if (filter === "ALL") {
    return true;
  }
  return normalizeApplicationStatus(status) === filter;
}

export function deduplicateApplications(apps: readonly Application[]): Application[] {
  const seenIds = new Set<string>();
  return apps.filter((app) => {
    const id = app?.id?.trim();
    if (!id || seenIds.has(id)) {
      return false;
    }
    seenIds.add(id);
    return true;
  });
}

export interface ApplicationEmptyStateDetails {
  title: string;
  subtitle: string;
  buttonText: string | null;
  resetType: "STATUS" | "SEARCH" | "ALL" | null;
}

export function getApplicationEmptyState(
  totalCount: number,
  statusFilter: StatusCategory,
  searchQuery: string
): ApplicationEmptyStateDetails {
  if (totalCount === 0) {
    return {
      title: "No applications yet",
      subtitle: "Your real submitted applications will appear here",
      buttonText: null,
      resetType: null,
    };
  }
  if (statusFilter === "IN_PROGRESS") {
    return {
      title: "No in-progress applications found",
      subtitle: "There are no applications currently in progress",
      buttonText: "Show All Applications",
      resetType: "STATUS",
    };
  }
  if (statusFilter === "COMPLETED") {
    return {
      title: "No completed applications found",
      subtitle: "There are no completed applications matching your criteria",
      buttonText: "Show All Applications",
      resetType: "STATUS",
    };
  }
  if (statusFilter === "UNDER_VERIFICATION") {
    return {
      title: "No applications under verification",
      subtitle: "There are no applications currently undergoing verification",
      buttonText: "Show All Applications",
      resetType: "STATUS",
    };
  }
  if (searchQuery.trim().length > 0) {
    return {
      title: `No results for "${searchQuery.trim()}"`,
      subtitle: "Check for typos or try clearing your search",
      buttonText: "Clear Search",
      resetType: "SEARCH",
    };
  }
  return {
    title: "No applications match your filter",
    subtitle: "Try resetting your active category filters",
    buttonText: "Reset Filters",
    resetType: "ALL",
  };
}

export function matchesCategoryFilter(
  app: Application,
  selectedFilterKey: string
): boolean {
  if (selectedFilterKey === "ALL") {
    return true;
  }
  const sid = (app.serviceId || "").toLowerCase();
  const cat = (app.category || "").toUpperCase();

  if (selectedFilterKey === "gst-registration") {
    return sid.includes("registration");
  }
  if (selectedFilterKey === "gst-amendment") {
    return sid.includes("amendment");
  }
  if (selectedFilterKey === "gst-filing") {
    return sid.includes("filing") && cat === "GST";
  }
  if (selectedFilterKey === "ITR") {
    return cat === "ITR" || sid.includes("itr") || sid.includes("tds");
  }
  if (selectedFilterKey === "LOANS") {
    return cat === "LOANS" || sid.startsWith("loan");
  }
  if (selectedFilterKey === "BUSINESS") {
    return cat === "BUSINESS" || sid.includes("company") || sid.includes("incorporation");
  }
  return true;
}

export function matchesSearchQuery(
  app: Application,
  searchQuery: string
): boolean {
  const q = searchQuery.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return (
    app.id.toLowerCase().includes(q) ||
    (app.serviceName || "").toLowerCase().includes(q) ||
    Boolean(app.formData?.arn && String(app.formData.arn).toLowerCase().includes(q)) ||
    Boolean(app.formData?.applicationId && String(app.formData.applicationId).toLowerCase().includes(q)) ||
    Boolean(app.formData?.gstin && String(app.formData.gstin).toLowerCase().includes(q)) ||
    Boolean(app.formData?.pan && String(app.formData.pan).toLowerCase().includes(q))
  );
}

export function getResumeRoute(app: Application): string {
  return (
    (app.formData?.resumeRoute as string) ||
    (app.serviceId === "tds-refund"
      ? "/service/tds-form"
      : `/service/${app.serviceId || "itr"}`)
  );
}


