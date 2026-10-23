import React from "react";
import { Text, TextInput, View } from "react-native";
import { Dropdown } from "@/shared/components/Dropdown";
import {
  MSME_GST_STATUS_OPTIONS,
  MSME_REGISTRATION_STATUS_OPTIONS,
  type MsmeGstStatus,
  type MsmeLoanErrors,
  type MsmeLoanFormData,
  type MsmeRegistrationStatus,
} from "../../types/msmeLoan.types";
import { styles } from "./MsmeLoanScreen.styles";

interface Props {
  form: Pick<MsmeLoanFormData, "udyamStatus" | "udyamRegistrationNumber" | "gstStatus" | "gstin">;
  errors: Pick<MsmeLoanErrors, "udyamStatus" | "udyamRegistrationNumber" | "gstStatus" | "gstin">;
  setField: (field: keyof MsmeLoanFormData, value: string) => void;
}

export const MsmeRegistrationSection: React.FC<Props> = ({ form, errors, setField }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>MSME Registration</Text>

    <Dropdown
      label="Udyam / MSME Registration Status"
      required
      options={[...MSME_REGISTRATION_STATUS_OPTIONS]}
      value={form.udyamStatus}
      onSelect={(val) => setField("udyamStatus", val as MsmeRegistrationStatus)}
      placeholder="Select registration status"
      error={errors.udyamStatus}
    />

    {form.udyamStatus === "Registered" ? (
      <View style={styles.field}>
        <Text style={styles.label}>
          Udyam Registration Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.udyamRegistrationNumber ? styles.inputError : null]}
          value={form.udyamRegistrationNumber}
          onChangeText={(val) => setField("udyamRegistrationNumber", val.toUpperCase())}
          placeholder="Enter Udyam registration number"
          placeholderTextColor="#94A3B8"
          maxLength={25}
          autoCapitalize="characters"
          accessibilityLabel="Udyam Registration Number"
        />
        {errors.udyamRegistrationNumber ? (
          <Text style={styles.errorText}>{errors.udyamRegistrationNumber}</Text>
        ) : null}
      </View>
    ) : null}

    <Dropdown
      label="GST Registration Status"
      required
      options={[...MSME_GST_STATUS_OPTIONS]}
      value={form.gstStatus}
      onSelect={(val) => setField("gstStatus", val as MsmeGstStatus)}
      placeholder="Select GST status"
      error={errors.gstStatus}
    />

    {form.gstStatus === "Registered" ? (
      <View style={styles.field}>
        <Text style={styles.label}>
          GSTIN <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.gstin ? styles.inputError : null]}
          value={form.gstin}
          onChangeText={(val) => setField("gstin", val.toUpperCase())}
          placeholder="Enter GSTIN"
          placeholderTextColor="#94A3B8"
          maxLength={15}
          autoCapitalize="characters"
          accessibilityLabel="GSTIN"
        />
        {errors.gstin ? <Text style={styles.errorText}>{errors.gstin}</Text> : null}
      </View>
    ) : null}
  </View>
);
