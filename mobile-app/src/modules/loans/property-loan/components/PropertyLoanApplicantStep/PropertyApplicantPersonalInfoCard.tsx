import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanApplicantFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanApplicantStep.styles";
import { ApplicantDropdownKey } from "./PropertyApplicantEmploymentCard";

export interface PropertyApplicantPersonalInfoCardProps {
  data: LoanApplicantFormData;
  errors?: Record<string, string>;
  onOpenPicker: (key: ApplicantDropdownKey) => void;
}

export const PropertyApplicantPersonalInfoCard: React.FC<PropertyApplicantPersonalInfoCardProps> = ({
  data,
  errors = {},
  onOpenPicker,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="information-circle" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
          </View>
          <Text style={styles.cardTitle}>Personal Information</Text>
        </View>
      </View>

      {/* Gender */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Gender <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.gender) && styles.dropdownSelectorActive,
            errors.gender ? styles.inputError : null,
          ]}
          onPress={() => onOpenPicker("gender")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.gender
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.gender || "Select gender..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={data.gender ? BrandColors.PRIMARY_ORANGE : "#64748B"}
          />
        </TouchableOpacity>
        {errors.gender ? (
          <Text style={styles.errorText}>{errors.gender}</Text>
        ) : null}
      </View>

      {/* Marital Status */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Marital Status <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.maritalStatus) && styles.dropdownSelectorActive,
            errors.maritalStatus ? styles.inputError : null,
          ]}
          onPress={() => onOpenPicker("maritalStatus")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.maritalStatus
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.maritalStatus || "Select marital status..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={data.maritalStatus ? BrandColors.PRIMARY_ORANGE : "#64748B"}
          />
        </TouchableOpacity>
        {errors.maritalStatus ? (
          <Text style={styles.errorText}>{errors.maritalStatus}</Text>
        ) : null}
      </View>

      {/* Residence Type */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Residence Type <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.residenceType) && styles.dropdownSelectorActive,
            errors.residenceType ? styles.inputError : null,
          ]}
          onPress={() => onOpenPicker("residenceType")}
          activeOpacity={0.8}
        >
          <Text
            numberOfLines={1}
            style={
              data.residenceType
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.residenceType || "Select residence type..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={data.residenceType ? BrandColors.PRIMARY_ORANGE : "#64748B"}
          />
        </TouchableOpacity>
        {errors.residenceType ? (
          <Text style={styles.errorText}>{errors.residenceType}</Text>
        ) : null}
      </View>

      {/* Years at Current Address */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Years at Current Address <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.yearsAtCurrentAddress) && styles.dropdownSelectorActive,
            errors.yearsAtCurrentAddress ? styles.inputError : null,
          ]}
          onPress={() => onOpenPicker("yearsAtCurrentAddress")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.yearsAtCurrentAddress
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.yearsAtCurrentAddress || "Select years..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={
              data.yearsAtCurrentAddress
                ? BrandColors.PRIMARY_ORANGE
                : "#64748B"
            }
          />
        </TouchableOpacity>
        {errors.yearsAtCurrentAddress ? (
          <Text style={styles.errorText}>{errors.yearsAtCurrentAddress}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default PropertyApplicantPersonalInfoCard;
