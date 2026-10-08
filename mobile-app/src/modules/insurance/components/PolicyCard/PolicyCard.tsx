import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../hooks/use-theme';
import { styles, getThemedStyles } from './PolicyCard.styles';

interface PolicyCardProps {
  policyNumber: string;
  planName: string;
  provider: string;
  status: string;
  validUntil: string;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({
  policyNumber,
  planName,
  provider,
  status,
  validUntil,
}) => {
  const colors = useTheme();
  const themed = getThemedStyles(colors);

  return (
    <View style={[styles.card, themed.card]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.provider, themed.provider]}>{provider}</Text>
          <Text style={[styles.plan, themed.plan]}>{planName}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text style={[styles.policyNum, themed.policyNum]}>Policy #{policyNumber}</Text>
        <Text style={[styles.validity, themed.validity]}>Valid until {validUntil}</Text>
      </View>
    </View>
  );
};

export default PolicyCard;
