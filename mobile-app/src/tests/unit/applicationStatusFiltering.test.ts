import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeApplicationStatus,
  matchesStatusFilter,
  matchesCategoryFilter,
  matchesSearchQuery,
  deduplicateApplications,
  getApplicationEmptyState,
  getResumeRoute,
} from "../../modules/applications/utils/applicationStatusUtils";
import type { Application } from "../../types/domain";

function createMockApp(
  overrides: Partial<Application> & { id: string; status: string }
): Application {
  return {
    serviceId: "gst-registration",
    serviceName: "GST Registration",
    category: "GST",
    progress: 50,
    assignedExecutive: "TaxEdge Executive",
    paymentAmount: 0,
    paymentStatus: "Paid",
    createdAt: "2026-03-01T10:00:00Z",
    formData: {},
    documents: [],
    timeline: [],
    chatHistory: [],
    ...overrides,
  };
}

test("normalizeApplicationStatus maps Completed variants correctly", () => {
  const completedCases = [
    "Completed",
    "completed",
    "COMPLETED",
    "Approved",
    "APPROVED",
    "Disbursed",
    "DISBURSED",
    "Sanctioned",
    "Certificate Issued",
    "Documents Issued",
    "Return Filed",
    "E-Verified",
    "everified",
    "Closed",
    "Policy Issued",
  ];

  completedCases.forEach((status) => {
    assert.equal(
      normalizeApplicationStatus(status),
      "COMPLETED",
      `Expected status '${status}' to map to COMPLETED`
    );
  });
});

test("normalizeApplicationStatus maps Under Verification variants correctly", () => {
  const verificationCases = [
    "Under Verification",
    "under_verification",
    "UNDER_VERIFICATION",
    "Under Review",
    "under_review",
    "UNDER_REVIEW",
    "Under Scrutiny",
    "Officer Review",
    "Officer Scrutiny",
    "Verification",
    "Submitted",
    "SUBMITTED",
    "KYC Pending",
    "Documents Under Verification",
    "New Request Received",
  ];

  verificationCases.forEach((status) => {
    assert.equal(
      normalizeApplicationStatus(status),
      "UNDER_VERIFICATION",
      `Expected status '${status}' to map to UNDER_VERIFICATION`
    );
  });
});

test("normalizeApplicationStatus maps In Progress variants correctly", () => {
  const inProgressCases = [
    "In Progress",
    "in_progress",
    "IN_PROGRESS",
    "Processing",
    "PROCESSING",
    "Document Collection",
    "Pending Payment",
    "Payment Pending",
    "Documents Pending",
    "Ready for Filing",
    "Return Preparation",
    "Data Preparation",
    "Customer Review",
    "Customer Approval",
    "Draft",
    "Pending",
  ];

  inProgressCases.forEach((status) => {
    assert.equal(
      normalizeApplicationStatus(status),
      "IN_PROGRESS",
      `Expected status '${status}' to map to IN_PROGRESS`
    );
  });
});

test("normalizeApplicationStatus preserves Rejected and unmapped statuses as OTHER", () => {
  const otherCases = [
    "Rejected",
    "REJECTED",
    "Failed",
    "FAILED",
    "Cancelled",
    "CANCELLED",
    "Suspended",
    "SUSPENDED",
    "",
    "   ",
    undefined,
    "Unknown Custom Status",
  ];

  otherCases.forEach((status) => {
    assert.equal(
      normalizeApplicationStatus(status),
      "OTHER",
      `Expected status '${status}' to map to OTHER`
    );
  });
});

