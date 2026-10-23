import { AmendmentFormData, RegisteredDetails } from "../types/gstAmendmentTypes";

const sv = (v: unknown): string => (v ? String(v) : "");

export function resolveTargetGstId(
  gstin: string,
  customer: Record<string, unknown> | null | undefined,
  gstDraft: Record<string, unknown> | null | undefined,
  applications: { formData?: Record<string, unknown> }[]
): string {
  const appMatch = applications.find((a) => a.formData?.createdGstId || a.formData?.gstId || a.formData?.gstin);
  return (
    gstin ||
    sv(customer?.gstId) ||
    sv(gstDraft?.createdGstId) ||
    sv(appMatch?.formData?.createdGstId) ||
    sv(appMatch?.formData?.gstId) ||
    sv(appMatch?.formData?.gstin) ||
    "GST29AAACU9876P1Z5"
  );
}

export function generateArn(): string {
  const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
  return `AA2993${randomSuffix.toString().slice(0, 6)}`;
}

export function buildComparisonSummaries(
  sectionId: string,
  registeredDetails: RegisteredDetails,
  formData: AmendmentFormData
): {
  currentValSummary: string;
  requestedValSummary: string;
  currentValDict: Record<string, string>;
  requestedValDict: Record<string, string>;
} {
  let currentValSummary = "";
  let requestedValSummary = "";
  let currentValDict: Record<string, string> = {};
  let requestedValDict: Record<string, string> = {};

  switch (sectionId) {
    case "legal-name":
      currentValSummary = registeredDetails.legalBusinessName;
      requestedValSummary = formData.newLegalBusinessName;
      currentValDict = { "Legal Business Name": registeredDetails.legalBusinessName };
      requestedValDict = { "Legal Business Name": formData.newLegalBusinessName };
      break;

    case "principal-place":
      currentValSummary = `${registeredDetails.principalAddress}, ${registeredDetails.principalCity}, ${registeredDetails.principalDistrict}, ${registeredDetails.principalState} - ${registeredDetails.principalPincode}`;
      requestedValSummary = `${formData.newPrincipalAddress}, ${formData.newPrincipalCity}, ${formData.newPrincipalDistrict}, ${formData.newPrincipalState} - ${formData.newPrincipalPincode} (${formData.newPrincipalNatureOfPremises})`;
      currentValDict = {
        Address: registeredDetails.principalAddress,
        City: registeredDetails.principalCity,
        District: registeredDetails.principalDistrict,
        State: registeredDetails.principalState,
        "PIN Code": registeredDetails.principalPincode,
      };
      requestedValDict = {
        "Business Address": formData.newPrincipalAddress,
        City: formData.newPrincipalCity,
        District: formData.newPrincipalDistrict,
        "State / UT": formData.newPrincipalState,
        "PIN Code": formData.newPrincipalPincode,
        "Nature of Premises": formData.newPrincipalNatureOfPremises,
      };
      break;

    case "additional-place":
      currentValSummary = `${registeredDetails.additionalAddress}, ${registeredDetails.additionalCity} - ${registeredDetails.additionalPincode} (${registeredDetails.additionalNatureOfPremises})`;
      requestedValSummary = `${formData.newAdditionalAddress}, ${formData.newAdditionalCity} - ${formData.newAdditionalPincode} (${formData.newAdditionalNatureOfPremises})`;
      currentValDict = {
        Address: registeredDetails.additionalAddress,
        City: registeredDetails.additionalCity,
        "PIN Code": registeredDetails.additionalPincode,
        "Nature of Premises": registeredDetails.additionalNatureOfPremises,
      };
      requestedValDict = {
        "Additional Place Address": formData.newAdditionalAddress,
        City: formData.newAdditionalCity,
        "PIN Code": formData.newAdditionalPincode,
        "Nature of Premises": formData.newAdditionalNatureOfPremises,
      };
      break;

    case "bank-accounts":
      currentValSummary = `${registeredDetails.bankName} - A/C: ${registeredDetails.bankAccountNumber}, IFSC: ${registeredDetails.ifscCode}`;
      requestedValSummary = `${formData.newBankName} - A/C: ${formData.newBankAccountNumber}, IFSC: ${formData.newIfscCode}`;
      currentValDict = {
        "Bank Name": registeredDetails.bankName,
        "Account Number": registeredDetails.bankAccountNumber,
        "IFSC Code": registeredDetails.ifscCode,
        "Account Type": registeredDetails.accountType,
      };
      requestedValDict = {
        "Bank Name": formData.newBankName,
        "Account Number": formData.newBankAccountNumber,
        "Confirm Account Number": formData.confirmBankAccountNumber,
        "IFSC Code": formData.newIfscCode,
        "Account Type": formData.newAccountType,
      };
      break;

    case "authorised-signatories":
      currentValSummary = `${registeredDetails.signatoryName} (${registeredDetails.signatoryPan}) - ${registeredDetails.signatoryDesignation}`;
      requestedValSummary = `${formData.newSignatoryName} (${formData.newSignatoryPan}) - ${formData.newSignatoryDesignation}`;
      currentValDict = {
        Name: registeredDetails.signatoryName,
        PAN: registeredDetails.signatoryPan,
        Designation: registeredDetails.signatoryDesignation,
        Mobile: registeredDetails.signatoryMobile,
        Email: registeredDetails.signatoryEmail,
      };
      requestedValDict = {
        "Signatory Name": formData.newSignatoryName,
        "Signatory PAN": formData.newSignatoryPan,
        "Date of Birth": formData.newSignatoryDob,
        Designation: formData.newSignatoryDesignation,
        "Signatory Mobile": formData.newSignatoryMobile,
        "Signatory Email": formData.newSignatoryEmail,
      };
      break;

    case "contact-details":
      currentValSummary = `Mob: ${registeredDetails.contactMobile}, Email: ${registeredDetails.contactEmail}`;
      requestedValSummary = `Mob: ${formData.newContactMobile}, Email: ${formData.newContactEmail}`;
      currentValDict = {
        Mobile: registeredDetails.contactMobile,
        Email: registeredDetails.contactEmail,
      };
      requestedValDict = {
        "Mobile Number": formData.newContactMobile,
        "Email Address": formData.newContactEmail,
      };
      break;
  }

  return {
    currentValSummary,
    requestedValSummary,
    currentValDict,
    requestedValDict,
  };
}

