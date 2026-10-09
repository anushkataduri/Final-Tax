import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "@/shared/components/KeyboardAwareFormLayout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ItrSelectableBank } from "../../itr-filing/types/itrFiling.types";
import { styles } from "./BankSelectorModal.styles";

interface BankSelectorModalProps {
  visible: boolean;
  banks: ItrSelectableBank[];
  selectedBankId?: string;
  onSelectBank: (bankId: string) => void;
  onAddBank: (bank: ItrSelectableBank) => void;
  onClose: () => void;
}

export const BankSelectorModal: React.FC<BankSelectorModalProps> = ({
  visible,
  banks,
  selectedBankId,
  onSelectBank,
  onAddBank,
  onClose,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountType, setAccountType] = useState<"Savings" | "Current">("Savings");

  const handleSaveNewBank = () => {
    if (!bankName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
      Alert.alert("Required Fields", "Please provide the bank name, account number, and IFSC code.");
      return;
    }
    
    if (bankName.trim().length < 3 || !/^[A-Za-z\s]+$/.test(bankName)) {
      Alert.alert("Invalid Bank Name", "Bank name should only contain alphabets and be at least 3 characters long.");
      return;
    }
    
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
      Alert.alert("Invalid IFSC", "Please enter a valid 11-character IFSC code (e.g. SBIN0001234).");
      return;
    }

    const masked = `•••• •••• ${accountNumber.trim().slice(-4)}`;
    const newBank: ItrSelectableBank = {
      id: `bank-${Date.now()}`,
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      maskedAccountNumber: masked,
      ifscCode: ifscCode.trim().toUpperCase(),
      accountType,
      isPrimaryRefund: false,
      validationStatus: "Validated",
    };

    onAddBank(newBank);
    onSelectBank(newBank.id);
    setShowAddForm(false);
    setBankName("");
    setAccountNumber("");
    setIfscCode("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Ionicons name="card-outline" size={20} color="#083B75" />
              <Text style={styles.headerTitle}>Select Refund Bank Account</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Direct income tax refunds are credited by CPC Bengaluru to your pre-validated bank account.
          </Text>

          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            {/* List of Registered Accounts */}
            <View style={styles.bankList}>
              {banks.map((bank) => {
                const isSelected = bank.id === selectedBankId || bank.isPrimaryRefund;
                return (
                  <TouchableOpacity
                    key={bank.id}
                    activeOpacity={0.8}
                    style={[styles.bankCard, isSelected && styles.bankCardSelected]}
                    onPress={() => onSelectBank(bank.id)}
                  >
                    <View style={styles.bankInfoCol}>
                      <View style={styles.bankTitleRow}>
                        <Text style={styles.bankName}>{bank.bankName}</Text>
                        <View style={styles.validatedTag}>
                          <Ionicons name="checkmark-circle" size={11} color="#166534" />
                          <Text style={styles.validatedTagText}>{bank.validationStatus}</Text>
                        </View>
                      </View>
                      <Text style={styles.bankNumber}>{bank.maskedAccountNumber}</Text>
                      <Text style={styles.bankSub}>
                        IFSC: {bank.ifscCode} • {bank.accountType} Account
                      </Text>
                    </View>

                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Add Bank Form Toggle */}
            {!showAddForm ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.addBankBtn}
                onPress={() => setShowAddForm(true)}
              >
                <Ionicons name="add-circle-outline" size={18} color="#083B75" />
                <Text style={styles.addBankBtnText}>Add Another Bank Account</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.addFormContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bank Name</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. State Bank of India"
                      placeholderTextColor="#94A3B8"
                      value={bankName}
                      onChangeText={(val) => setBankName(val.replace(/[^A-Za-z\\s]/g, ""))} maxLength={50}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Account Number</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="number-pad"
                      placeholder="Enter account number"
                      placeholderTextColor="#94A3B8"
                      value={accountNumber}
                      onChangeText={(val) => setAccountNumber(val.replace(/[^0-9]/g, ""))} maxLength={18}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>IFSC Code</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.textInput}
                      autoCapitalize="characters"
                      placeholder="e.g. SBIN0001234"
                      placeholderTextColor="#94A3B8"
                      value={ifscCode}
                      onChangeText={setIfscCode} maxLength={11}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.saveBankBtn}
                  onPress={handleSaveNewBank}
                >
                  <Text style={styles.saveBankBtnText}>Save & Validate Account</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Confirm Selection Button */}
            <TouchableOpacity activeOpacity={0.85} style={styles.confirmBtn} onPress={onClose}>
              <Text style={styles.confirmBtnText}>Confirm Selected Account</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
};
