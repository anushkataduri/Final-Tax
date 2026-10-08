import React, { useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../hooks/use-theme";
import { PrimaryButton } from "../../../../shared/components/Button/PrimaryButton";
import { styles, getThemedStyles } from "./OTPSection.styles";

interface OTPSectionProps {
  otp: string;
  onChangeOtp: (text: string) => void;
  onVerify: (code?: string) => void;
  onResend: () => void;
  timer: number;
  canResend: boolean;
  loading: boolean;
  error?: string | null;
  verifyButtonTitle?: string;
}

export function OTPSection({
  otp,
  onChangeOtp,
  onVerify,
  onResend,
  timer,
  canResend,
  loading,
  error,
  verifyButtonTitle = "Verify OTP",
}: OTPSectionProps) {
  const colors = useTheme();
  const inputRef = useRef<TextInput>(null);
  const themed = getThemedStyles(colors);

  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const handleChangeText = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    onChangeOtp(clean);
  };

  const renderOtpBoxes = () => {
    return Array.from({ length: 6 }).map((_, i) => {
      const char = otp[i] || "";
      const isCurrent = i === otp.length;
      return (
        <View
          key={i}
          style={[
            styles.otpBox,
            themed.getOtpBoxStyle(isCurrent, error),
          ]}
        >
          <Text style={[styles.otpBoxText, themed.otpBoxText]}>{char}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={styles.otpTouchable}
      >
        <View style={styles.otpGrid}>{renderOtpBoxes()}</View>
      </TouchableOpacity>

      <TextInput
        ref={inputRef}
        value={otp}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        maxLength={6}
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        style={styles.hiddenInput}
      />

      {error ? <Text style={[styles.error, themed.error]}>{error}</Text> : null}

      <PrimaryButton
        title={verifyButtonTitle}
        onPress={() => onVerify(otp)}
        loading={loading}
        disabled={loading || otp.length !== 6}
        colorType="orange"
        style={styles.verifyBtn}
      />

      <View style={styles.resendContainer}>
        {timer > 0 ? (
          <Text style={[styles.resendText, themed.resendText]}>
            Resend code in{" "}
            <Text style={themed.timerText}>
              0:{timer < 10 ? `0${timer}` : timer}
            </Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={onResend} disabled={!canResend} activeOpacity={0.7}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default OTPSection;
