import type { InsuranceMember } from '../types/member.types';

export const memberSchema = {
  validateMember(member: Partial<InsuranceMember>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    if (!member.fullName?.trim()) errors.fullName = 'Full name is required';
    if (!member.dob?.trim()) errors.dob = 'Date of birth is required';
    return { valid: Object.keys(errors).length === 0, errors };
  },
};
