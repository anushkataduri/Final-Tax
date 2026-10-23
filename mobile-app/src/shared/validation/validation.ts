import { validators, ValidationRule } from "./validators";

export type SchemaRules<T extends Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

/**
 * Validates a single field against a validation rule function.
 * Returns null if valid, or an error string if invalid.
 */
export function validateField<T = unknown>(value: T, rule: ValidationRule<T>): string | null {
  return rule(value);
}

/**
 * Validates a data object against a schema of validation rules.
 * Returns a Record<string, string> of field error messages.
 */
export function validateForm<T extends Record<string, unknown>>(
  values: Partial<T>,
  schema: SchemaRules<T>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const key in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, key)) {
      const rule = schema[key];
      if (rule) {
        const value = values[key];
        const error = rule(value as T[Extract<keyof T, string>]);
        if (error) {
          errors[key] = error;
        }
      }
    }
  }

  return errors;
}

export default {
  validateField,
  validateForm,
  validators,
};
