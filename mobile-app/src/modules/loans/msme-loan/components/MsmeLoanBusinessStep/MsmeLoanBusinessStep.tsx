import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LoanBusinessFormData } from "../../../types/loans.types";
import { styles } from "./MsmeLoanBusinessStep.styles";

export interface MsmeLoanBusinessStepProps {
  data: LoanBusinessFormData;
  onChange: (field: keyof LoanBusinessFormData, value: string) => void;
  errors?: Record<string, string>;
}

const VINTAGE_OPTIONS = [
  { label: "< 1 Year", value: "0" },
  { label: "1 - 2 Years", value: "2" },
  { label: "3 - 5 Years", value: "4" },
  { label: "5 - 10 Years", value: "7" },
  { label: "10+ Years", value: "11" },
];

export const MsmeLoanBusinessStep: React.FC<MsmeLoanBusinessStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Udyam Registration & Enterprise Profile</Text>
      <Text style={styles.sectionSubtitle}>
        Provide MSME Udyam credentials, firm legal name, and audited turnover.
      </Text>

      {/* Enterprise Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Registered MSME Enterprise Name <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.businessName && styles.inputError]}
          placeholder="e.g. Swastik Micro Industries"
          placeholderTextColor="#94A3B8"
          value={data.businessName}
          onChangeText={(text) => onChange("businessName", text)}
        />
        {errors.businessName && (
          <Text style={styles.errorText}>{errors.businessName}</Text>
        )}
      </View>

      {/* Udyam Registration (Mandatory for MSME) */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Udyam Registration Number <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.udyamRegistration && styles.inputError]}
          placeholder="e.g. UDYAM-MH-01-0012345"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          value={data.udyamRegistration}
          onChangeText={(text) =>
            onChange("udyamRegistration", text.toUpperCase())
          }
        />
        {errors.udyamRegistration && (
          <Text style={styles.errorText}>{errors.udyamRegistration}</Text>
        )}
      </View>

      {/* GSTIN */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          GSTIN Number{" "}
          <Text style={styles.optionalTag}>(Optional if turnover &lt; ₹40 Lakhs)</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.gstin && styles.inputError]}
          placeholder="e.g. 27ABCDE1234F1Z5"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          maxLength={15}
          value={data.gstin}
          onChangeText={(text) => onChange("gstin", text.toUpperCase())}
        />
        {errors.gstin && <Text style={styles.errorText}>{errors.gstin}</Text>}
      </View>

      {/* Vintage */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Enterprise Vintage (Years) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <View style={styles.vintageRow}>
          {VINTAGE_OPTIONS.map((item) => {
            const isSelected = data.businessVintageYears === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.7}
                onPress={() => onChange("businessVintageYears", item.value)}
                style={[
                  styles.vintageChip,
                  isSelected && styles.vintageChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.vintageChipText,
                    isSelected && styles.vintageChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.businessVintageYears && (
          <Text style={styles.errorText}>{errors.businessVintageYears}</Text>
        )}
      </View>

      {/* Annual Turnover */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Annual Turnover / Gross Receipts (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.annualTurnover && styles.inputError]}
          placeholder="e.g. 3500000"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={data.annualTurnover}
          onChangeText={(text) => onChange("annualTurnover", text)}
        />
        {errors.annualTurnover && (
          <Text style={styles.errorText}>{errors.annualTurnover}</Text>
        )}
      </View>

      {/* Net Profit */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Annual Net Profit (₹) <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.netProfit && styles.inputError]}
          placeholder="e.g. 500000"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={data.netProfit}
          onChangeText={(text) => onChange("netProfit", text)}
        />
        {errors.netProfit && (
          <Text style={styles.errorText}>{errors.netProfit}</Text>
        )}
      </View>
    </View>
  );
};

export default MsmeLoanBusinessStep;
