import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { FormInput } from '../../../../shared/components/Input/FormInput';
import { useCompanyRegistration } from '../../hooks/useCompanyRegistration';
import { styles } from './BusinessDetailsScreen.styles';

export const BusinessDetailsScreen: React.FC = () => {
  const { draft, updateCompanyDetails } = useCompanyRegistration();

  return (
    <View style={styles.container}>
      <AppHeader title="Business Activity" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <FormInput
          label="Industry Category"
          value={draft.company.industryCategory || ''}
          onChangeText={(v) => updateCompanyDetails({ industryCategory: v })}
          placeholder="e.g. Information Technology"
        />
        <FormInput
          label="Business Activity Description"
          value={draft.company.businessActivityDescription || ''}
          onChangeText={(v) => updateCompanyDetails({ businessActivityDescription: v })}
          placeholder="Describe your primary business objectives"
        />
      </ScrollView>
    </View>
  );
};

export default BusinessDetailsScreen;
