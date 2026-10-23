import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./Step3RegimeAndDeductions.styles";

interface AddDeductionModalProps {
  visible: boolean;
  title: string;
  amount: string;
  onChangeTitle: (val: string) => void;
  onChangeAmount: (val: string) => void;
  onAdd: () => void;
  onClose: () => void;
}

export const AddDeductionModal: React.FC<AddDeductionModalProps> = ({
  visible,
  title,
  amount,
  onChangeTitle,
  onChangeAmount,
  onAdd,
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeaderRow}>
          <Text style={styles.modalTitle}>Add Additional Deduction</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
            <Ionicons name="close" size={22} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Deduction Section</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 80G Charitable Donations"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={onChangeTitle}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Amount Claimed</Text>
          <View style={styles.inputBox}>
            <Text style={styles.currencyPrefix}>₹</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#94A3B8"
              value={amount}
              onChangeText={onChangeAmount}
            />
          </View>
        </View>

        <View style={styles.modalActionRow}>
          <TouchableOpacity activeOpacity={0.8} style={styles.actionBtnCancel} onPress={onClose}>
            <Text style={styles.actionBtnCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.actionBtnSave} onPress={onAdd}>
            <Text style={styles.actionBtnSaveText}>Add Deduction</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
