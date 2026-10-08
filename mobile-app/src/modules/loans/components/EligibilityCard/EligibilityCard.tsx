import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../design-system/colors";
import { formatCurrencyINR } from "../../../../shared/formatters/currencyFormatter";
import { styles } from "./EligibilityCard.styles";

export interface EligibilityCardProps {
  maxAmount: number;
  interestRate: number;
  tenureMonths: number;
}

export const EligibilityCard: React.FC<EligibilityCardProps> = ({
  maxAmount,
  interestRate,
  tenureMonths,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Ionicons name="sparkles" size={20} color={BrandColors.PRIMARY_ORANGE} />
        <Text style={styles.badgeText}>Pre-Qualified Offer</Text>
      </View>

      <Text style={styles.amountText}>{formatCurrencyINR(maxAmount)}</Text>
      <Text style={styles.subText}>Maximum eligible loan amount</Text>

      <View style={styles.footerRow}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Interest Rate</Text>
          <Text style={styles.infoValue}>{interestRate}% p.a.</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Max Tenure</Text>
          <Text style={styles.infoValue}>{tenureMonths} Months</Text>
        </View>
      </View>
    </View>
  );
};

export default EligibilityCard;
