/// <reference types="node" />
import assert from "node:assert/strict";
import { test, describe, beforeEach } from "node:test";
import { toWholeRupees } from "../../modules/loans/utils/moneyInput";
import {
  BUSINESS_TEXT_LIMITS,
  validateBusinessLoanForm,
} from "../../modules/loans/businessWorkingCapital/validation/businessLoanValidation";
import { pruneBusinessFormData } from "../../modules/loans/businessWorkingCapital/utils/pruneBusinessFormData";
import {
  createInitialBusinessFormData,
  createInitialKycData,
} from "../../modules/loans/store/loansStore.types";
import { buildReviewSections } from "../../modules/loans/utils/loanReviewSummary";
import { useLoansStore } from "../../modules/loans/store/loansStore";
import {
  localLoanSubmissionService,
  setLoanSubmissionService,
  type LoanSubmissionPayload,
} from "../../modules/loans/services/loanSubmissionService";
import type { BusinessLoanFormData } from "../../modules/loans/businessWorkingCapital/types/businessLoan.types";

const validBusiness = (): BusinessLoanFormData => {
  const form = createInitialBusinessFormData();
  form.businessProfile = {
    ...form.businessProfile,
    businessName: "Apex Traders",
    constitution: "Proprietorship",
    businessActivity: "Trading",
    establishmentDate: "10-05-2019",
    businessAddress: "12 Market Road, Hyderabad",
    pincode: "500001",
  };
  form.businessLoan = {
    loanAmount: "1000000",
    purpose: "Business Expansion",
    purposeOther: "",
    purposeDescription: "Open a second outlet",
    projectCost: "",
  };
  form.workingCapital = {
    loanAmount: "500000",
    purpose: "Payroll",
    purposeOther: "",
    purposeDescription: "Monthly salaries",
    monthlySales: "800000",
    monthlyExpenses: "600000",
  };
  return form;
};

describe("money input", () => {
  test("typed and pasted amounts become whole-rupee digits", () => {
    assert.equal(toWholeRupees("1"), "1");
    assert.equal(toWholeRupees("₹10,00,000"), "1000000");
    assert.equal(toWholeRupees("1,00,00,000"), "10000000");
    assert.equal(toWholeRupees("-5000"), "5000");
    assert.equal(toWholeRupees("abc"), "");
  });

  test("a pasted decimal is truncated, never turned into extra digits", () => {
    assert.equal(toWholeRupees("50,000.75"), "50000");
    assert.equal(toWholeRupees("₹1,00,000.50"), "100000");
    assert.equal(toWholeRupees(".99"), "");
  });
});

describe("business validation attacks", () => {
  test("a complete form is valid for both loan types", () => {
    const form = validBusiness();
    assert.equal(validateBusinessLoanForm(form).isValid, true);
    assert.equal(validateBusinessLoanForm({ ...form, loanType: "working-capital" }).isValid, true);
  });

  test("emoji and Unicode business names are accepted and not altered", () => {
    const names = ["🏢 ABC Enterprises", "ABC 🚀 Traders", "தமிழ் Business", "हिंदी व्यापार", "తెలుగు వ్యాపారం", "中文 Business", "O'Connor & Sons", "A&B Traders", "ABC @#$%"];
    names.forEach((businessName) => {
      const form = validBusiness();
      form.businessProfile.businessName = businessName;
      const { errors } = validateBusinessLoanForm(form);
      assert.equal(errors.businessName, undefined, businessName);
    });
  });

  test("whitespace-only, too-short and too-long names are rejected with a message", () => {
    const form = validBusiness();
    form.businessProfile.businessName = "     ";
    assert.ok(validateBusinessLoanForm(form).errors.businessName);
    form.businessProfile.businessName = "ab";
    assert.match(validateBusinessLoanForm(form).errors.businessName ?? "", /at least 3/);
    form.businessProfile.businessName = "x".repeat(BUSINESS_TEXT_LIMITS.name + 1);
    assert.match(validateBusinessLoanForm(form).errors.businessName ?? "", /up to/);
  });

  test("amounts: zero, negative text, below minimum and missing are rejected", () => {
    const form = validBusiness();
    ["", "0", "100", "24999"].forEach((amount) => {
      form.businessLoan.loanAmount = amount;
      assert.ok(validateBusinessLoanForm(form).errors.businessLoanAmount, amount);
    });
    form.businessLoan.loanAmount = "25000";
    assert.equal(validateBusinessLoanForm(form).errors.businessLoanAmount, undefined);
  });

  test("future establishment date, bad PIN and bad GSTIN are reported on their field", () => {
    const form = validBusiness();
    form.businessProfile.establishmentDate = "01-01-2999";
    form.businessProfile.pincode = "12345";
    form.businessProfile.isGstRegistered = true;
    form.businessProfile.gstin = "NOTAGSTIN";
    const { errors } = validateBusinessLoanForm(form);
    assert.ok(errors.establishmentDate);
    assert.match(errors.pincode ?? "", /6-digit/);
    assert.ok(errors.gstin);
  });

  test("Other without a specification is rejected for every dropdown", () => {
    const form = validBusiness();
    form.businessProfile.constitution = "Other";
    form.businessProfile.businessActivity = "Other";
    form.businessLoan.purpose = "Other";
    const { errors } = validateBusinessLoanForm(form);
    assert.ok(errors.constitutionOther);
    assert.ok(errors.activityOther);
    assert.ok(errors.businessLoanPurposeOther);
  });

  test("the other loan type's fields are never validated", () => {
    const form = validBusiness();
    form.workingCapital = createInitialBusinessFormData().workingCapital;
    assert.equal(validateBusinessLoanForm(form).isValid, true);
    form.loanType = "working-capital";
    form.businessLoan = createInitialBusinessFormData().businessLoan;
    form.workingCapital = validBusiness().workingCapital;
    assert.equal(validateBusinessLoanForm(form).isValid, true);
  });
});

