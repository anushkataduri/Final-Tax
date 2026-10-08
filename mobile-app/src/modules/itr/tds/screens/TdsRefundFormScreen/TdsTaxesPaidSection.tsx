import React from "react";
import { View, Text, TextInput } from "react-native";
import { IncomeTaxDetails } from "../../types/customerIncome.types";
import { CustomerFormErrors } from "../../validation/tdsCustomerSchema";
import { styles } from "./TdsRefundFormScreen.styles";
import { TdsFormInputRefs, UpdateIncomeField, SectionHeader } from "./TdsRefundFormSections.types";

interface TdsTaxesPaidSectionProps {
  income: IncomeTaxDetails;
  errors: CustomerFormErrors;
  inputs: TdsFormInputRefs;
  updateIncome: UpdateIncomeField;
}

export const TdsTaxesPaidSection: React.FC<TdsTaxesPaidSectionProps> = ({
  income,
  errors,
  inputs: { tdsRef, tcsRef, advanceTaxRef, selfTaxRef },
  updateIncome,
}) => (
  <View style={styles.sectionCard}>
    <SectionHeader number={4} title="TDS & Taxes Paid" />

    {/* Total TDS Deducted (Full Width) */}
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>
        Total TDS Deducted (₹) <Text style={styles.requiredAsterisk}>*</Text>
      </Text>
      <TextInput
        ref={tdsRef}
        style={[styles.textInput, errors["income.totalTdsDeducted"] ? styles.textInputError : null]}
        placeholder="Enter TDS amount"
        placeholderTextColor="#94A3B8"
        keyboardType="numeric"
        value={income.totalTdsDeducted}
        onChangeText={(t) => updateIncome("totalTdsDeducted", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
        returnKeyType="next"
        onSubmitEditing={() => tcsRef.current?.focus()}
      />
      {errors["income.totalTdsDeducted"] && (
        <Text style={styles.errorText}>{errors["income.totalTdsDeducted"]}</Text>
      )}
    </View>

    {/* TCS & Advance Tax (2 Columns - Spacious & Fits) */}
    <View style={styles.fieldRow}>
      <View style={[styles.fieldGroup, styles.fieldRowItem]}>
        <Text style={styles.fieldLabel}>TCS Amount (₹)</Text>
        <TextInput
          ref={tcsRef}
          style={styles.textInput}
          placeholder="Enter TCS"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={income.tcsAmount}
          onChangeText={(t) => updateIncome("tcsAmount", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
          returnKeyType="next"
          onSubmitEditing={() => advanceTaxRef.current?.focus()}
        />
      </View>

      <View style={[styles.fieldGroup, styles.fieldRowItem]}>
        <Text style={styles.fieldLabel}>Advance Tax (₹)</Text>
        <TextInput
          ref={advanceTaxRef}
          style={styles.textInput}
          placeholder="Enter advance tax"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={income.advanceTaxPaid}
          onChangeText={(t) => updateIncome("advanceTaxPaid", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
          returnKeyType="next"
          onSubmitEditing={() => selfTaxRef.current?.focus()}
        />
      </View>
    </View>

    {/* Self Assessment Tax (Full Width - Fits cleanly without clipping) */}
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>Self Assessment Tax Paid (₹)</Text>
      <TextInput
        ref={selfTaxRef}
        style={styles.textInput}
        placeholder="Enter self-assessment tax"
        placeholderTextColor="#94A3B8"
        keyboardType="numeric"
        value={income.selfAssessmentTaxPaid}
        onChangeText={(t) => updateIncome("selfAssessmentTaxPaid", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
        returnKeyType="done"
      />
    </View>
  </View>
);

