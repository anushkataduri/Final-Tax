import React, { useState } from "react";
import { View } from "react-native";
import { FormInput } from "../../../../shared/components/Input/FormInput";
import type { CompanyDetails } from "../../types/company.types";
import { CompanySectionCard } from "../CompanySectionCard/CompanySectionCard";
import {
  getSuffixForType,
  validateBusinessActivity,
  validateIndustryCategory,
  validateProposedCompanyName,
} from "../../validation/companySchema";
import { styles } from "./CompanyDetailsForm.styles";

export interface CompanyDetailsFormProps {
  values: Partial<CompanyDetails>;
  onChange: (updates: Partial<CompanyDetails>) => void;
}

export const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({
  values,
  onChange,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const suffix = values.nameSuffix || getSuffixForType(values.companyType);

  const validateField = (field: string, val?: string) => {
    let err: string | null = null;
    if (field === 'proposedName1') {
      err = validateProposedCompanyName(val, suffix);
    } else if (field === 'proposedName2') {
      err = val?.trim() ? validateProposedCompanyName(val, suffix) : null;
      if (!err && val?.trim() && values.proposedName1?.trim() && val.trim().toLowerCase() === values.proposedName1.trim().toLowerCase()) {
        err = 'Alternative name must be distinct from primary proposed name.';
      }
    } else if (field === 'industryCategory') {
      err = validateIndustryCategory(val, true);
    } else if (field === 'businessActivityDescription') {
      err = validateBusinessActivity(val, true);
    }

    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <CompanySectionCard
        iconName="business-outline"
        title="Company Information"
        subtitle="Proposed names and business objective"
      >
        <FormInput
          label="Proposed Company Name (Option 1)"
          value={values.proposedName1 || ""}
          onChangeText={(text) => {
            onChange({ proposedName1: text });
            validateField('proposedName1', text);
          }}
          onBlur={() => validateField('proposedName1', values.proposedName1)}
          placeholder="Enter Proposed Company Name (Option 1)"
          error={errors.proposedName1}
          required
        />
        <FormInput
          label="Proposed Company Name (Option 2 - Alternative)"
          value={values.proposedName2 || ""}
          onChangeText={(text) => {
            onChange({ proposedName2: text });
            validateField('proposedName2', text);
          }}
          onBlur={() => validateField('proposedName2', values.proposedName2)}
          placeholder="Enter Proposed Company Name (Option 2)"
          error={errors.proposedName2}
        />
        <FormInput
          label="Industry Category"
          value={values.industryCategory || ""}
          onChangeText={(text) => {
            onChange({ industryCategory: text });
            validateField('industryCategory', text);
          }}
          onBlur={() => validateField('industryCategory', values.industryCategory)}
          placeholder="Enter Industry Category"
          error={errors.industryCategory}
          required
        />
        <FormInput
          label="Business Activity Description"
          value={values.businessActivityDescription || ""}
          onChangeText={(text) => {
            onChange({ businessActivityDescription: text });
            validateField('businessActivityDescription', text);
          }}
          onBlur={() => validateField('businessActivityDescription', values.businessActivityDescription)}
          placeholder="Enter Business Activity Description"
          error={errors.businessActivityDescription}
          required
        />
      </CompanySectionCard>
    </View>
  );
};

export default CompanyDetailsForm;
