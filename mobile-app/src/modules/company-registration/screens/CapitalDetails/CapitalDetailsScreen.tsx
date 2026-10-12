import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { FormInput } from '../../../../shared/components/Input/FormInput';
import { CompanySectionCard } from '../../components/CompanySectionCard/CompanySectionCard';
import { useCompanyRegistration } from '../../hooks/useCompanyRegistration';
import { validateCapitalNumeric } from '../../validation/companySchema';
import { styles } from './CapitalDetailsScreen.styles';

export const CapitalDetailsScreen: React.FC = () => {
  const { draft, updateCompanyDetails } = useCompanyRegistration();
  const [rawAuthCapital, setRawAuthCapital] = useState<string>(String(draft.company.authorizedCapital || ''));
  const [rawPaidUpCapital, setRawPaidUpCapital] = useState<string>(String(draft.company.paidUpCapital || ''));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, val: string) => {
    let err: string | null = null;
    if (field === 'authorizedCapital') {
      err = validateCapitalNumeric(val, 'Authorised Capital');
    } else if (field === 'paidUpCapital') {
      err = validateCapitalNumeric(val, 'Paid-up Capital');
      if (!err && Number(val) > Number(rawAuthCapital)) {
        err = 'Paid-up Capital cannot exceed Authorised Capital.';
      }
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
      <AppHeader title="Capital & Share Structure" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CompanySectionCard
          iconName="cash-outline"
          title="Capital Structure"
          description="Define authorized and paid-up capital of the entity."
        >
          <FormInput
            label="Authorized Capital (₹)"
            value={rawAuthCapital}
            onChangeText={(v) => {
              setRawAuthCapital(v);
              const num = Number(v);
              if (!isNaN(num)) updateCompanyDetails({ authorizedCapital: num });
              validateField('authorizedCapital', v);
            }}
            onBlur={() => validateField('authorizedCapital', rawAuthCapital)}
            keyboardType="numeric"
            error={errors.authorizedCapital}
            required
          />
          <FormInput
            label="Paid-up Capital (₹)"
            value={rawPaidUpCapital}
            onChangeText={(v) => {
              setRawPaidUpCapital(v);
              const num = Number(v);
              if (!isNaN(num)) updateCompanyDetails({ paidUpCapital: num });
              validateField('paidUpCapital', v);
            }}
            onBlur={() => validateField('paidUpCapital', rawPaidUpCapital)}
            keyboardType="numeric"
            error={errors.paidUpCapital}
            required
          />
        </CompanySectionCard>
      </ScrollView>
    </View>
  );
};

export default CapitalDetailsScreen;
