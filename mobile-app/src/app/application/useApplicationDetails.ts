import { useAuthStore } from "@/store/authStore";
import type { Application, TimelineStep } from "@/types/domain";
import type { DetailTab } from "@/components/screens/application/ApplicationHeader";
import {
  formatDisplayDate,
  calculateExpectedDate,
  getGstAmendmentTimeline,
  getDefaultTimeline,
} from "@/components/screens/application/applicationDetailsUtils";

type KeyVal = { key: string; val: string };

export interface ApplicationDetails {
  isGstAmendment: boolean;
  formData: Record<string, unknown>;
  isCore: boolean;
  displayId: string;
  displayName: string;
  applicantName: string;
  isLoans: boolean;
  appliedDate: string;
  assignedCA: string;
  expectedDate: string;
  uploadedDocs: number;
  isPaid: boolean;
  totalAmount: number;
  baseServiceFee: number;
  gstAmount: number;
  timelineSteps: TimelineStep[];
  headerInfo: { nav: string; title: string; sub: string };
  overviewRows: KeyVal[];
  filingRows: KeyVal[];
  estimateRows: KeyVal[];
  registrationRows: KeyVal[];
  paymentRows: KeyVal[];
}

export function useApplicationDetails(
  app: Application,
  activeTab: DetailTab
): ApplicationDetails {
  const isGstAmendment = app.serviceId === "gst-amendment";
  const formData = (app.formData || {}) as Record<string, unknown>;

  const isNonCore =
    formData.isCore === false ||
    formData.isCore === "false" ||
    Boolean((formData.amendmentCategory as string)?.toLowerCase().includes("non-core")) ||
    (formData.section
      ? ["Bank Accounts", "Authorised Signatories", "Contact Details"].some((s) =>
          (formData.section as string)?.includes(s)
        )
      : false);
  const isCore = isGstAmendment && !isNonCore;

  const displayId =
    isGstAmendment && formData.arn ? String(formData.arn) : app.id;
  const displayName =
    isGstAmendment && formData.section
      ? `GST Amendment — ${formData.section}`
      : app.serviceName;

  const currentCustomerName = useAuthStore.getState().customer?.name;
  const applicantName =
    (formData.applicantName as string) ||
    (isGstAmendment
      ? ((formData.currentValues as Record<string, string>)?.["Legal Business Name"] || "Registered Taxpayer")
      : (formData.businessName as string) ||
        (formData.tradeName as string) ||
        currentCustomerName ||
        "Verified Business");

  const isLoans =
    app.category === "LOANS" ||
    (app.serviceId || "").startsWith("loan") ||
    app.serviceId === "machinery-loan";

  const appliedDate =
    (formData.submissionDate as string) || formatDisplayDate(app.createdAt);
  const assignedCA = isLoans
    ? "TaxEdge Loan Agent"
    : app.assignedExecutive && app.assignedExecutive.trim() !== ""
      ? app.assignedExecutive.trim()
      : isGstAmendment
        ? isCore ? "GST Verification Officer" : "Auto-Verification Engine"
        : "CA not assigned yet";
  const expectedDate = isGstAmendment
    ? isCore ? "15 Working Days (Officer Review)" : "Auto-Approved / 24 Hours"
    : calculateExpectedDate(app.createdAt);
  const uploadedDocs = app.documents.filter((d) => d.status === "Uploaded").length;

  const isPaid = isGstAmendment || app.paymentStatus === "Paid";
  const totalAmount = isGstAmendment ? 0 : app.paymentAmount;
  const baseServiceFee = Math.round(app.paymentAmount / 1.18);
  const gstAmount = app.paymentAmount - baseServiceFee;

  const timelineSteps: TimelineStep[] =
    app.timeline && app.timeline.length > 0
      ? app.timeline
      : isGstAmendment
        ? getGstAmendmentTimeline(appliedDate, isCore)
        : getDefaultTimeline(app, appliedDate);

  const headerInfo = {
    OVERVIEW: {
      nav: isGstAmendment ? "Amendment Details" : "Application Details",
      title: displayName,
      sub: isGstAmendment
        ? `ARN: ${displayId} • ${appliedDate}`
        : `${applicantName} • ${appliedDate}`,
    },
    STATUS: {
      nav: isGstAmendment ? "Amendment Status" : "Application Status",
      title: isGstAmendment
        ? isCore ? "Officer Verification" : "System Verification"
        : app.serviceId === "gst-filing" ? "Staff Verification" : "Document Verification",
      sub: isGstAmendment
        ? `Type: ${isCore ? "Core (Officer Approval)" : "Non-Core (Auto)"} • Target: ${expectedDate}`
        : `Assigned CA: ${assignedCA} • Target: ${expectedDate}`,
    },
    DOCUMENTS: {
      nav: isGstAmendment ? "Supporting Documents" : "Required Documents",
      title: "Document Uploads",
      sub: isGstAmendment && formData.document
        ? "Supporting proof attached"
        : `${uploadedDocs} of ${app.documents.length} documents uploaded`,
    },
    PAYMENTS: {
      nav: "Payment Details",
      title: "Invoice & Fees",
      sub: isGstAmendment
        ? "Government Portal Filing • Fee: Free"
        : `Total: ₹${totalAmount.toLocaleString()} • Status: ${app.paymentStatus}`,
    },
    CHAT: {
      nav: isLoans ? "Chat with Loan Agent" : "Chat with CA",
      title: isLoans ? "Loan Agent Support" : "CA Consultation",
      sub: `Application #${displayId} • ${assignedCA}`,
    },
  }[activeTab];

  const overviewRows: KeyVal[] = isGstAmendment
    ? [
        { key: "Application Type", val: "GST Amendment" },
        { key: "ARN / Reference", val: displayId },
        { key: "GSTIN", val: (formData.gstin as string) || "—" },
        { key: "Requested Section", val: (formData.section as string) || "—" },
        { key: "Amendment Type", val: isCore ? "Core (Officer Approval Required)" : "Non-Core (Auto-Approved)" },
        { key: "Submission Date", val: appliedDate },
        { key: "Current Status", val: (app.status as string) || "Submitted" },
        { key: "Processing Window", val: expectedDate },
      ]
    : [
        { key: "Customer / Entity", val: applicantName },
        { key: "Service", val: app.serviceName },
        { key: "Application ID", val: app.id },
        { key: "Applied Date", val: appliedDate },
        { key: "Assigned CA", val: assignedCA },
        { key: "Expected Completion", val: expectedDate },
      ];

  const filingRows: KeyVal[] = app.formData?.gstin
    ? [
        { key: "GSTIN", val: app.formData.gstin },
        { key: "Business Entity", val: app.formData.businessName || app.formData.tradeName || applicantName },
        ...(app.formData.taxpayerScheme ? [{ key: "Taxpayer Scheme", val: app.formData.taxpayerScheme }] : []),
        ...(app.formData.filingNature ? [{ key: "Filing Nature", val: app.formData.filingNature }] : []),
        ...(app.formData.financialYear ? [{ key: "Financial Year", val: app.formData.financialYear }] : []),
        ...(app.formData.filingPeriod ? [{ key: "Filing Period", val: app.formData.filingPeriod }] : []),
        ...(app.formData.filingFrequency ? [{ key: "Filing Frequency", val: app.formData.filingFrequency }] : []),
        ...(app.formData.filingType ? [{ key: "Return Form", val: app.formData.filingType }] : []),
        ...(app.formData.calculationMethod ? [{ key: "Calculation Method", val: app.formData.calculationMethod === "estimated" ? "Self Estimated Figures" : "TaxEdge CA Assisted (Documents)" }] : []),
      ]
    : [];

  const hasEstimates = Boolean(app.formData?.turnover || app.formData?.eligibleItc);
  const turnoverNum = Number(app.formData?.turnover || 0);
  const outputGstNum = Math.round(turnoverNum * 0.18);
  const itcNum = Number(app.formData?.eligibleItc || 0);
  const netLiabilityNum = Math.max(0, outputGstNum - itcNum);

  const estimateRows: KeyVal[] = hasEstimates
    ? [
        { key: "Gross Taxable Turnover", val: `₹${turnoverNum.toLocaleString()}` },
        { key: "Estimated Output GST (18%)", val: `₹${outputGstNum.toLocaleString()}` },
        { key: "Eligible Input Tax Credit", val: `- ₹${itcNum.toLocaleString()}` },
        { key: "Net Tax Liability (Govt)", val: `₹${netLiabilityNum.toLocaleString()}` },
      ]
    : [];

  const registrationRows: KeyVal[] =
    !app.formData?.gstin && app.formData?.businessName
      ? [
          { key: "Business Name", val: app.formData.businessName },
          ...(app.formData.businessType ? [{ key: "Business Type", val: app.formData.businessType }] : []),
          ...(app.formData.state ? [{ key: "State", val: app.formData.state }] : []),
          ...(app.formData.pan ? [{ key: "PAN", val: app.formData.pan }] : []),
        ]
      : [];

  const paymentRows: KeyVal[] = isGstAmendment
    ? [
        { key: "Government Portal Fee", val: "₹0 (Free)" },
        { key: "TaxEdge Amendment Processing", val: "₹0 (Complimentary)" },
        { key: "GST (18%)", val: "₹0" },
      ]
    : [
        { key: "Service Fee", val: `₹${baseServiceFee.toLocaleString()}` },
        { key: "Government Fees", val: "₹0 (Included)" },
        { key: "Platform GST (18%)", val: `₹${gstAmount.toLocaleString()}` },
        ...(app.formData?.transactionId ? [{ key: "Transaction ID", val: app.formData.transactionId }] : []),
        ...(app.formData?.paymentMethod ? [{ key: "Payment Method", val: app.formData.paymentMethod }] : []),
        { key: "Payment Date", val: appliedDate },
      ];

  return {
    isGstAmendment,
    formData,
    isCore,
    displayId,
    displayName,
    applicantName,
    isLoans,
    appliedDate,
    assignedCA,
    expectedDate,
    uploadedDocs,
    isPaid,
    totalAmount,
    baseServiceFee,
    gstAmount,
    timelineSteps,
    headerInfo,
    overviewRows,
    filingRows,
    estimateRows,
    registrationRows,
    paymentRows,
  };
}
