import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { CompanyDetailsForm } from '../../components/CompanyDetailsForm/CompanyDetailsForm';
import { useCompanyRegistration } from '../../hooks/useCompanyRegistration';
import { styles } from './CompanyDetailsScreen.styles';

export const CompanyDetailsScreen: React.FC = () => {
  const { draft, updateCompanyDetails } = useCompanyRegistration();

  return (
    <View style={styles.container}>
      <AppHeader title="Company Details" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CompanyDetailsForm
          values={draft.company}
          onChange={updateCompanyDetails}
        />
      </ScrollView>
    </View>
  );
};

export default CompanyDetailsScreen;
