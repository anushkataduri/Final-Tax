import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { formatIndianNumberInput, toRawNumericString } from "../../utils/loanFormatting";
import { styles, amountInputColors } from "./LoanAmountInput.styles";

export interface LoanAmountPreset {
  /** Chip text, e.g. "₹10 Lakhs". */
  label: string;
  /** Raw whole-rupee digits, e.g. "1000000". */
  value: string;
}

export interface LoanAmountInputProps {
  /** Raw whole-rupee digits ("" when empty). This is the value stored in form state and sent to the API. */
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  presets?: readonly LoanAmountPreset[];
  /** Extra focus handling, e.g. scrolling the field into view. */
  onFocus?: () => void;
}

/**
 * Rupee amount field with optional quick-pick chips.
 *
 * While focused the field shows the raw digits being typed, so the cursor never
 * jumps; once blurred it shows Indian digit grouping ("42,58,088"). `onChange`
 * always reports raw digits ("4258088"). A chip is highlighted when its value
 * equals the current value, so no selection state is kept here.
 */
export const LoanAmountInput: React.FC<LoanAmountInputProps> = ({
  value,
  onChange,
  label,
  required = false,
  placeholder = "Enter amount",
  error,
  presets = [],
  onFocus,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleChangeText = (text: string) => onChange(toRawNumericString(text, 0));
  const displayValue = isFocused ? value : formatIndianNumberInput(value, 0);

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.requiredStar}> *</Text> : null}
        </Text>
      ) : null}

      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <Text style={styles.currencySymbol}>₹</Text>
        <TextInput
          style={styles.input}
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={amountInputColors.placeholder}
          keyboardType="number-pad"
          returnKeyType="done"
          accessibilityLabel={label}
        />
      </View>

      {presets.length > 0 ? (
        <View style={styles.chipRow}>
          {presets.map((preset) => {
            const isSelected = value === preset.value;
            return (
              <TouchableOpacity
                key={preset.value}
                activeOpacity={0.7}
                onPress={() => onChange(preset.value)}
                style={[styles.chip, isSelected && styles.chipActive]}
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{preset.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default LoanAmountInput;