describe("loan type switching", () => {
  beforeEach(() => {
    useLoansStore.getState().resetAll();
    setLoanSubmissionService(localLoanSubmissionService);
  });

  test("the submission data holds only the selected loan type", () => {
    const form = validBusiness();
    const business = pruneBusinessFormData(form);
    assert.equal(business.businessLoan.loanAmount, "1000000");
    assert.equal(business.workingCapital.loanAmount, "");
    const wc = pruneBusinessFormData({ ...form, loanType: "working-capital" });
    assert.equal(wc.workingCapital.monthlySales, "800000");
    assert.equal(wc.businessLoan.loanAmount, "");
  });

  test("a stale project cost is dropped when the purpose no longer needs it", () => {
    const form = validBusiness();
    form.businessLoan.projectCost = "250000";
    assert.equal(pruneBusinessFormData(form).businessLoan.projectCost, "");
    form.businessLoan.purpose = "Equipment Purchase";
    assert.equal(pruneBusinessFormData(form).businessLoan.projectCost, "250000");
  });

  test("a submitted application carries no data from the other loan type", async () => {
    let captured: LoanSubmissionPayload | null = null;
    setLoanSubmissionService({
      submit: async (payload) => {
        captured = payload;
        return { applicationId: "TXE-LN-1", submittedAt: new Date().toISOString(), isSyncedToServer: false };
      },
    });
    const s = useLoansStore.getState();
    s.selectCategory({ id: "business-loan", title: "Business", description: "", image: { uri: "t" } });
    s.setKycField("fullName", "Rajesh Sharma");
    s.setKycField("mobile", "9876543210");
    const form = validBusiness();
    s.setLoanType("business-loan");
    Object.entries(form.businessProfile).forEach(([k, v]) =>
      useLoansStore.getState().setBusinessProfileField(k as keyof typeof form.businessProfile, v as never)
    );
    Object.entries(form.businessLoan).forEach(([k, v]) =>
      useLoansStore.getState().setBusinessLoanField(k as keyof typeof form.businessLoan, v as never)
    );
    Object.entries(form.workingCapital).forEach(([k, v]) =>
      useLoansStore.getState().setWorkingCapitalField(k as keyof typeof form.workingCapital, v as never)
    );
    ["pan_card", "business_proof"].forEach((id) =>
      useLoansStore.getState().setDocumentAttachment(id, {
        id: `${id}_1`, documentId: id, fileName: `${id}.pdf`, fileUri: `file:///${id}.pdf`,
        fileSize: 10, mimeType: "application/pdf", status: "selected",
      })
    );
    useLoansStore.getState().setReviewConsent(true);
    assert.equal(await useLoansStore.getState().submitLoanApplication(), true);
    const sent = (captured as LoanSubmissionPayload | null)?.businessFormData;
    assert.equal(sent?.workingCapital.loanAmount, "");
    assert.equal(sent?.workingCapital.monthlySales, "");
    assert.equal(sent?.businessLoan.loanAmount, "1000000");
  });

  test("review shows the selected type and keeps emoji text intact", () => {
    const form = validBusiness();
    form.businessProfile.businessName = "🏢 Shree Ganesh 🛍️ & Sons";
    const kyc = { ...createInitialKycData(), fullName: "Rajesh Sharma", mobile: "9876543210" };
    const wcSections = buildReviewSections(kyc, { ...form, loanType: "working-capital" });
    const business = wcSections.find((x) => x.id === "business");
    assert.equal(business?.rows[0].value, "🏢 Shree Ganesh 🛍️ & Sons");
    const loan = wcSections.find((x) => x.id === "loan");
    assert.equal(loan?.rows[0].value, "Working Capital Loan");
    assert.ok(!loan?.rows.some((r) => r.label === "Requested Amount"));
  });
});
