import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { QuoteCard } from '../../components/QuoteCard/QuoteCard';
import { useInsuranceQuotes } from '../../hooks/useInsuranceQuotes';
import { Button } from '../../../../shared/components/Button/Button';
import { styles } from './InsuranceQuotesScreen.styles';

export const InsuranceQuotesScreen: React.FC = () => {
  const { baseAnnual, gstAmount, grandTotal } = useInsuranceQuotes();

  return (
    <View style={styles.container}>
      <AppHeader title="Your Quote" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <QuoteCard baseAmount={baseAnnual} taxAmount={gstAmount} totalAmount={grandTotal} />
        <Button title="Proceed to Proposal" onPress={() => {}} variant="primary" />
      </ScrollView>
    </View>
  );
};

export default InsuranceQuotesScreen;
