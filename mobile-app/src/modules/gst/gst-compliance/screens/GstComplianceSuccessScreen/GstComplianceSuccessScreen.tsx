import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  BackHandler,
  Platform,
  Clipboard,
} from "react-native";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/shared/hooks/useTheme";
import { BrandColors } from "@/shared/theme";
import { logger } from "@/core/logging/logger";
import {
  styles,
  getRootThemeStyle,
  getTitleThemeStyle,
  getSubtitleThemeStyle,
  getRefCardThemeStyle,
  getRefLabelThemeStyle,
  getRefValueThemeStyle,
  getCopyBtnThemeStyle,
  getDividerThemeStyle,
  getMetaLabelThemeStyle,
  getMetaValueThemeStyle,
  getNextStepsCardThemeStyle,
  getStepTextThemeStyle,
  getBottomBarThemeStyle,
  getSecondaryBtnThemeStyle,
} from "@/modules/gst/gst-compliance/screens/GstComplianceSuccessScreen/GstComplianceSuccessScreen.styles";

export function GstComplianceSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const params = useLocalSearchParams<{
    referenceId?: string;
    requestType?: string;
    gstin?: string;
    submittedAt?: string;
    estimatedResponse?: string;
  }>();

  const refId = params.referenceId || "GSTC-2026-000123";
  const requestType = params.requestType || "Compliance Request";
  const gstin = params.gstin || "29AAAAA0000A1Z5";
  const submittedAt = params.submittedAt || "09 Sep 2026";
  const estimatedResponse = params.estimatedResponse || "Within 24 Hours";

  // Animations
  const [scaleAnim] = useState(() => new Animated.Value(0.5));
  const [opacityAnim] = useState(() => new Animated.Value(0));
  const [cardSlideAnim] = useState(() => new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim, cardSlideAnim]);

  const handleGoDashboard = useCallback(() => {
    router.replace("/(main)/home");
  }, [router]);

  const handleTrackRequest = useCallback(() => {
    router.replace("/(main)/applications");
  }, [router]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleGoDashboard();
      return true;
    });
    return () => sub.remove();
  }, [handleGoDashboard]);

  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyRef = useCallback(async () => {
    let success = false;

    // 1. Web modern navigator.clipboard
    if (Platform.OS === "web") {
      try {
        if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(refId);
          success = true;
        }
      } catch (err) {
        logger.debug("[GstComplianceSuccessScreen] Web navigator.clipboard error", { error: err });
      }
    }

    // 2. React Native / React Native Web Clipboard API
    if (!success) {
      try {
        if (Clipboard && typeof Clipboard.setString === "function") {
          Clipboard.setString(refId);
          success = true;
        }
      } catch (err) {
        logger.debug("[GstComplianceSuccessScreen] Clipboard.setString error", { error: err });
      }
    }

    if (success) {
      setIsCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    } else {
      Alert.alert(
        "Copy Unavailable",
        `Unable to copy to clipboard on this device. Your Reference ID is ${refId}. Please note it down.`
      );
    }
  }, [refId]);

  const paddingTop = Math.max(insets.top, 20);
  const paddingBottom = Math.max(insets.bottom, 20);

  return (
    <View style={[styles.root, getRootThemeStyle(isDark, paddingTop, paddingBottom)]}>
      <FocusAwareStatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Checkmark Circle */}
        <Animated.View
          style={[
            styles.checkCircleWrap,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.outerGlow}>
            <View style={styles.middleCircle}>
              <View style={styles.innerCheckCircle}>
                <Ionicons name="checkmark" size={44} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Title & Subtitle */}
        <Animated.View
          style={[
            styles.headerCol,
            {
              transform: [{ translateY: cardSlideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={[styles.successTitle, getTitleThemeStyle(isDark)]}>
            Request Submitted Successfully
          </Text>

          <Text style={[styles.successSubtitle, getSubtitleThemeStyle(isDark)]}>
            Your GST Compliance request has been submitted successfully.
            Our CA team will review your documents and contact you shortly.
          </Text>
        </Animated.View>

        {/* Reference ID Card */}
        <Animated.View
          style={[
            styles.refCard,
            getRefCardThemeStyle(isDark),
            {
              transform: [{ translateY: cardSlideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.refRow}>
            <View style={styles.refTextCol}>
              <Text style={[styles.refLabel, getRefLabelThemeStyle(isDark)]}>
                Reference ID
              </Text>
              <Text
                style={[
                  styles.refValue,
                  getRefValueThemeStyle(),
                  refId.length > 20 && styles.refValueLong,
                ]}
                selectable={true}
                accessibilityRole="text"
                accessibilityLabel={`Reference ID: ${refId}`}
              >
                {refId}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCopyRef}
              style={[styles.copyButton, getCopyBtnThemeStyle(isDark, isCopied)]}
              accessibilityRole="button"
              accessibilityLabel={isCopied ? "Reference ID copied" : "Copy Reference ID"}
              accessibilityHint="Copies the submission reference ID to your clipboard"
            >
              <Ionicons
                name={isCopied ? "checkmark-circle-outline" : "copy-outline"}
                size={16}
                color={
                  isCopied
                    ? isDark
                      ? "#4ADE80"
                      : "#16A34A"
                    : BrandColors.PRIMARY_BLUE_ACCENT
                }
              />
              <Text
                style={[
                  styles.copyText,
                  {
                    color: isCopied
                      ? isDark
                        ? "#4ADE80"
                        : "#16A34A"
                      : BrandColors.PRIMARY_BLUE_ACCENT,
                  },
                ]}
              >
                {isCopied ? "Copied!" : "Copy"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, getDividerThemeStyle(isDark)]} />

          {/* Key Details Grid */}
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={[styles.metaLabel, getMetaLabelThemeStyle(isDark)]}>
                Submitted On
              </Text>
              <Text style={[styles.metaValue, getMetaValueThemeStyle(isDark, false)]}>
                {submittedAt}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={[styles.metaLabel, getMetaLabelThemeStyle(isDark)]}>
                Estimated Response
              </Text>
              <Text style={[styles.metaValue, getMetaValueThemeStyle(isDark, true)]}>
                {estimatedResponse}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, getDividerThemeStyle(isDark)]} />

          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={[styles.metaLabel, getMetaLabelThemeStyle(isDark)]}>
                Request Type
              </Text>
              <Text style={[styles.metaValue, getMetaValueThemeStyle(isDark, false)]}>
                {requestType}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={[styles.metaLabel, getMetaLabelThemeStyle(isDark)]}>
                GSTIN
              </Text>
              <Text style={[styles.metaValue, getMetaValueThemeStyle(isDark, false)]}>
                {gstin}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* What Happens Next Card */}
        <Animated.View
          style={[
            styles.nextStepsCard,
            getNextStepsCardThemeStyle(isDark),
            {
              transform: [{ translateY: cardSlideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={[styles.nextStepsTitle, getTitleThemeStyle(isDark)]}>
            What happens next?
          </Text>

          <View style={styles.stepItem}>
            <View style={styles.stepDot} />
            <Text style={[styles.stepText, getStepTextThemeStyle(isDark)]}>
              A certified Chartered Accountant will review your uploaded registers and notice details.
            </Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepDot} />
            <Text style={[styles.stepText, getStepTextThemeStyle(isDark)]}>
              You will receive an update in your TaxEdge Notifications and WhatsApp within 24 hours.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.bottomBar, getBottomBarThemeStyle(isDark, paddingBottom)]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleTrackRequest}
          style={styles.primaryBtn}
        >
          <Ionicons name="compass-outline" size={18} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>Track Request</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleGoDashboard}
          style={[styles.secondaryBtn, getSecondaryBtnThemeStyle(isDark)]}
        >
          <Ionicons
            name="home-outline"
            size={18}
            color={isDark ? "#F8FAFC" : "#0F172A"}
          />
          <Text style={[styles.secondaryBtnText, getTitleThemeStyle(isDark)]}>
            Go to Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default GstComplianceSuccessScreen;
