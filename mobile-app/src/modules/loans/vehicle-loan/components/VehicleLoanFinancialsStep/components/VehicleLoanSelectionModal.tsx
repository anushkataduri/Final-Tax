import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../../shared/theme";
import { styles } from "../VehicleLoanFinancialsStep.styles";

export interface VehicleLoanSelectionModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const VehicleLoanSelectionModal: React.FC<VehicleLoanSelectionModalProps> = ({
  visible,
  title,
  onClose,
  children,
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
        <View style={styles.modalHeaderRow}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-circle" size={24} color="#94A3B8" />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </View>
    </TouchableOpacity>
  </Modal>
);

export interface OptionRowProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const OptionRow: React.FC<OptionRowProps> = ({ label, isSelected, onSelect }) => (
  <TouchableOpacity
    style={[styles.optionItem, isSelected && styles.optionItemActive]}
    onPress={onSelect}
  >
    <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>{label}</Text>
    {isSelected && <Ionicons name="checkmark" size={18} color={BrandColors.PRIMARY_ORANGE || "#EA580C"} />}
  </TouchableOpacity>
);
