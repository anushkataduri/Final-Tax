import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./ItrStepIndicator.styles";

interface ItrStepIndicatorProps {
  currentStep: number; // 0 to 4 (representing steps 1 to 5)
  totalSteps?: number; // 5
  stepTitle: string;
  onBack: () => void;
  onSettings?: () => void;
  onSaveDraft?: () => void;
}

const STEP_LABELS = [
  "Personal & Filing Info",
  "Income Sources",
  "Document Checklist",
  "Tax Summary & Review",
];

export const ItrStepIndicator: React.FC<ItrStepIndicatorProps> = ({
  currentStep,
  totalSteps = 5,
  stepTitle,
  onBack,
  onSettings,
  onSaveDraft,
}) => {
  const displayStepNumber = currentStep + 1;
  const progressPercent = Math.min(100, Math.max(0, (displayStepNumber / totalSteps) * 100));
  const stepLabel = STEP_LABELS[currentStep] || stepTitle;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topRow}>
        {currentStep === totalSteps - 1 ? (
          <View style={styles.rightSpacer} /> // Replaces back button with empty spacer for balance
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.circleBtn}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={20} color="#0B1F3A" />
          </TouchableOpacity>
        )}

        <View style={styles.titleCenter}>
          <Text style={styles.mainTitle}>ITR Filing</Text>
          <Text style={styles.subTitle}>
            Step {displayStepNumber} of {totalSteps} • {stepLabel}
          </Text>
        </View>

        {currentStep === totalSteps - 1 ? (
          onSaveDraft ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onSaveDraft}
              style={{
                height: 34,
                paddingHorizontal: 12,
                borderRadius: 17,
                backgroundColor: "#F8FAFC",
                borderWidth: 1,
                borderColor: "#E2E8F0",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 4
              }}
              accessibilityLabel="Save Draft"
            >
              <Ionicons name="bookmark-outline" size={14} color="#64748B" />
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#64748B" }}>Draft</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.rightSpacer} />
          )
        ) : (
          <View style={styles.rightSpacer} />
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

