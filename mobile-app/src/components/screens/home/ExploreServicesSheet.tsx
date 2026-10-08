/**
 * ExploreServicesSheet
 * Bottom-sheet modal that shows the full service catalogue with search.
 * Triggered when the user taps "More Services" on the Home screen.
 */

import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type EdgeInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/app/(main)/home.styles";
import type { CatalogueItem, CatalogueSection, ServiceCategoryId } from "@/types/domain";


interface ExploreServicesSheetProps {
  visible: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  /** Already filtered and grouped catalogue entries */
  filteredCatalogue: CatalogueSection[];
  onSelectItem: (item: CatalogueItem, groupId: ServiceCategoryId) => void;
  colors: ReturnType<typeof useTheme>;
  isDark: boolean;
  insets: EdgeInsets;
}

export function ExploreServicesSheet({
  visible,
  onClose,
  query,
  onQueryChange,
  filteredCatalogue,
  onSelectItem,
  colors,
  isDark,
  insets,
}: ExploreServicesSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + 12,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              Explore Services
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Text style={[styles.sheetDone, { color: colors.orange }]}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View
            style={[
              styles.sheetSearch,
              {
                backgroundColor: colors.backgroundElement,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="search" size={17} color={colors.textSecondary} />
            <TextInput
              value={query}
              onChangeText={onQueryChange}
              placeholder="Search services..."
              placeholderTextColor={colors.textSecondary}
              style={[styles.sheetSearchInput, { color: colors.text }]}
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => onQueryChange("")} hitSlop={8}>
                <Ionicons
                  name="close-circle"
                  size={17}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Catalogue list */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.sheetScrollContent}
          >
            {filteredCatalogue.map((group, groupIndex) => (
              <View key={`${group.id}-${groupIndex}`}>
                <View style={styles.catHeader}>
                  <View
                    style={[
                      styles.catIcon,
                      {
                        backgroundColor: isDark
                          ? colors.backgroundSelected
                          : "#E8EFF7",
                      },
                    ]}
                  >
                    <Ionicons name={group.icon} size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.catTitle, { color: colors.text }]}>
                    {group.title}
                  </Text>
                </View>

                {group.items.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.75}
                    onPress={() => onSelectItem(item, group.id)}
                    style={[
                      styles.serviceRow,
                      {
                        backgroundColor: colors.backgroundElement,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.serviceRowText, { color: colors.text }]}
                    >
                      {item.label}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={17}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {filteredCatalogue.length === 0 && (
              <View style={styles.sheetEmpty}>
                <Ionicons
                  name="search-outline"
                  size={34}
                  color={colors.textSecondary}
                />
                <Text style={[styles.sheetEmptyText, { color: colors.text }]}>
                  No services match "{query.trim()}"
                </Text>
              </View>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
