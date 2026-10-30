import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./RevisedFormField.styles";

interface RevisedFormFieldProps {
  label: string;
  value: string;
  onChangeText: (val: string) => void;
  originalValue?: string;
  changeValue?: string;
  isMandatory?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "number-pad" | "numeric";
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
}

export const RevisedFormField: React.FC<RevisedFormFieldProps> = ({
  label,
  value,
  onChangeText,
  originalValue,
  changeValue,
  isMandatory = false,
  placeholder,
  keyboardType = "default",
  maxLength,
  autoCapitalize = "none",
  error,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label} {isMandatory ? <Text style={styles.star}>*</Text> : null}
        </Text>
      </View>

      <View style={styles.stackedBody}>
        {originalValue ? (
          <View style={styles.stackedRow}>
            <Text style={styles.fieldSubLabel}>Original</Text>
            <Text style={styles.originalValueText}>{originalValue}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          {originalValue ? (
            <Text style={styles.inputSubLabel}>Revised</Text>
          ) : null}
          <TextInput
            style={[styles.input, error ? styles.errorInput : null]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            keyboardType={keyboardType}
            maxLength={maxLength}
            autoCapitalize={autoCapitalize}
          />
        </View>

        {changeValue ? (
          <View style={styles.changeRow}>
            <Text style={styles.fieldSubLabel}>Change</Text>
            <Text
              style={
                changeValue === "—" || changeValue === "₹0"
                  ? styles.neutralChangeText
                  : styles.changeValueText
              }
            >
              {changeValue}
            </Text>
          </View>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
