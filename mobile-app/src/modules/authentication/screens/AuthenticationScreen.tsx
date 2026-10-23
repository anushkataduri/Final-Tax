import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Reanimated from "react-native-reanimated";
import { useTheme } from "../../../hooks/use-theme";
import { Spacing, BrandColors } from "../../../shared/theme";
import { useAuthStore } from "../store/authStore";
import { logger } from "@/core/logging/logger";
import {
  MobileNumberSection,
  PasscodeLoginSection,
  ErrorBanner,
  BiometricReauthCard,
  AuthFlowSections,
  AuthBrandHeader,
  ServerConfigHint,
} from "../components";
import { useReauthSlideAnimation } from "../hooks/useReauthSlideAnimation";
import { useAuthFlowTransition } from "../hooks/useAuthFlowTransition";
import { useAuthHandlers } from "../hooks/useAuthHandlers";
import { BiometricPromptModal } from "../../../shared/components/BiometricPromptModal";
import { ServerConfigModal } from "../../../shared/components/ServerConfigModal";
import {
  styles,
  reauthStyles,
  getThemedStyles,
  getDynamicScrollStyle,
} from "./AuthenticationScreen.styles";

const HEADER_OFFSET = Spacing.md;
const FOOTER_OFFSET = Spacing.base;
const MIN_SCROLL_PADDING = Spacing.xl + Spacing.xs;

