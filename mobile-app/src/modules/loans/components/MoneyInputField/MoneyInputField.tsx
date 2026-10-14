import React from "react";
import { Text, TextInput, View } from "react-native";
import { groupIndianDigits } from "@/shared/formatters/currencyFormatter";
import { toWholeRupees } from "../../utils/moneyInput";
import { styles } from "./MoneyInputField.styles";

interface MoneyInputFieldProps {
  label: string;
  /** Raw whole-rupee digits, e.g. "100000". */
  value: string;
  onChange: (rawDigits: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

/** A rupee amount input: shows Indian grouping, stores whole-rupee digits only. */
export const MoneyInputField: React.FC<MoneyInputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
}) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>
      {label} {required ? <Text style={styles.requiredStar}>*</Text> : null}
    </Text>
    <View style={[styles.row, error ? styles.rowError : null]}>
      <Text style={styles.prefix}>₹</Text>
      <TextInput
        style={styles.input}
        value={value ? groupIndianDigits(value) : ""}
        onChangeText={(text) => onChange(toWholeRupees(text))}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType="number-pad"
        maxLength={12}
        accessibilityLabel={label}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default MoneyInputField;
