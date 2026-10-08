import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanOwnershipFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanOwnershipStep.styles";

export interface PropertyCoOwnerCardProps {
  data: LoanOwnershipFormData;
  onChange: (field: keyof LoanOwnershipFormData, value: string) => void;
  errors?: Record<string, string>;
  onOpenRelationshipPicker: () => void;
}

export const PropertyCoOwnerCard: React.FC<PropertyCoOwnerCardProps> = ({
  data,
  onChange,
  errors = {},
  onOpenRelationshipPicker,
}) => {
  const isJoint = data.ownershipType === "Joint Ownership";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="people" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
          </View>
          <Text style={styles.cardTitle}>Co-owner Details (If Joint Ownership)</Text>
        </View>
      </View>

      {/* Co-owner Full Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Co-owner Full Name {isJoint && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <View
          style={[
            styles.inputWithIcon,
            errors.coOwnerFullName ? styles.inputError : null,
          ]}
        >
          <View style={styles.iconBoxLeft}>
            <Ionicons name="person-outline" size={18} color="#64748B" />
          </View>
          <TextInput
            style={styles.inputFlex}
            placeholder="Enter co-owner name"
            placeholderTextColor="#94A3B8"
            value={data.coOwnerFullName}
            onChangeText={(text) => onChange("coOwnerFullName", text)}
          />
        </View>
        {errors.coOwnerFullName ? (
          <Text style={styles.errorText}>{errors.coOwnerFullName}</Text>
        ) : null}
      </View>

      {/* Relationship with Applicant */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Relationship with Applicant {isJoint && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.coOwnerRelationship) && styles.dropdownSelectorActive,
            errors.coOwnerRelationship ? styles.inputError : null,
          ]}
          onPress={onOpenRelationshipPicker}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.coOwnerRelationship
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.coOwnerRelationship || "Select relationship..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={
              data.coOwnerRelationship
                ? BrandColors.PRIMARY_ORANGE
                : "#64748B"
            }
          />
        </TouchableOpacity>
        {errors.coOwnerRelationship ? (
          <Text style={styles.errorText}>{errors.coOwnerRelationship}</Text>
        ) : null}
      </View>

      {/* Co-owner PAN */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Co-owner PAN {isJoint && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <View
          style={[
            styles.inputWithIcon,
            errors.coOwnerPan ? styles.inputError : null,
          ]}
        >
          <View style={styles.iconBoxLeft}>
            <Ionicons name="card-outline" size={18} color="#64748B" />
          </View>
          <TextInput
            style={styles.inputFlex}
            placeholder="Enter PAN (e.g. ABCDE1234F)"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            maxLength={10}
            value={data.coOwnerPan}
            onChangeText={(text) => onChange("coOwnerPan", text.toUpperCase())}
          />
        </View>
        {errors.coOwnerPan ? (
          <Text style={styles.errorText}>{errors.coOwnerPan}</Text>
        ) : null}
      </View>

      {/* Co-owner Mobile Number */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Co-owner Mobile Number {isJoint && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <View
          style={[
            styles.inputWithIcon,
            errors.coOwnerMobile ? styles.inputError : null,
          ]}
        >
          <View style={styles.iconBoxLeft}>
            <Ionicons name="call-outline" size={18} color="#64748B" />
          </View>
          <View style={styles.prefixIconBox}>
            <Text style={styles.prefixText}>+91</Text>
          </View>
          <TextInput
            style={styles.inputFlex}
            placeholder="Enter mobile number"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            maxLength={10}
            value={data.coOwnerMobile}
            onChangeText={(text) =>
              onChange("coOwnerMobile", text.replace(/\D/g, ""))
            }
          />
        </View>
        {errors.coOwnerMobile ? (
          <Text style={styles.errorText}>{errors.coOwnerMobile}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default PropertyCoOwnerCard;
