import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { companyRegistrationService } from '../../services/companyRegistrationService';
import { CompanyTypeCard } from '../../components/CompanyTypeCard/CompanyTypeCard';
import { styles } from './RegistrationTypeScreen.styles';

export const RegistrationTypeScreen: React.FC = () => {
  const router = useRouter();
  const types = companyRegistrationService.getCompanyTypes();
  const [selected, setSelected] = useState<string>(types[0].type);

  return (
    <View style={styles.container}>
      <AppHeader title="Select Company Type" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        {types.map((t) => (
          <CompanyTypeCard
            key={t.type}
            item={t}
            selected={selected === t.type}
            onSelect={(item) => {
              setSelected(item.type);
              router.back();
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default RegistrationTypeScreen;
