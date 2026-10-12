/**
 * HSN / SAC Classification and Validation Policy
 *
 * In the Indian GST framework:
 * - SAC (Services Accounting Code): Used for services, standardly begins with "99" (typically 6 digits).
 * - HSN (Harmonized System of Nomenclature): Used for goods (4, 6, or 8 digits).
 */

export interface HsnSacClassification {
  isValid: boolean;
  type: "SAC" | "HSN" | "UNKNOWN";
  label: string;
  description?: string;
}

export const hsnSacPolicy = {
  /**
   * Classifies a given code as SAC (Services) or HSN (Goods).
   * @param code The HSN/SAC code to classify
   * @returns Classification object containing validity, type, and human-readable label
   */
  classify: (code: string): HsnSacClassification => {
    if (!code || typeof code !== "string") {
      return {
        isValid: false,
        type: "UNKNOWN",
        label: "",
      };
    }

    const clean = code.trim();

    // Must be digits between 2 and 8 in length
    if (!/^\d{2,8}$/.test(clean)) {
      return {
        isValid: false,
        type: "UNKNOWN",
        label: "",
      };
    }

    // In India GST, all SAC codes begin with "99"
    if (clean.startsWith("99")) {
      const isValid = clean.length >= 4 && clean.length <= 8;
      return {
        isValid,
        type: "SAC",
        label: `SAC (Services) — ${clean.length} digits`,
        description: "Services Accounting Code",
      };
    }

    // Standard HSN codes for goods
    const isValid = clean.length >= 4 && clean.length <= 8;
    return {
      isValid,
      type: "HSN",
      label: `HSN (Goods) — ${clean.length} digits`,
      description: "Harmonized System of Nomenclature for Goods",
    };
  },

  /**
   * Validates whether a code conforms to standard HSN/SAC code requirements (4 to 8 digits).
   */
  isValidCode: (code: string): boolean => {
    return hsnSacPolicy.classify(code).isValid;
  },

  /**
   * Determines whether a given code represents services (SAC).
   */
  isServiceCode: (code: string): boolean => {
    return (code?.trim() || "").startsWith("99");
  },
};
