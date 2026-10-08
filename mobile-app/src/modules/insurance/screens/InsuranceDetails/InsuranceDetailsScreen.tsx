import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { useInsurance } from '../../hooks/useInsurance';
import { InsurancePlanCard } from '../../components/InsurancePlanCard/InsurancePlanCard';
import { styles } from './InsuranceDetailsScreen.styles';

export const InsuranceDetailsScreen: React.FC = () => {
  const { plans, setSelectedPlan } = useInsurance('HEALTH');

  return (
    <View style={styles.container}>
      <AppHeader title="Health Insurance Plans" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        {plans.map((p) => (
          <InsurancePlanCard key={p.id} plan={p} onSelect={setSelectedPlan} />
        ))}
      </ScrollView>
    </View>
  );
};

export default InsuranceDetailsScreen;
