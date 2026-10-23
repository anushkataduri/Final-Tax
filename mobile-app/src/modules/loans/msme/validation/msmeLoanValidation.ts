import { INDIAN_STATES_AND_UTS } from "@/components/screens/create-profile/types";
import {
  MSME_BUSINESS_ACTIVITY_OPTIONS,
  MSME_CONSTITUTION_OPTIONS,
  MSME_DURATION_OPTIONS,
  MSME_GST_STATUS_OPTIONS,
  MSME_OWNERSHIP_OPTIONS,
  MSME_REGISTRATION_STATUS_OPTIONS,
  type MsmeLoanAddress,
  type MsmeLoanFormData,
  type MsmeLoanErrors,
  type MsmeMoneyField,
} from "../types/msmeLoan.types";
import {
  isUdyamRegistered,
  isGstRegistered,
} from "../constants/msmeDocuments";
import {
  hasMaliciousOrDecorativeChars,
  validateBusinessName,
  validateConstitutionOther,
  validateBusinessActivityOther,
  validateEstablishmentDate,
  validateUdyamNumber,
  validateGstin,
  validateEmployees,
  validateTurnover,
  validateOwnershipOther,
} from "./msmePrimitiveValidators";

// Re-export constants and primitives for existing consumers
export {
  MSME_BUSINESS_NAME_MAX_LENGTH,
  MSME_CONSTITUTION_OTHER_MAX_LENGTH,
  MSME_ACTIVITY_OTHER_MAX_LENGTH,
  MSME_HOUSE_MAX_LENGTH,
  MSME_STREET_MAX_LENGTH,
  MSME_CITY_MAX_LENGTH,
  MSME_OWNERSHIP_OTHER_MAX_LENGTH,
  MSME_MAX_EMPLOYEES,
  EMOJI_REGEX,
  CONTROL_CHAR_REGEX,
  HTML_SCRIPT_REGEX,
  SQL_INJECTION_REGEX,
  hasMaliciousOrDecorativeChars,
  validateBusinessName,
  validateConstitutionOther,
  validateBusinessActivityOther,
  validateEstablishmentDate,
  validateUdyamNumber,
  validateGstin,
  validateEmployees,
  validateTurnover,
  validateOwnershipOther,
} from "./msmePrimitiveValidators";

// City must only contain letters, Indian language characters, spaces, and dots/hyphens
const CITY_ALLOWED_REGEX = /^[a-zA-Zऀ-ൿ\s.'-]+$/;

// Address house / street allowed characters
const ADDRESS_LINE_ALLOWED_REGEX = /^[a-zA-Z0-9ऀ-ൿ\s.,#'\-/()]+$/;

// Standard Indian PIN code: 6 digits, 1-9 start
const PINCODE_REGEX = /^[1-9]\d{5}$/;

export function validateOperatingAddress(
  address: MsmeLoanAddress
): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};

  const rawHouse = address.houseNumber || "";
  const house = rawHouse.trim();
  if (!house) {
    errors["operatingAddress.houseNumber"] = "Please enter house, flat or building";
  } else if (rawHouse.startsWith(" ") || rawHouse.endsWith(" ")) {
    errors["operatingAddress.houseNumber"] = "House/flat cannot contain leading or trailing spaces";
  } else if (house.length > 100) {
    errors["operatingAddress.houseNumber"] = "House/flat cannot exceed 100 characters";
  } else if (hasMaliciousOrDecorativeChars(house) || !ADDRESS_LINE_ALLOWED_REGEX.test(house)) {
    errors["operatingAddress.houseNumber"] = "House/flat contains invalid characters";
  }

  const rawStreet = address.street || "";
  const street = rawStreet.trim();
  if (!street) {
    errors["operatingAddress.street"] = "Please enter street, locality or landmark";
  } else if (rawStreet.startsWith(" ") || rawStreet.endsWith(" ")) {
    errors["operatingAddress.street"] = "Street cannot contain leading or trailing spaces";
  } else if (street.length > 120) {
    errors["operatingAddress.street"] = "Street cannot exceed 120 characters";
  } else if (hasMaliciousOrDecorativeChars(street) || !ADDRESS_LINE_ALLOWED_REGEX.test(street)) {
    errors["operatingAddress.street"] = "Street/locality contains invalid characters";
  }

  const rawCity = address.city || "";
  const city = rawCity.trim();
  if (!city) {
    errors["operatingAddress.city"] = "Please enter city or district";
  } else if (rawCity.startsWith(" ") || rawCity.endsWith(" ")) {
    errors["operatingAddress.city"] = "City cannot contain leading or trailing spaces";
  } else if (city.length > 50) {
    errors["operatingAddress.city"] = "City cannot exceed 50 characters";
  } else if (hasMaliciousOrDecorativeChars(city)) {
    errors["operatingAddress.city"] = "City contains invalid symbols or emoji";
  } else if (!CITY_ALLOWED_REGEX.test(city) || /\d/.test(city)) {
    errors["operatingAddress.city"] = "City must contain letters only";
  } else if (!/[a-zA-Zऀ-ൿ]/.test(city)) {
    errors["operatingAddress.city"] = "City must contain letters";
  }

  const state = (address.state || "").trim();
  if (!state) {
    errors["operatingAddress.state"] = "Please select a state or union territory";
  } else if (!INDIAN_STATES_AND_UTS.includes(state as (typeof INDIAN_STATES_AND_UTS)[number])) {
    errors["operatingAddress.state"] = "Please select a valid state from the list";
  }

  const rawPin = address.pincode || "";
  if (!rawPin.trim()) {
    errors["operatingAddress.pincode"] = "Please enter a 6-digit PIN code";
  } else if (/\s/.test(rawPin)) {
    errors["operatingAddress.pincode"] = "PIN code cannot contain spaces";
  } else if (rawPin.startsWith("0")) {
    errors["operatingAddress.pincode"] = "PIN code cannot start with 0";
  } else if (!PINCODE_REGEX.test(rawPin)) {
    errors["operatingAddress.pincode"] = "Please enter a valid 6-digit PIN code";
  }

  return errors;
}