test("matchesStatusFilter filters accurately", () => {
  const sampleStatuses = [
    { status: "Completed", isCompleted: true, isInProgress: false, isUnderVerification: false },
    { status: "Approved", isCompleted: true, isInProgress: false, isUnderVerification: false },
    { status: "Submitted", isCompleted: false, isInProgress: false, isUnderVerification: true },
    { status: "Under Verification", isCompleted: false, isInProgress: false, isUnderVerification: true },
    { status: "In Progress", isCompleted: false, isInProgress: true, isUnderVerification: false },
    { status: "Processing", isCompleted: false, isInProgress: true, isUnderVerification: false },
    { status: "Rejected", isCompleted: false, isInProgress: false, isUnderVerification: false },
  ];

  sampleStatuses.forEach(({ status, isCompleted, isInProgress, isUnderVerification }) => {
    assert.equal(matchesStatusFilter(status, "ALL"), true);
    assert.equal(matchesStatusFilter(status, "COMPLETED"), isCompleted);
    assert.equal(matchesStatusFilter(status, "IN_PROGRESS"), isInProgress);
    assert.equal(matchesStatusFilter(status, "UNDER_VERIFICATION"), isUnderVerification);
  });
});

test("deduplicateApplications removes duplicate application records stably", () => {
  const apps: Application[] = [
    createMockApp({ id: "APP-001", status: "Submitted" }),
    createMockApp({
      id: "APP-001",
      status: "Submitted",
      serviceName: "GST Registration (Duplicate)",
    }),
    createMockApp({
      id: "APP-002",
      status: "In Progress",
      serviceId: "loan-business",
      category: "LOANS",
      paymentStatus: "Pending",
    }),
  ];

  const unique = deduplicateApplications(apps);
  assert.equal(unique.length, 2);
  assert.equal(unique[0].id, "APP-001");
  assert.equal(unique[1].id, "APP-002");
});

test("Calculates correct summary counts across diverse services", () => {
  const allServicesApps: Application[] = [
    createMockApp({ id: "GST-REG-1", serviceId: "gst-registration", serviceName: "GST Registration", category: "GST", status: "Submitted" }),
    createMockApp({ id: "GST-AMD-1", serviceId: "gst-amendment", serviceName: "GST Amendment", category: "GST", status: "In Progress" }),
    createMockApp({ id: "GST-CMP-1", serviceId: "gst-compliance", serviceName: "GST Compliance", category: "GST", status: "Under Verification" }),
    createMockApp({ id: "CMP-INC-1", serviceId: "company-incorporation", serviceName: "Company Incorporation", category: "BUSINESS", status: "Completed" }),
    createMockApp({ id: "LN-BUS-1", serviceId: "loan-business", serviceName: "Business Loan", category: "LOANS", status: "Processing" }),
    createMockApp({ id: "LN-HOME-1", serviceId: "loan-home", serviceName: "Home Loan", category: "LOANS", status: "Approved" }),
    createMockApp({ id: "ITR-FIL-1", serviceId: "itr-filing", serviceName: "ITR Filing", category: "ITR", status: "Return Preparation" }),
    createMockApp({ id: "TDS-REF-1", serviceId: "tds-refund", serviceName: "TDS Refund", category: "ITR", status: "Under Review" }),
    createMockApp({ id: "LN-MSME-1", serviceId: "loan-msme", serviceName: "MSME Loan", category: "LOANS", status: "Rejected", paymentStatus: "Pending" }),
  ];

  const unique = deduplicateApplications(allServicesApps);
  const totalCount = unique.length;
  const inProgressCount = unique.filter(
    (a) => normalizeApplicationStatus(a.status) === "IN_PROGRESS"
  ).length;
  const completedCount = unique.filter(
    (a) => normalizeApplicationStatus(a.status) === "COMPLETED"
  ).length;
  const underVerificationCount = unique.filter(
    (a) => normalizeApplicationStatus(a.status) === "UNDER_VERIFICATION"
  ).length;

  assert.equal(totalCount, 9, "Total count must be 9");
  assert.equal(inProgressCount, 3, "In Progress count must be 3 (GST Amendment, Business Loan, ITR Filing)");
  assert.equal(completedCount, 2, "Completed count must be 2 (Company Incorporation, Home Loan)");
  assert.equal(underVerificationCount, 3, "Under Verification count must be 3 (GST Reg Submitted, GST Compliance, TDS Refund)");
});

