import type { CompanyDetails } from '../types/company.types';
import { EMAIL_REGEX, PHONE_REGEX, PINCODE_REGEX } from '../../../shared/validators/indianTaxValidators';

import type { LinkedRegistrations } from '../types/registration.types';

export const getSuffixForType = (type?: string): string => {
  switch (type) {
    case 'One Person Company (OPC)':
      return '(OPC) Private Limited';
    case 'Section 8 (NGO)':
      return 'Foundation / Section 8';
    case 'Public Limited':
      return 'Limited';
    case 'Limited Liability Partnership (LLP)':
      return 'LLP';
    default:
      return 'Private Limited';
  }
};

export const validateProposedCompanyName = (name?: string, suffix?: string): string | null => {
  const trimmed = name?.trim() || '';
  if (!trimmed) {
    return 'Please enter a proposed company name.';
  }

  // Check for manually typed legal suffixes at the end of the name
  const suffixRegex = /(?:\b|\s)(PRIVATE\s+LIMITED|PVT\.?\s*LTD\.?|LIMITED|LTD\.?|LLP|OPC)\b\.?$/i;
  if (suffixRegex.test(trimmed)) {
    return 'Please enter the company name without a legal suffix. The legal suffix is added automatically.';
  }

  const suffixText = suffix || '';
  const fullLength = (trimmed + ' ' + suffixText).trim().length;
  if (fullLength > 75 || trimmed.length > 75) {
    return 'Company name exceeds the permitted character limit.';
  }

  if (trimmed.length < 3) {
    return 'Please enter a valid company name.';
  }

  const isValidChars = /^[a-zA-Z0-9\s&.\-,()]+$/.test(trimmed);
  if (!isValidChars) {
    return 'Please remove unsupported special characters.';
  }

  const alphaCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (alphaCount < 2) {
    return 'Please enter a valid company name.';
  }

  return null;
};

/** Step 0: company type. Adds messages to `fieldErrors` and `errors`. */
const collectCompanyTypeErrors = (
  details: Partial<CompanyDetails>, fieldErrors: Record<string, string>, errors: string[]
): void => {
  if (!details.companyType?.trim()) {
    fieldErrors.companyType = 'Please select a Company Type to proceed.';
    errors.push(fieldErrors.companyType);
  }
};

/** Step 1: classification, activity and names. Adds messages to `fieldErrors` and `errors`. */
const collectCompanyDetailsErrors = (
  details: Partial<CompanyDetails>, fieldErrors: Record<string, string>, errors: string[]
): void => {
  if (!details.companyCategory?.trim()) {
    fieldErrors.companyCategory = 'Please select a company category.';
    errors.push(fieldErrors.companyCategory);
  }
  if (!details.companySubCategory?.trim()) {
    fieldErrors.companySubCategory = 'Please select a sub-category.';
    errors.push(fieldErrors.companySubCategory);
  }
  const suffixText = details.nameSuffix || getSuffixForType(details.companyType);
  const nameError = validateProposedCompanyName(details.proposedName1, suffixText);
  if (nameError) {
    fieldErrors.proposedName1 = nameError;
    errors.push(nameError);
  }
  if (!details.primaryActivity?.trim()) {
    fieldErrors.primaryActivity = 'Please enter the primary business activity.';
    errors.push(fieldErrors.primaryActivity);
  }
  if (!details.nicCode?.trim() || !/^\d{5}$/.test(details.nicCode.trim())) {
    fieldErrors.nicCode = 'NIC code must contain exactly 5 digits.';
    errors.push(fieldErrors.nicCode);
  }
};

export const validatePinCode = (pin?: string): string | null => {
  const trimmed = pin?.trim() || '';
  if (!trimmed) return 'PIN code is required.';
  if (!/^[1-9][0-9]{5}$/.test(trimmed)) {
    return 'Enter a valid 6-digit Indian PIN code.';
  }
  return null;
};

export const validateCompanyEmail = (email?: string): string | null => {
  const trimmed = email?.trim() || '';
  if (!trimmed) return 'Company email is required.';
  if (trimmed.length > 254) return 'Email address must not exceed 254 characters.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed) || trimmed.includes(' ')) {
    return 'Enter a valid email address.';
  }
  return null;
};

