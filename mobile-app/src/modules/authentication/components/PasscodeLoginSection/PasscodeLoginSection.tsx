import React, { useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../../../hooks/use-theme";
import { PrimaryButton } from "../../../../shared/components/Button/PrimaryButton";
import { styles, getThemedStyles } from "./PasscodeLoginSection.styles";

interface PasscodeLoginSectionProps {
  passcode: string;
  onChangePasscode: (code: string) => void;
  onLogin: () => void;
  onForgotPasscode: () => void;
  loading: boolean;
  error?: string | null;
  onBiometricLogin?: () => void;
  isBiometricEnabled?: boolean;
  biometricTypeLabel?: string;
  /** If false, suppresses the automatic keyboard focus on mount. Defaults to true. */
  autoFocus?: boolean;
}

export function PasscodeLoginSection({
  passcode,
  onChangePasscode,
  onLogin,
  onForgotPasscode,
  loading,
  error,
  onBiometricLogin,
  isBiometricEnabled,
  biometricTypeLabel = "Biometrics",
  autoFocus = true,
}: PasscodeLoginSectionProps) {
  const colors = useTheme();
  const inputRef = useRef<TextInput>(null);
  const themed = getThemedStyles(colors);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(t);
  }, [autoFocus]);

  const handleChangeText = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    onChangePasscode(clean);
    if (clean.length === 6) {
      setTimeout(() => {
        onLogin();
      }, 50);
    }
  };

  const renderDots = () => {
    return Array.from({ length: 6 }).map((_, i) => {
      const isFilled = i < passcode.length;
      const isCurrent = i === passcode.length;
      return (
        <View
          key={i}
          style={[
            styles.dotBox,
            themed.getDotBoxStyle(isCurrent, error),
          ]}
        >
          {isFilled ? <View style={styles.dot} /> : null}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, themed.title]}>Enter 6-Digit Passcode</Text>
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={styles.touchable}
      >
        <View style={styles.dotsRow}>{renderDots()}</View>
      </TouchableOpacity>

      <TextInput
        ref={inputRef}
        value={passcode}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        maxLength={6}
        secureTextEntry
        style={styles.hiddenInput}
      />

      <View style={styles.forgotRow}>
        <TouchableOpacity onPress={onForgotPasscode} activeOpacity={0.7} style={styles.forgotBtn}>
          <Text style={styles.forgotText}>
            Forgot Passcode?
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={[styles.error, themed.error]}>{error}</Text> : null}

      <PrimaryButton
        title="Login"
        onPress={onLogin}
        loading={loading}
        disabled={loading || passcode.length !== 6}
        colorType="orange"
        style={styles.loginBtn}
      />

      {isBiometricEnabled && onBiometricLogin && (
        <TouchableOpacity
          onPress={onBiometricLogin}
          activeOpacity={0.75}
          style={[styles.biometricBtn, themed.biometricBtn]}
        >
          <Ionicons
            name={
              (biometricTypeLabel || "").toLowerCase().includes("face")
                ? "scan-outline"
                : "finger-print-outline"
            }
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.biometricBtnText, themed.biometricBtnText]}>
            {`Login with ${biometricTypeLabel || "Biometrics"}`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default PasscodeLoginSection;
