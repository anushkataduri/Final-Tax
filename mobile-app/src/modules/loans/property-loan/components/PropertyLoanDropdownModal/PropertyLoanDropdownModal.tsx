import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { styles } from "./PropertyLoanDropdownModal.styles";

export interface DropdownItemOption {
  label: string;
  value: string;
}

export interface PropertyLoanDropdownModalProps {
  visible: boolean;
  title: string;
  options: (string | DropdownItemOption)[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export const PropertyLoanDropdownModal: React.FC<PropertyLoanDropdownModalProps> = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option) => {
              const optionValue = typeof option === "string" ? option : option.value;
              const optionLabel = typeof option === "string" ? option : option.label;
              const isSelected = selectedValue === optionValue;

              return (
                <TouchableOpacity
                  key={optionValue}
                  style={[
                    styles.optionItem,
                    isSelected && styles.optionItemActive,
                  ]}
                  onPress={() => {
                    onSelect(optionValue);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextActive,
                    ]}
                  >
                    {optionLabel}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={BrandColors.PRIMARY_ORANGE}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default PropertyLoanDropdownModal;
