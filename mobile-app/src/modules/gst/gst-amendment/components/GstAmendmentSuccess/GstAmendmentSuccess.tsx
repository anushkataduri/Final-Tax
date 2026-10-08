import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  styles,
  getSuccessHeroStyle,
  getSuccessActionsWrapStyle,
} from "./GstAmendmentSuccess.styles";
import { SubmissionResult } from "../../types/gstAmendmentTypes";

interface GstAmendmentSuccessProps {
  submissionResult: SubmissionResult;
  insets: { top: number; bottom: number };
  onTrack: () => void;
  onOpenApplications: () => void;
}

export const GstAmendmentSuccess: React.FC<GstAmendmentSuccessProps> = ({
  submissionResult,
  insets,
  onTrack,
  onOpenApplications,
}) => {
  return (
    <View style={styles.successContainer}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.PRIMARY_BLUE} />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.modalScrollView}
        contentContainerStyle={styles.modalScrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Banner with curved bottom */}
        <View style={[styles.successHero, getSuccessHeroStyle(insets.top)]}>
          <View style={styles.successHeroIconBox}>
            <View style={styles.successHeroCheckCircle}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.successHeroTitle}>Amendment Submitted</Text>
        </View>

        {/* Details Card */}
        <View style={styles.successCard}>
          <View style={styles.successRow}>
            <Text style={styles.successRowKey}>Application Type</Text>
            <Text style={styles.successRowVal}>GST Amendment</Text>
          </View>
          <View style={styles.successDivider} />

          <View style={styles.successRow}>
            <Text style={styles.successRowKey}>Field Amended</Text>
            <Text style={styles.successRowVal}>{submissionResult.sectionTitle}</Text>
          </View>
          <View style={styles.successDivider} />

          <View style={styles.successRow}>
            <Text style={styles.successRowKey}>GSTIN</Text>
            <Text style={styles.successRowVal}>{submissionResult.gstin}</Text>
          </View>
          <View style={styles.successDivider} />

          <View style={styles.successRow}>
            <Text style={styles.successRowKey}>ARN</Text>
            <Text style={styles.successRowVal}>{submissionResult.arn}</Text>
          </View>
          <View style={styles.successDivider} />

          <View style={styles.successRow}>
            <Text style={styles.successRowKey}>Submission Date</Text>
            <Text style={styles.successRowVal}>{submissionResult.date}</Text>
          </View>
          <View style={styles.successDivider} />

          <View style={styles.successRow}>
            <Text style={styles.successRowKey}>Estimated Completion</Text>
            <Text style={styles.successRowVal}>{submissionResult.estCompletion}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={[styles.successActionsWrap, getSuccessActionsWrapStyle(insets.bottom)]}>
          <TouchableOpacity
            style={styles.successTrackBtn}
            activeOpacity={0.8}
            onPress={onTrack}
          >
            <Text style={styles.successTrackBtnText}>Track Application Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.successHomeBtn}
            activeOpacity={0.8}
            onPress={onOpenApplications}
          >
            <Text style={styles.successHomeBtnText}>Go to My Applications</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
