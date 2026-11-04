import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRevisedProgressStore } from "../../store/revisedProgressStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RevisedItrHeader } from "../../components/common";
import { useApplicationStore } from "@/store/applicationStore";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { RevisedItrApiService } from "../../services/RevisedItrApiService";
import { getPastAssessmentYears } from "@/modules/itr/taxRules";
import {
  filterNumericAcknowledgementNumber,
  isOriginalItrAckNumberValid,
} from "../../utils/acknowledgementValidation";
import {
  styles,
  getContainerInsetsStyle,
  getScrollContentInsetsStyle,
  getBottomBarInsetsStyle,
} from "./FindOriginalReturnScreen.styles";

export const FindOriginalReturnScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    acknowledgementNumber?: string;
    assessmentYear?: string;
    isEditing?: string;
  }>();
  useRevisedProgressStore((s) => s.maxStepReached);
  const insets = useSafeAreaInsets();

  const initialAck = filterNumericAcknowledgementNumber(params.acknowledgementNumber || "");
  const [ackNumber, setAckNumber] = useState<string>(initialAck);
  const ayOptions = getPastAssessmentYears(3).map((ay) => ay.label);
  const [assessmentYear, setAssessmentYear] = useState<string>(
    params.assessmentYear || ayOptions[0]
  );
  const [showAyDropdown, setShowAyDropdown] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(() => {
    if (params.acknowledgementNumber) {
      if (initialAck.length === 0) {
        return "Please enter the 15-digit Acknowledgement Number.";
      }
      if (initialAck.length < 15) {
        return "Acknowledgement number must be exactly 15 digits.";
      }
      return null;
    }
    return null;
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    showDraftModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () => ackNumber.length > 0,
    onSaveDraft: () => {
      useApplicationStore.getState().saveRevisedItrDraft({ step: 0 });
    },
    onDiscardDraft: () => {
      useApplicationStore.getState().clearRevisedItrDraft();
      useRevisedProgressStore.getState().reset();
    },
    isSubmitted: () => useRevisedProgressStore.getState().isSubmitted,
  });

  useEffect(() => {
    const draft = useApplicationStore.getState().revisedItrDraft;
    if (draft) {
      const step = Number((draft as any)?.step ?? (draft as any)?.currentStep ?? 0);
      const draftParams = ((draft as any)?.formData || {}) as any;
      if (step >= 4) {
        router.push({ pathname: "/service/revised-itr-review" as any, params: draftParams });
      } else if (step === 3) {
        router.push({ pathname: "/service/revised-itr-documents" as any, params: draftParams });
      } else if (step === 2) {
        router.push({ pathname: "/service/revised-itr-update" as any, params: draftParams });
      } else if (step === 1) {
        router.push({ pathname: "/service/revised-itr-reason" as any, params: draftParams });
      }
    } else {
      // Clear any in-memory store data from earlier completed sessions
      useRevisedProgressStore.getState().reset();
    }
  }, [router]);

  const handleAckNumberChange = (val: string) => {
    // Real-time numeric filtering: reject letters, emojis, spaces, commas, and special characters
    const filtered = filterNumericAcknowledgementNumber(val);
    setAckNumber(filtered);

    if (filtered.length === 0) {
      setError("Please enter the 15-digit Acknowledgement Number.");
      return;
    }

    if (filtered.length < 15) {
      setError("Acknowledgement number must be exactly 15 digits.");
      return;
    }

    setError(null);
  };

  const isAckValid = isOriginalItrAckNumberValid(ackNumber);
  const isContinueDisabled = !isAckValid || isSubmitting;

  const { revisedItrId, setBackendIds, setMaxStepReached } = useRevisedProgressStore();
  const { customer, authenticatedUser } = useAuthStore();

  // POST Method - Normal Flow (Continue)
  const handleContinue = async () => {
    const cleanAck = filterNumericAcknowledgementNumber(ackNumber);
    if (cleanAck.length !== 15) {
      setError(
        cleanAck.length === 0
          ? "Please enter the 15-digit Acknowledgement Number."
          : "Acknowledgement number must be exactly 15 digits."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const customerId =
        customer?.customerId ||
        (authenticatedUser as any)?.customerId ||
        (authenticatedUser as any)?.custId ||
        "";
      if (!customerId) {
        Alert.alert(
          "Registration Required",
          "Please complete your account registration before filing a revised ITR.",
        );
        return;
      }

      const payload = {
        customerId,
        itrAcknowledgementNumber: cleanAck,
        assessmentYear: assessmentYear.replace("AY ", "").trim(),
      };

      const response = await RevisedItrApiService.saveRevisedItr(payload);
      if (response && response.revisedItrId) {
        setBackendIds({ revisedItrId: response.revisedItrId });
      }
      setMaxStepReached(2);

      // Navigate to Screen 2: Reason for Revision
      router.push({
        pathname: "/service/revised-itr-reason" as any,
        params: {
          acknowledgementNumber: cleanAck,
          assessmentYear,
        },
      });
    } catch (e: any) {
      console.error("Error saving revised ITR:", e);
      Alert.alert("Error", e?.message || "Failed to save revised ITR.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // PUT Method - Editing Flow (Update & Continue)
  const handleUpdateAndContinue = async () => {
    const cleanAck = filterNumericAcknowledgementNumber(ackNumber);
    if (cleanAck.length !== 15) {
      setError(
        cleanAck.length === 0
          ? "Please enter the 15-digit Acknowledgement Number."
          : "Acknowledgement number must be exactly 15 digits."
      );
      return;
    }

    if (!revisedItrId) {
      Alert.alert("Error", "No revised ITR ID found to update.");
      return;
    }

    try {
      setIsSubmitting(true);
      const customerId =
        customer?.customerId ||
        (authenticatedUser as any)?.customerId ||
        (authenticatedUser as any)?.custId ||
        "";
      if (!customerId) {
        Alert.alert(
          "Registration Required",
          "Please complete your account registration before filing a revised ITR.",
        );
        return;
      }

      const payload = {
        customerId,
        itrAcknowledgementNumber: cleanAck,
        assessmentYear: assessmentYear.replace("AY ", "").trim(),
      };

      await RevisedItrApiService.updateRevisedItr(revisedItrId, payload);

      // Redirect back to Review screen
      router.push({
        pathname: "/service/revised-itr-review" as any,
        params: {
          acknowledgementNumber: cleanAck,
          assessmentYear,
        },
      });
    } catch (e: any) {
      console.error("Error updating revised ITR:", e);
      Alert.alert("Error", e?.message || "Failed to update revised ITR.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, getContainerInsetsStyle(insets.top)]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <RevisedItrHeader subtitle="Find Original Return" />

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          getScrollContentInsetsStyle(insets.bottom),
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Find Original Return</Text>
        </View>

        {/* Input: Acknowledgement Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Original ITR Acknowledgement Number <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.textInput, error ? styles.inputError : null]}
            placeholder="Enter 15-digit acknowledgement number"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            maxLength={15}
            autoCapitalize="none"
            autoCorrect={false}
            value={ackNumber}
            onChangeText={handleAckNumberChange}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Input: Assessment Year Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Assessment Year <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowAyDropdown(!showAyDropdown)}
            style={styles.dropdownSelector}
          >
            <Text style={styles.dropdownValue}>{assessmentYear || "Select year"}</Text>
            <Ionicons
              name={showAyDropdown ? "chevron-up" : "chevron-down"}
              size={18}
              color="#0B1F3A"
            />
          </TouchableOpacity>

          {showAyDropdown && (
            <View style={styles.dropdownMenu}>
              {ayOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.7}
                  onPress={() => {
                    setAssessmentYear(opt);
                    setShowAyDropdown(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      assessmentYear === opt && styles.dropdownItemActive,
                    ]}
                  >
                    {opt}
                  </Text>
                  {assessmentYear === opt && (
                    <Ionicons name="checkmark" size={16} color="#F97316" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Button */}
      <View
        style={[
          styles.bottomBar,
          getBottomBarInsetsStyle(insets.bottom),
        ]}
      >
        {params.isEditing === "true" ? (
          /* Button 1: Update & Continue (PUT Method) */
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleUpdateAndContinue}
            style={[styles.ctaButton, isContinueDisabled ? styles.ctaButtonDisabled : null]}
            disabled={isContinueDisabled}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text
                  style={[
                    styles.ctaButtonText,
                    isContinueDisabled ? styles.ctaButtonTextDisabled : null,
                  ]}
                >
                  Update & Continue
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={isContinueDisabled ? "#64748B" : "#FFFFFF"}
                />
              </>
            )}
          </TouchableOpacity>
        ) : (
          /* Button 2: Continue (POST Method) */
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleContinue}
            style={[styles.ctaButton, isContinueDisabled ? styles.ctaButtonDisabled : null]}
            disabled={isContinueDisabled}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text
                  style={[
                    styles.ctaButtonText,
                    isContinueDisabled ? styles.ctaButtonTextDisabled : null,
                  ]}
                >
                  Continue
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={isContinueDisabled ? "#64748B" : "#FFFFFF"}
                />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      <UniversalDraftModal
        visible={showDraftModal}
        onCancel={handleCancel}
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
      />
    </View>
  );
};

export default FindOriginalReturnScreen;
