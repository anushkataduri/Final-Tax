import type { AmendmentFormData, AmendmentStep, SupportingDoc } from "../types/gstAmendmentTypes";
import { validateAmendmentFieldValue } from "./gstAmendmentFieldValidator";

// Re-export primitives for external callers that import from this module
export { validatePanNumber, validateGstinInput, isValidPincode, hasEmoji, validateAmendmentEmail } from "./gstAmendmentPrimitiveValidators";
export { VALID_GSTIN_STATE_CODES, ALLOWED_PAN_CATEGORIES } from "./gstAmendmentValidationConstants";
export { validateAmendmentFieldValue } from "./gstAmendmentFieldValidator";

export function isFormDataDirty(
  currentStep: AmendmentStep,
  formData: AmendmentFormData,
  supportingDocOrDocs: SupportingDoc | Record<string, SupportingDoc | null> | null,
): boolean {
  if (currentStep === "LANDING" || currentStep === "SUCCESS") return false;

  const hasDoc = Boolean(
    supportingDocOrDocs &&
      (typeof supportingDocOrDocs === "object" && "uri" in supportingDocOrDocs
        ? Boolean(supportingDocOrDocs.uri)
        : Object.values(supportingDocOrDocs).some((doc) => Boolean(doc?.uri))),
  );

  return Boolean(
    formData.newLegalBusinessName || formData.newPrincipalAddress || formData.newPrincipalCity ||
    formData.newPrincipalDistrict || formData.newPrincipalState || formData.newPrincipalPincode ||
    formData.newPrincipalNatureOfPremises || formData.newAdditionalAddress ||
    formData.newAdditionalCity || formData.newAdditionalPincode ||
    formData.newAdditionalNatureOfPremises || formData.newBankName ||
    formData.newBankAccountNumber || formData.confirmBankAccountNumber ||
    formData.newIfscCode || formData.newAccountType || formData.newSignatoryName ||
    formData.newSignatoryPan || formData.newSignatoryDob || formData.newSignatoryDesignation ||
    formData.newSignatoryMobile || formData.newSignatoryEmail || formData.newContactMobile ||
    formData.newContactEmail || hasDoc,
  );
}

type FieldErrs = Record<string, string>;
type SectionRule = (formData: AmendmentFormData, errs: FieldErrs) => void;

const applyField = (
  field: keyof AmendmentFormData,
  formData: AmendmentFormData,
  errs: FieldErrs,
) => {
  const err = validateAmendmentFieldValue(field, formData[field] as string, formData, true);
  if (err) errs[field as string] = err;
};

const SECTION_RULES: Record<string, SectionRule> = {
  "legal-name": (d, e) => applyField("newLegalBusinessName", d, e),

  "principal-place": (d, e) => {
    applyField("newPrincipalAddress", d, e);
    applyField("newPrincipalCity", d, e);
    applyField("newPrincipalDistrict", d, e);
    if (!d.newPrincipalState) e.newPrincipalState = "Select state or union territory";
    applyField("newPrincipalPincode", d, e);
    if (!d.newPrincipalNatureOfPremises) e.newPrincipalNatureOfPremises = "Select nature of possession";
  },

  "additional-place": (d, e) => {
    applyField("newAdditionalAddress", d, e);
    applyField("newAdditionalCity", d, e);
    applyField("newAdditionalPincode", d, e);
    if (!d.newAdditionalNatureOfPremises) e.newAdditionalNatureOfPremises = "Select nature of possession";
  },

  "bank-accounts": (d, e) => {
    applyField("newBankName", d, e);
    applyField("newBankAccountNumber", d, e);
    applyField("confirmBankAccountNumber", d, e);
    applyField("newIfscCode", d, e);
    if (!d.newAccountType) e.newAccountType = "Select account type";
  },

  "authorised-signatories": (d, e) => {
    applyField("newSignatoryName", d, e);
    applyField("newSignatoryPan", d, e);
    applyField("newSignatoryDob", d, e);
    applyField("newSignatoryDesignation", d, e);
    applyField("newSignatoryMobile", d, e);
    applyField("newSignatoryEmail", d, e);
  },

  "contact-details": (d, e) => {
    applyField("newContactMobile", d, e);
    applyField("newContactEmail", d, e);
  },
};

export function validateSectionForm(
  sectionId: string,
  formData: AmendmentFormData,
  supportingDoc: SupportingDoc | null,
): { isValid: boolean; errors: Record<string, string> } {
  const errs: FieldErrs = {};
  SECTION_RULES[sectionId]?.(formData, errs);
  if (!supportingDoc?.uri) errs.supportingDoc = "Upload supporting document";
  return { isValid: Object.keys(errs).length === 0, errors: errs };
}

export function validateFieldRealtime(
  field: keyof AmendmentFormData,
  value: string,
  allData: AmendmentFormData,
): string | null {
  return validateAmendmentFieldValue(field, value, allData, true);
}
