import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../../hooks/use-theme';
import { ServiceHeader } from '../../../../shared/components/ServiceHeader';
import { companyRegistrationService } from '../../services/companyRegistrationService';
import { CompanyTypeCard } from '../../components/CompanyTypeCard/CompanyTypeCard';
import { CompanySectionCard } from '../../components/CompanySectionCard/CompanySectionCard';
import { styles, getThemedStyles } from './CompanyRegistrationHomeScreen.styles';

export const CompanyRegistrationHomeScreen: React.FC = () => {
  const colors = useTheme();
  const router = useRouter();
  const companyTypes = companyRegistrationService.getCompanyTypes();
  const themed = getThemedStyles(colors);

  return (
    <ScrollView style={[styles.container, themed.container]} showsVerticalScrollIndicator={false}>
      <ServiceHeader
        title="Company Registration"
        subtitle="Incorporate your business in India with full MCA, GST & PAN compliance."
        tag="Corporate Services"
        iconName="business"
      />
      <View style={styles.section}>
        <CompanySectionCard
          iconName="business-outline"
          title="Choose Entity Type"
          subtitle="Select legal structure to begin registration"
        >
          {companyTypes.map((item) => (
            <CompanyTypeCard
              key={item.type}
              item={item}
              selected={false}
              onSelect={() => router.push('/(main)/applications')}
            />
          ))}
        </CompanySectionCard>
      </View>
    </ScrollView>
  );
};

export default CompanyRegistrationHomeScreen;
