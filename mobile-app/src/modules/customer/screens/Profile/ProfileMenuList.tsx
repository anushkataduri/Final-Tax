import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { UseThemeResult } from "@/hooks/use-theme";
import type { IconName } from "@/types/domain";
import type { Href } from "expo-router";
import type { ProfileModalType } from "@/components/screens/profile/ProfileSectionModal";
import { styles } from "./ProfileScreen.styles";

export type RowAction =
  | { kind: "route"; href: Href }
  | { kind: "modal"; modal: "personal" | "kyc" | ProfileModalType }
  | { kind: "soon" };

export interface MenuRow {
  label: string;
  icon: IconName;
  tint: string;
  tintBg: string;
  action: RowAction;
}

export interface MenuSection {
  title: string;
  rows: MenuRow[];
}

interface ProfileMenuListProps {
  colors: UseThemeResult;
  sections: MenuSection[];
  onRunAction: (row: MenuRow) => void;
  onLogout: () => void;
}

export function ProfileMenuList({ colors, sections, onRunAction, onLogout }: ProfileMenuListProps) {
  return (
    <View style={styles.menuArea}>
      {sections.map((section) => (
        <View key={section.title}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            {section.title.toUpperCase()}
          </Text>
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            ]}
          >
            {section.rows.map((row, index) => (
              <TouchableOpacity
                key={row.label}
                activeOpacity={0.75}
                onPress={() => onRunAction(row)}
                style={[
                  styles.row,
                  index > 0 ? [styles.rowBorderTop, { borderTopColor: colors.border }] : null,
                ]}
              >
                <View style={[styles.rowIcon, { backgroundColor: row.tintBg }]}>
                  <Ionicons name={row.icon} size={17} color={row.tint} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>{row.label}</Text>
                <Ionicons name="chevron-forward" size={17} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onLogout}
        style={[
          styles.logoutBtn,
          { borderColor: colors.error, backgroundColor: colors.backgroundElement },
        ]}
      >
        <Ionicons name="log-out-outline" size={19} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
