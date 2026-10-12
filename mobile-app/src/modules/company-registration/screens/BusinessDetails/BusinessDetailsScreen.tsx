import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { FormInput } from '../../../../shared/components/Input/FormInput';
import { CompanySectionCard } from '../../components/CompanySectionCard/CompanySectionCard';
import { useCompanyRegistration } from '../../hooks/useCompanyRegistration';
import {
  validateBusinessActivity,
  validateIndustryCategory,
} from '../../validation/companySchema';
import { styles } from './BusinessDetailsScreen.styles';

export const BusinessDetailsScreen: React.FC = () => {
  const { draft, updateCompanyDetails } = useCompanyRegistration();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value?: string) => {
    let err: string | null = null;
    if (field === 'industryCategory') err = validateIndustryCategory(value, true);
    else if (field === 'businessActivityDescription') err = validateBusinessActivity(value, true);

    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Business Activity" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CompanySectionCard
          iconName="briefcase-outline"
          title="Business Activity"
          description="Define the industry classification and objectives of your company."
        >
          <FormInput
            label="Industry Category"
            value={draft.company.industryCategory || ''}
            onChangeText={(v) => {
              updateCompanyDetails({ industryCategory: v });
              validateField('industryCategory', v);
            }}
            onBlur={() => validateField('industryCategory', draft.company.industryCategory)}
            placeholder="e.g. Information Technology"
            error={errors.industryCategory}
            required
          />
          <FormInput
            label="Business Activity Description"
            value={draft.company.businessActivityDescription || ''}
            onChangeText={(v) => {
              updateCompanyDetails({ businessActivityDescription: v });
              validateField('businessActivityDescription', v);
            }}
            onBlur={() => validateField('businessActivityDescription', draft.company.businessActivityDescription)}
            placeholder="Describe your primary business objectives"
            error={errors.businessActivityDescription}
            required
          />
        </CompanySectionCard>
      </ScrollView>
    </View>
  );
};

export default BusinessDetailsScreen;
