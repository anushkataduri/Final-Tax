import React from "react";
import { Text, TextInput, View } from "react-native";
import { Dropdown } from "@/shared/components/Dropdown";
import { MoneyInputField } from "../../../components/MoneyInputField";
import {
  MSME_DURATION_OPTIONS,
  MSME_OWNERSHIP_OPTIONS,
  type MsmeLoanErrors,
  type MsmeLoanFormData,
  type MsmeOperatingDuration,
  type MsmeOwnership,
} from "../../types/msmeLoan.types";
import { MSME_OWNERSHIP_OTHER_MAX_LENGTH } from "../../validation/msmeLoanValidation";
import { styles } from "./MsmeLoanScreen.styles";

interface Props {
  form: Pick<MsmeLoanFormData, "operatingDuration" | "numberOfEmployees" | "annualTurnover" | "ownershipType" | "ownershipTypeOther">;
  errors: Pick<MsmeLoanErrors, "operatingDuration" | "numberOfEmployees" | "annualTurnover" | "ownershipType" | "ownershipTypeOther">;
  setField: (field: keyof MsmeLoanFormData, value: string) => void;
}

export const MsmeBusinessInfoSection: React.FC<Props> = ({ form, errors, setField }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Business Information</Text>

    <Dropdown
      label="Business Operating Duration"
      required
      options={[...MSME_DURATION_OPTIONS]}
      value={form.operatingDuration}
      onSelect={(val) => setField("operatingDuration", val as MsmeOperatingDuration)}
      placeholder="Select operating duration"
      error={errors.operatingDuration}
    />

    <View style={styles.field}>
      <Text style={styles.label}>
        Number of Employees <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.numberOfEmployees ? styles.inputError : null]}
        value={form.numberOfEmployees}
        onChangeText={(val) => setField("numberOfEmployees", val)}
        placeholder="Enter number of employees"
        placeholderTextColor="#94A3B8"
        maxLength={6}
        keyboardType="number-pad"
        accessibilityLabel="Number of Employees"
      />
      {errors.numberOfEmployees ? <Text style={styles.errorText}>{errors.numberOfEmployees}</Text> : null}
    </View>

    <MoneyInputField
      label="Annual Business Turnover"
      required
      value={form.annualTurnover}
      onChange={(val) => setField("annualTurnover", val)}
      placeholder="Enter annual turnover"
      error={errors.annualTurnover}
    />

    <Dropdown
      label="Business Ownership"
      required
      options={[...MSME_OWNERSHIP_OPTIONS]}
      value={form.ownershipType}
      onSelect={(val) => setField("ownershipType", val as MsmeOwnership)}
      placeholder="Select ownership type"
      error={errors.ownershipType}
    />

    {form.ownershipType === "Other" ? (
      <View style={styles.field}>
        <Text style={styles.label}>
          Business Ownership Type <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.ownershipTypeOther ? styles.inputError : null]}
          value={form.ownershipTypeOther}
          onChangeText={(val) => setField("ownershipTypeOther", val)}
          placeholder="Enter ownership type"
          placeholderTextColor="#94A3B8"
          maxLength={MSME_OWNERSHIP_OTHER_MAX_LENGTH}
          autoCapitalize="words"
          accessibilityLabel="Business Ownership Type"
        />
        {errors.ownershipTypeOther ? (
          <Text style={styles.errorText}>{errors.ownershipTypeOther}</Text>
        ) : null}
      </View>
    ) : null}
  </View>
);
