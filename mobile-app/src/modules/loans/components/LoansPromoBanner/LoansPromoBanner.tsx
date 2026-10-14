import React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { styles } from "./LoansPromoBanner.styles";

/** Promotional banner; the artwork is composed from icons until a raster illustration is supplied. */
export const LoansPromoBanner: React.FC = () => (
  <LinearGradient
    colors={["#FFFFFF", "#DCEBFF"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.card}
  >
    <View style={styles.textCol}>
      <Text style={styles.title}>Turning Your Plans Into Possibilities</Text>
      <Text style={styles.subtitle}>Business · Home · Vehicle and more</Text>
    </View>
    <View style={styles.art} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Ionicons name="trending-up" size={64} color={BrandColors.PRIMARY_ORANGE} style={styles.chartIcon} />
      <Ionicons name="home" size={44} color={BrandColors.PRIMARY_BLUE} style={styles.homeIcon} />
      <Ionicons name="car-sport" size={44} color={BrandColors.PRIMARY_BLUE_ACCENT} style={styles.carIcon} />
    </View>
  </LinearGradient>
);

export default LoansPromoBanner;
