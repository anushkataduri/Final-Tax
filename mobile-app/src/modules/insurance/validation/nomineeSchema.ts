import type { NomineeDetails } from '../types/member.types';

export const nomineeSchema = {
  validateNominee(nominee: Partial<NomineeDetails>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    if (!nominee.fullName?.trim()) errors.fullName = 'Nominee name is required';
    if (!nominee.relation?.trim()) errors.relation = 'Relationship is required';
    return { valid: Object.keys(errors).length === 0, errors };
  },
};
