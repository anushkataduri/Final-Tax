import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../../hooks/use-theme';
import type { InsurancePlan } from '../../types/insurance.types';
import { formatCurrency } from '../../../../shared/formatters/currencyFormatter';
import { styles, getThemedStyles } from './InsurancePlanCard.styles';

interface InsurancePlanCardProps {
  plan: InsurancePlan;
  onSelect: (plan: InsurancePlan) => void;
}

export const InsurancePlanCard: React.FC<InsurancePlanCardProps> = ({ plan, onSelect }) => {
  const colors = useTheme();
  const themed = getThemedStyles(colors);

  return (
    <View style={[styles.card, themed.card]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.provider, themed.provider]}>{plan.provider}</Text>
          <Text style={[styles.planName, themed.planName]}>{plan.planName}</Text>
        </View>
        <View style={styles.coverBadge}>
          <Text style={styles.coverText}>Cover {formatCurrency(plan.coverAmount)}</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={[styles.metricLabel, themed.metricLabel]}>CSR</Text>
          <Text style={[styles.metricValue, themed.metricValue]}>{plan.claimSettlementRatio}%</Text>
        </View>
        {plan.cashlessHospitalsCount && (
          <View style={styles.metric}>
            <Text style={[styles.metricLabel, themed.metricLabel]}>Hospitals</Text>
            <Text style={[styles.metricValue, themed.metricValue]}>{plan.cashlessHospitalsCount.toLocaleString()}+</Text>
          </View>
        )}
      </View>

      <View style={styles.featuresList}>
        {plan.features.slice(0, 2).map((f, i) => (
          <View key={i} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={[styles.featureText, themed.featureText]}>{f}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <View>
          <Text style={[styles.premiumLabel, themed.premiumLabel]}>Starts from</Text>
          <Text style={[styles.premiumValue, themed.premiumValue]}>{formatCurrency(plan.monthlyPremium)}/mo</Text>
        </View>
        <TouchableOpacity style={[styles.button, themed.button]} onPress={() => onSelect(plan)}>
          <Text style={styles.buttonText}>View Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InsurancePlanCard;
