import React, { useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { getSuffixForType, validateProposedCompanyName } from '../../validation/companySchema';
import { CompanySectionCard } from '../CompanySectionCard/CompanySectionCard';
import { styles } from './StepProposedNames.styles';

export const StepProposedNames: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const updateDetails = useCompanyRegistrationStore((state) => state.updateCompanyDetails);
  const fieldErrors = useCompanyRegistrationStore((state) => state.fieldErrors);
  const setFieldErrors = useCompanyRegistrationStore((state) => state.setFieldErrors);

  const suffix = getSuffixForType(company.companyType);

  useEffect(() => {
    if (company.nameSuffix !== suffix) {
      updateDetails({ nameSuffix: suffix });
    }
  }, [company.companyType, suffix]);

  const handleBlur = () => {
    const errorMsg = validateProposedCompanyName(company.proposedName1, suffix);
    if (errorMsg) {
      setFieldErrors({ ...fieldErrors, proposedName1: errorMsg });
    }
  };

  const handleChangeText = (val: string) => {
    updateDetails({ proposedName1: val });
    const err = validateProposedCompanyName(val, suffix);
    if (!err && fieldErrors.proposedName1) {
      const nextErrors = { ...fieldErrors };
      delete nextErrors.proposedName1;
      setFieldErrors(nextErrors);
    }
  };

  return (
    <CompanySectionCard
      title="Proposed Company Names"
      description="Provide your preferred name for SPICe+ Part A name reservation / incorporation."
    >
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Proposed Company Name *</Text>
        <TextInput
          style={[styles.input, !!fieldErrors.proposedName1 && styles.inputError]}
          value={company.proposedName1 || ''}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          placeholder="Enter your proposed company name"
          placeholderTextColor="#94A3B8"
        />
        <Text style={styles.suffixLabel}>Legal suffix: {suffix}</Text>
        {!!fieldErrors.proposedName1 && <Text style={styles.errorText}>{fieldErrors.proposedName1}</Text>}
      </View>
    </CompanySectionCard>
  );
};

export default StepProposedNames;
