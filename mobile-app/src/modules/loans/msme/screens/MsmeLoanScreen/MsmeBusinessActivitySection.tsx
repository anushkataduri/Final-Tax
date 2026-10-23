import React from "react";
import { Text, TextInput, View } from "react-native";
import { Dropdown } from "@/shared/components/Dropdown";
import { UniversalDatePicker } from "@/shared/components/UniversalDatePicker";
import {
  MSME_BUSINESS_ACTIVITY_OPTIONS,
  type MsmeBusinessActivity,
  type MsmeLoanErrors,
  type MsmeLoanFormData,
} from "../../types/msmeLoan.types";
import { MSME_ACTIVITY_OTHER_MAX_LENGTH } from "../../validation/msmeLoanValidation";
import { styles } from "./MsmeLoanScreen.styles";

interface Props {
  form: Pick<MsmeLoanFormData, "businessActivity" | "businessActivityOther" | "establishmentDate">;
  errors: Pick<MsmeLoanErrors, "businessActivity" | "businessActivityOther" | "establishmentDate">;
  setField: (field: keyof MsmeLoanFormData, value: string) => void;
}

export const MsmeBusinessActivitySection: React.FC<Props> = ({ form, errors, setField }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Business Activity</Text>

    <Dropdown
      label="Primary Business Activity"
      required
      options={[...MSME_BUSINESS_ACTIVITY_OPTIONS]}
      value={form.businessActivity}
      onSelect={(val) => setField("businessActivity", val as MsmeBusinessActivity)}
      placeholder="Select business activity"
      error={errors.businessActivity}
    />

    {form.businessActivity === "Other" ? (
      <View style={styles.field}>
        <Text style={styles.label}>
          Business Activity <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.businessActivityOther ? styles.inputError : null]}
          value={form.businessActivityOther}
          onChangeText={(val) => setField("businessActivityOther", val)}
          placeholder="Enter business activity"
          placeholderTextColor="#94A3B8"
          maxLength={MSME_ACTIVITY_OTHER_MAX_LENGTH}
          autoCapitalize="words"
          accessibilityLabel="Business Activity"
        />
        {errors.businessActivityOther ? (
          <Text style={styles.errorText}>{errors.businessActivityOther}</Text>
        ) : null}
      </View>
    ) : null}

    <View style={styles.field}>
      <UniversalDatePicker
        label="Business Establishment Date"
        value={form.establishmentDate}
        onChange={(val) => setField("establishmentDate", val)}
        required
        placeholder="Select establishment date"
        valueFormat="DD-MM-YYYY"
        allowManualEntry
        maximumDate={new Date()}
        error={errors.establishmentDate}
      />
    </View>
  </View>
);