/** Complete form validation for MSME Loan Screen 2. */
export function validateMsmeLoanForm(
  formData: MsmeLoanFormData,
  invalidMoneyFields?: Partial<Record<MsmeMoneyField, boolean>>
): { isValid: boolean; errors: MsmeLoanErrors } {
  const errors: MsmeLoanErrors = {};

  const businessNameError = validateBusinessName(formData.businessName);
  if (businessNameError) errors.businessName = businessNameError;

  if (!formData.constitution) {
    errors.constitution = "Please select business constitution";
  } else if (!MSME_CONSTITUTION_OPTIONS.includes(formData.constitution)) {
    errors.constitution = "Please select a valid business constitution";
  } else if (formData.constitution === "Other") {
    const e = validateConstitutionOther(formData.constitutionOther);
    if (e) errors.constitutionOther = e;
  }

  if (!formData.businessActivity) {
    errors.businessActivity = "Please select primary business activity";
  } else if (!MSME_BUSINESS_ACTIVITY_OPTIONS.includes(formData.businessActivity)) {
    errors.businessActivity = "Please select a valid business activity";
  } else if (formData.businessActivity === "Other") {
    const e = validateBusinessActivityOther(formData.businessActivityOther);
    if (e) errors.businessActivityOther = e;
  }

  const dateError = validateEstablishmentDate(formData.establishmentDate);
  if (dateError) errors.establishmentDate = dateError;

  Object.assign(errors, validateOperatingAddress(formData.operatingAddress));

  const isUdyamRegisteredVal = isUdyamRegistered(formData.udyamStatus);
  const isValidUdyamOption =
    (MSME_REGISTRATION_STATUS_OPTIONS as readonly string[]).includes(formData.udyamStatus) ||
    formData.udyamStatus === "Yes" ||
    formData.udyamStatus === "No";
  if (!formData.udyamStatus) {
    errors.udyamStatus = "Please select Udyam registration status";
  } else if (!isValidUdyamOption) {
    errors.udyamStatus = "Please select a valid registration status";
  } else if (isUdyamRegisteredVal) {
    const e = validateUdyamNumber(formData.udyamRegistrationNumber, "Registered");
    if (e) errors.udyamRegistrationNumber = e;
  }

  const isGstRegisteredVal = isGstRegistered(formData.gstStatus);
  const isValidGstOption =
    (MSME_GST_STATUS_OPTIONS as readonly string[]).includes(formData.gstStatus) ||
    formData.gstStatus === "Yes" ||
    formData.gstStatus === "No";
  if (!formData.gstStatus) {
    errors.gstStatus = "Please select GST registration status";
  } else if (!isValidGstOption) {
    errors.gstStatus = "Please select a valid GST registration status";
  } else if (isGstRegisteredVal) {
    const e = validateGstin(formData.gstin, "Registered");
    if (e) errors.gstin = e;
  }

  if (!formData.operatingDuration) {
    errors.operatingDuration = "Please select business operating duration";
  } else if (!MSME_DURATION_OPTIONS.includes(formData.operatingDuration)) {
    errors.operatingDuration = "Please select a valid operating duration";
  }

  const employeesError = validateEmployees(formData.numberOfEmployees);
  if (employeesError) errors.numberOfEmployees = employeesError;

  const turnoverError = validateTurnover(formData.annualTurnover, invalidMoneyFields?.annualTurnover);
  if (turnoverError) errors.annualTurnover = turnoverError;

  if (!formData.ownershipType) {
    errors.ownershipType = "Please select business ownership type";
  } else if (!MSME_OWNERSHIP_OPTIONS.includes(formData.ownershipType)) {
    errors.ownershipType = "Please select a valid ownership type";
  } else if (formData.ownershipType === "Other") {
    const e = validateOwnershipOther(formData.ownershipType, formData.ownershipTypeOther);
    if (e) errors.ownershipTypeOther = e;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
