import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../hooks/use-theme';
import { formatCurrency } from '../../../../shared/formatters/currencyFormatter';
import { styles, getThemedStyles } from './QuoteCard.styles';

interface QuoteCardProps {
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ baseAmount, taxAmount, totalAmount }) => {
  const colors = useTheme();
  const themed = getThemedStyles(colors);

  return (
    <View style={[styles.card, themed.card]}>
      <Text style={[styles.heading, themed.heading]}>Premium Summary</Text>
      <View style={styles.row}>
        <Text style={[styles.label, themed.label]}>Base Premium</Text>
        <Text style={[styles.value, themed.value]}>{formatCurrency(baseAmount)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, themed.label]}>GST (18%)</Text>
        <Text style={[styles.value, themed.value]}>{formatCurrency(taxAmount)}</Text>
      </View>
      <View style={[styles.divider, themed.divider]} />
      <View style={styles.row}>
        <Text style={[styles.totalLabel, themed.totalLabel]}>Total Payable</Text>
        <Text style={[styles.totalValue, themed.totalValue]}>{formatCurrency(totalAmount)}</Text>
      </View>
    </View>
  );
};

export default QuoteCard;
