export const MSME_BUSINESS_NAME_MAX_LENGTH = 100;
export const MSME_CONSTITUTION_OTHER_MAX_LENGTH = 50;
export const MSME_ACTIVITY_OTHER_MAX_LENGTH = 60;
export const MSME_HOUSE_MAX_LENGTH = 100;
export const MSME_STREET_MAX_LENGTH = 120;
export const MSME_CITY_MAX_LENGTH = 50;
export const MSME_OWNERSHIP_OTHER_MAX_LENGTH = 50;
export const MSME_MAX_EMPLOYEES = 50000;

// Broad emoji detection covering standard emojis, pictorial symbols, and presentation selectors
export const EMOJI_REGEX =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{200D}]/u;

// Control characters (newlines, tabs, null bytes, backspaces, etc.)
export const CONTROL_CHAR_REGEX = /[\u0000-\u001F\u007F-\u009F]/;

// HTML tags, script payloads, javascript: URLs
export const HTML_SCRIPT_REGEX = /<[^>]*>|javascript:|alert\(|<\s*script/i;

// SQL injection patterns like ' OR 1=1 --, DROP TABLE, UNION SELECT, etc.
export const SQL_INJECTION_REGEX =
  /('\s*(OR|AND)\b|--|\/\*|\*\/|\b(UNION\s+SELECT|INSERT\s+INTO|DROP\s+TABLE|DELETE\s+FROM|UPDATE\s+\w+\s+SET|OR\s+1\s*=\s*1|EXEC|XP_)\b)/i;

const BUSINESS_NAME_ALLOWED_REGEX = /^[a-zA-Z0-9ऀ-ൿ\s.,&'\-/()]+$/;

// Standard Udyam Registration format: UDYAM-XX-00-0000000
const UDYAM_REGEX = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;

// Standard Indian GSTIN format: 15 alphanumeric characters with strict checksum positions
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/** Checks for emoji, control characters, script/html, and SQL injection payloads. */
export function hasMaliciousOrDecorativeChars(input: string): boolean {
  return (
    EMOJI_REGEX.test(input) ||
    CONTROL_CHAR_REGEX.test(input) ||
    HTML_SCRIPT_REGEX.test(input) ||
    SQL_INJECTION_REGEX.test(input)
  );
}

export function validateBusinessName(name: string): string | undefined {
  if (!name || !name.trim()) return "Please enter your business or trade name";
  if (name.startsWith(" ") || name.endsWith(" ")) return "Business name cannot contain leading or trailing spaces";
  if (name.length > MSME_BUSINESS_NAME_MAX_LENGTH) return `Business name cannot exceed ${MSME_BUSINESS_NAME_MAX_LENGTH} characters`;
  if (hasMaliciousOrDecorativeChars(name)) return "Business name contains invalid symbols, emoji or formatting";
  if (!BUSINESS_NAME_ALLOWED_REGEX.test(name)) return "Business name contains invalid characters";
  if (!/[a-zA-Zऀ-ൿ]/.test(name)) return "Business name must contain letters";
  return undefined;
}

export function validateConstitutionOther(value: string): string | undefined {
  if (!value || !value.trim()) return "Please specify your business constitution";
  if (value.startsWith(" ") || value.endsWith(" ")) return "Constitution cannot contain leading or trailing spaces";
  if (value.length > MSME_CONSTITUTION_OTHER_MAX_LENGTH) return `Constitution cannot exceed ${MSME_CONSTITUTION_OTHER_MAX_LENGTH} characters`;
  if (hasMaliciousOrDecorativeChars(value)) return "Constitution contains invalid characters or emoji";
  if (!/^[a-zA-Zऀ-ൿ\s.,'\-/()]+$/.test(value)) return "Constitution contains invalid characters";
  if (!/[a-zA-Zऀ-ൿ]/.test(value)) return "Constitution must contain letters";
  return undefined;
}

export function validateBusinessActivityOther(value: string): string | undefined {
  if (!value || !value.trim()) return "Please specify your business activity";
  if (value.startsWith(" ") || value.endsWith(" ")) return "Activity cannot contain leading or trailing spaces";
  if (value.length > MSME_ACTIVITY_OTHER_MAX_LENGTH) return `Activity cannot exceed ${MSME_ACTIVITY_OTHER_MAX_LENGTH} characters`;
  if (hasMaliciousOrDecorativeChars(value)) return "Activity contains invalid characters or emoji";
  if (!/^[a-zA-Z0-9ऀ-ൿ\s.,'\-/()]+$/.test(value)) return "Activity contains invalid characters";
  if (!/[a-zA-Zऀ-ൿ]/.test(value)) return "Activity must contain letters";
  return undefined;
}

/**
 * Validates Business Establishment Date.
 * Supports ISO (YYYY-MM-DD) or Indian display (DD-MM-YYYY).
 */
export function validateEstablishmentDate(dateStr: string): string | undefined {
  if (!dateStr || !dateStr.trim()) return "Please select business establishment date";
  const clean = dateStr.trim();
  let day: number, month: number, year: number;

  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    const parts = clean.split("-").map(Number);
    year = parts[0]; month = parts[1]; day = parts[2];
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) {
    const parts = clean.split("-").map(Number);
    day = parts[0]; month = parts[1]; year = parts[2];
  } else {
    return "Please enter a valid establishment date";
  }

  if (year < 1850) return "Please enter a valid establishment year";

  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return "Please enter a valid calendar date";
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (parsed > today) return "Establishment date cannot be in the future";

  return undefined;
}

export function validateUdyamNumber(number: string, status: string): string | undefined {
  if (status !== "Registered") return undefined;
  const raw = number || "";
  if (!raw.trim()) return "Please enter your Udyam registration number";
  if (/\s/.test(raw)) return "Udyam number cannot contain spaces";
  const clean = raw.trim().toUpperCase();
  if (hasMaliciousOrDecorativeChars(clean)) return "Udyam number contains invalid characters or emoji";
  if (!UDYAM_REGEX.test(clean)) return "Enter a valid Udyam number (e.g. UDYAM-XX-00-0000000)";
  return undefined;
}

export function validateGstin(gstin: string, status: string): string | undefined {
  if (status !== "Registered") return undefined;
  const raw = gstin || "";
  if (!raw.trim()) return "Please enter your 15-character GSTIN";
  if (/\s/.test(raw)) return "GSTIN cannot contain spaces";
  const clean = raw.trim().toUpperCase();
  if (hasMaliciousOrDecorativeChars(clean)) return "GSTIN contains invalid characters or emoji";
  if (clean.length !== 15 || !GSTIN_REGEX.test(clean)) return "Enter a valid 15-character GSTIN";
  return undefined;
}

export function validateEmployees(value: string): string | undefined {
  const raw = value || "";
  const clean = raw.trim();
  if (!clean) return "Please enter number of employees";
  if (raw.startsWith(" ") || raw.endsWith(" ")) return "Number of employees cannot contain spaces";
  if (hasMaliciousOrDecorativeChars(clean)) return "Employees must contain digits only";
  if (clean.includes(".")) return "Number of employees must be a whole number";
  if (/[eE+\-]/.test(clean)) return "Number of employees must be a valid whole number";
  if (!/^\d+$/.test(clean)) return "Number of employees must contain digits only";
  const count = parseInt(clean, 10);
  if (isNaN(count) || count < 1) return "Please enter at least 1 employee";
  if (count > MSME_MAX_EMPLOYEES) return `Number of employees cannot exceed ${MSME_MAX_EMPLOYEES.toLocaleString("en-IN")}`;
  return undefined;
}

export function validateTurnover(turnover: string, isInvalidMoney?: boolean): string | undefined {
  if (isInvalidMoney) return "Enter a whole-rupee amount using numbers only";
  const raw = (turnover || "").trim();
  if (!raw) return "Please enter annual turnover";
  if (hasMaliciousOrDecorativeChars(raw)) return "Turnover contains invalid characters or emoji";
  if (/[eE+\-]/.test(raw)) return "Turnover cannot use scientific notation or signs";
  if (raw.includes(".")) return "Annual turnover must be a whole-rupee amount";
  const clean = raw.replace(/,/g, "");
  if (!/^\d+$/.test(clean)) return "Annual turnover must contain numbers only";
  const amount = parseInt(clean, 10);
  if (isNaN(amount) || amount <= 0) return "Annual turnover must be greater than zero";
  return undefined;
}

export function validateOwnershipOther(ownershipType: string, otherValue: string): string | undefined {
  if (ownershipType !== "Other") return undefined;
  const raw = otherValue || "";
  const clean = raw.trim();
  if (!clean) return "Please specify ownership type";
  if (raw.startsWith(" ") || raw.endsWith(" ")) return "Ownership type cannot contain leading or trailing spaces";
  if (clean.length > MSME_OWNERSHIP_OTHER_MAX_LENGTH) return `Ownership type cannot exceed ${MSME_OWNERSHIP_OTHER_MAX_LENGTH} characters`;
  if (hasMaliciousOrDecorativeChars(clean)) return "Ownership type contains invalid characters or emoji";
  if (!/^[a-zA-Zऀ-ൿ\s.,'\-/()]+$/.test(clean)) return "Ownership type contains invalid characters";
  if (!/[a-zA-Zऀ-ൿ]/.test(clean)) return "Ownership type must contain letters";
  return undefined;
}
