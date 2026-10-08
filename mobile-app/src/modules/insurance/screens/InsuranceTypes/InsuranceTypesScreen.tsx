import React from 'react';
import { View } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { InsuranceHomeScreen } from '../InsuranceHome/InsuranceHomeScreen';
import { styles } from './InsuranceTypesScreen.styles';

export const InsuranceTypesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppHeader title="All Insurance Types" showBack />
      <InsuranceHomeScreen />
    </View>
  );
};

export default InsuranceTypesScreen;
