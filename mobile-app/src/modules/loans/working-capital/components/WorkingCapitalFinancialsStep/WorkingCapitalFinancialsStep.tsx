import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LoanDetailsFormData, LoanEmploymentType } from "../../../types/loans.types";
import { LoanAmountInput, type LoanAmountPreset } from "../../../components/LoanAmountInput";
import { styles } from "./WorkingCapitalFinancialsStep.styles";

export interface WorkingCapitalFinancialsStepProps {
  data: LoanDetailsFormData;
  onChange: <K extends keyof LoanDetailsFormData>(
    field: K,
    value: LoanDetailsFormData[K]
  ) => void;
  errors?: Record<string, string>;
}

const WC_PURPOSES: readonly string[] = [
  "Working Capital",
  "Inventory / Stock",
  "Raw Material Purchase",
  "Supplier Payments",
  "Business Operating Expenses",
  "Receivables / Cash Flow Gap",
  "Other",
];

const WC_FACILITIES: readonly string[] = [
  "Cash Credit (CC) Facility",
  "Overdraft (OD) Line",
  "Invoice / Bill Discounting",
];

const AMOUNT_PRESETS: readonly LoanAmountPreset[] = [
  { label: "₹10 Lakhs", value: "1000000" },
  { label: "₹25 Lakhs", value: "2500000" },
  { label: "₹50 Lakhs", value: "5000000" },
  { label: "₹1 Crore", value: "10000000" },
  { label: "₹2.5 Crores", value: "25000000" },
];

export const WorkingCapitalFinancialsStep: React.FC<WorkingCapitalFinancialsStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const handleAmountChange = (val: string) => {
    onChange("requiredAmount", val);
  };

  const handlePurposeChange = (purpose: string) => {
    onChange("purpose", purpose);
  };

  const handleFacilityChange = (facility: string) => {
    onChange("employmentType", facility as LoanEmploymentType);
  };

  const handleExistingLoansToggle = (hasLoans: boolean) => {
    onChange("hasExistingLoans", hasLoans);
    if (!hasLoans && data.existingEmi) {
      onChange("existingEmi", "");
    }
  };

  const handleEmiChange = (text: string) => {
    onChange("existingEmi", text);
  };

  const renderPurposeChip = (purpose: string) => {
    const isSelected = data.purpose === purpose;
    return (
      <TouchableOpacity
        key={purpose}
        onPress={() => handlePurposeChange(purpose)}
        style={[styles.chip, isSelected && styles.chipActive]}
      >
        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
          {purpose}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFacilityChip = (facility: string) => {
    const isSelected = (data.employmentType as string) === facility;
    return (
      <TouchableOpacity
        key={facility}
        onPress={() => handleFacilityChange(facility)}
        style={[styles.chip, isSelected && styles.chipActive]}
      >
        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
          {facility}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Card 1: Credit Limit / Loan Amount */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Required Credit Limit</Text>
        <LoanAmountInput
          label="Required Credit Limit / Loan Amount (₹)"
          required
          placeholder="Enter required credit limit (₹)"
          value={data.requiredAmount}
          onChange={handleAmountChange}
          presets={AMOUNT_PRESETS}
          error={errors.requiredAmount}
        />
      </View>

      {/* Card 2: Credit Purpose */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Working Capital Purpose</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Credit Purpose <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.chipRow}>
            {WC_PURPOSES.map(renderPurposeChip)}
          </View>
          {errors.purpose && (
            <Text style={styles.errorText}>{errors.purpose}</Text>
          )}
        </View>
      </View>

      {/* Card 3: Facility Type */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Facility Type</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Preferred Facility Type <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.chipRow}>
            {WC_FACILITIES.map(renderFacilityChip)}
          </View>
        </View>
      </View>

      {/* Card 4: Existing Active Bank Borrowings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Existing Active Bank Borrowings?</Text>
        <View style={styles.fieldGroup}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              onPress={() => handleExistingLoansToggle(false)}
              style={[
                styles.toggleButton,
                !data.hasExistingLoans && styles.toggleButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  !data.hasExistingLoans && styles.toggleTextActive,
                ]}
              >
                No Existing Lines
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleExistingLoansToggle(true)}
              style={[
                styles.toggleButton,
                data.hasExistingLoans && styles.toggleButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  data.hasExistingLoans && styles.toggleTextActive,
                ]}
              >
                Yes, Active Debts
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {data.hasExistingLoans && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Total Monthly Interest / EMI Outgo (₹) <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.existingEmi && styles.inputError]}
              placeholder="e.g. 25000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.existingEmi}
              onChangeText={handleEmiChange}
            />
            {errors.existingEmi && (
              <Text style={styles.errorText}>{errors.existingEmi}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default WorkingCapitalFinancialsStep;

