import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { PolicyCard } from '../../components/PolicyCard/PolicyCard';
import { styles } from './PolicyDetailsScreen.styles';

export const PolicyDetailsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppHeader title="Active Policy Details" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <PolicyCard
          policyNumber="HDFC-HEALTH-984210"
          planName="Optima Secure"
          provider="HDFC ERGO"
          status="ACTIVE"
          validUntil="31 Mar 2027"
        />
      </ScrollView>
    </View>
  );
};

export default PolicyDetailsScreen;
