import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ItrSelectableBank } from "../../itr-filing/types/itrFiling.types";
import { styles } from "./BankSelectorModal.styles";

interface BankSelectorModalProps {
  visible: boolean;
  banks: ItrSelectableBank[];
  selectedBankId?: string;
  initialBank?: ItrSelectableBank | null;
  onSelectBank: (bankId: string) => void;
  onAddBank: (bank: ItrSelectableBank) => void;
  onUpdateBank?: (bank: ItrSelectableBank) => void;
  onClose: () => void;
}

export const BankSelectorModal: React.FC<BankSelectorModalProps> = ({
  visible,
  banks,
  initialBank,
  onSelectBank,
  onAddBank,
  onUpdateBank,
  onClose,
}) => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountType, setAccountType] = useState<"Savings" | "Current">("Savings");

  useEffect(() => {
    if (visible && initialBank) {
      setBankName(initialBank.bankName || "");
      setAccountNumber(initialBank.accountNumber || "");
      setIfscCode(initialBank.ifscCode || "");
      setAccountType(initialBank.accountType || "Savings");
    } else if (visible && !initialBank) {
      setBankName("");
      setAccountNumber("");
      setIfscCode("");
      setAccountType("Savings");
    }
  }, [visible, initialBank]);

  const resetForm = () => {
    setBankName("");
    setAccountNumber("");
    setIfscCode("");
    setAccountType("Savings");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSaveBank = () => {
    const cleanBankName = bankName.trim();
    const cleanAccountNum = accountNumber.trim();
    const cleanIfsc = ifscCode.trim().toUpperCase();

    // 1. Mandatory Fields Check
    if (!cleanBankName || !cleanAccountNum || !cleanIfsc) {
      Alert.alert(
        "Required Fields",
        "Bank Name, Account Number, and IFSC Code are mandatory. Please fill in all fields."
      );
      return;
    }

    // 2. GST-Aligned Bank Name Validation (Min 2 characters, letters, spaces, &.-)
    if (cleanBankName.length < 2 || !/^[a-zA-Z0-9\s&.-]{2,100}$/.test(cleanBankName)) {
      Alert.alert(
        "Invalid Bank Name",
        "Please enter a valid bank name (at least 2 characters long)."
      );
      return;
    }

    // 3. GST-Aligned Account Number Validation (9 to 18 digits, digits only, not all zeros)
    if (/[^0-9]/.test(cleanAccountNum)) {
      Alert.alert(
        "Invalid Account Number",
        "Account number must contain digits only."
      );
      return;
    }

    if (/^0+$/.test(cleanAccountNum)) {
      Alert.alert(
        "Invalid Account Number",
        "Account number cannot contain only zeros."
      );
      return;
    }

    if (cleanAccountNum.length < 9 || cleanAccountNum.length > 18) {
      Alert.alert(
        "Invalid Account Number",
        "Please enter a valid bank account number between 9 and 18 digits."
      );
      return;
    }

    // 4. GST-Aligned IFSC Code Validation (11 characters: 4 letters, '0', 6 alphanumeric)
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      Alert.alert(
        "Invalid IFSC Code",
        "Please enter a valid 11-digit IFSC code (e.g. SBIN0001234 or HDFC0001234)."
      );
      return;
    }

    // 5. Duplicate Prevention (Exclude self if in Edit mode)
    const isDuplicate = banks.some(
      (b) =>
        b.id !== initialBank?.id &&
        b.accountNumber.trim() === cleanAccountNum &&
        b.ifscCode.trim().toUpperCase() === cleanIfsc
    );

    if (isDuplicate) {
      Alert.alert(
        "Duplicate Bank Account",
        "This bank account has already been added. Duplicate bank accounts are not permitted."
      );
      return;
    }

    const masked = `•••• •••• ${cleanAccountNum.slice(-4)}`;

    if (initialBank) {
      const updatedBank: ItrSelectableBank = {
        ...initialBank,
        bankName: cleanBankName,
        accountNumber: cleanAccountNum,
        maskedAccountNumber: masked,
        ifscCode: cleanIfsc,
        accountType,
      };
      if (onUpdateBank) {
        onUpdateBank(updatedBank);
      } else {
        onAddBank(updatedBank);
      }
      onSelectBank(updatedBank.id);
    } else {
      const newBank: ItrSelectableBank = {
        id: `bank-${Date.now()}`,
        bankName: cleanBankName,
        accountNumber: cleanAccountNum,
        maskedAccountNumber: masked,
        ifscCode: cleanIfsc,
        accountType,
        isPrimaryRefund: true,
        validationStatus: "Validated",
      };
      onAddBank(newBank);
      onSelectBank(newBank.id);
    }

    resetForm();
    onClose();
  };

  const isEditing = Boolean(initialBank);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Ionicons name={isEditing ? "create-outline" : "card-outline"} size={20} color="#083B75" />
              <Text style={styles.headerTitle}>{isEditing ? "Edit Bank Account" : "Add Bank Account"}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {isEditing
              ? "Update your bank account details for receiving direct tax refunds."
              : "Enter bank details for receiving your direct income tax refund from CPC Bengaluru."}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
            {/* Bank Name */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Bank Name</Text>
                <Text style={styles.mandatoryStar}>*</Text>
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. State Bank of India"
                  placeholderTextColor="#94A3B8"
                  value={bankName}
                  onChangeText={(val) => setBankName(val.replace(/[^A-Za-z\s&.-]/g, ""))}
                  maxLength={60}
                />
              </View>
            </View>

            {/* Account Number */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Account Number</Text>
                <Text style={styles.mandatoryStar}>*</Text>
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  keyboardType="number-pad"
                  placeholder="Enter 9 to 18 digit account number"
                  placeholderTextColor="#94A3B8"
                  value={accountNumber}
                  onChangeText={(val) => setAccountNumber(val.replace(/[^0-9]/g, ""))}
                  maxLength={18}
                />
              </View>
            </View>

            {/* IFSC Code */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>IFSC Code</Text>
                <Text style={styles.mandatoryStar}>*</Text>
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  autoCapitalize="characters"
                  placeholder="e.g. SBIN0001234"
                  placeholderTextColor="#94A3B8"
                  value={ifscCode}
                  onChangeText={(val) => setIfscCode(val.toUpperCase())}
                  maxLength={11}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.saveBankBtn}
              onPress={handleSaveBank}
            >
              <Text style={styles.saveBankBtnText}>
                {isEditing ? "Update & Validate Account" : "Save & Validate Account"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
