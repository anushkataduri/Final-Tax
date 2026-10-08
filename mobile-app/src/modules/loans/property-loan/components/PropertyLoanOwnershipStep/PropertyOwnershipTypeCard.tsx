import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { styles } from "./PropertyLoanOwnershipStep.styles";

export interface PropertyOwnershipTypeCardProps {
  ownershipType: string;
  onSelectOwnershipType: (type: "Sole Ownership" | "Joint Ownership") => void;
  error?: string;
}

export const PropertyOwnershipTypeCard: React.FC<PropertyOwnershipTypeCardProps> = ({
  ownershipType,
  onSelectOwnershipType,
  error,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="key" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
          </View>
          <Text style={styles.cardTitle}>Ownership Details</Text>
        </View>
      </View>

      {/* Ownership Type Selection Cards */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Ownership Type <Text style={styles.requiredStar}>*</Text>
        </Text>
        <View style={styles.radioRow}>
          {/* Sole Ownership */}
          <TouchableOpacity
            style={[
              styles.radioCard,
              ownershipType === "Sole Ownership"
                ? styles.radioCardSelected
                : null,
              error ? styles.inputError : null,
            ]}
            onPress={() => onSelectOwnershipType("Sole Ownership")}
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                ownershipType === "Sole Ownership"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={20}
              color={
                ownershipType === "Sole Ownership"
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
            <Text style={styles.radioText}>Sole Ownership</Text>
          </TouchableOpacity>

          {/* Joint Ownership */}
          <TouchableOpacity
            style={[
              styles.radioCard,
              ownershipType === "Joint Ownership"
                ? styles.radioCardSelected
                : null,
              error ? styles.inputError : null,
            ]}
            onPress={() => onSelectOwnershipType("Joint Ownership")}
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                ownershipType === "Joint Ownership"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={20}
              color={
                ownershipType === "Joint Ownership"
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
            <Text style={styles.radioText}>Joint Ownership</Text>
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </View>
  );
};

export default PropertyOwnershipTypeCard;
