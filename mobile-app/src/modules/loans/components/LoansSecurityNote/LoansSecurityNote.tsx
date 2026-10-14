import React from "react";
import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { styles } from "./LoansSecurityNote.styles";

export const LoansSecurityNote: React.FC = () => (
  <View style={styles.container} accessible>
    <Ionicons name="shield-checkmark" size={36} color={BrandColors.PRIMARY_BLUE_ACCENT} />
    <View style={styles.textCol}>
      <Text style={styles.title}>Your information is safe &amp; secure</Text>
      <Text style={styles.body}>
        We follow strict data protection and privacy standards for loan processing.
      </Text>
    </View>
  </View>
);

export default LoansSecurityNote;
