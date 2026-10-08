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
  "Regime & Deductions",
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
        {currentStep === 4 ? (
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

        {currentStep === 4 ? (
          onSaveDraft ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onSaveDraft}
              style={styles.circleBtn}
              accessibilityLabel="Save Draft"
            >
              <Ionicons name="save-outline" size={20} color="#64748B" />
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

