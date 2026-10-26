import type { Application, TimelineStep } from "@/types/domain";
import { logger } from "@/core/logging/logger";
import { getErrorMessage } from "@/core/error-handling/errorMessage";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return "Today";
  if (MONTH_NAMES.some((m) => dateStr.includes(m))) return dateStr;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch (error) {
    logger.debug("Failed to format date string", { dateStr, error: getErrorMessage(error) });
  }
  return dateStr;
}

export function calculateExpectedDate(dateStr?: string): string {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.trim()) {
    return "Unavailable";
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return "Unavailable";
    }
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
  } catch (error) {
    logger.debug("Failed to calculate expected date", { dateStr, error: getErrorMessage(error) });
    return "Unavailable";
  }
}

export function getServiceSpecificTimeline(app: Application, appliedDate: string): TimelineStep[] {
  const isCompleted =
    app.status?.toLowerCase().includes("complete") ||
    app.status?.toLowerCase().includes("approved") ||
    app.status?.toLowerCase().includes("disbursed");

  const sid = (app.serviceId || "").toLowerCase();
  const cat = (app.category || "").toUpperCase();

  let baseSteps: { title: string; description: string }[] = [];

  if (sid.includes("amendment")) {
    const isCore = String(app.formData?.isCore).toLowerCase() !== "false";
    baseSteps = [
      { title: "Amendment Submitted", description: "Request submitted with supporting documents" },
      { title: "Under Verification", description: "TaxEdge CA reviewing amendment details" },
      { title: "Officer Review", description: isCore ? "Assessing officer reviewing the core changes" : "System auto-verification" },
      { title: "Amended Registration", description: "Updated registration certificate issued" },
    ];
  } else if (sid.includes("cancellation")) {
    baseSteps = [
      { title: "Cancellation Submitted", description: "Form REG-16 submitted" },
      { title: "Liability & Reversal Check", description: "Verification of stock and ITC liabilities" },
      { title: "Officer Scrutiny", description: "Tax officer reviewing cancellation grounds" },
      { title: "Cancellation Order (REG-19)", description: "Final registration cancellation issued" },
    ];
  } else if (sid.includes("filing") && cat === "GST") {
    baseSteps = [
      { title: "Filing Data Submitted", description: "Sales, purchase & turnover details received" },
      { title: "CA Reconciliation & Verification", description: "Input Tax Credit & output liability matching" },
      { title: "Return Preparation", description: "Return computation & dual-regime check" },
      { title: "Portal E-Filing & ARN", description: "Filing confirmed and ARN generated" },
    ];
  } else if (cat === "GST" || sid.includes("gst")) {
    baseSteps = [
      { title: "Application Submitted", description: "Application details and documents filed online" },
      { title: "Document Verification", description: "Review of identity, premises and constitution proofs" },
      { title: "TRN & ARN Processing", description: "Temporary and Application Reference Number processing" },
      { title: "GST Certificate Issuance", description: "Final GSTIN approval and certificate issued" },
    ];
  } else if (sid.includes("notice")) {
    baseSteps = [
      { title: "Notice Details Submitted", description: "Tax notice and response inputs received" },
      { title: "CA Case Evaluation", description: "Analysis of assessment issues and grounds" },
      { title: "Draft Response Preparation", description: "Preparation of detailed reply and supporting proofs" },
      { title: "Response E-Filing", description: "Submission on Income Tax compliance portal" },
    ];
  } else if (cat === "ITR" || sid.includes("itr") || sid.includes("tds")) {
    baseSteps = [
      { title: "Return Information Submitted", description: "Income, deductions & personal details received" },
      { title: "CA Computation & Verification", description: "Form 26AS/AIS reconciliation & calculation" },
      { title: "ITR E-Filing", description: "Filing with Income Tax Department e-Filing portal" },
      { title: "ITR-V & Department Processing", description: "Centralized Processing Center (CPC) acknowledgment" },
    ];
  } else if (cat === "LOANS" || sid.startsWith("loan")) {
    baseSteps = [
      { title: "Loan Application Submitted", description: "Borrower details and financial profiles received" },
      { title: "Document & KYC Verification", description: "Verification of identity, income proofs and credit profile" },
      { title: "Credit Assessment & Underwriting", description: "Lender review and loan sanction proposal" },
      { title: "Sanction & Disbursement", description: "Sanction letter issuance and loan disbursement" },
    ];
  } else if (cat === "BUSINESS" || sid.includes("company") || sid.includes("incorporation")) {
    baseSteps = [
      { title: "Incorporation Request Submitted", description: "Name choices, director details & constitution received" },
      { title: "DSC & Document Verification", description: "Digital signature verification and SPICe+ preparation" },
      { title: "ROC Filing & Name Approval", description: "Submission to Ministry of Corporate Affairs (MCA)" },
      { title: "Certificate of Incorporation", description: "COI, PAN and TAN issuance" },
    ];
  } else {
    baseSteps = [
      { title: "Application Submitted", description: "Application details and documents received" },
      { title: "Under Verification", description: "Executive reviewing submitted details" },
      { title: "Processing & Fulfillment", description: "Service execution in progress" },
      { title: "Completed", description: "Confirmation and final deliverables dispatched" },
    ];
  }

  return baseSteps.map((step, idx) => {
    let status: TimelineStep["status"] = "pending";
    let date: string | undefined = undefined;

    if (isCompleted) {
      status = "completed";
      date = appliedDate;
    } else if (idx === 0) {
      status = "completed";
      date = appliedDate;
    } else if (idx === 1) {
      status = "current";
      date = appliedDate;
    } else {
      status = "pending";
    }

    return {
      title: step.title,
      description: step.description,
      status,
      date,
    };
  });
}

export function getDefaultTimeline(app: Application, appliedDate: string): TimelineStep[] {
  return getServiceSpecificTimeline(app, appliedDate);
}
