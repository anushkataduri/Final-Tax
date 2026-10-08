import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CATEGORY_DEFINITIONS } from "../../store/documentVaultStore";
import { styles } from "./CategoryHeaderTabs.styles";

interface CategoryHeaderTabsProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryHeaderTabs: React.FC<CategoryHeaderTabsProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORY_DEFINITIONS.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.75}
              onPress={() => onSelectCategory(cat.id)}
              style={[
                styles.tabPill,
                isSelected ? styles.tabPillActive : styles.tabPillInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isSelected ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryHeaderTabs;