export const validateCompanyMobile = (mobile?: string): string | null => {
  const trimmed = mobile?.trim() || '';
  if (!trimmed) return 'Mobile number is required.';
  if (trimmed.length < 10 && /^\d+$/.test(trimmed)) {
    return 'Mobile number must contain exactly 10 digits.';
  }
  if (!/^[6-9][0-9]{9}$/.test(trimmed)) {
    return 'Enter a valid 10-digit Indian mobile number.';
  }
  return null;
};

/** Step 2: registered office. Adds messages to `fieldErrors` and `errors`. */
const collectRegisteredOfficeErrors = (
  details: Partial<CompanyDetails>, fieldErrors: Record<string, string>, errors: string[]
): void => {
  if (!details.registeredAddressLine?.trim()) {
    fieldErrors.registeredAddressLine = 'Address line is required.';
    errors.push(fieldErrors.registeredAddressLine);
  }
  if (!details.registeredCity?.trim()) {
    fieldErrors.registeredCity = 'City is required.';
    errors.push(fieldErrors.registeredCity);
  }
  if (!details.registeredDistrict?.trim()) {
    fieldErrors.registeredDistrict = 'District is required.';
    errors.push(fieldErrors.registeredDistrict);
  }
  if (!details.registeredState?.trim()) {
    fieldErrors.registeredState = 'State is required.';
    errors.push(fieldErrors.registeredState);
  }
  const pinErr = validatePinCode(details.registeredPincode);
  if (pinErr) {
    fieldErrors.registeredPincode = pinErr;
    errors.push(pinErr);
  }
  if (!details.premisesOwnership?.trim()) {
    fieldErrors.premisesOwnership = 'Please select premises ownership status.';
    errors.push(fieldErrors.premisesOwnership);
  }
  const emailErr = validateCompanyEmail(details.companyEmail);
  if (emailErr) {
    fieldErrors.companyEmail = emailErr;
    errors.push(emailErr);
  }
  const mobileErr = validateCompanyMobile(details.companyMobile);
  if (mobileErr) {
    fieldErrors.companyMobile = mobileErr;
    errors.push(mobileErr);
  }
};

/** Step 4: capital and shares. Adds messages to `fieldErrors` and `errors`. */
const collectCapitalErrors = (
  details: Partial<CompanyDetails>, fieldErrors: Record<string, string>, errors: string[]
): void => {
  if (!details.authorizedCapital || details.authorizedCapital <= 0) {
    fieldErrors.authorizedCapital = 'Please enter valid Authorised Capital.';
    errors.push(fieldErrors.authorizedCapital);
  }
  if (!details.faceValuePerShare || details.faceValuePerShare <= 0) {
    fieldErrors.faceValuePerShare = 'Please enter valid Face Value per Share.';
    errors.push(fieldErrors.faceValuePerShare);
  }
  if (details.paidUpCapital && details.authorizedCapital && details.paidUpCapital > details.authorizedCapital) {
    fieldErrors.paidUpCapital = 'Subscribed Capital cannot exceed Authorised Capital.';
    errors.push(fieldErrors.paidUpCapital);
  }
};

/** Step 6: linked registrations. Adds messages to `fieldErrors` and `errors`. */
const collectLinkedRegistrationErrors = (
  details: Partial<CompanyDetails>, linkedRegistrations: LinkedRegistrations | undefined, fieldErrors: Record<string, string>, errors: string[]
): void => {
  if (linkedRegistrations?.bankAccount) {
    if (!details.accountNumber?.trim() || !/^\d{6,18}$/.test(details.accountNumber.trim())) {
      fieldErrors.accountNumber = 'Please enter a valid account number.';
      errors.push(fieldErrors.accountNumber);
    }
  }
};

export const companySchema = {
  validateStep(step: number, details: Partial<CompanyDetails>, linkedRegistrations?: LinkedRegistrations): { valid: boolean; errors: string[]; fieldErrors: Record<string, string> } {
    const errors: string[] = [];
    const fieldErrors: Record<string, string> = {};

    if (step === 0) {
      collectCompanyTypeErrors(details, fieldErrors, errors);
    }

    if (step === 1) {
      collectCompanyDetailsErrors(details, fieldErrors, errors);
    }

    if (step === 2) {
      collectRegisteredOfficeErrors(details, fieldErrors, errors);
    }

    if (step === 4) {
      collectCapitalErrors(details, fieldErrors, errors);
    }

    if (step === 6) {
      collectLinkedRegistrationErrors(details, linkedRegistrations, fieldErrors, errors);
    }

    return { valid: errors.length === 0, errors, fieldErrors };
  },
};

