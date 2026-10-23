import React from "react";
import { Text, TextInput, View } from "react-native";
import { Dropdown } from "@/shared/components/Dropdown";
import {
  MSME_CONSTITUTION_OPTIONS,
  type MsmeConstitution,
  type MsmeLoanErrors,
  type MsmeLoanFormData,
} from "../../types/msmeLoan.types";
import { MSME_BUSINESS_NAME_MAX_LENGTH, MSME_CONSTITUTION_OTHER_MAX_LENGTH } from "../../validation/msmeLoanValidation";
import { styles } from "./MsmeLoanScreen.styles";

interface Props {
  form: Pick<MsmeLoanFormData, "businessName" | "constitution" | "constitutionOther">;
  errors: Pick<MsmeLoanErrors, "businessName" | "constitution" | "constitutionOther">;
  setField: (field: keyof MsmeLoanFormData, value: string) => void;
}

export const MsmeBusinessDetailsSection: React.FC<Props> = ({ form, errors, setField }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Business Details</Text>

    <View style={styles.field}>
      <Text style={styles.label}>
        Business / Trade Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.businessName ? styles.inputError : null]}
        value={form.businessName}
        onChangeText={(val) => setField("businessName", val)}
        placeholder="Enter business name"
        placeholderTextColor="#94A3B8"
        maxLength={MSME_BUSINESS_NAME_MAX_LENGTH}
        autoCapitalize="words"
        accessibilityLabel="Business / Trade Name"
      />
      {errors.businessName ? <Text style={styles.errorText}>{errors.businessName}</Text> : null}
    </View>

    <Dropdown
      label="Business Constitution"
      required
      options={[...MSME_CONSTITUTION_OPTIONS]}
      value={form.constitution}
      onSelect={(val) => setField("constitution", val as MsmeConstitution)}
      placeholder="Select business constitution"
      error={errors.constitution}
    />

    {form.constitution === "Other" ? (
      <View style={styles.field}>
        <Text style={styles.label}>
          Business Constitution <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.constitutionOther ? styles.inputError : null]}
          value={form.constitutionOther}
          onChangeText={(val) => setField("constitutionOther", val)}
          placeholder="Enter business constitution"
          placeholderTextColor="#94A3B8"
          maxLength={MSME_CONSTITUTION_OTHER_MAX_LENGTH}
          autoCapitalize="words"
          accessibilityLabel="Business Constitution"
        />
        {errors.constitutionOther ? <Text style={styles.errorText}>{errors.constitutionOther}</Text> : null}
      </View>
    ) : null}
  </View>
);
