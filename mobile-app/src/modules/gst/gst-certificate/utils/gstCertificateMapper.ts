import { CertificateDetails, CertificateRequestParams } from "../types/gstCertificateTypes";

const s = (v: unknown): string => (v ? String(v) : "");

const STATE_CODE_MAP: Record<string, string> = {
  "07": "Delhi",
  "24": "Gujarat",
  "27": "Maharashtra",
  "29": "Karnataka",
  "33": "Tamil Nadu",
  "36": "Telangana",
  "19": "West Bengal",
  "09": "Uttar Pradesh",
  "06": "Haryana",
  "08": "Rajasthan",
  "32": "Kerala",
  "37": "Andhra Pradesh",
};

export function mapRegistrationDataToCertificate(
  targetGstin: string,
  params: CertificateRequestParams,
  applications: { serviceId?: string; formData?: Record<string, unknown> }[],
  gstDraft: Record<string, unknown> | null | undefined,
  registrationDraft: Record<string, unknown> | null | undefined,
  customer: Record<string, unknown> | null | undefined
): CertificateDetails {
  const clean = targetGstin.trim().toUpperCase();
  const app =
    applications.find((a) => (a.formData?.gstin as string | undefined)?.toUpperCase() === clean) ||
    applications.find((a) => a.serviceId === "gst-registration");
  const fd = (app?.formData || {}) as Record<string, unknown>;
  const dBiz = ((gstDraft?.businessData as Record<string, unknown>) || {}) as Record<string, unknown>;
  const sDraft = registrationDraft || {};
  const cust = customer || {};

  const state =
    params.state ||
    s(fd.state) ||
    s(dBiz.state) ||
    s(sDraft.state) ||
    s(cust.state) ||
    STATE_CODE_MAP[clean.slice(0, 2)] ||
    "";

  const legalName =
    params.legalName ||
    s(fd.legalName) ||
    s(dBiz.legalName) ||
    s(sDraft.legalName) ||
    s(cust.businessName) ||
    s(cust.name) ||
    (clean ? `ENTERPRISE ${clean}` : "TAXPAYER ENTERPRISE");

  const tradeName =
    params.tradeName ||
    s(fd.businessName) ||
    s(dBiz.businessName) ||
    s(sDraft.businessName) ||
    legalName;

  const constitution =
    params.constitution ||
    s(fd.businessType) ||
    s(dBiz.businessType) ||
    s(sDraft.constitution) ||
    "Private Limited Company";

  const addrParts = [
    s(fd.businessAddress) || s(dBiz.businessAddress),
    s(fd.city) || s(dBiz.city),
    s(fd.district) || s(dBiz.district),
    state,
    s(fd.pinCode) || s(dBiz.pinCode),
  ].filter(Boolean);

  const address =
    params.address ||
    (addrParts.length > 0
      ? addrParts.join(", ")
      : s(cust.address) || (state ? `Registered Office, ${state}` : "Registered Business Address"));

  const sigName =
    params.director ||
    params.signatoryName ||
    s(fd.signatoryName) ||
    s(dBiz.signatoryName) ||
    s(cust.name) ||
    "";
  const sigDesignation =
    s(fd.signatoryDesignation) || s(dBiz.signatoryDesignation) || "Director";
  const signatories = sigName
    ? [{ name: String(sigName).toUpperCase(), designation: sigDesignation }]
    : [];

  const additionalPlaces = (
    fd.additionalAddress
      ? [s(fd.additionalAddress)]
      : dBiz.additionalAddress
      ? [s(dBiz.additionalAddress)]
      : []
  ).filter(Boolean);

  const natureStr = s(fd.natureOfBusiness) || s(dBiz.natureOfBusiness);
  const activities = natureStr
    ? natureStr.split(",").map((seg: string) => seg.trim()).filter(Boolean)
    : [];

  const compositionStr = s(fd.compositionScheme);
  const todayStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return {
    gstin: clean,
    legalName: String(legalName).toUpperCase(),
    tradeName: String(tradeName).toUpperCase(),
    constitution,
    address,
    liabilityDate: s(fd.businessStartDate) || s(dBiz.businessStartDate) || "",
    validityFrom: s(fd.businessStartDate) || s(dBiz.businessStartDate) || "01/04/2026",
    regType: compositionStr.includes("composition") ? "Composition" : "Regular",
    regDate: s(fd.appliedDate) || todayStr,
    issueDate: todayStr,
    additionalPlaces,
    signatories,
    activities,
    state,
  };
}
