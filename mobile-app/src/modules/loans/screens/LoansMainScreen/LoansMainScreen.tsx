import React, { useCallback } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoanCategoryCard } from "../../components/LoanCategoryCard";
import { LoansHeader } from "../../components/LoansHeader";
import { LOAN_CATEGORIES } from "../../constants/loanCategories";
import type { LoanCategory } from "../../types/loanCategory.types";
import { styles } from "./LoansMainScreen.styles";

export const LoansMainScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCategoryPress = useCallback((category: LoanCategory) => {
    // Individual loan flows will be built in later screens; no route exists yet.
    Alert.alert(category.title, "This loan application is coming soon.");
  }, []);

  return (
    <View style={styles.container}>
      <LoansHeader onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardList}>
          {LOAN_CATEGORIES.map((category) => (
            <LoanCategoryCard
              key={category.id}
              category={category}
              onPress={handleCategoryPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default LoansMainScreen;
