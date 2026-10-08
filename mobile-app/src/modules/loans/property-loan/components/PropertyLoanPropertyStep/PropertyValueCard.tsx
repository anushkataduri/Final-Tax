import React from "react";
import { View, Text, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanPropertyFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanPropertyStep.styles";

export interface PropertyValueCardProps {
  data: LoanPropertyFormData;
  onChange: (field: keyof LoanPropertyFormData, value: string) => void;
  errors?: Record<string, string>;
}

export const PropertyValueCard: React.FC<PropertyValueCardProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="cash" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
          </View>
          <Text style={styles.cardTitle}>Property Value</Text>
        </View>
      </View>

      {/* Estimated Market Value */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Estimated Market Value <Text style={styles.requiredStar}>*</Text>
        </Text>
        <View
          style={[
            styles.inputWithIcon,
            Boolean(errors.estimatedMarketValue) && styles.inputError,
          ]}
        >
          <View style={styles.iconBoxLeft}>
            <Text style={styles.currencySymbolText}>₹</Text>
          </View>
          <TextInput
            style={styles.inputFlex}
            placeholder="Enter estimated market value"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={data.estimatedMarketValue}
            onChangeText={(text) =>
              onChange("estimatedMarketValue", text.replace(/\D/g, ""))
            }
          />
        </View>
        {Boolean(errors.estimatedMarketValue) && (
          <Text style={styles.errorText}>{errors.estimatedMarketValue}</Text>
        )}
        <View style={styles.helperTextRow}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#64748B"
          />
          <Text style={styles.helperText}>
            The lender confirms this through a technical valuation visit.
          </Text>
        </View>
      </View>
    </View>
  );
};
