import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRevisedProgressStore } from "../../store/revisedProgressStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RevisedItrHeader } from "../../components/common";
import { ReturnSummaryCard } from "../../components/find";
import { useApplicationStore } from "@/store/applicationStore";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { RevisedItrApiService } from "../../services/RevisedItrApiService";
import { OriginalReturnDetails } from "../../types/revisedItr.types";
import {
  styles,
  getContainerInsetsStyle,
  getScrollContentInsetsStyle,
  getBottomBarInsetsStyle,
} from "./FindOriginalReturnScreen.styles";

export const FindOriginalReturnScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ acknowledgementNumber?: string; assessmentYear?: string; isEditing?: string }>();
  const maxStepReached = useRevisedProgressStore((s) => s.maxStepReached);
  const insets = useSafeAreaInsets();
  const applications = useApplicationStore((state) => state.applications);

  const existingItr = applications.find(
    (a) => a.serviceId === "itr-filing" || a.category === "ITR"
  );

  const [ackNumber, setAckNumber] = useState<string>(params.acknowledgementNumber || (existingItr?.formData as any)?.previousAckNumber || "");
  const [assessmentYear, setAssessmentYear] = useState<string>("AY 2025-26");
  const [showAyDropdown, setShowAyDropdown] = useState<boolean>(false);
  const [foundReturn, setFoundReturn] = useState<OriginalReturnDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    showDraftModal,
    openDraftModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    saveDestination: "/service/itr",
    discardDestination: "/service/itr",
    isDirty: () => ackNumber.trim().length > 0 || foundReturn !== null,
    onSaveDraft: () => {
      useApplicationStore.getState().saveRevisedItrDraft({ step: 0 });
    },
    onDiscardDraft: () => {
      useApplicationStore.getState().clearRevisedItrDraft();
    },
    isSubmitted: () => false,
  });

  const ayOptions = ["AY 2025-26", "AY 2024-25", "AY 2023-24"];

  useEffect(() => {
    const draft = useApplicationStore.getState().revisedItrDraft;
    if (draft) {
      const step = draft.step ?? draft.currentStep ?? 0;
      if (step >= 4) {
        router.push({ pathname: "/service/revised-itr-review" as any, params: draft.formData || {} });
      } else if (step === 3) {
        router.push({ pathname: "/service/revised-itr-documents" as any, params: draft.formData || {} });
      } else if (step === 2) {
        router.push({ pathname: "/service/revised-itr-update" as any, params: draft.formData || {} });
      } else if (step === 1) {
        router.push({ pathname: "/service/revised-itr-reason" as any, params: draft.formData || {} });
      }
    }
  }, []);

  const handleFindReturn = () => {
    // 15-digit numeric validation
    const cleaned = ackNumber.trim();
    if (!cleaned) {
      setError("Please enter the 15-digit Acknowledgement Number.");
      return;
    }
    if (!/^\d{15}$/.test(cleaned)) {
      setError("Acknowledgement Number must be exactly 15 digits.");
      return;
    }

    setError(null);
    const matched = applications.find(
      (a) =>
        (a.formData as any)?.previousAckNumber === cleaned ||
        a.id === cleaned
    );

    if (matched) {
      const fd = (matched.formData || {}) as any;
      setFoundReturn({
        acknowledgementNumber: cleaned,
        assessmentYear: fd.assessmentYear || assessmentYear,
        filingDate: matched.createdAt || "Filed via TaxEdge",
        itrForm: fd.formTitle || fd.formType || "ITR-1 (Sahaj)",
        filingStatus: matched.status || "Successfully Filed",
        grossTotalIncome: fd.grossTotalIncome
          ? `₹${Number(fd.grossTotalIncome).toLocaleString("en-IN")}`
          : "—",
      });
    } else {
      setFoundReturn({
        acknowledgementNumber: cleaned,
        assessmentYear,
        filingDate: "Verified from IT Portal",
        itrForm: "ITR Form",
        filingStatus: "Filed & Verified",
        grossTotalIncome: "—",
      });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { revisedItrId, setBackendIds, setMaxStepReached } = useRevisedProgressStore();
  const { customer, authenticatedUser } = useAuthStore();

  const handleContinue = async () => {
    if (!foundReturn) {
      handleFindReturn();
      return;
    }

    try {
      setIsSubmitting(true);
      const customerId = customer?.customerId || (authenticatedUser as any)?.customerId || "CUST-12345";
      
      const payload = {
        customerId,
        itrAcknowledgementNumber: foundReturn.acknowledgementNumber,
        assessmentYear: foundReturn.assessmentYear.replace("AY ", "").trim() // Convert "AY 2025-26" to "2025-26"
      };

      if (maxStepReached >= 2 && revisedItrId) {
        // Edit flow
        await RevisedItrApiService.updateRevisedItr(revisedItrId, payload);
      } else {
        // Initial flow
        const response = await RevisedItrApiService.saveRevisedItr(payload);
        if (response && response.revisedItrId) {
          setBackendIds({ revisedItrId: response.revisedItrId });
        }
        setMaxStepReached(2);
      }

      // Navigate to Screen 2: Reason for Revision
      router.push({
        pathname: "/service/revised-itr-reason" as any,
        params: {
          acknowledgementNumber: foundReturn.acknowledgementNumber,
          assessmentYear: foundReturn.assessmentYear,
        },
      });
    } catch (e) {
      console.error(e);
      // Optional: Add an Alert.alert here
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
            placeholder="Enter acknowledgement number"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            maxLength={15}
            value={ackNumber}
            onChangeText={(val) => {
              setAckNumber(val);
              if (error) setError(null);
            }}
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

        {/* Return Summary Card if Found */}
        {foundReturn && <ReturnSummaryCard details={foundReturn} />}
      </ScrollView>

      {/* Sticky Bottom Action Button */}
      <View
        style={[
          styles.bottomBar,
          getBottomBarInsetsStyle(insets.bottom),
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={foundReturn ? handleContinue : handleFindReturn}
          style={styles.ctaButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.ctaButtonText}>{params.isEditing === "true" ? "Update and Continue" : "Continue"}</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
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



