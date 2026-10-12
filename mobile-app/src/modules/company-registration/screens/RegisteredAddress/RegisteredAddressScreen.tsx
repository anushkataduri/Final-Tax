import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { FormInput } from '../../../../shared/components/Input/FormInput';
import { CompanySectionCard } from '../../components/CompanySectionCard/CompanySectionCard';
import { useCompanyRegistration } from '../../hooks/useCompanyRegistration';
import {
  validateAddressLine,
  validateLocationName,
  validatePinCode,
} from '../../validation/companySchema';
import { styles } from './RegisteredAddressScreen.styles';

export const RegisteredAddressScreen: React.FC = () => {
  const { draft, updateCompanyDetails } = useCompanyRegistration();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value?: string) => {
    let err: string | null = null;
    if (field === 'registeredAddressLine') err = validateAddressLine(value);
    else if (field === 'registeredCity') err = validateLocationName(value, 'City');
    else if (field === 'registeredState') err = validateLocationName(value, 'State');
    else if (field === 'registeredPincode') err = validatePinCode(value);

    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Registered Office Address" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CompanySectionCard
          iconName="location-outline"
          title="Registered Office Address"
          description="Official communication address for MCA and ROC."
        >
          <FormInput
            label="Address Line"
            value={draft.company.registeredAddressLine}
            onChangeText={(v) => {
              updateCompanyDetails({ registeredAddressLine: v });
              validateField('registeredAddressLine', v);
            }}
            onBlur={() => validateField('registeredAddressLine', draft.company.registeredAddressLine)}
            placeholder="Building, Street, Landmark"
            error={errors.registeredAddressLine}
            required
          />
          <FormInput
            label="City"
            value={draft.company.registeredCity}
            onChangeText={(v) => {
              updateCompanyDetails({ registeredCity: v });
              validateField('registeredCity', v);
            }}
            onBlur={() => validateField('registeredCity', draft.company.registeredCity)}
            placeholder="City"
            error={errors.registeredCity}
            required
          />
          <FormInput
            label="State"
            value={draft.company.registeredState}
            onChangeText={(v) => {
              updateCompanyDetails({ registeredState: v });
              validateField('registeredState', v);
            }}
            onBlur={() => validateField('registeredState', draft.company.registeredState)}
            placeholder="State"
            error={errors.registeredState}
            required
          />
          <FormInput
            label="Pincode"
            value={draft.company.registeredPincode}
            onChangeText={(v) => {
              updateCompanyDetails({ registeredPincode: v });
              validateField('registeredPincode', v);
            }}
            onBlur={() => validateField('registeredPincode', draft.company.registeredPincode)}
            placeholder="6-digit Pincode"
            keyboardType="numeric"
            maxLength={6}
            error={errors.registeredPincode}
            required
          />
        </CompanySectionCard>
      </ScrollView>
    </View>
  );
};

export default RegisteredAddressScreen;
