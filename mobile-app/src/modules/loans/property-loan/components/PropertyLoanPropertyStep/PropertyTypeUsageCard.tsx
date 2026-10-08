import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanPropertyFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanPropertyStep.styles";
import { PropertyDropdownKey } from "./PropertyLocationCard";

export interface PropertyTypeUsageCardProps {
  data: LoanPropertyFormData;
  onChange: (field: keyof LoanPropertyFormData, value: string) => void;
  onOpenPicker: (key: PropertyDropdownKey) => void;
  errors?: Record<string, string>;
}

export const PropertyTypeUsageCard: React.FC<PropertyTypeUsageCardProps> = ({
  data,
  onChange,
  onOpenPicker,
  errors = {},
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="business" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
          </View>
          <Text style={styles.cardTitle}>Property Type & Usage</Text>
        </View>
      </View>

      {/* Property Type Dropdown */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Property Type <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.propertyType) && styles.dropdownSelectorActive,
            Boolean(errors.propertyType) && styles.inputError,
          ]}
          onPress={() => onOpenPicker("propertyType")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.propertyType ? styles.dropdownText : styles.dropdownPlaceholder
            }
          >
            {data.propertyType || "Select property type..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={data.propertyType ? BrandColors.PRIMARY_ORANGE : "#64748B"}
          />
        </TouchableOpacity>
        {Boolean(errors.propertyType) && (
          <Text style={styles.errorText}>{errors.propertyType}</Text>
        )}
      </View>

      {/* Property Sub-Type Dropdown */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Property Sub-Type <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.propertySubType) && styles.dropdownSelectorActive,
            Boolean(errors.propertySubType) && styles.inputError,
          ]}
          onPress={() => onOpenPicker("propertySubType")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.propertySubType
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.propertySubType || "Select property sub-type..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={data.propertySubType ? BrandColors.PRIMARY_ORANGE : "#64748B"}
          />
        </TouchableOpacity>
        {Boolean(errors.propertySubType) && (
          <Text style={styles.errorText}>{errors.propertySubType}</Text>
        )}
      </View>

      {/* Construction Status Dropdown */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Construction Status <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.constructionStatus) && styles.dropdownSelectorActive,
            Boolean(errors.constructionStatus) && styles.inputError,
          ]}
          onPress={() => onOpenPicker("constructionStatus")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.constructionStatus
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.constructionStatus || "Select construction status..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={
              data.constructionStatus ? BrandColors.PRIMARY_ORANGE : "#64748B"
            }
          />
        </TouchableOpacity>
        {Boolean(errors.constructionStatus) && (
          <Text style={styles.errorText}>{errors.constructionStatus}</Text>
        )}
      </View>

      {/* Current Usage Dropdown */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Current Usage <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.currentUsage) && styles.dropdownSelectorActive,
            Boolean(errors.currentUsage) && styles.inputError,
          ]}
          onPress={() => onOpenPicker("currentUsage")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.currentUsage ? styles.dropdownText : styles.dropdownPlaceholder
            }
          >
            {data.currentUsage || "Select current usage..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={data.currentUsage ? BrandColors.PRIMARY_ORANGE : "#64748B"}
          />
        </TouchableOpacity>
        {Boolean(errors.currentUsage) && (
          <Text style={styles.errorText}>{errors.currentUsage}</Text>
        )}
      </View>

      {/* Area Type Dropdown */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Area Type <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.areaType) && styles.dropdownSelectorActive,
            Boolean(errors.areaType) && styles.inputError,
          ]}
          onPress={() => onOpenPicker("areaType")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.areaType ? styles.dropdownText : styles.dropdownPlaceholder
            }
          >
            {data.areaType || "Select area type..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={data.areaType ? BrandColors.PRIMARY_ORANGE : "#64748B"}
          />
        </TouchableOpacity>
        {Boolean(errors.areaType) && (
          <Text style={styles.errorText}>{errors.areaType}</Text>
        )}
      </View>

      {/* Area Input with sq. ft. suffix */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Area <Text style={styles.requiredStar}>*</Text>
        </Text>
        <View
          style={[
            styles.inputWithIcon,
            Boolean(errors.area) && styles.inputError,
          ]}
        >
          <View style={styles.iconBoxLeft}>
            <Ionicons name="resize-outline" size={18} color="#64748B" />
          </View>
          <TextInput
            style={styles.inputFlex}
            placeholder="Enter area"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={data.area}
            onChangeText={(text) => onChange("area", text.replace(/\D/g, ""))}
          />
          <View style={styles.suffixBox}>
            <Text style={styles.suffixText}>sq. ft.</Text>
          </View>
        </View>
        {Boolean(errors.area) && (
          <Text style={styles.errorText}>{errors.area}</Text>
        )}
      </View>

      {/* Property Age Dropdown */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Property Age <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.propertyAge) && styles.dropdownSelectorActive,
            Boolean(errors.propertyAge) && styles.inputError,
          ]}
          onPress={() => onOpenPicker("propertyAge")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.propertyAge ? styles.dropdownText : styles.dropdownPlaceholder
            }
          >
            {data.propertyAge || "Select property age..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={data.propertyAge ? BrandColors.PRIMARY_ORANGE : "#64748B"}
          />
        </TouchableOpacity>
        {Boolean(errors.propertyAge) && (
          <Text style={styles.errorText}>{errors.propertyAge}</Text>
        )}
      </View>

      {/* Approving Authority Dropdown */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Approving Authority <Text style={styles.requiredStar}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdownSelector,
            Boolean(data.approvingAuthority) && styles.dropdownSelectorActive,
            Boolean(errors.approvingAuthority) && styles.inputError,
          ]}
          onPress={() => onOpenPicker("approvingAuthority")}
          activeOpacity={0.8}
        >
          <Text
            style={
              data.approvingAuthority
                ? styles.dropdownText
                : styles.dropdownPlaceholder
            }
          >
            {data.approvingAuthority || "Select approving authority..."}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={
              data.approvingAuthority ? BrandColors.PRIMARY_ORANGE : "#64748B"
            }
          />
        </TouchableOpacity>
        {Boolean(errors.approvingAuthority) && (
          <Text style={styles.errorText}>{errors.approvingAuthority}</Text>
        )}
      </View>
    </View>
  );
};
