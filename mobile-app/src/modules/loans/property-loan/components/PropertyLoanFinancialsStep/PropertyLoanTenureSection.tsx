import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { styles } from "./PropertyLoanFinancialsStep.styles";
import {
  TENURE_PRESETS,
  formatTenureEquivalent,
  isPresetTenure,
} from "../../utils/propertyLoanTenureUtils";

interface PropertyLoanTenureSectionProps {
  preferredTenureMonths?: string;
  onChange: (field: "preferredTenureMonths", value: string) => void;
  error?: string;
}

export const PropertyLoanTenureSection: React.FC<PropertyLoanTenureSectionProps> = ({
  preferredTenureMonths,
  onChange,
  error,
}) => {
  const [isCustomTenure, setIsCustomTenure] = useState<boolean>(() => {
    return Boolean(preferredTenureMonths && !isPresetTenure(preferredTenureMonths));
  });
  const [customTenureValue, setCustomTenureValue] = useState<string>(() => {
    return !isPresetTenure(preferredTenureMonths) ? preferredTenureMonths || "" : "";
  });
  const [customError, setCustomError] = useState("");

  const handleSelectPreset = (val: string) => {
    setIsCustomTenure(false);
    setCustomError("");
    onChange("preferredTenureMonths", val);
  };

  const validateAndPropagateCustom = (clean: string) => {
    if (!clean) {
      setCustomError("");
      onChange("preferredTenureMonths", "");
      return;
    }
    const num = parseInt(clean, 10);
    if (num < 1) {
      setCustomError("Tenure must be at least 1 month");
      onChange("preferredTenureMonths", clean);
    } else if (num > 240) {
      setCustomError("Maximum permitted tenure is 240 months (20 years)");
      onChange("preferredTenureMonths", clean);
    } else {
      setCustomError("");
      onChange("preferredTenureMonths", clean);
    }
  };

  const handleSelectCustom = () => {
    setIsCustomTenure(true);
    if (customTenureValue) {
      validateAndPropagateCustom(customTenureValue);
    } else {
      onChange("preferredTenureMonths", "");
    }
  };

  const handleCustomTenureChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    setCustomTenureValue(clean);
    validateAndPropagateCustom(clean);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="calendar" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
          </View>
          <Text style={styles.cardTitle}>
            Preferred Tenure <Text style={styles.requiredStar}>*</Text>
          </Text>
        </View>
      </View>

      <View style={styles.tenureGrid}>
        {TENURE_PRESETS.map((item) => {
          const isSelected = !isCustomTenure && preferredTenureMonths === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              activeOpacity={0.7}
              onPress={() => handleSelectPreset(item.value)}
              style={[styles.tenureBox, isSelected && styles.tenureBoxActive]}
            >
              <Text style={[styles.tenureText, isSelected && styles.tenureTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSelectCustom}
          style={[
            styles.tenureBox,
            styles.tenureBoxCustom,
            isCustomTenure && styles.tenureBoxCustomActive,
          ]}
        >
          <Text
            style={[
              styles.tenureText,
              styles.tenureTextCustom,
              isCustomTenure && styles.tenureTextCustomActive,
            ]}
          >
            + Custom
          </Text>
        </TouchableOpacity>
      </View>

      {isCustomTenure && (
        <View style={styles.customTenureSection}>
          <Text style={styles.customTenureTitle}>
            Enter Tenure (Months) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.customTenureInput,
              (Boolean(customError) || Boolean(error)) && styles.inputError,
            ]}
            placeholder="Enter months (e.g., 48)"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={customTenureValue}
            onChangeText={handleCustomTenureChange}
            maxLength={3}
          />
          {Boolean(customTenureValue) && !customError && (
            <Text style={styles.tenureEquivalentText}>
              {formatTenureEquivalent(customTenureValue)}
            </Text>
          )}
          {Boolean(customError) && <Text style={styles.errorText}>{customError}</Text>}
          {!customError && Boolean(error) && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      {!isCustomTenure && Boolean(error) && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
