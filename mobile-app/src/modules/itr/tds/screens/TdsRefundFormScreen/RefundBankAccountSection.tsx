import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { BankAccountType, BankRefundDetails } from "../../types/customerIncome.types";
import { cleanAccountNumber } from "../../utils/tdsValidation";
import { CustomerFormErrors } from "../../validation/tdsCustomerSchema";
import { styles } from "./TdsRefundFormScreen.styles";
import { TdsFormInputRefs, UpdateBankField, SectionHeader } from "./TdsRefundFormSections.types";

interface RefundBankAccountSectionProps {
  bank: BankRefundDetails;
  errors: CustomerFormErrors;
  inputs: TdsFormInputRefs;
  isIfscLoading: boolean;
  ifscError: string | null;
  updateBank: UpdateBankField;
  onIfscChange: (val: string) => void;
}

export const RefundBankAccountSection: React.FC<RefundBankAccountSectionProps> = ({
  bank,
  errors,
  inputs: { accHolderRef, accNumRef, confirmAccNumRef, ifscRef, salaryRef },
  isIfscLoading,
  ifscError,
  updateBank,
  onIfscChange,
}) => (
  <View style={styles.sectionCard}>
    <SectionHeader number={2} title="Refund Bank Account" />

    {/* Account Holder Name */}
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>
        Account Holder Name <Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <TextInput
        ref={accHolderRef}
        style={[styles.textInput, errors["bank.accountHolderName"] ? styles.textInputError : null]}
        placeholder="Enter account holder name"
        placeholderTextColor="#94A3B8"
        value={bank.accountHolderName}
        onChangeText={(t) => updateBank("accountHolderName", t.replace(/[^A-Za-z\s]/g, ""))}
        maxLength={50}
        returnKeyType="next"
        onSubmitEditing={() => accNumRef.current?.focus()}
      />
      {errors["bank.accountHolderName"] && (
        <Text style={styles.errorText}>{errors["bank.accountHolderName"]}</Text>
      )}
    </View>

    {/* Bank Account Number (Full Width for clean fit) */}
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>
        Bank Account Number <Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <TextInput
        ref={accNumRef}
        style={[styles.textInput, errors["bank.accountNumber"] ? styles.textInputError : null]}
        placeholder="Enter account number"
        placeholderTextColor="#94A3B8"
        keyboardType="number-pad"
        value={bank.accountNumber}
        onChangeText={(t) => updateBank("accountNumber", cleanAccountNumber(t))}
        maxLength={18}
        returnKeyType="next"
        onSubmitEditing={() => confirmAccNumRef.current?.focus()}
      />
      {errors["bank.accountNumber"] && (
        <Text style={styles.errorText}>{errors["bank.accountNumber"]}</Text>
      )}
    </View>

    {/* Confirm Account Number (Full Width for clean fit) */}
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>
        Confirm Account Number <Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <TextInput
        ref={confirmAccNumRef}
        style={[styles.textInput, errors["bank.confirmAccountNumber"] ? styles.textInputError : null]}
        placeholder="Re-enter account number"
        placeholderTextColor="#94A3B8"
        keyboardType="number-pad"
        value={bank.confirmAccountNumber}
        onChangeText={(t) => updateBank("confirmAccountNumber", cleanAccountNumber(t))}
        maxLength={18}
        returnKeyType="next"
        onSubmitEditing={() => ifscRef.current?.focus()}
      />
      {errors["bank.confirmAccountNumber"] && (
        <Text style={styles.errorText}>{errors["bank.confirmAccountNumber"]}</Text>
      )}
    </View>

    {/* IFSC Code with Auto-Lookup */}
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>
        IFSC Code <Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <View style={styles.ifscRow}>
        <View style={styles.ifscInputWrap}>
          <TextInput
            ref={ifscRef}
            style={[
              styles.textInput,
              errors["bank.ifscCode"] || ifscError ? styles.textInputError : null,
            ]}
            placeholder="Enter IFSC"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            value={bank.ifscCode}
            onChangeText={onIfscChange}
          maxLength={11}
            returnKeyType="next"
            onSubmitEditing={() => salaryRef.current?.focus()}
          />
        </View>
        {isIfscLoading && <ActivityIndicator size="small" color={BrandColors.PRIMARY_ORANGE} />}
      </View>

      {/* IFSC Status */}
      {isIfscLoading && (
        <View style={styles.ifscLoadingBox}>
          <Text style={styles.ifscLoadingText}>Verifying IFSC with RBI directory...</Text>
        </View>
      )}

      {bank.isIfscVerified && bank.bankName && (
        <View style={styles.ifscSuccessBox}>
          <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
          <Text style={styles.ifscSuccessText} numberOfLines={1}>
            {bank.bankName} • {bank.branchName}
          </Text>
        </View>
      )}

      {(errors["bank.ifscCode"] || ifscError) && (
        <Text style={styles.errorText}>{errors["bank.ifscCode"] || ifscError}</Text>
      )}
    </View>

    {/* Bank Name & Branch (Read-Only after lookup) */}
    <View style={styles.fieldRow}>
      <View style={[styles.fieldGroup, styles.fieldRowItem]}>
        <Text style={styles.fieldLabel}>Bank Name</Text>
        <TextInput
          style={[styles.textInput, styles.textInputReadOnly]}
          editable={false}
          placeholder="Auto-fetched via IFSC"
          placeholderTextColor="#94A3B8"
          value={bank.bankName}
        />
      </View>

      <View style={[styles.fieldGroup, styles.fieldRowItem]}>
        <Text style={styles.fieldLabel}>Branch</Text>
        <TextInput
          style={[styles.textInput, styles.textInputReadOnly]}
          editable={false}
          placeholder="Auto-fetched via IFSC"
          placeholderTextColor="#94A3B8"
          value={bank.branchName}
        />
      </View>
    </View>

    {/* Account Type */}
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>Account Type</Text>
      <View style={styles.chipGroup}>
        {(["savings", "current"] as BankAccountType[]).map((type) => (
          <TouchableOpacity
            key={type}
            activeOpacity={0.8}
            onPress={() => updateBank("accountType", type)}
            style={[styles.chip, bank.accountType === type ? styles.chipActive : null]}
          >
            <Text style={[styles.chipText, bank.accountType === type ? styles.chipTextActive : null]}>
              {type === "savings" ? "Savings Account" : "Current Account"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </View>
);