export function AuthenticationScreen() {
  const colors = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    isLoggedIn,
    authFlowState,
    mobileNumber,
    passcode,
    isLoading,
    error,
    otpTimer,
    passcodeLockoutUntil,
    refreshPasscodeLockout,
    resetLoginPresentation,
    setMobileNumber,
    setPasscode,
    setError,
    decrementTimer,
    sendOtp,
    verifyOtp,
    loginWithPasscode,
    startForgotPasscode,
    verifyForgotPasscodeOtp,
    resetPasscodeAndProceed,
    changeNumber,
    setAuthFlowState,
    isBiometricEnabled,
    syncFromDevAuth,
  } = useAuthStore();

  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricType, setBiometricType] = useState("Fingerprint");
  const [showServerModal, setShowServerModal] = useState(false);

  const {
    passcodeVisible,
    biometricDismissed,
    passcodeAutoFocus,
    setPasscodeAutoFocus,
    biometricAnimStyle,
    passcodeAnimStyle,
    resetToBiometric,
    slideToPasscode: slideToBiometricDismissed,
  } = useReauthSlideAnimation();
  const reauthScrollRef = useRef<ScrollView>(null);

  const hasBioTriggered = useRef(false);
  const hasNavigated = useRef(false);

  const {
    handleBiometricReauth,
    handlePasscodeFromReauth,
    handleMobileSubmit,
    handleOtpVerify,
    handleLoginSubmit,
    handleEnableBiometric,
    handleNotNowBiometric,
    handleBiometricLogin,
    handleForgotPasscode,
    handleForgotPasscodeOtpVerify,
    handleResetPasscodeSubmit,
    handleBiometricRetry,
    handleReauthBiometricFallback,
  } = useAuthHandlers({
    router,
    mobileNumber,
    setPasscode,
    loginWithPasscode,
    sendOtp,
    verifyOtp,
    setAuthFlowState,
    setError,
    resetLoginPresentation,
    syncFromDevAuth,
    startForgotPasscode,
    verifyForgotPasscodeOtp,
    resetPasscodeAndProceed,
    slideToBiometricDismissed,
    resetToBiometric,
    setPasscodeAutoFocus,
    setBiometricType,
    setShowBiometricModal,
    hasBioTriggered,
    hasNavigated,
  });

  useEffect(() => {
    if (authFlowState === "BIOMETRIC_REAUTH") {
      hasBioTriggered.current = false;
      hasNavigated.current = false;
      resetToBiometric();
    }
  }, [authFlowState, hasBioTriggered, hasNavigated, resetToBiometric]);

  useEffect(() => {
    if (!passcodeVisible) return;
    const timer = setTimeout(() => {
      reauthScrollRef.current?.scrollToEnd({ animated: true });
    }, 500);
    return () => clearTimeout(timer);
  }, [passcodeVisible, reauthScrollRef]);

  useFocusEffect(
    useCallback(() => {
      if (authFlowState !== "BIOMETRIC_REAUTH" || hasBioTriggered.current) return undefined;
      const timer = setTimeout(() => {
        if (hasBioTriggered.current) return;
        hasBioTriggered.current = true;
        handleBiometricReauth();
      }, 2900);
      return () => clearTimeout(timer);
    }, [authFlowState, hasBioTriggered, handleBiometricReauth])
  );

  useEffect(() => {
    if ((authFlowState === "PASSCODE_LOGIN" || authFlowState === "BIOMETRIC_REAUTH") && mobileNumber) {
      refreshPasscodeLockout().catch((err) => {
        logger.debug("[AuthenticationScreen] Passcode lockout refresh failed", { error: err });
      });
    }
  }, [authFlowState, mobileNumber, refreshPasscodeLockout]);

  useEffect(() => {
    if (
      isLoggedIn &&
      !showBiometricModal &&
      authFlowState !== "PASSCODE_LOGIN" &&
      authFlowState !== "BIOMETRIC_REAUTH" &&
      authFlowState !== "RESET_PASSCODE" &&
      authFlowState !== "FORGOT_PASSCODE_OTP"
    ) {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.replace("/(main)/home");
      }
    }
  }, [isLoggedIn, showBiometricModal, authFlowState, hasNavigated, router]);

  const { fadeAnim, slideAnim } = useAuthFlowTransition({ authFlowState, otpTimer, decrementTimer });

  const themed = getThemedStyles(colors, isDark, insets.top, HEADER_OFFSET, MIN_SCROLL_PADDING);
  const dynamicScroll = getDynamicScrollStyle(insets.top, insets.bottom, HEADER_OFFSET, FOOTER_OFFSET, MIN_SCROLL_PADDING);

  const screenModals = (
    <>
      <BiometricPromptModal
        visible={showBiometricModal}
        biometricType={biometricType}
        onEnable={handleEnableBiometric}
        onNotNow={handleNotNowBiometric}
      />
      <ServerConfigModal visible={showServerModal} onClose={() => setShowServerModal(false)} />
    </>
  );

  if (authFlowState === "BIOMETRIC_REAUTH") {
    return (
      <KeyboardAvoidingView
        style={[styles.container, themed.container, { flex: 1 }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        <FocusAwareStatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ScrollView
          ref={reauthScrollRef}
          contentContainerStyle={[styles.scroll, dynamicScroll]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.wrapper}>
            <AuthBrandHeader onLongPress={() => setShowServerModal(true)} titleStyle={themed.brandTitle} subtitleStyle={themed.brandSub} />
            <View style={reauthStyles.welcomeSection}>
              <Text style={[reauthStyles.welcomeTitle, { color: colors.text }]}>Welcome Back 👋</Text>
            </View>
            <ErrorBanner error={error} onDismiss={() => setError(null)} />
            {!biometricDismissed && (
              <Reanimated.View style={[reauthStyles.animatedSection, biometricAnimStyle]}>
                <BiometricReauthCard
                  biometricType={biometricType}
                  textColor={colors.text}
                  secondaryTextColor={colors.textSecondary}
                  onRetry={handleBiometricRetry}
                  onUsePasscode={slideToBiometricDismissed}
                />
              </Reanimated.View>
            )}
            {passcodeVisible && (
              <Reanimated.View style={[reauthStyles.animatedSection, passcodeAnimStyle]}>
                <MobileNumberSection
                  mobile={mobileNumber}
                  onChangeMobile={setMobileNumber}
                  onSubmit={() => {}}
                  isReadOnly={true}
                  onChangeNumber={changeNumber}
                  loading={false}
                  showContinueButton={false}
                />
                <PasscodeLoginSection
                  passcode={passcode}
                  onChangePasscode={setPasscode}
                  onLogin={handlePasscodeFromReauth}
                  onForgotPasscode={handleForgotPasscode}
                  loading={isLoading}
                  onBiometricLogin={handleReauthBiometricFallback}
                  isBiometricEnabled={isBiometricEnabled}
                  biometricTypeLabel={biometricType}
                  autoFocus={passcodeAutoFocus}
                  lockoutUntil={passcodeLockoutUntil}
                />
              </Reanimated.View>
            )}
          </View>
        </ScrollView>
        {screenModals}
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, themed.container]}
    >
      <FocusAwareStatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        contentContainerStyle={[styles.scroll, dynamicScroll]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {authFlowState === "RESET_PASSCODE" && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setAuthFlowState("PASSCODE_LOGIN")}
            style={[styles.backBtnAbsolute, themed.backBtnAbsolute]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={20} color={isDark ? "#FFFFFF" : BrandColors.PRIMARY_BLUE_DARK} />
          </TouchableOpacity>
        )}
        <View style={styles.wrapper}>
          <AuthBrandHeader onLongPress={() => setShowServerModal(true)} titleStyle={themed.brandTitle} subtitleStyle={themed.brandSub} />
          {authFlowState === "ENTER_MOBILE" && (
            <View style={styles.welcome}>
              <Text style={[styles.welcomeTitle, themed.welcomeTitle]}>Welcome Back 👋</Text>
            </View>
          )}
          {authFlowState !== "RESET_PASSCODE" && (
            <>
              <ErrorBanner error={error} onDismiss={() => setError(null)} />
              <ServerConfigHint error={error} onPress={() => setShowServerModal(true)} />
            </>
          )}
          <Animated.View style={[styles.formBody, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <AuthFlowSections
              biometricTypeLabel={biometricType}
              onMobileSubmit={handleMobileSubmit}
              onOtpVerify={handleOtpVerify}
              onPasscodeLogin={handleLoginSubmit}
              onForgotPasscode={handleForgotPasscode}
              onBiometricLogin={handleBiometricLogin}
              onForgotPasscodeOtpVerify={handleForgotPasscodeOtpVerify}
              onResetPasscodeSubmit={handleResetPasscodeSubmit}
            />
          </Animated.View>
        </View>
      </ScrollView>
      {screenModals}
    </KeyboardAvoidingView>
  );
}

export default AuthenticationScreen;
