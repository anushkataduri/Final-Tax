import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./LoanTypeSelector.styles";

export interface LoanTypeSelectorProps {
  types: string[];
  selectedType: string;
  onSelect: (type: string) => void;
}

export const LoanTypeSelector: React.FC<LoanTypeSelectorProps> = ({
  types,
  selectedType,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {types.map((type) => {
        const isSelected = selectedType === type;
        return (
          <TouchableOpacity
            key={type}
            activeOpacity={0.8}
            onPress={() => onSelect(type)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default LoanTypeSelector;
