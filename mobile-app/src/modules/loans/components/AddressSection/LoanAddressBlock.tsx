import React from "react";
import { Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Dropdown } from "@/shared/components/Dropdown";
import type { LoanKycAddress, LoanKycErrors } from "../../types/loanKyc.types";
import { styles } from "./AddressSection.styles";

interface LoanAddressBlockProps {
  address: LoanKycAddress;
  errorPrefix: "currentAddress" | "permanentAddress";
  errors: LoanKycErrors;
  isLocked: boolean;
  onChange: (field: keyof LoanKycAddress, value: string) => void;
  stateOptions: string[];
  statePlaceholder?: string;
}

interface LockedFieldProps {
  label: string;
  value: string;
}

const LockedField: React.FC<LockedFieldProps> = ({ label, value }) => (
  <>
    <View style={styles.lockedLabelRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Ionicons name="lock-closed-outline" size={12} color="#94A3B8" />
    </View>
    <View style={styles.lockedField}>
      <Text style={styles.lockedFieldValue}>{value || "—"}</Text>
    </View>
  </>
);

interface EditableFieldProps {
  label: string;
  value: string;
  error?: string;
  onChange: (val: string) => void;
  placeholder: string;
  keyboardType?: "default" | "number-pad";
}

const EditableField: React.FC<EditableFieldProps> = ({
  label, value, error, onChange, placeholder, keyboardType = "default",
}) => (
  <>
    <Text style={styles.fieldLabel}>
      {label} <Text style={styles.requiredStar}>*</Text>
    </Text>
    <TextInput
      style={[styles.input, error ? styles.inputError : undefined]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      keyboardType={keyboardType}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </>
);

export const LoanAddressBlock: React.FC<LoanAddressBlockProps> = ({
  address, errorPrefix, errors, isLocked, onChange,
  stateOptions, statePlaceholder = "Select State / UT",
}) => {
  const err = (field: string) =>
    errors[`${errorPrefix}.${field}` as keyof LoanKycErrors] as string | undefined;

  const handlePincodeChange = (text: string) => {
    const value = text.trim();
    const clean = /^\d{3}[\s-]\d{3}$/.test(value) ? value.replace(/\D/g, "") : text;
    onChange("pincode", clean);
  };

  return (
    <>
      <View style={styles.fieldWrapper}>
        {isLocked ? (
          <LockedField label="House / Flat / Building" value={address.houseNumber} />
        ) : (
          <EditableField
            label="House / Flat / Building"
            value={address.houseNumber}
            error={err("houseNumber")}
            onChange={(val) => onChange("houseNumber", val)}
            placeholder="e.g. Flat 402, Block B"
          />
        )}
      </View>

      <View style={styles.fieldWrapper}>
        {isLocked ? (
          <LockedField label="Street / Locality / Landmark" value={address.street} />
        ) : (
          <EditableField
            label="Street / Locality / Landmark"
            value={address.street}
            error={err("street")}
            onChange={(val) => onChange("street", val)}
            placeholder="e.g. MG Road, Near City Mall"
          />
        )}
      </View>

      <View style={styles.twoColRow}>
        <View style={[styles.col, styles.fieldWrapper]}>
          {isLocked ? (
            <LockedField label="City / District" value={address.city} />
          ) : (
            <EditableField
              label="City / District"
              value={address.city}
              error={err("city")}
              onChange={(val) => onChange("city", val)}
              placeholder="e.g. Hyderabad"
            />
          )}
        </View>
        <View style={[styles.col, styles.fieldWrapper]}>
          {isLocked ? (
            <LockedField label="PIN Code" value={address.pincode} />
          ) : (
            <EditableField
              label="PIN Code"
              value={address.pincode}
              error={err("pincode")}
              onChange={handlePincodeChange}
              placeholder="6 digits"
              keyboardType="number-pad"
            />
          )}
        </View>
      </View>

      <View style={styles.fieldWrapper}>
        {isLocked ? (
          <>
            <View style={styles.lockedLabelRow}>
              <Text style={styles.fieldLabel}>State</Text>
              <Ionicons name="lock-closed-outline" size={12} color="#94A3B8" />
            </View>
            <Dropdown
              placeholder={statePlaceholder}
              value={address.state}
              options={stateOptions}
              onSelect={() => {}}
              disabled
              error={err("state")}
            />
          </>
        ) : (
          <Dropdown
            label="State"
            required
            placeholder={statePlaceholder}
            value={address.state}
            options={stateOptions}
            onSelect={(val) => onChange("state", val)}
            error={err("state")}
          />
        )}
      </View>
    </>
  );
};
