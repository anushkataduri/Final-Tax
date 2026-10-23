import React from "react";
import { Text, TextInput, View } from "react-native";
import { Dropdown } from "@/shared/components/Dropdown";
import { INDIAN_STATES_AND_UTS } from "@/components/screens/create-profile/types";
import type { MsmeLoanAddress, MsmeLoanErrors } from "../../types/msmeLoan.types";
import { MSME_CITY_MAX_LENGTH, MSME_HOUSE_MAX_LENGTH, MSME_STREET_MAX_LENGTH } from "../../validation/msmeLoanValidation";
import { styles } from "./MsmeLoanScreen.styles";

interface Props {
  address: MsmeLoanAddress;
  errors: Pick<MsmeLoanErrors, "operatingAddress.houseNumber" | "operatingAddress.street" | "operatingAddress.city" | "operatingAddress.state" | "operatingAddress.pincode">;
  setAddressField: (field: keyof MsmeLoanAddress, value: string) => void;
}

export const MsmeAddressSection: React.FC<Props> = ({ address, errors, setAddressField }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Business Operating Address</Text>

    <View style={styles.field}>
      <Text style={styles.label}>
        House / Flat / Building <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors["operatingAddress.houseNumber"] ? styles.inputError : null]}
        value={address.houseNumber}
        onChangeText={(val) => setAddressField("houseNumber", val)}
        placeholder="Enter house, flat or building"
        placeholderTextColor="#94A3B8"
        maxLength={MSME_HOUSE_MAX_LENGTH}
        accessibilityLabel="House / Flat / Building"
      />
      {errors["operatingAddress.houseNumber"] ? (
        <Text style={styles.errorText}>{errors["operatingAddress.houseNumber"]}</Text>
      ) : null}
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>
        Street / Locality / Landmark <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors["operatingAddress.street"] ? styles.inputError : null]}
        value={address.street}
        onChangeText={(val) => setAddressField("street", val)}
        placeholder="Enter street, locality or landmark"
        placeholderTextColor="#94A3B8"
        maxLength={MSME_STREET_MAX_LENGTH}
        accessibilityLabel="Street / Locality / Landmark"
      />
      {errors["operatingAddress.street"] ? (
        <Text style={styles.errorText}>{errors["operatingAddress.street"]}</Text>
      ) : null}
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>
        City / District <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors["operatingAddress.city"] ? styles.inputError : null]}
        value={address.city}
        onChangeText={(val) => setAddressField("city", val)}
        placeholder="Enter city or district"
        placeholderTextColor="#94A3B8"
        maxLength={MSME_CITY_MAX_LENGTH}
        autoCapitalize="words"
        accessibilityLabel="City / District"
      />
      {errors["operatingAddress.city"] ? (
        <Text style={styles.errorText}>{errors["operatingAddress.city"]}</Text>
      ) : null}
    </View>

    <Dropdown
      label="State / Union Territory"
      required
      options={[...INDIAN_STATES_AND_UTS]}
      value={address.state}
      onSelect={(val) => setAddressField("state", val)}
      placeholder="Select state or union territory"
      error={errors["operatingAddress.state"]}
    />

    <View style={styles.field}>
      <Text style={styles.label}>
        PIN Code <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors["operatingAddress.pincode"] ? styles.inputError : null]}
        value={address.pincode}
        onChangeText={(val) => setAddressField("pincode", val)}
        placeholder="Enter PIN code"
        placeholderTextColor="#94A3B8"
        maxLength={6}
        keyboardType="number-pad"
        accessibilityLabel="PIN Code"
      />
      {errors["operatingAddress.pincode"] ? (
        <Text style={styles.errorText}>{errors["operatingAddress.pincode"]}</Text>
      ) : null}
    </View>
  </View>
);
