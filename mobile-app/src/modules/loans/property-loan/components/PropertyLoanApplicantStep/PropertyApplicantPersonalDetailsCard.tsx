import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanApplicantFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanApplicantStep.styles";

export interface PropertyApplicantPersonalDetailsCardProps {
  data: LoanApplicantFormData;
  onChange: (field: keyof LoanApplicantFormData, value: string | boolean | null) => void;
  errors?: Record<string, string>;
  onOpenDatePicker: () => void;
}

export const PropertyApplicantPersonalDetailsCard: React.FC<PropertyApplicantPersonalDetailsCardProps> = ({
  data,
  onChange,
  errors = {},
  onOpenDatePicker,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="person" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
          </View>
          <Text style={styles.cardTitle}>Personal Details</Text>
        </View>
      </View>

      {/* Full Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Full Name <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, Boolean(errors.fullName) && styles.inputError]}
          placeholder="Enter full name"
          placeholderTextColor="#94A3B8"
          value={data.fullName}
          onChangeText={(text) => onChange("fullName", text)}
        />
        {Boolean(errors.fullName) && (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        )}
      </View>

      {/* PAN */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          PAN <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, Boolean(errors.pan) && styles.inputError]}
          placeholder="Enter PAN (e.g. ABCDE1234F)"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          maxLength={10}
          value={data.pan}
          onChangeText={(text) => onChange("pan", text.toUpperCase())}
        />
        {Boolean(errors.pan) && (
          <Text style={styles.errorText}>{errors.pan}</Text>
        )}
      </View>

      {/* Mobile Number */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Mobile Number <Text style={styles.requiredStar}>*</Text>
        </Text>
        <View
          style={[
            styles.inputWithPrefix,
            Boolean(errors.mobile) && styles.inputError,
          ]}
        >
          <View style={styles.prefixBox}>
            <Text style={styles.prefixText}>+91</Text>
          </View>
          <TextInput
            style={styles.inputFlex}
            placeholder="Enter mobile number"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            maxLength={10}
            value={data.mobile}
            onChangeText={(text) => onChange("mobile", text.replace(/\D/g, ""))}
          />
        </View>
        {Boolean(errors.mobile) && (
          <Text style={styles.errorText}>{errors.mobile}</Text>
        )}
      </View>

      {/* Date of Birth */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Date of Birth <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.inputWithIcon,
            Boolean(errors.dob) && styles.inputError,
          ]}
          onPress={onOpenDatePicker}
          activeOpacity={0.8}
        >
          <TextInput
            style={styles.inputWithIconFlex}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#94A3B8"
            value={data.dob}
            onChangeText={(text) => onChange("dob", text)}
          />
          <TouchableOpacity
            style={styles.calendarIconBtn}
            onPress={onOpenDatePicker}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE}
              style={styles.inputIconRight}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {Boolean(errors.dob) && (
          <Text style={styles.errorText}>{errors.dob}</Text>
        )}
      </View>

      {/* Current Address */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Current Address <Text style={styles.requiredStar}>*</Text>
        </Text>
        <View
          style={[
            styles.inputWithIcon,
            Boolean(errors.currentAddress) && styles.inputError,
          ]}
        >
          <Ionicons
            name="location-outline"
            size={18}
            color="#64748B"
            style={styles.inputIconLeft}
          />
          <TextInput
            style={styles.inputWithIconFlex}
            placeholder="Enter your current address"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={2}
            value={data.currentAddress}
            onChangeText={(text) => onChange("currentAddress", text)}
          />
        </View>
        {Boolean(errors.currentAddress) && (
          <Text style={styles.errorText}>{errors.currentAddress}</Text>
        )}
      </View>
    </View>
  );
};
