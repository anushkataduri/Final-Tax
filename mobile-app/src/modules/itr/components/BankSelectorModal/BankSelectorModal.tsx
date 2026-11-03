import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ItrSelectableBank } from "../../itr-filing/types/itrFiling.types";
import { ifscService, IfscDetails, IfscLookupError } from "@/shared/services/lookup/ifscService";
import { validators } from "@/shared/validation/validators";
import { BrandColors } from "@/shared/theme";
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

const IFSC_LOOKUP_DEBOUNCE_MS = 600;

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
  const [ifscLookupLoading, setIfscLookupLoading] = useState(false);
  const [ifscLookupError, setIfscLookupError] = useState<string | null>(null);
  const [ifscLookupResult, setIfscLookupResult] = useState<IfscDetails | null>(null);
  const lookupDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible && initialBank) {
      setBankName(initialBank.bankName || "");
      setAccountNumber(initialBank.accountNumber || "");
      setIfscCode(initialBank.ifscCode || "");
      setAccountType(initialBank.accountType || "Savings");
      setIfscLookupLoading(false);
      setIfscLookupError(null);
      // Treat already-validated banks as having a lookup result to keep bank name locked
      setIfscLookupResult(
        initialBank.validationStatus === "Validated"
          ? { bank: initialBank.bankName, branch: "", ifsc: initialBank.ifscCode }
          : null
      );
    } else if (visible && !initialBank) {
      resetFormState();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initialBank]);

  const resetFormState = () => {
    setBankName("");
    setAccountNumber("");
    setIfscCode("");
    setAccountType("Savings");
    setIfscLookupLoading(false);
    setIfscLookupError(null);
    setIfscLookupResult(null);
    if (lookupDebounceRef.current) {
      clearTimeout(lookupDebounceRef.current);
    }
  };

  const handleClose = () => {
    resetFormState();
    onClose();
  };

  const performIfscLookup = async (ifsc: string) => {
    setIfscLookupLoading(true);
    setIfscLookupError(null);
    try {
      const result = await ifscService.lookup(ifsc);
      setIfscLookupResult(result);
      setBankName(result.bank);
    } catch (err) {
      setIfscLookupResult(null);
      if (err instanceof IfscLookupError) {
        setIfscLookupError(
          err.errorType === "NOT_FOUND"
            ? "IFSC code not found. Please verify and re-enter."
            : "Unable to verify IFSC. Please check your connection and try again."
        );
      } else {
        setIfscLookupError("Unable to verify IFSC. Please try again.");
      }
    } finally {
      setIfscLookupLoading(false);
    }
  };

  const handleIfscChange = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setIfscCode(clean);
    setIfscLookupError(null);
    setIfscLookupResult(null);
    setBankName("");

    if (lookupDebounceRef.current) {
      clearTimeout(lookupDebounceRef.current);
    }

    if (ifscService.isValidFormat(clean)) {
      lookupDebounceRef.current = setTimeout(() => {
        void performIfscLookup(clean);
      }, IFSC_LOOKUP_DEBOUNCE_MS);
    }
  };

  const handleSaveBank = () => {
    const cleanBankName = bankName.trim();
    const cleanAccountNum = accountNumber.trim();
    const cleanIfsc = ifscCode.trim().toUpperCase();

    if (!cleanBankName || !cleanAccountNum || !cleanIfsc) {
      Alert.alert(
        "Required Fields",
        "Bank Name, Account Number, and IFSC Code are mandatory. Please fill in all fields."
      );
      return;
    }

    if (cleanBankName.length < 2 || !/^[a-zA-Z0-9\s&.-]{2,100}$/.test(cleanBankName)) {
      Alert.alert(
        "Invalid Bank Name",
        "Please enter a valid bank name (at least 2 characters long)."
      );
      return;
    }

    const accountError = validators.bankAccountNumber("Account Number")(cleanAccountNum);
    if (accountError) {
      Alert.alert("Invalid Account Number", accountError);
      return;
    }

    const ifscError = validators.ifsc("IFSC Code")(cleanIfsc);
    if (ifscError) {
      Alert.alert(
        "Invalid IFSC Code",
        "Please enter a valid 11-digit IFSC code (e.g. SBIN0001234 or HDFC0001234)."
      );
      return;
    }

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
    const validationStatus: "Validated" | "Pending" = ifscLookupResult ? "Validated" : "Pending";

    if (initialBank) {
      const updatedBank: ItrSelectableBank = {
        ...initialBank,
        bankName: cleanBankName,
        accountNumber: cleanAccountNum,
        maskedAccountNumber: masked,
        ifscCode: cleanIfsc,
        accountType,
        validationStatus,
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
        validationStatus,
      };
      onAddBank(newBank);
      onSelectBank(newBank.id);
    }

    resetFormState();
    onClose();
  };

  const isEditing = Boolean(initialBank);
  const isBankNameLocked = Boolean(ifscLookupResult);

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
            {/* IFSC Code — placed first so bank name auto-fills below it */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>IFSC Code</Text>
                <Text style={styles.mandatoryStar}>*</Text>
              </View>
              <View style={[styles.inputBox, ifscLookupError ? styles.inputBoxError : null]}>
                <View style={styles.ifscInputRow}>
                  <TextInput
                    style={[styles.textInput, styles.ifscTextInput]}
                    autoCapitalize="characters"
                    placeholder="e.g. SBIN0001234"
                    placeholderTextColor="#94A3B8"
                    value={ifscCode}
                    onChangeText={handleIfscChange}
                    maxLength={11}
                  />
                  {ifscLookupLoading && (
                    <ActivityIndicator size="small" color={BrandColors.PRIMARY_ORANGE} />
                  )}
                  {ifscLookupResult && !ifscLookupLoading && (
                    <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                  )}
                </View>
              </View>
              {ifscLookupError ? (
                <Text style={styles.errorText}>{ifscLookupError}</Text>
              ) : null}
              {ifscLookupResult && !ifscLookupLoading ? (
                <View style={styles.lookupResultBox}>
                  <Ionicons name="business-outline" size={13} color="#166534" />
                  <Text style={styles.lookupResultText}>
                    <Text style={styles.lookupResultBank}>{ifscLookupResult.bank}</Text>
                    {ifscLookupResult.branch ? ` — ${ifscLookupResult.branch}` : ""}
                    {ifscLookupResult.city ? `, ${ifscLookupResult.city}` : ""}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Bank Name — auto-filled from IFSC lookup and locked */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Bank Name</Text>
                <Text style={styles.mandatoryStar}>*</Text>
                {isBankNameLocked && (
                  <Ionicons name="lock-closed-outline" size={11} color="#64748B" style={styles.lockIcon} />
                )}
              </View>
              <View style={[styles.inputBox, isBankNameLocked && styles.inputBoxLocked]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Auto-filled from IFSC lookup"
                  placeholderTextColor="#94A3B8"
                  value={bankName}
                  onChangeText={(val) => {
                    if (!isBankNameLocked) {
                      setBankName(val.replace(/[^A-Za-z\s&.-]/g, ""));
                    }
                  }}
                  editable={!isBankNameLocked}
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

            {/* Account Type */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Account Type</Text>
              </View>
              <View style={styles.accountTypeRow}>
                {(["Savings", "Current"] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    activeOpacity={0.8}
                    style={[styles.accountTypePill, accountType === type && styles.accountTypePillActive]}
                    onPress={() => setAccountType(type)}
                  >
                    <Text
                      style={[
                        styles.accountTypePillText,
                        accountType === type && styles.accountTypePillTextActive,
                      ]}
                    >
                      {type === "Savings" ? "Savings Account" : "Current Account"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.saveBankBtn, ifscLookupLoading && styles.saveBankBtnDisabled]}
              onPress={handleSaveBank}
              disabled={ifscLookupLoading}
            >
              <Text style={styles.saveBankBtnText}>
                {ifscLookupLoading
                  ? "Verifying IFSC…"
                  : isEditing
                  ? "Update & Validate Account"
                  : "Save & Validate Account"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