test("Multi-filter combination: status + category + search query works together without interference", () => {
  const apps: Application[] = [
    createMockApp({
      id: "APP-101",
      serviceId: "gst-registration",
      serviceName: "GST Registration",
      category: "GST",
      status: "Submitted",
      formData: { arn: "ARN-999" },
    }),
    createMockApp({
      id: "APP-102",
      serviceId: "gst-amendment",
      serviceName: "GST Amendment",
      category: "GST",
      status: "In Progress",
    }),
    createMockApp({
      id: "APP-103",
      serviceId: "loan-business",
      serviceName: "Business Loan",
      category: "LOANS",
      status: "In Progress",
    }),
  ];

  // 1. Filter by IN_PROGRESS status only
  const inProgressApps = apps.filter((a) => matchesStatusFilter(a.status, "IN_PROGRESS"));
  assert.equal(inProgressApps.length, 2);

  // 2. Combine IN_PROGRESS + GST category
  const inProgressGst = apps.filter(
    (a) =>
      matchesCategoryFilter(a, "gst-amendment") &&
      matchesStatusFilter(a.status, "IN_PROGRESS")
  );
  assert.equal(inProgressGst.length, 1);
  assert.equal(inProgressGst[0].id, "APP-102");

  // 3. Combine UNDER_VERIFICATION + Search for ARN
  const searchArn = apps.filter(
    (a) =>
      matchesStatusFilter(a.status, "UNDER_VERIFICATION") &&
      matchesSearchQuery(a, "ARN-999")
  );
  assert.equal(searchArn.length, 1);
  assert.equal(searchArn[0].id, "APP-101");

  // 4. Total Applications (ALL) resets status without clearing category or search
  const allCategoryGst = apps.filter(
    (a) =>
      matchesCategoryFilter(a, "gst-registration") &&
      matchesStatusFilter(a.status, "ALL")
  );
  assert.equal(allCategoryGst.length, 1);
  assert.equal(allCategoryGst[0].id, "APP-101");
});

test("getApplicationEmptyState generates correct messages and actions", () => {
  // Empty store
  const emptyStore = getApplicationEmptyState(0, "ALL", "");
  assert.equal(emptyStore.title, "No applications yet");
  assert.equal(emptyStore.buttonText, null);

  // Filtered by In Progress with 0 results
  const emptyInProgress = getApplicationEmptyState(5, "IN_PROGRESS", "");
  assert.equal(emptyInProgress.title, "No in-progress applications found");
  assert.equal(emptyInProgress.buttonText, "Show All Applications");
  assert.equal(emptyInProgress.resetType, "STATUS");

  // Filtered by Completed with 0 results
  const emptyCompleted = getApplicationEmptyState(5, "COMPLETED", "");
  assert.equal(emptyCompleted.title, "No completed applications found");
  assert.equal(emptyCompleted.buttonText, "Show All Applications");
  assert.equal(emptyCompleted.resetType, "STATUS");

  // Filtered by Under Verification with 0 results
  const emptyVerification = getApplicationEmptyState(5, "UNDER_VERIFICATION", "");
  assert.equal(emptyVerification.title, "No applications under verification");
  assert.equal(emptyVerification.buttonText, "Show All Applications");
  assert.equal(emptyVerification.resetType, "STATUS");

  // Filtered by Search Query
  const emptySearch = getApplicationEmptyState(5, "ALL", "xyzNotFound");
  assert.equal(emptySearch.title, 'No results for "xyzNotFound"');
  assert.equal(emptySearch.buttonText, "Clear Search");
  assert.equal(emptySearch.resetType, "SEARCH");
});

test("getResumeRoute resolves valid resume routes for incomplete applications", () => {
  const tdsApp = createMockApp({
    id: "TDS-1",
    serviceId: "tds-refund",
    serviceName: "TDS Refund",
    category: "ITR",
    status: "Draft",
    paymentStatus: "Pending",
  });
  assert.equal(getResumeRoute(tdsApp), "/service/tds-form");

  const customResumeApp = createMockApp({
    id: "GST-1",
    serviceId: "gst-registration",
    serviceName: "GST Registration",
    category: "GST",
    status: "Draft",
    paymentStatus: "Pending",
    formData: { resumeRoute: "/service/gst-form/step2" },
  });
  assert.equal(getResumeRoute(customResumeApp), "/service/gst-form/step2");
});
