import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanOwnershipFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanOwnershipStep.styles";

export interface PropertyExistingLoanCardProps {
  data: LoanOwnershipFormData;
  onChange: (field: keyof LoanOwnershipFormData, value: string | boolean) => void;
  errors?: Record<string, string>;
  onOpenLenderPicker: () => void;
  onOpenLoanTypePicker: () => void;
}

export const PropertyExistingLoanCard: React.FC<PropertyExistingLoanCardProps> = ({
  data,
  onChange,
  errors = {},
  onOpenLenderPicker,
  onOpenLoanTypePicker,
}) => {
  return (
    <>
      {/* 3. Existing Property Loan (If any) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="card" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Existing Property Loan (If any)</Text>
          </View>
        </View>

        {/* Current Lender */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Current Lender</Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.currentLender) && styles.dropdownSelectorActive,
            ]}
            onPress={onOpenLenderPicker}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.currentLender
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.currentLender || "Select lender..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.currentLender
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
          </TouchableOpacity>
        </View>

        {/* Existing Loan Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Existing Loan Type</Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.existingLoanType) && styles.dropdownSelectorActive,
              Boolean(errors.existingLoanType) && styles.inputError,
            ]}
            onPress={onOpenLoanTypePicker}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.existingLoanType
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.existingLoanType
                ? ["Home Loan", "Loan Against Property (LAP)", "Commercial Purchase Loan", "Top-up Loan"].includes(data.existingLoanType)
                  ? data.existingLoanType
                  : "Others"
                : "Select loan type..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.existingLoanType
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
          </TouchableOpacity>
          {Boolean(errors.existingLoanType && !["Others"].includes(data.existingLoanType)) && (
            <Text style={styles.errorText}>{errors.existingLoanType}</Text>
          )}

          {Boolean(
            data.existingLoanType === "Others" ||
            (data.existingLoanType &&
              !["Home Loan", "Loan Against Property (LAP)", "Commercial Purchase Loan", "Top-up Loan"].includes(data.existingLoanType))
          ) && (
            <View style={styles.customInputContainer}>
              <Text style={styles.customInputLabel}>
                Specify Existing Loan Type <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.customInput,
                  Boolean(errors.existingLoanType) && styles.inputError,
                ]}
                placeholder="e.g., Plot Loan, Personal Loan"
                placeholderTextColor="#94A3B8"
                value={data.existingLoanType === "Others" ? "" : data.existingLoanType}
                onChangeText={(text) => onChange("existingLoanType", text || "Others")}
              />
              {Boolean(errors.existingLoanType) && (
                <Text style={styles.errorText}>{errors.existingLoanType}</Text>
              )}
            </View>
          )}
        </View>

        {/* Outstanding Loan Amount */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Outstanding Loan Amount</Text>
          <View style={styles.inputWithIcon}>
            <View style={styles.iconBoxLeft}>
              <Text style={styles.currencySymbolText}>₹</Text>
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter outstanding amount"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={data.outstandingLoanAmount}
              onChangeText={(text) =>
                onChange("outstandingLoanAmount", text.replace(/\D/g, ""))
              }
            />
          </View>
        </View>
      </View>

      {/* 4. Ownership Confirmation */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="checkmark-circle" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Ownership Confirmation</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() =>
            onChange("isConfirmationChecked", !data.isConfirmationChecked)
          }
          activeOpacity={0.7}
        >
          <Ionicons
            name={
              data.isConfirmationChecked ? "checkbox" : "square-outline"
            }
            size={22}
            color={
              data.isConfirmationChecked
                ? BrandColors.PRIMARY_ORANGE
                : errors.isConfirmationChecked
                ? "#EF4444"
                : "#94A3B8"
            }
          />
          <Text style={styles.checkboxText}>
            I/We confirm that the property details provided above are correct
            and I/We have the legal right to offer this property as security for
            the loan.
          </Text>
        </TouchableOpacity>
        {errors.isConfirmationChecked ? (
          <Text style={styles.errorText}>{errors.isConfirmationChecked}</Text>
        ) : null}
      </View>
    </>
  );
};

export default PropertyExistingLoanCard;