export function buildDbReviewSummaries(
  sectionId: string,
  registeredDetails: RegisteredDetails,
  dbData: Record<string, unknown> | null | undefined,
  fallbackFormData: AmendmentFormData
): Record<string, string> {
  let requestedValDict: Record<string, string> = {};

  switch (sectionId) {
    case "legal-name": {
      requestedValDict = { "Legal Business Name": sv(dbData?.newLegalName) || fallbackFormData.newLegalBusinessName };
      break;
    }
    case "principal-place": {
      requestedValDict = {
        "Business Address": sv(dbData?.newBusinessAddress) || fallbackFormData.newPrincipalAddress,
        City: sv(dbData?.newCity) || fallbackFormData.newPrincipalCity,
        District: sv(dbData?.newDistrict) || fallbackFormData.newPrincipalDistrict,
        "State / UT": sv(dbData?.newState) || fallbackFormData.newPrincipalState,
        "PIN Code": sv(dbData?.newPinCode) || fallbackFormData.newPrincipalPincode,
        "Nature of Premises": sv(dbData?.natureOfPremises) || fallbackFormData.newPrincipalNatureOfPremises,
      };
      break;
    }
    case "additional-place": {
      requestedValDict = {
        "Additional Place Address": sv(dbData?.address) || fallbackFormData.newAdditionalAddress,
        City: sv(dbData?.city) || fallbackFormData.newAdditionalCity,
        "PIN Code": sv(dbData?.pinCode) || fallbackFormData.newAdditionalPincode,
        "Nature of Premises": sv(dbData?.natureOfPremises) || fallbackFormData.newAdditionalNatureOfPremises,
      };
      break;
    }
    case "bank-accounts": {
      const rawAcct = sv(dbData?.newBankAccountNumber) || fallbackFormData.newBankAccountNumber;
      const maskedAcct = rawAcct.length > 4 ? "XXXX" + rawAcct.slice(-4) : rawAcct;
      requestedValDict = {
        "Bank Name": sv(dbData?.newBankName) || fallbackFormData.newBankName,
        "Account Number": maskedAcct,
        "IFSC Code": sv(dbData?.newIfscCode) || fallbackFormData.newIfscCode,
        "Account Type": sv(dbData?.newAccountType) || fallbackFormData.newAccountType,
      };
      break;
    }
    case "contact-details": {
      requestedValDict = {
        "Mobile Number": sv(dbData?.newMobileNumber) || fallbackFormData.newContactMobile,
        "Email Address": sv(dbData?.newEmail) || fallbackFormData.newContactEmail,
      };
      break;
    }
    case "authorised-signatories": {
      requestedValDict = {
        "Signatory Name": sv(dbData?.newSignatoryName) || fallbackFormData.newSignatoryName,
        "Signatory PAN": sv(dbData?.newSignatoryPan) || fallbackFormData.newSignatoryPan,
        "Date of Birth": sv(dbData?.newSignatoryDob) || fallbackFormData.newSignatoryDob,
        Designation: sv(dbData?.newDesignation) || sv(dbData?.newSignatoryDesignation) || fallbackFormData.newSignatoryDesignation,
        "Signatory Mobile": sv(dbData?.newSignatoryMobile) || fallbackFormData.newSignatoryMobile,
        "Signatory Email": sv(dbData?.newSignatoryEmail) || fallbackFormData.newSignatoryEmail,
      };
      break;
    }
    default:
      break;
  }

  return requestedValDict;
}

