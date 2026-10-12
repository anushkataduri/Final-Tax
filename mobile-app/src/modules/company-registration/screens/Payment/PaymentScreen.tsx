import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { Button } from '../../../../shared/components/Button/Button';
import { formatCurrencyINR } from '../../../../shared/formatters/currencyFormatter';
import { CompanySectionCard } from '../../components/CompanySectionCard/CompanySectionCard';
import { useCompanyRegistration } from '../../hooks/useCompanyRegistration';
import { useTheme } from '../../../../hooks/use-theme';
import { styles, getThemedStyles } from './PaymentScreen.styles';

export const PaymentScreen: React.FC = () => {
  const colors = useTheme();
  const { draft } = useCompanyRegistration();
  const themed = getThemedStyles(colors);

  return (
    <View style={[styles.container, themed.container]}>
      <AppHeader title="Incorporation Fee Payment" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CompanySectionCard
          iconName="card-outline"
          title="Order Summary"
          subtitle="Includes MCA filing fees, Name Approval, DIN & DSC"
        >
          <Text style={[styles.amount, themed.amount]}>{formatCurrencyINR(draft.totalFee || 4999)}</Text>
        </CompanySectionCard>
        <Button title="Proceed to Pay" onPress={() => {}} variant="primary" />
      </ScrollView>
    </View>
  );
};

export default PaymentScreen;
