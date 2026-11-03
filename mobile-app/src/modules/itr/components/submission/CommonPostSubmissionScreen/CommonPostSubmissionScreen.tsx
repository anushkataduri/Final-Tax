import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Circle, Rect } from "react-native-svg";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { FilingProgressTracker } from "../../success/FilingProgressTracker";
import {
  CommonPostSubmissionScreenProps,
  SummaryRowItem,
} from "./postSubmission.types";
import {
  styles,
  getContainerInsetsStyle,
  getScrollContentInsetsStyle,
  getBottomBarInsetsStyle,
} from "./CommonPostSubmissionScreen.styles";

export const CommonPostSubmissionScreen: React.FC<CommonPostSubmissionScreenProps> = ({
  config,
  onTrackStatus,
  onGoHome,
  onDownloadAcknowledgement,
  onBack,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const referenceId = config.referenceId ? String(config.referenceId).trim() : "";
  const isSubmissionConfirmed = Boolean(referenceId && referenceId.length > 0);

  const todayFormatted = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Safe Back Navigation: Never allow back-stepping into submitted wizard
  const handleNavigateHome = useCallback(() => {
    if (onGoHome) {
      onGoHome();
    } else {
      router.replace("/(main)/home" as any);
    }
  }, [onGoHome, router]);

  const handleBackPress = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      handleNavigateHome();
    }
  }, [onBack, handleNavigateHome]);

  const handleTrackStatusPress = () => {
    if (onTrackStatus) {
      onTrackStatus();
      return;
    }
    if (config.primaryCta?.onPress) {
      config.primaryCta.onPress();
      return;
    }
    const target = config.primaryCta?.destination || "/(main)/applications";
    router.replace(target as any);
  };

  const handleDownloadPress = () => {
    if (onDownloadAcknowledgement) {
      onDownloadAcknowledgement();
      return;
    }
    if (config.tertiaryCta?.onPress) {
      config.tertiaryCta.onPress();
      return;
    }
    Alert.alert(
      "Application Receipt Downloaded",
      `TaxEdge Application Receipt for ${referenceId || "your submission"} has been saved to your device.`
    );
  };

  useEffect(() => {
    const backSub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleBackPress();
      return true;
    });
    return () => backSub.remove();
  }, [handleBackPress]);

  // Module-specific Defaults
  const getHeaderTitle = (): string => {
    if (config.headerTitle) return config.headerTitle;
    switch (config.moduleType) {
      case "revised-itr":
        return "Revised ITR";
      case "tds-refund":
        return "TDS Refund";
      case "itr":
      default:
        return "ITR Filing";
    }
  };

  const getCelebrationTitle = (): string => {
    if (config.title) return config.title;
    switch (config.moduleType) {
      case "revised-itr":
        return "Your Revised ITR application has been received.";
      case "tds-refund":
        return "Your TDS Refund claim has been received!";
      case "itr":
      default:
        return "Your application has been received!";
    }
  };

  const getCelebrationSubtitle = (): string => {
    if (config.description) return config.description;
    switch (config.moduleType) {
      case "revised-itr":
        return "Your documents and revised tax information have been received. A Tax Executive will review them before preparing your return.";
      case "tds-refund":
        return "Your TDS refund claim and documents have been received. A Tax Executive will verify your deductions and file the refund claim.";
      case "itr":
      default:
        return "Your documents and tax information have been received. A Tax Executive will review them before preparing your return.";
    }
  };

  // Build Summary Rows functionally based on configuration discriminated union
  const buildSummaryRows = (): SummaryRowItem[] => {
    const rows: SummaryRowItem[] = [];

    switch (config.moduleType) {
      case "revised-itr": {
        const rawAy = config.assessmentYear || "";
        const ay = rawAy ? (rawAy.startsWith("AY") ? rawAy : `AY ${rawAy}`) : "Current AY";
        rows.push({ label: "Assessment Year", value: ay });
        rows.push({ label: "Return Form", value: config.formType || "Revised ITR" });
        rows.push({ label: "Filing Purpose", value: config.incomeType || "Revised Return Filing" });
        if (config.revisionReason) {
          rows.push({ label: "Revision Reason", value: config.revisionReason });
        }
        if (config.originalAckNumber) {
          rows.push({ label: "Original Ack No.", value: config.originalAckNumber });
        }
        const upCount = config.uploadedDocsCount ?? 0;
        const totCount = config.totalDocsCount ?? 0;
        rows.push({ label: "Documents", value: `${upCount} of ${totCount} received` });
        rows.push({ label: "Submission Date", value: config.submissionDate || todayFormatted });
        rows.push({ label: "Status", value: config.status || "Received" });
        break;
      }
      case "tds-refund": {
        const rawAy = config.assessmentYear || "";
        const ay = rawAy ? (rawAy.startsWith("AY") ? rawAy : `AY ${rawAy}`) : "Current AY";
        rows.push({ label: "Service", value: config.serviceName || "TDS Refund" });
        rows.push({ label: "Assessment Year", value: ay });
        if (config.estimatedRefund !== undefined) {
          const formattedRefund = String(config.estimatedRefund).startsWith("₹")
            ? String(config.estimatedRefund)
            : `₹${config.estimatedRefund}`;
          rows.push({ label: "Estimated Refund", value: formattedRefund });
        }
        rows.push({ label: "Refund Bank", value: config.refundBank || "Verified Primary Bank" });
        const upCount = config.uploadedDocsCount ?? 0;
        const totCount = config.totalDocsCount ?? 0;
        if (Number(totCount) > 0) {
          rows.push({ label: "Documents", value: `${upCount} of ${totCount} received` });
        }
        rows.push({ label: "Applied Date", value: config.submissionDate || todayFormatted });
        rows.push({ label: "Status", value: config.status || "Under Verification" });
        break;
      }
      case "itr":
      default: {
        const rawAy = config.assessmentYear || "";
        const ay = rawAy ? (rawAy.startsWith("AY") ? rawAy : `AY ${rawAy}`) : "Current AY";
        rows.push({ label: "Assessment Year", value: ay });
        rows.push({ label: "Return Form", value: config.formType || "ITR Form" });
        rows.push({ label: "Income Sources", value: config.incomeType || "Declared Income" });
        rows.push({ label: "Tax Regime", value: config.taxRegime || "New Tax Regime" });
        const upCount = config.uploadedDocsCount ?? 0;
        const totCount = config.totalDocsCount ?? 0;
        rows.push({ label: "Documents", value: `${upCount} of ${totCount} received` });
        rows.push({ label: "Refund Bank", value: config.refundBank || "Verified Primary Bank" });
        rows.push({ label: "Submission Date", value: config.submissionDate || todayFormatted });
        rows.push({ label: "Status", value: config.status || "Received" });
        break;
      }
    }

    return rows;
  };

  const summaryRows = buildSummaryRows();
  const defaultNextSteps = [
    "A Tax Executive will verify your documents against Income Tax Department records.",
    "You will receive an in-app and SMS notification at each stage of verification.",
    "You can track the live progress in your Applications tab at any time.",
  ];
  const nextSteps = config.nextSteps && config.nextSteps.length > 0 ? config.nextSteps : defaultNextSteps;

  const hasTertiaryCta = Boolean(config.tertiaryCta !== null);

  return (
    <View style={[styles.container, getContainerInsetsStyle(insets.top)]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBackPress}
          style={styles.backButton}
          testID="post-submission-back-button"
        >
          <Ionicons name="chevron-back" size={20} color="#0B1F3A" />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
          <Text style={styles.headerSubtitle}>
            {config.headerSubtitle || "Application Received"}
          </Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          getScrollContentInsetsStyle(insets.bottom, hasTertiaryCta),
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Guard against unconfirmed submissions */}
        {!isSubmissionConfirmed ? (
          <View style={styles.unconfirmedCard} testID="unconfirmed-submission-warning">
            <Ionicons name="alert-circle-outline" size={32} color="#DC2626" />
            <Text style={styles.unconfirmedTitle}>Submission Not Confirmed</Text>
            <Text style={styles.unconfirmedDescription}>
              We could not find a confirmed application reference ID. If you just submitted your
              return, please check your applications list or contact support.
            </Text>
          </View>
        ) : (
          /* Celebration Card */
          <View style={styles.celebrationCard}>
            <View style={styles.badgeWrapper}>
              <Svg width={140} height={90} viewBox="0 0 140 90" style={styles.confettiSvg}>
                <Rect x={20} y={15} width={4} height={4} rx={1} fill="#F97316" transform="rotate(25, 20, 15)" />
                <Circle cx={35} cy={30} r={2} fill="#0B1F3A" />
                <Rect x={15} y={45} width={5} height={3} rx={1} fill="#16A34A" transform="rotate(-15, 15, 45)" />
                <Circle cx={30} cy={65} r={2.5} fill="#F97316" />
                <Rect x={115} y={15} width={4} height={4} rx={1} fill="#0B1F3A" transform="rotate(-30, 115, 15)" />
                <Circle cx={105} cy={32} r={2} fill="#16A34A" />
                <Rect x={120} y={45} width={5} height={3} rx={1} fill="#F97316" transform="rotate(20, 120, 45)" />
                <Circle cx={110} cy={65} r={2.5} fill="#0B1F3A" />
              </Svg>

              <View style={styles.successOuterCircle}>
                <View style={styles.successInnerCircle}>
                  <Ionicons name="checkmark" size={30} color="#FFFFFF" />
                </View>
              </View>
            </View>

            <Text style={styles.celebrationTitle}>{getCelebrationTitle()}</Text>
            <Text style={styles.celebrationSubtitle}>{getCelebrationSubtitle()}</Text>

            <View style={styles.referenceIdCard}>
              <Text style={styles.referenceIdLabel}>Application ID</Text>
              <Text style={styles.referenceIdValue} numberOfLines={1} ellipsizeMode="tail">
                {referenceId}
              </Text>
            </View>
          </View>
        )}

        {/* 6-Stage Progress Tracker */}
        <FilingProgressTracker isRevised={config.moduleType === "revised-itr"} />

        {/* What We Have Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="document-text" size={16} color="#F97316" />
            </View>
            <Text style={styles.cardTitle}>What we have</Text>
          </View>

          {summaryRows.map((row, idx) => {
            const isLast = idx === summaryRows.length - 1;
            return (
              <View
                key={`${row.label}-${idx}`}
                style={[styles.summaryRow, isLast && styles.summaryRowNoBorder]}
              >
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue} numberOfLines={2}>
                  {row.value}
                </Text>
              </View>
            );
          })}
        </View>

        {/* What Happens Next Card */}
        <View style={styles.nextStepsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="notifications-outline" size={16} color="#0B1F3A" />
            </View>
            <Text style={styles.cardTitle}>What happens next</Text>
          </View>

          {nextSteps.map((step, idx) => (
            <View key={`step-${idx}`} style={styles.nextStepItem}>
              <View style={styles.nextStepDot} />
              <Text style={styles.nextStepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={[styles.bottomBar, getBottomBarInsetsStyle(insets.bottom)]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleTrackStatusPress}
          style={styles.primaryButton}
          testID="post-submission-primary-cta"
        >
          <Text style={styles.primaryButtonText}>
            {config.primaryCta?.label || "Track My Application"}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNavigateHome}
          style={styles.secondaryButton}
          testID="post-submission-secondary-cta"
        >
          <Ionicons name="home-outline" size={18} color="#0B1F3A" />
          <Text style={styles.secondaryButtonText}>
            {config.secondaryCta?.label || "Go Home"}
          </Text>
        </TouchableOpacity>

        {hasTertiaryCta && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleDownloadPress}
            style={styles.tertiaryButton}
            testID="post-submission-tertiary-cta"
          >
            <Ionicons name="download-outline" size={18} color="#F97316" />
            <Text style={styles.tertiaryButtonText}>
              {config.tertiaryCta?.label || "Download TaxEdge Application Receipt"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CommonPostSubmissionScreen;
