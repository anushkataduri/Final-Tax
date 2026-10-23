import React from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { UseThemeResult } from "@/hooks/use-theme";
import type { Customer } from "@/types/domain";
import { styles, getKycPillStyle } from "./ProfileScreen.styles";

interface PersonalData {
  name?: string;
  custId?: string;
  customerId?: string;
  customerType?: string;
}

interface ProfileHeroSectionProps {
  colors: UseThemeResult;
  customer: Customer | null;
  pickingPhoto: boolean;
  isProfileComplete: boolean;
  personalDetails: PersonalData | null;
  kycVerified: boolean;
  onChangePhoto: () => void;
}

export function ProfileHeroSection({
  colors,
  customer,
  pickingPhoto,
  isProfileComplete,
  personalDetails,
  kycVerified,
  onChangePhoto,
}: ProfileHeroSectionProps) {
  const displayName = isProfileComplete
    ? (personalDetails?.name || customer?.name || "Customer Profile")
    : "Welcome to TaxEdge";

  const displayId = isProfileComplete
    ? `Customer ID: ${personalDetails?.custId || personalDetails?.customerId || customer?.customerId || "N/A"}`
    : "Profile setup pending";

  const displayType = isProfileComplete
    ? (personalDetails?.customerType || customer?.customerType || "Individual")
    : "Profile Incomplete";

  const kycStyle = getKycPillStyle(kycVerified, colors);

  return (
    <View style={[styles.hero, { backgroundColor: colors.primaryDark }]}>
      <TouchableOpacity activeOpacity={0.85} onPress={onChangePhoto} style={styles.avatarWrap}>
        <View style={styles.avatarBg}>
          {customer?.avatarUri ? (
            <Image source={{ uri: customer.avatarUri }} style={styles.avatarImage} resizeMode="cover" />
          ) : (
            <Ionicons name="person" size={38} color="#FFFFFF" />
          )}
          {pickingPhoto && (
            <View style={styles.avatarLoading}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={[styles.editBadge, { backgroundColor: colors.orange }]}>
          <Ionicons name="pencil" size={12} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <Text style={styles.heroName}>{displayName}</Text>
      <Text style={styles.heroId}>{displayId}</Text>

      <View style={styles.pillRow}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{displayType}</Text>
        </View>
        <View style={[styles.pill, styles.pillOutline, { borderColor: kycStyle.borderColor }]}>
          <Text style={[styles.pillText, { color: kycStyle.color }]}>
            {kycVerified ? "KYC Verified ✓" : "KYC Pending"}
          </Text>
        </View>
      </View>
    </View>
  );
}
