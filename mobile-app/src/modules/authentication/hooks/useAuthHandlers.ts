import { useCallback } from "react";
import type React from "react";
import type { useRouter } from "expo-router";
import { Keyboard } from "react-native";
import { useAuthStore } from "../store/authStore";
import { authStorage } from "../services/authStorage";
import { biometricService } from "../services/biometricService";
import { logger } from "@/core/logging/logger";
import { getErrorMessage } from "@/core/error-handling/errorMessage";
import type { AuthFlowState } from "../types/auth.types";

interface AuthHandlerDeps {
  router: ReturnType<typeof useRouter>;
  mobileNumber: string;
  setPasscode: (code: string) => void;
  loginWithPasscode: () => Promise<{ success: boolean }>;
  sendOtp: (overrideMobile?: string) => Promise<unknown>;
  verifyOtp: (code?: string) => Promise<{ success: boolean; requiresPasscode?: boolean }>;
  setAuthFlowState: (state: AuthFlowState) => void;
  setError: (error: string | null) => void;
  resetLoginPresentation: () => void;
  syncFromDevAuth: () => void;
  startForgotPasscode: () => Promise<unknown>;
  verifyForgotPasscodeOtp: (code?: string) => Promise<unknown>;
  resetPasscodeAndProceed: () => Promise<unknown>;
  slideToBiometricDismissed: () => void;
  resetToBiometric: () => void;
  setPasscodeAutoFocus: (value: boolean) => void;
  setBiometricType: (type: string) => void;
  setShowBiometricModal: (show: boolean) => void;
  hasBioTriggered: React.MutableRefObject<boolean>;
  hasNavigated: React.MutableRefObject<boolean>;
}

export function useAuthHandlers(deps: AuthHandlerDeps) {
  const {
    router, mobileNumber,
    setPasscode, loginWithPasscode, sendOtp, verifyOtp,
    setAuthFlowState, setError, resetLoginPresentation, syncFromDevAuth,
    startForgotPasscode, verifyForgotPasscodeOtp, resetPasscodeAndProceed,
    slideToBiometricDismissed, resetToBiometric, setPasscodeAutoFocus,
    setBiometricType, setShowBiometricModal,
    hasBioTriggered: hasBioTriggeredRef, hasNavigated: hasNavigatedRef,
  } = deps;

  const navigateHomeOnce = () => {
    if (!hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      router.replace("/(main)/home");
    }
  };

  const offerBiometricEnrollmentOrGoHome = async () => {
    try {
      const hasHardware = await biometricService.checkHardwareSupport();
      const isEnrolled = await biometricService.checkEnrollment();
      const isAlreadyEnabled = await biometricService.isBiometricEnabled();
      if (hasHardware && isEnrolled && !isAlreadyEnabled) {
        const typeLabel = await biometricService.getBiometricTypeLabel();
        setBiometricType(typeLabel);
        setShowBiometricModal(true);
        return;
      }
    } catch (err) {
      logger.debug("[AuthHandlers] Biometric enrollment check fallback:", { error: err });
    }
    navigateHomeOnce();
  };

  const handleBiometricReauth = useCallback(async () => {
    try {
      const typeLabel = await biometricService.getBiometricTypeLabel().catch(() => "Biometrics");
      const authRes = await biometricService.authenticate({
        promptMessage: `Authenticate with ${typeLabel}`,
        disableDeviceFallback: true,
      });

      if (authRes.success) {
        resetLoginPresentation();
        const activeMobile = mobileNumber || authStorage.getSession().activeMobile;
        if (activeMobile) {
          authStorage.saveSession({ isLoggedIn: true, activeMobile, lastLoginAt: new Date().toISOString() });
          await useAuthStore.getState().fetchAndSyncProfile(activeMobile).catch(() => {});
          syncFromDevAuth();
        }
        navigateHomeOnce();
        return;
      }
      slideToBiometricDismissed();
    } catch {
      slideToBiometricDismissed();
    }
  }, [mobileNumber, resetLoginPresentation, syncFromDevAuth, slideToBiometricDismissed, navigateHomeOnce]);

  const handlePasscodeFromReauth = useCallback(async () => {
    const res = await loginWithPasscode();
    if (res.success) {
      setPasscodeAutoFocus(false);
      setPasscode("");
      Keyboard.dismiss();
      await offerBiometricEnrollmentOrGoHome();
    }
  }, [loginWithPasscode, setPasscodeAutoFocus, setPasscode, offerBiometricEnrollmentOrGoHome]);

  const handleMobileSubmit = async () => { await sendOtp(); };

  const handleOtpVerify = async (code?: string) => {
    const res = await verifyOtp(code);
    if (res.success) {
      if (res.requiresPasscode) {
        setAuthFlowState("PASSCODE_LOGIN");
      } else {
        router.replace("/(main)/home");
      }
    }
  };

  const handleLoginSubmit = async () => {
    const res = await loginWithPasscode();
    if (res.success) {
      setPasscode("");
      Keyboard.dismiss();
      await offerBiometricEnrollmentOrGoHome();
    }
  };

  const handleEnableBiometric = async () => {
    setShowBiometricModal(false);
    try {
      const authRes = await biometricService.authenticate();
      if (authRes.success) {
        await useAuthStore.getState().setBiometricEnabled(true);
      }
    } catch (err) {
      logger.warn("[AuthHandlers] Biometric activation failed:", { error: err });
    }
    navigateHomeOnce();
  };

  const handleNotNowBiometric = () => { setShowBiometricModal(false); navigateHomeOnce(); };

  const handleBiometricLogin = async () => {
    try {
      const typeLabel = await biometricService.getBiometricTypeLabel();
      const authRes = await biometricService.authenticate(`Authenticate with ${typeLabel}`);
      if (authRes.success) {
        resetLoginPresentation();
        const activeMobile = mobileNumber || authStorage.getSession().activeMobile;
        if (activeMobile) {
          authStorage.saveSession({ isLoggedIn: true, activeMobile, lastLoginAt: new Date().toISOString() });
          syncFromDevAuth();
          router.replace("/(main)/home");
        }
      } else if (!authRes?.cancelled && authRes?.error && authRes.error !== "Authentication cancelled") {
        setError(authRes.error);
      }
    } catch (e) {
      setError(getErrorMessage(e) || "Biometric authentication failed");
    }
  };

  const handleForgotPasscode = async () => { await startForgotPasscode(); };
  const handleForgotPasscodeOtpVerify = async (code?: string) => { await verifyForgotPasscodeOtp(code); };
  const handleResetPasscodeSubmit = async () => { await resetPasscodeAndProceed(); };

  const handleBiometricRetry = () => {
    hasBioTriggeredRef.current = false;
    handleBiometricReauth();
  };

  const handleReauthBiometricFallback = () => {
    hasBioTriggeredRef.current = false;
    resetToBiometric();
    handleBiometricReauth();
  };

  return {
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
  };
}
