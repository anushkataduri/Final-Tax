import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { Button } from '../../../../shared/components/Button/Button';
import { useInsuranceQuotes } from '../../hooks/useInsuranceQuotes';
import { formatCurrencyINR } from '../../../../shared/formatters/currencyFormatter';
import { useTheme } from '../../../../hooks/use-theme';
import { styles, getThemedStyles } from './PaymentScreen.styles';

export const PaymentScreen: React.FC = () => {
  const colors = useTheme();
  const { grandTotal } = useInsuranceQuotes();
  const themed = getThemedStyles(colors);

  return (
    <View style={[styles.container, themed.container]}>
      <AppHeader title="Pay Insurance Premium" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, themed.card]}>
          <Text style={[styles.title, themed.title]}>Total Payable</Text>
          <Text style={[styles.amount, themed.amount]}>{formatCurrencyINR(grandTotal)}</Text>
          <Text style={[styles.note, themed.note]}>Instant Policy issuance on successful payment verification.</Text>
        </View>
        <Button title="Proceed to Checkout" onPress={() => {}} variant="primary" />
      </ScrollView>
    </View>
  );
};

export default PaymentScreen;
