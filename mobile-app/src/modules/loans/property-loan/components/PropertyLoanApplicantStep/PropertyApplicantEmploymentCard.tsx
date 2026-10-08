import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanApplicantFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanApplicantStep.styles";

export type ApplicantDropdownKey =
  | "gender"
  | "maritalStatus"
  | "residenceType"
  | "yearsAtCurrentAddress"
  | "employerCategory"
  | "totalWorkExperience"
  | "yearsInCurrentJob";

export interface PropertyApplicantEmploymentCardProps {
  data: LoanApplicantFormData;
  onChange: (field: keyof LoanApplicantFormData, value: string | boolean | null) => void;
  errors?: Record<string, string>;
  onOpenPicker: (key: ApplicantDropdownKey) => void;
}

export const PropertyApplicantEmploymentCard: React.FC<PropertyApplicantEmploymentCardProps> = ({
  data,
  onChange,
  errors = {},
  onOpenPicker,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="briefcase" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
          </View>
          <Text style={styles.cardTitle}>Employment Details</Text>
        </View>
      </View>

      {/* Employer Category */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Employer Category <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.employerCategory) && styles.dropdownSelectorActive,
            errors.employerCategory ? styles.inputError : null,
          ]}
          onPress={() => onOpenPicker("employerCategory")}
          activeOpacity={0.8}
        >
          <Text
            numberOfLines={1}
            style={
              data.employerCategory
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.employerCategory || "Select category..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={
              data.employerCategory
                ? BrandColors.PRIMARY_ORANGE
                : "#64748B"
            }
          />
        </TouchableOpacity>
        {errors.employerCategory ? (
          <Text style={styles.errorText}>{errors.employerCategory}</Text>
        ) : null}
      </View>

      {/* Employer Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Employer Name <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            errors.employerName ? styles.inputError : null,
          ]}
          placeholder="Enter employer name"
          placeholderTextColor="#94A3B8"
          value={data.employerName}
          onChangeText={(text) => onChange("employerName", text)}
        />
        {errors.employerName ? (
          <Text style={styles.errorText}>{errors.employerName}</Text>
        ) : null}
      </View>

      {/* Total Work Experience */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Total Work Experience <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.totalWorkExperience) && styles.dropdownSelectorActive,
            errors.totalWorkExperience ? styles.inputError : null,
          ]}
          onPress={() => onOpenPicker("totalWorkExperience")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.totalWorkExperience
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.totalWorkExperience || "Select experience..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={
              data.totalWorkExperience
                ? BrandColors.PRIMARY_ORANGE
                : "#64748B"
            }
          />
        </TouchableOpacity>
        {errors.totalWorkExperience ? (
          <Text style={styles.errorText}>{errors.totalWorkExperience}</Text>
        ) : null}
      </View>

      {/* Years in Current Job */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Years in Current Job <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.yearsInCurrentJob) && styles.dropdownSelectorActive,
            errors.yearsInCurrentJob ? styles.inputError : null,
          ]}
          onPress={() => onOpenPicker("yearsInCurrentJob")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.yearsInCurrentJob
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.yearsInCurrentJob || "Select years..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={
              data.yearsInCurrentJob
                ? BrandColors.PRIMARY_ORANGE
                : "#64748B"
            }
          />
        </TouchableOpacity>
        {errors.yearsInCurrentJob ? (
          <Text style={styles.errorText}>{errors.yearsInCurrentJob}</Text>
        ) : null}
      </View>

      {/* Annual Income */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Annual Income <Text style={styles.requiredStar}>*</Text>
        </Text>
        <View
          style={[
            styles.inputWithPrefix,
            errors.annualIncome ? styles.inputError : null,
          ]}
        >
          <View style={styles.prefixBox}>
            <Text style={styles.prefixText}>₹</Text>
          </View>
          <TextInput
            style={styles.inputFlex}
            placeholder="Enter annual income"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={data.annualIncome}
            onChangeText={(text) =>
              onChange("annualIncome", text.replace(/\D/g, ""))
            }
          />
        </View>
        {errors.annualIncome ? (
          <Text style={styles.errorText}>{errors.annualIncome}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default PropertyApplicantEmploymentCard;
