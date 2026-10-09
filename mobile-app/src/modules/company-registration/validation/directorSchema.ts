import type { DirectorInfo } from '../types/director.types';

export const DOB_REGEX = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\d\d$/;

export function isValidDob(dob: string): boolean {
  if (!dob || !DOB_REGEX.test(dob)) return false;
  const parts = dob.split('-');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function formatDobInput(text: string): string {
  const cleaned = text.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
}

export function validateDirectorPan(pan?: string): string | null {
  const trimmed = pan?.trim().toUpperCase() || '';
  if (!trimmed) return 'PAN number is required.';
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(trimmed)) {
    return 'Enter a valid 10-character PAN, for example ABCDE1234F.';
  }
  return null;
}

export function validateDirectorEmail(email?: string): string | null {
  const trimmed = email?.trim() || '';
  if (!trimmed) return 'Email address is required.';
  if (trimmed.length > 254) return 'Email address must not exceed 254 characters.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed) || trimmed.includes(' ')) {
    return 'Enter a valid email address.';
  }
  return null;
}

export function validateDirectorMobile(mobile?: string): string | null {
  const trimmed = mobile?.trim() || '';
  if (!trimmed) return 'Mobile number is required.';
  if (trimmed.length < 10 && /^\d+$/.test(trimmed)) {
    return 'Mobile number must contain exactly 10 digits.';
  }
  if (!/^[6-9][0-9]{9}$/.test(trimmed)) {
    return 'Enter a valid 10-digit Indian mobile number.';
  }
  return null;
}

export function validateDirectorDob(dob?: string): string | null {
  const trimmed = dob?.trim() || '';
  if (!trimmed) return 'Date of Birth is required.';
  if (!isValidDob(trimmed)) {
    return 'Please enter a valid date of birth in DD-MM-YYYY format.';
  }
  return null;
}

export const directorSchema = {
  validateDirector(director: Partial<DirectorInfo>, index = 0): { valid: boolean; errors: string[]; fieldErrors: Record<string, string> } {
    const errors: string[] = [];
    const fieldErrors: Record<string, string> = {};
    const dirId = director.id || `dir_${index}`;
    const prefix = `dir_${dirId}_`;

    if (!director.name?.trim()) {
      fieldErrors[`${prefix}name`] = 'Full Name as in PAN is required.';
      errors.push(fieldErrors[`${prefix}name`]);
    }

    const panErr = validateDirectorPan(director.pan);
    if (panErr) {
      fieldErrors[`${prefix}pan`] = panErr;
      errors.push(panErr);
    }

    const dobErr = validateDirectorDob(director.dob);
    if (dobErr) {
      fieldErrors[`${prefix}dob`] = dobErr;
      errors.push(dobErr);
    }

    const emailErr = validateDirectorEmail(director.email);
    if (emailErr) {
      fieldErrors[`${prefix}email`] = emailErr;
      errors.push(emailErr);
    }

    const mobileErr = validateDirectorMobile(director.phone);
    if (mobileErr) {
      fieldErrors[`${prefix}phone`] = mobileErr;
      errors.push(mobileErr);
    }

    if (!director.designation?.trim()) {
      fieldErrors[`${prefix}designation`] = 'Designation is required.';
      errors.push(fieldErrors[`${prefix}designation`]);
    }

    return { valid: errors.length === 0, errors, fieldErrors };
  },
};
