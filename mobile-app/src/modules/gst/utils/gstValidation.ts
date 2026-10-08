/**
 * GST Validation Utilities
 * Strict Indian GSTIN validation, file type checks, and size validation
 */

// Official 15-character GSTIN format regex:
// 2 digits (state code) + 5 letters (PAN) + 4 digits (PAN) + 1 letter (PAN) + 1 alphanumeric (entity number) + 'Z' + 1 alphanumeric (checksum)
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export const RECONCILIATION_ALLOWED_EXTENSIONS = [
  ".pdf",
  ".xls",
  ".xlsx",
  ".csv",
  ".jpg",
  ".jpeg",
  ".png",
];
export const NOTICE_ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".xls",
  ".xlsx",
  ".csv",
];

export function isValidGstin(gstin: string): boolean {
  if (!gstin) return false;
  return GSTIN_REGEX.test(gstin.trim().toUpperCase());
}

export function cleanGstinInput(text: string): string {
  return text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 15);
}

export function isFileSizeValid(bytes?: number, maxBytes: number = MAX_FILE_SIZE_BYTES): boolean {
  if (bytes === undefined || bytes === null) return true;
  return bytes <= maxBytes;
}

export function isFileTypeAllowed(filename: string, allowedExtensions: string[]): boolean {
  if (!filename) return false;
  const lower = filename.toLowerCase();
  return allowedExtensions.some((ext) => lower.endsWith(ext.toLowerCase()));
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export function generateComplianceRefId(): string {
  const year = new Date().getFullYear();
  const randomSeq = String(Math.floor(100000 + Math.random() * 900000));
  return `GSTC-${year}-${randomSeq}`;
}

export function getTodayFormatted(): string {
  const d = new Date();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}
