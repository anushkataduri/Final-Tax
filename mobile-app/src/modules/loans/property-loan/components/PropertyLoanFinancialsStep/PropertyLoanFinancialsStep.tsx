import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanDetailsFormData } from "../../../types/loans.types";
import { PropertyLoanDropdownModal } from "../PropertyLoanDropdownModal";
import { styles } from "./PropertyLoanFinancialsStep.styles";
import { PropertyLoanTenureSection } from "./PropertyLoanTenureSection";
import { PURPOSES, APPLICANT_TYPES } from "../../utils/propertyLoanTenureUtils";

export interface PropertyLoanFinancialsStepProps {
  data: LoanDetailsFormData;
  onChange: (field: keyof LoanDetailsFormData, value: string | number | boolean | null) => void;
  errors?: Record<string, string>;
}

export const PropertyLoanFinancialsStep: React.FC<PropertyLoanFinancialsStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [activeModal, setActiveModal] = useState<"purpose" | "applicantType" | null>(null);

  const isOthersPurposeSelected =
    data.purpose === "Others" ||
    (Boolean(data.purpose) &&
      !PURPOSES.filter((p) => p !== "Others").includes(data.purpose));

  const handleSelectPurpose = (val: string) => {
    setActiveModal(null);
    if (val === "Others") {
      onChange("purpose", "Others");
      onChange("customPurpose", "");
    } else {
      onChange("purpose", val);
      onChange("customPurpose", "");
    }
  };

  const handleCustomPurposeChange = (text: string) => {
    onChange("customPurpose", text);
    onChange("purpose", text || "Others");
  };

  return (
    <View style={styles.container}>
      {/* 1. Loan Requirement Section Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="home" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Loan Requirement</Text>
          </View>
        </View>

        {/* Loan Type Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Loan Type <Text style={styles.requiredStar}>*</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveModal("purpose")}
            style={[
              styles.dropdownSelector,
              Boolean(data.purpose) && styles.dropdownSelectorActive,
              Boolean(errors.purpose) && styles.inputError,
            ]}
          >
            <Text style={data.purpose ? styles.dropdownText : styles.dropdownPlaceholder}>
              {isOthersPurposeSelected
                ? "Others"
                : data.purpose || "Select Loan Type..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={data.purpose ? BrandColors.PRIMARY_ORANGE : "#64748B"}
            />
          </TouchableOpacity>
          {Boolean(errors.purpose && !isOthersPurposeSelected) && (
            <Text style={styles.errorText}>{errors.purpose}</Text>
          )}

          {isOthersPurposeSelected && (
            <View style={styles.customInputContainer}>
              <Text style={styles.customInputLabel}>
                Specify Loan Type <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.customInput,
                  Boolean(errors.customPurpose || errors.purpose) && styles.inputError,
                ]}
                placeholder="e.g., Construction Loan, Warehouse Mortgage"
                placeholderTextColor="#94A3B8"
                value={
                  data.customPurpose || (data.purpose !== "Others" ? data.purpose : "")
                }
                onChangeText={handleCustomPurposeChange}
              />
              {Boolean(
                errors.customPurpose ||
                  (errors.purpose && (!data.customPurpose || data.purpose === "Others"))
              ) && (
                <Text style={styles.errorText}>
                  {errors.customPurpose || errors.purpose}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Required Loan Amount */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Required Loan Amount <Text style={styles.requiredStar}>*</Text>
          </Text>

          <View style={[styles.amountRow, Boolean(errors.requiredAmount) && styles.inputError]}>
            <View style={styles.currencyPrefix}>
              <Text style={styles.currencyPrefixText}>₹</Text>
            </View>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter your required amount"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.requiredAmount}
              onChangeText={(text) => onChange("requiredAmount", text)}
            />
          </View>
          <Text style={styles.helperText}>
            Final amount depends on your property's value and eligibility.
          </Text>
          {Boolean(errors.requiredAmount) && (
            <Text style={styles.errorText}>{errors.requiredAmount}</Text>
          )}
        </View>
      </View>

      {/* 2. Preferred Tenure Section Card */}
      <PropertyLoanTenureSection
        preferredTenureMonths={data.preferredTenureMonths}
        onChange={(field, val) => onChange(field, val)}
        error={errors.preferredTenureMonths}
      />

      {/* 3. Applicant Type Section Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="person" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>
              Applicant Type <Text style={styles.requiredStar}>*</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveModal("applicantType")}
          style={[
            styles.dropdownSelector,
            Boolean(data.employmentType) && styles.dropdownSelectorActive,
            Boolean(errors.employmentType) && styles.inputError,
          ]}
        >
          <Text style={data.employmentType ? styles.dropdownText : styles.dropdownPlaceholder}>
            {data.employmentType || "Select applicant type..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={data.employmentType ? BrandColors.PRIMARY_ORANGE : "#64748B"}
          />
        </TouchableOpacity>
        <Text style={styles.helperText}>
          The next steps and document list change based on this.
        </Text>
        {Boolean(errors.employmentType) && (
          <Text style={styles.errorText}>{errors.employmentType}</Text>
        )}
      </View>

      {/* 4. Existing Customer Yes / No Section Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="people" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>
              Existing customer with us? <Text style={styles.requiredStar}>*</Text>
            </Text>
          </View>
        </View>

        <View style={styles.twoBoxRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChange("hasExistingLoans", true)}
            style={[
              styles.separateBox,
              data.hasExistingLoans === true && styles.separateBoxActive,
            ]}
          >
            <Text
              style={[
                styles.separateBoxText,
                data.hasExistingLoans === true && styles.separateBoxTextActive,
              ]}
            >
              YES
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChange("hasExistingLoans", false)}
            style={[
              styles.separateBox,
              data.hasExistingLoans === false && styles.separateBoxActive,
            ]}
          >
            <Text
              style={[
                styles.separateBoxText,
                data.hasExistingLoans === false && styles.separateBoxTextActive,
              ]}
            >
              NO
            </Text>
          </TouchableOpacity>
        </View>
        {Boolean(errors.hasExistingLoans) && (
          <Text style={styles.errorText}>{errors.hasExistingLoans}</Text>
        )}
      </View>

      {/* Dropdown Modals */}
      <PropertyLoanDropdownModal
        visible={activeModal === "purpose"}
        title="Select Loan Type"
        options={PURPOSES}
        selectedValue={isOthersPurposeSelected ? "Others" : data.purpose}
        onSelect={handleSelectPurpose}
        onClose={() => setActiveModal(null)}
      />

      <PropertyLoanDropdownModal
        visible={activeModal === "applicantType"}
        title="Select Applicant Type"
        options={APPLICANT_TYPES}
        selectedValue={data.employmentType}
        onSelect={(val) => onChange("employmentType", val)}
        onClose={() => setActiveModal(null)}
      />
    </View>
  );
};

export default PropertyLoanFinancialsStep;
