import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./RevisedItrHeader.styles";

interface RevisedItrHeaderProps {
  subtitle: string;
  onBack?: () => void;
  hideBackButton?: boolean;
  onSaveDraft?: () => void;
  showDraftIcon?: boolean;
}

export const RevisedItrHeader: React.FC<RevisedItrHeaderProps> = ({
  subtitle,
  onBack,
  hideBackButton = false,
  onSaveDraft,
  showDraftIcon = false,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  };

  return (
    <View style={styles.header}>
      {!hideBackButton ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color="#0B1F3A" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 38, height: 38 }} />
      )}

      <View style={styles.titleGroup}>
        <Text style={styles.title}>Revised ITR</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {showDraftIcon ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSaveDraft}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: "#F8FAFC",
            borderWidth: 1,
            borderColor: "#E2E8F0",
            justifyContent: "center",
            alignItems: "center",
          }}
          accessibilityLabel="Save Draft"
        >
          <Ionicons name="save-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 38, height: 38 }} />
      )}
    </View>
  );
};
