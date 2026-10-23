import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getSupportedAssessmentYears } from "../../../../taxRules";
import { ItrPersonalInfo } from "../../../types/itrFiling.types";
import { styles } from "../Step1PersonalInfo.styles";

interface Props {
  assessmentYear: string;
  onUpdate: (info: Partial<ItrPersonalInfo>) => void;
  showCustomAy: boolean;
}

export const Step1AssessmentYearPicker: React.FC<Props> = ({
  assessmentYear,
  onUpdate,
  showCustomAy,
}) => {
  const supportedAYs = getSupportedAssessmentYears();

  const localAYs = [...supportedAYs];
  if (assessmentYear && !localAYs.find((a) => a.id === assessmentYear)) {
    const parts = assessmentYear.split("-");
    const yr = parseInt(parts[0], 10);
    if (!isNaN(yr)) {
      localAYs.push({
        id: assessmentYear,
        label: `AY ${assessmentYear}`,
        sub: `FY ${yr - 1}-${String(yr).slice(-2)} (Custom)`,
        financialYear: `${yr - 1}-${yr}`,
        isCurrent: false,
      });
    }
  }

  const displayAYs = localAYs
    .sort((a, b) => a.id.localeCompare(b.id))
    .filter((ay) => !ay.sub.includes("Advance") || showCustomAy);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons name="calendar-outline" size={18} color="#083B75" />
          <Text style={styles.cardTitle}>Assessment Year (AY)</Text>
        </View>
      </View>

      <Text style={styles.cardDescription}>
        Select the assessment year for which you are filing this income tax return.
      </Text>

      <View style={styles.pickerRow}>
        {displayAYs.map((ay) => {
          const isSelected = assessmentYear === ay.id;
          return (
            <TouchableOpacity
              key={ay.id}
              activeOpacity={0.8}
              style={[styles.pickerPill, isSelected && styles.pickerPillSelected, { position: "relative" }]}
              onPress={() => onUpdate({ assessmentYear: ay.id })}
            >
              <Text style={[styles.pickerPillText, isSelected && styles.pickerPillTextSelected]}>
                {ay.label}
              </Text>
              <Text style={[styles.pickerPillSubText, isSelected && styles.pickerPillSubTextSelected]}>
                FY {ay.financialYear}
              </Text>

              {ay.sub.includes("Custom") && (
                <TouchableOpacity
                  style={{ position: "absolute", top: -6, right: -6, backgroundColor: "#DC2626", borderRadius: 10, width: 20, height: 20, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#FFF" }}
                  onPress={(e) => {
                    e.stopPropagation();
                    onUpdate({ assessmentYear: supportedAYs[0].id });
                  }}
                >
                  <Ionicons name="close" size={14} color="white" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
