import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { Button } from '../../../../shared/components/Button/Button';
import { useInsuranceStore } from '../../store/insuranceSlice';
import { useTheme } from '../../../../hooks/use-theme';
import { styles, getThemedStyles } from './ReviewApplicationScreen.styles';

export const ReviewApplicationScreen: React.FC = () => {
  const colors = useTheme();
  const plan = useInsuranceStore((s) => s.selectedPlan);
  const themed = getThemedStyles(colors);

  return (
    <View style={[styles.container, themed.container]}>
      <AppHeader title="Review Proposal" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, themed.card]}>
          <Text style={[styles.cardTitle, themed.cardTitle]}>Selected Insurance Plan</Text>
          <Text style={[styles.cardValue, themed.cardValue]}>{plan?.provider} - {plan?.planName}</Text>
          <Text style={[styles.cardValue, themed.cardValue]}>Coverage: ₹{plan?.coverAmount?.toLocaleString()}</Text>
        </View>
        <Button title="Pay Premium" onPress={() => {}} variant="primary" />
      </ScrollView>
    </View>
  );
};

export default ReviewApplicationScreen;
