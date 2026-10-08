import { validatePasscode } from "@/modules/authentication/validation/authSchema";
import {
  validateDateOfBirth,
  validateEmail,
  validateFullName,
} from "@/shared/validators/indianTaxValidators";
import type { SignupForm } from "./types";

export const sanitizePanInput = (text: string, currentPan: string): string => {
  const clean = text.toUpperCase().replace(/\s+/g, "");
  if (clean.length < currentPan.length && currentPan.startsWith(clean)) {
    return clean;
  }
  return Array.from(clean.slice(0, 10)).reduce(
    (acc, ch, i) =>
      acc.stopped
        ? acc
        : (i < 5 && /[A-Z]/.test(ch)) ||
            (i >= 5 && i < 9 && /[0-9]/.test(ch)) ||
            (i === 9 && /[A-Z]/.test(ch))
          ? { str: acc.str + ch, stopped: false }
          : { str: acc.str, stopped: true },
    { str: "", stopped: false }
  ).str;
};

export const formatDobInput = (text: string): string => {
  const digits = text.replace(/[^0-9]/g, "");
  return digits.length > 4
    ? `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`
    : digits.length > 2
      ? `${digits.slice(0, 2)}-${digits.slice(2)}`
      : digits;
};

export const validateField = (
  key: keyof SignupForm,
  val: string,
  mobileNumber?: string,
  passwordForConfirm?: string
): string => {
  const validators: Record<keyof SignupForm, () => string> = {
    name: () => (!val.trim() ? "Required" : validateFullName(val) ? "" : "Enter a valid full name"),
    email: () => {
      const c = val.trim();
      return !c ? "Required" : !validateEmail(c) ? "Invalid email" : "";
    },
    gender: () => (val ? "" : "Required"),
    dob: () => {
      const c = val.trim();
      return !c ? "Required" : !validateDateOfBirth(c) ? "Please enter a valid date of birth." : "";
    },
    fatherSpouseName: () => (val.trim() ? "" : "Required"),
    pan: () => {
      const c = val.trim().toUpperCase();
      return !c ? "Required" : !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(c) ? "Invalid PAN" : "";
    },
    aadhaar: () => {
      const c = val.replace(/\D/g, "");
      return !c ? "Required" : c.length !== 12 || !/^[2-9]{1}[0-9]{11}$/.test(c) ? "Invalid Aadhaar" : "";
    },
    addressLine1: () => (val.trim() ? "" : "Required"),
    addressLine2: () => "",
    city: () => (val.trim() ? "" : "Required"),
    pincode: () => {
      const c = val.replace(/\D/g, "");
      return !c ? "Required" : c.length !== 6 ? "PIN Code must be 6 digits" : "";
    },
    state: () => (val ? "" : "Required"),
    mobileNumber: () => "",
    password: () =>
      !val
        ? "Required"
        : val.length < 6
          ? "Passcode must be 6 digits"
          : !validatePasscode(val, mobileNumber).valid
            ? validatePasscode(val, mobileNumber).error || "Invalid passcode"
            : "",
    confirmPassword: () =>
      !val ? "Required" : val !== passwordForConfirm ? "Passcodes do not match" : "",
    customerType: () => (val ? "" : "Required"),
  };
  return validators[key]?.() ?? "";
};

export const validateRealTimeField = (
  key: keyof SignupForm,
  val: string,
  form: SignupForm,
  mobileNumber?: string
): string => {
  switch (key) {
    case "name": {
      if (!val) return "";
      if (/[0-9]/.test(val)) return "Name cannot contain numbers";
      if (val.trim().length >= 2 && !validateFullName(val)) {
        return "Enter a valid full name";
      }
      return "";
    }
    case "email": {
      if (!val) return "";
      if (val.includes("@") && val.indexOf(".") > val.indexOf("@") + 1) {
        return validateEmail(val.trim()) ? "" : "Invalid email address";
      }
      return "";
    }
    case "dob": {
      if (!val) return "";
      if (val.length === 10) {
        return validateDateOfBirth(val) ? "" : "Please enter a valid date of birth.";
      }
      return "";
    }
    case "fatherSpouseName": {
      if (!val) return "";
      if (/[0-9]/.test(val)) return "Name cannot contain numbers";
      return "";
    }
    case "pan": {
      const clean = val.trim().toUpperCase();
      if (!clean) return "";
      if (clean.length === 10) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(clean) ? "" : "Invalid PAN format";
      }
      return "";
    }
    case "aadhaar": {
      const clean = val.replace(/\D/g, "");
      if (!clean) return "";
      if (clean.length === 12) {
        return /^[2-9]{1}[0-9]{11}$/.test(clean) ? "" : "Invalid Aadhaar (must start with 2-9)";
      }
      return "";
    }
    case "pincode": {
      const clean = val.replace(/\D/g, "");
      if (!clean) return "";
      if (clean.length === 6) {
        return /^[1-9]{1}[0-9]{5}$/.test(clean) ? "" : "PIN Code cannot start with 0";
      }
      return "";
    }
    case "password": {
      if (!val) return "";
      if (val.length === 6) {
        const res = validatePasscode(val, mobileNumber || form.mobileNumber);
        return res.valid ? "" : (res.error || "Invalid passcode");
      }
      return "";
    }
    case "confirmPassword": {
      if (!val) return "";
      if (val.length === 6) {
        return val === form.password ? "" : "Passcodes do not match";
      }
      return "";
    }
    default:
      return "";
  }
};

export const checkFormValidity = (
  form: SignupForm,
  agreedToTerms: boolean,
  mobileNumber?: string
): boolean => {
  return (
    validateFullName(form.name) &&
    validateEmail(form.email) &&
    Boolean(form.gender) &&
    validateDateOfBirth(form.dob) &&
    Boolean(form.fatherSpouseName.trim()) &&
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan.trim().toUpperCase()) &&
    /^[2-9]{1}[0-9]{11}$/.test(form.aadhaar.replace(/\D/g, "")) &&
    Boolean(form.addressLine1.trim()) &&
    Boolean(form.city.trim()) &&
    form.pincode.replace(/\D/g, "").length === 6 &&
    Boolean(form.state) &&
    validatePasscode(form.password, mobileNumber).valid &&
    form.confirmPassword === form.password &&
    form.confirmPassword.length === 6 &&
    agreedToTerms
  );
};
