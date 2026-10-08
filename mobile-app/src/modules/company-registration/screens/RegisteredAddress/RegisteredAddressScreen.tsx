import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { FormInput } from '../../../../shared/components/Input/FormInput';
import { useCompanyRegistration } from '../../hooks/useCompanyRegistration';
import { styles } from './RegisteredAddressScreen.styles';

export const RegisteredAddressScreen: React.FC = () => {
  const { draft, updateCompanyDetails } = useCompanyRegistration();

  return (
    <View style={styles.container}>
      <AppHeader title="Registered Office Address" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <FormInput
          label="Address Line"
          value={draft.company.registeredAddressLine}
          onChangeText={(v) => updateCompanyDetails({ registeredAddressLine: v })}
          placeholder="Building, Street, Landmark"
        />
        <FormInput
          label="City"
          value={draft.company.registeredCity}
          onChangeText={(v) => updateCompanyDetails({ registeredCity: v })}
          placeholder="City"
        />
        <FormInput
          label="State"
          value={draft.company.registeredState}
          onChangeText={(v) => updateCompanyDetails({ registeredState: v })}
          placeholder="State"
        />
        <FormInput
          label="Pincode"
          value={draft.company.registeredPincode}
          onChangeText={(v) => updateCompanyDetails({ registeredPincode: v })}
          placeholder="6-digit Pincode"
          keyboardType="numeric"
          maxLength={6}
        />
      </ScrollView>
    </View>
  );
};

export default RegisteredAddressScreen;
