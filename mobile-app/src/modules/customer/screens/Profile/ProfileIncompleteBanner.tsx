import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { UseThemeResult } from "@/hooks/use-theme";
import { styles } from "./ProfileScreen.styles";

interface ProfileIncompleteBannerProps {
  colors: UseThemeResult;
  onCompleteProfile: () => void;
}

export function ProfileIncompleteBanner({ colors, onCompleteProfile }: ProfileIncompleteBannerProps) {
  return (
    <View
      style={[
        styles.completeProfileBanner,
        { backgroundColor: colors.backgroundElement, borderColor: colors.orange },
      ]}
    >
      <View style={styles.bannerHeader}>
        <View style={[styles.bannerIconCircle, { backgroundColor: "#FEF0E6" }]}>
          <Ionicons name="person-add" size={20} color={colors.orange} />
        </View>
        <View style={styles.bannerHeaderText}>
          <Text style={[styles.bannerTitle, { color: colors.text }]}>
            Complete Your Profile
          </Text>
          <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
            Set up your personal and KYC details to unlock loans, GST, ITR, and financial services.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.bannerBtn, { backgroundColor: colors.orange }]}
        activeOpacity={0.85}
        onPress={onCompleteProfile}
      >
        <Text style={styles.bannerBtnText}>Complete Profile Now</Text>
        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
