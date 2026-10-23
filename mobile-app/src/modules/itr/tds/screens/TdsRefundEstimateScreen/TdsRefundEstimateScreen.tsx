import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { useApplicationStore } from "@/store/applicationStore";
import { tdsDraftService } from "../../services/tdsDraftService";
import { tdsApiService } from "../../services/tdsApiService";
import { TaxCalculationBreakdownCard } from "../../components/estimate/TaxCalculationBreakdownCard";
import { useTdsEstimateData } from "./useTdsEstimateData";
import { styles } from "./TdsRefundEstimateScreen.styles";

const maskAccount = (num: string) =>
  (!num || num.length < 4) ? "••••" : `••••${num.slice(-4)}`;

export const TdsRefundEstimateScreen: React.FC = () => {
  const router = useRouter();
  const { applicationId: routeAppId, id: routeId } = useLocalSearchParams<{ applicationId?: string; id?: string }>();
  const insets = useSafeAreaInsets();

  const { formData, documents, calculation, isLoading, currentAppId } = useTdsEstimateData(
    routeId as string | undefined,
    routeAppId as string | undefined
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    showDraftModal,
    openDraftModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    saveDestination: "/service/itr",
    discardDestination: "/service/itr",
    isDirty: () => true,
    onSaveDraft: async () => {
      await useApplicationStore.getState().saveTdsDraft({ step: "ESTIMATE" });
    },
    onDiscardDraft: async () => {
      await tdsDraftService.clearDraft();
      await useApplicationStore.getState().clearTdsDraft();
    },
    isSubmitted: () => isSubmitting,
  });

  const handleEdit = () => {
    router.push({
      pathname: "/service/tds-form" as never,
      params: { isEditing: "true", id: currentAppId || routeId || routeAppId || "" },
    });
  };

  const handleProceedToPayment = async () => {
    if (!calculation) return;
    setIsSubmitting(true);
    try {
      const existingAppId = await tdsDraftService.getApplicationId();
      const response = await tdsApiService.submitApplicationDraft(
        formData,
        documents as never,
        calculation,
        existingAppId || undefined
      );
      const targetAppId = response?.applicationId || existingAppId;
      if (!targetAppId) throw new Error("Unable to create application record on server. Please try again.");

      await tdsDraftService.saveApplicationId(targetAppId);
      useApplicationStore.getState().saveTdsDraft({ step: "PAYMENT" });
      router.push({
        pathname: "/service/tds-payment" as never,
        params: {
          applicationId: targetAppId,
          refundAmount: calculation.estimatedRefund.toString(),
          isAdditionalPayable: calculation.isAdditionalTaxPayable ? "1" : "0",
          payableAmount: calculation.estimatedTaxPayable.toString(),
          serviceFee: calculation.serviceFee.toString(),
          gstAmount: calculation.gstAmount.toString(),
          totalPayable: calculation.totalPayableFee.toString(),
        },
      });
    } catch (err: unknown) {
      Alert.alert(
        "Application Submission Failed",
        (err instanceof Error ? err.message : null) ?? "Failed to submit. Please check your network and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadedDocs = documents.filter((d) => d.status === "uploaded" || d.status === "verified" || !!d.fileUri || !!d.fileName);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={BrandColors.PRIMARY_BLUE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <View style={{ width: 38, height: 38 }} />
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>Review Application</Text>
          <Text style={styles.headerSubtitle}>Step 2 of 4: Review & Estimate</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openDraftModal}
          style={{ height: 34, paddingHorizontal: 12, borderRadius: 17, backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 }}
          accessibilityLabel="Save Draft"
        >
          <Ionicons name="bookmark-outline" size={14} color="#64748B" />
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#64748B" }}>Draft</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 85 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Details */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="person-outline" size={18} color={BrandColors.PRIMARY_BLUE} />
              <Text style={styles.cardTitle}>Personal Details</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleEdit} style={styles.editButton}>
              <Ionicons name="pencil" size={12} color={BrandColors.PRIMARY_ORANGE_DARK} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Full Name</Text><Text style={styles.infoValue}>{formData.personal.fullName || "—"}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>PAN</Text><Text style={styles.infoValue}>{formData.personal.pan || "—"}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Mobile</Text><Text style={styles.infoValue}>+91 {formData.personal.mobileNumber || "—"}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Email</Text><Text style={styles.infoValue}>{formData.personal.email || "—"}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Address</Text><Text style={styles.infoValue} numberOfLines={1}>{formData.personal.city}, {formData.personal.state} - {formData.personal.pinCode}</Text></View>
          </View>
        </View>

        {/* Business Details */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="briefcase-outline" size={18} color={BrandColors.PRIMARY_BLUE} />
              <Text style={styles.cardTitle}>Business Details</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleEdit} style={styles.editButton}>
              <Ionicons name="pencil" size={12} color={BrandColors.PRIMARY_ORANGE_DARK} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Legal Name</Text><Text style={styles.infoValue}>{formData.business?.legalName || "—"}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>PAN</Text><Text style={styles.infoValue}>{formData.business?.pan || "—"}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Mobile</Text><Text style={styles.infoValue}>+91 {formData.business?.mobileNumber || "—"}</Text></View>
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="business-outline" size={18} color={BrandColors.PRIMARY_BLUE} />
              <Text style={styles.cardTitle}>Bank Details</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleEdit} style={styles.editButton}>
              <Ionicons name="pencil" size={12} color={BrandColors.PRIMARY_ORANGE_DARK} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Bank Name</Text><Text style={styles.infoValue}>{formData.bank.bankName || "—"}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Branch</Text><Text style={styles.infoValue}>{formData.bank.branchName || "—"}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Account</Text><Text style={styles.infoValue}>{maskAccount(formData.bank.accountNumber)} ({formData.bank.accountType})</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>IFSC</Text><Text style={styles.infoValue}>{formData.bank.ifscCode || "—"}</Text></View>
          </View>
        </View>

        {/* Documents */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="document-attach-outline" size={18} color={BrandColors.PRIMARY_BLUE} />
              <Text style={styles.cardTitle}>Documents ({uploadedDocs.length})</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleEdit} style={styles.editButton}>
              <Ionicons name="pencil" size={12} color={BrandColors.PRIMARY_ORANGE_DARK} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.docPillList}>
            {uploadedDocs.length > 0 ? (
              uploadedDocs.map((doc) => (
                <View key={doc.id} style={styles.docPill}>
                  <Ionicons name="checkmark-circle" size={13} color="#16A34A" />
                  <Text style={styles.docPillText}>{doc.title}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoLabel}>No documents uploaded yet</Text>
            )}
          </View>
        </View>

        {calculation && <TaxCalculationBreakdownCard breakdown={calculation} />}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
        <TouchableOpacity activeOpacity={0.85} onPress={handleProceedToPayment} disabled={isSubmitting} style={styles.proceedButton}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color={BrandColors.WHITE} />
          ) : (
            <>
              <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
              <Ionicons name="arrow-forward" size={18} color={BrandColors.WHITE} />
            </>
          )}
        </TouchableOpacity>
      </View>

      <UniversalDraftModal
        visible={showDraftModal}
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default TdsRefundEstimateScreen;
