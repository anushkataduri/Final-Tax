import React, { useState, useEffect } from "react";
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
import { TdsCustomerIncomeFormData } from "../../types/customerIncome.types";
import { TdsChecklistItem } from "../../types/checklist.types";
import { TaxCalculationBreakdown } from "../../types/estimate.types";
import { formatCurrency } from "../../utils/tdsValidation";
import { tdsDraftService, INITIAL_TDS_FORM_DATA } from "../../services/tdsDraftService";
import { tdsCalculationService } from "../../services/tdsCalculationService";
import { tdsApiService } from "../../services/tdsApiService";
import { TaxCalculationBreakdownCard } from "../../components/estimate/TaxCalculationBreakdownCard";
import { useTdsProgressStore } from "../../store/tdsProgressStore";
import { styles } from "./TdsRefundEstimateScreen.styles";

export const TdsRefundEstimateScreen: React.FC = () => {
  const router = useRouter();
  const { applicationId: routeAppId, id: routeId } = useLocalSearchParams<{ applicationId?: string; id?: string }>();
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState<TdsCustomerIncomeFormData>(INITIAL_TDS_FORM_DATA);
  const [documents, setDocuments] = useState<TdsChecklistItem[]>([]);
  const [calculation, setCalculation] = useState<TaxCalculationBreakdown | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAppId, setCurrentAppId] = useState<string | null>((routeId || routeAppId) as string | null);
  const {
    showDraftModal,
    openDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
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

  useEffect(() => {
    useTdsProgressStore.getState().setMaxStepReached(3);

    let isMounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const savedForm = await tdsDraftService.getFormDraft();
        const savedDocs = await tdsDraftService.getDocumentsDraft();
        const existingAppId = routeId || routeAppId || (await tdsDraftService.getApplicationId()) || undefined;

        if (existingAppId && isMounted) {
          setCurrentAppId(existingAppId);
        }

        const custId = savedForm.personal?.mobileNumber
          ? savedForm.personal.mobileNumber.replace(/\D/g, "")
          : "CUST-DEFAULT";

        let finalForm = {
          ...savedForm,
          business: { ...(savedForm.business || { legalName: "", pan: "", aadhaar: "", mobileNumber: "" }) },
          bank: { ...savedForm.bank },
          personal: { ...savedForm.personal },
          income: { ...savedForm.income },
        };
        let finalDocs = savedDocs && savedDocs.length > 0 ? [...savedDocs] : [];

        // 1. Directly fetch saved details from database @GetMapping("/get/{id}")
        let dbDetails: any = null;
        if (existingAppId) {
          try {
            console.log(`🌐 [TDS Review] Calling GET /tds-refund/get/${existingAppId}`);
            dbDetails = await tdsApiService.getTdsRefund(existingAppId);
            if (dbDetails) {
              console.log("✅ [TDS Review] Successfully loaded database details from /tds-refund/get/{id}:", dbDetails);
            }
          } catch (getErr) {
            console.warn(`[TDS Review] Warning calling GET /tds-refund/get/${existingAppId}:`, getErr);
          }
        }

        // Fallback: If not found by ID, attempt lookup by customer ID
        if (!dbDetails && custId && custId !== "CUST-DEFAULT") {
          try {
            dbDetails = await tdsApiService.getBankAccountByCustId(custId);
          } catch (custErr) {
            console.warn("[TDS Review] Fallback custId fetch warning:", custErr);
          }
        }

        if (dbDetails) {
          if (dbDetails.id && isMounted) {
            setCurrentAppId(dbDetails.id);
            await tdsDraftService.saveApplicationId(dbDetails.id);
          }
          // Populate Business Details from database
          finalForm.business = {
            legalName: dbDetails.legalBusinessName || finalForm.business?.legalName || "",
            pan: dbDetails.businessPan || finalForm.business?.pan || "",
            aadhaar: dbDetails.aadhaarNumber || finalForm.business?.aadhaar || "",
            mobileNumber: dbDetails.mobileNumber || finalForm.business?.mobileNumber || "",
          };

          // Populate Bank Details from database
          finalForm.bank = {
            accountHolderName: dbDetails.accountHolderName || finalForm.bank?.accountHolderName || "",
            accountNumber: dbDetails.accountNumber || finalForm.bank?.accountNumber || "",
            confirmAccountNumber: dbDetails.confirmAccountNumber || dbDetails.accountNumber || finalForm.bank?.confirmAccountNumber || "",
            ifscCode: dbDetails.ifscCode || finalForm.bank?.ifscCode || "",
            bankName: dbDetails.bankName || finalForm.bank?.bankName || "",
            branchName: dbDetails.branchName || finalForm.bank?.branchName || "",
            accountType: (dbDetails.accountType?.toLowerCase() === "current" ? "current" : "savings") as any,
            isIfscVerified: Boolean(dbDetails.bankName),
          };

          // Populate / align Personal Details
          finalForm.personal = {
            ...finalForm.personal,
            fullName: finalForm.personal?.fullName || dbDetails.accountHolderName || dbDetails.legalBusinessName || "",
            pan: finalForm.personal?.pan || dbDetails.businessPan || "",
            mobileNumber: finalForm.personal?.mobileNumber || dbDetails.mobileNumber || "",
            aadhaar: finalForm.personal?.aadhaar || dbDetails.aadhaarNumber || "",
          };

          // Populate Documents from database
          if (dbDetails.businessPanDocument) {
            const existingPan = finalDocs.find((d: any) => d.id === "pan");
            if (existingPan) {
              existingPan.status = "uploaded";
              existingPan.fileName = existingPan.fileName || "Business_PAN.pdf";
            } else {
              finalDocs.push({
                id: "pan",
                title: "Business PAN",
                subtitle: "Stored in Database",
                status: "uploaded",
                fileName: "Business_PAN.pdf",
                isMandatory: true,
              } as any);
            }
          }

          if (dbDetails.aadhaarDocument) {
            const existingAadhaar = finalDocs.find((d: any) => d.id === "aadhaar");
            if (existingAadhaar) {
              existingAadhaar.status = "uploaded";
              existingAadhaar.fileName = existingAadhaar.fileName || "Aadhaar_Card.pdf";
            } else {
              finalDocs.push({
                id: "aadhaar",
                title: "Aadhaar Card",
                subtitle: "Stored in Database",
                status: "uploaded",
                fileName: "Aadhaar_Card.pdf",
                isMandatory: true,
              } as any);
            }
          }
        }

        // 2. Fetch auxiliary application details (income / taxes)
        try {
          const backendApp = await tdsApiService.fetchFullTdsApplication(custId, existingAppId);
          if (backendApp) {
            if (backendApp.income) finalForm.income = { ...finalForm.income, ...backendApp.income };
          }
        } catch (err) {
          console.warn("[TDS Estimate Screen] Backend fetch warning:", err);
        }

        if (isMounted) {
          setFormData(finalForm);
          setDocuments(finalDocs);

          const calcResult = tdsCalculationService.calculate(finalForm);
          setCalculation(calcResult);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditPersonalOrIncome = () => {
    router.push({
      pathname: "/service/tds-form" as any,
      params: { isEditing: "true", id: currentAppId || routeId || routeAppId || "" },
    });
  };

  const handleEditDocuments = () => {
    router.push({
      pathname: "/service/tds-form" as any,
      params: { isEditing: "true", id: currentAppId || routeId || routeAppId || "" },
    });
  };

  const handleSubmitApplication = async () => {
    if (!calculation) return;
    setIsSubmitting(true);

    try {
      const existingAppId = await tdsDraftService.getApplicationId();
      const response = await tdsApiService.submitApplicationDraft(
        formData,
        documents as any,
        calculation,
        existingAppId || undefined
      );

      const targetAppId = response?.applicationId || existingAppId;
      if (!targetAppId) {
        throw new Error("Unable to create application record on server. Please try again.");
      }

      await tdsDraftService.saveApplicationId(targetAppId);

      // 1. Get Push Token
      let pushToken: string | undefined;
      try {
        const { registerForPushNotificationsAsync } = await import(
          "@/utils/pushNotificationService"
        );
        pushToken = (await registerForPushNotificationsAsync()) || undefined;
      } catch (pushErr) {
        console.warn("[TDS Review] Push token warning:", pushErr);
      }

      // 2. Submit to backend /tds-refund/submit
      try {
        await tdsApiService.submitTdsRefund(targetAppId, pushToken);
        console.log("✅ [TDS Review] Successfully submitted TDS refund to backend:", targetAppId);
      } catch (subErr: any) {
        console.warn("[TDS Review] Backend submit warning:", subErr);
      }

      // 3. Update global application store
      try {
        useApplicationStore.getState().addApplication({
          id: targetAppId,
          serviceId: "tds-refund",
          serviceName: "TDS Refund",
          category: "ITR",
          status: "Submitted",
          createdAt: new Date().toISOString(),
          paymentAmount: calculation.estimatedRefund,
        } as any);
      } catch (storeErr) {
        console.warn("[TDS Review] Application store update error:", storeErr);
      }

      // 4. In-App Notification
      try {
        const { useNotificationStore } = await import("@/store/notificationStore");
        useNotificationStore.getState().addNotification(
          "TDS Refund Submitted",
          `Your TDS refund application (${targetAppId}) has been successfully submitted for CA review.`,
          "itr"
        );
      } catch (notifErr) {
        console.warn("[TDS Review] Notification dispatch warning:", notifErr);
      }

      // 5. Clear draft
      await tdsDraftService.clearDraft();

      // Disable draft prevention upon successful submission
      markSubmitted();

      // 6. Navigate directly to Application Status screen
      router.replace({
        pathname: "/service/tds-status" as any,
        params: {
          applicationId: targetAppId,
          refundAmount: formatCurrency(calculation.estimatedRefund),
          isAdditionalPayable: calculation.isAdditionalTaxPayable ? "1" : "0",
        },
      });
    } catch (err: any) {
      Alert.alert(
        "Application Submission Failed",
        err?.message || "Failed to submit application to the server. Please check your network and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadedDocs = documents.filter((d) => (d.status === "uploaded" || d.status === "verified") || !!d.fileUri || !!d.fileName);

  const maskAccount = (num: string) => {
    if (!num || num.length < 4) return "••••";
    return `••••${num.slice(-4)}`;
  };

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <View style={{ width: 38, height: 38 }} />

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>Review Application</Text>
          <Text style={styles.headerSubtitle}>Step 2 of 2: Review & Submit</Text>
        </View>

        <View style={{ width: 38, height: 38 }} />
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 85 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================
            SECTION 1: PERSONAL DETAILS
        ======================================================== */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="person-outline" size={18} color={BrandColors.PRIMARY_BLUE} />
              <Text style={styles.cardTitle}>Personal Details</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditPersonalOrIncome}
              style={styles.editButton}
            >
              <Ionicons name="pencil" size={12} color={BrandColors.PRIMARY_ORANGE_DARK} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{formData.personal.fullName || "�"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>PAN</Text>
              <Text style={styles.infoValue}>{formData.personal.pan || "�"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile Number</Text>
              <Text style={styles.infoValue}>+91 {formData.personal.mobileNumber || "�"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{formData.personal.email || "�"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {formData.personal.city}, {formData.personal.state} - {formData.personal.pinCode}
              </Text>
            </View>
          </View>
        </View>
        {/* ========================================================
            SECTION 2: BUSINESS DETAILS
        ======================================================== */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="briefcase-outline" size={18} color={BrandColors.PRIMARY_BLUE} />
              <Text style={styles.cardTitle}>Business Details</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditPersonalOrIncome}
              style={styles.editButton}
            >
              <Ionicons name="pencil" size={12} color={BrandColors.PRIMARY_ORANGE_DARK} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Legal Name</Text>
              <Text style={styles.infoValue}>{formData.business?.legalName || "�"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>PAN</Text>
              <Text style={styles.infoValue}>{formData.business?.pan || "�"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Aadhaar</Text>
              <Text style={styles.infoValue}>{formData.business?.aadhaar || "�"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile Number</Text>
              <Text style={styles.infoValue}>+91 {formData.business?.mobileNumber || "�"}</Text>
            </View>
          </View>
        </View>
        {/* ========================================================
            SECTION 5: BANK DETAILS
        ======================================================== */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="business-outline" size={18} color={BrandColors.PRIMARY_BLUE} />
              <Text style={styles.cardTitle}>Bank Details</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditPersonalOrIncome}
              style={styles.editButton}
            >
              <Ionicons name="pencil" size={12} color={BrandColors.PRIMARY_ORANGE_DARK} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bank Name</Text>
              <Text style={styles.infoValue}>{formData.bank.bankName || "—"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Branch</Text>
              <Text style={styles.infoValue}>{formData.bank.branchName || "—"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Number</Text>
              <Text style={styles.infoValue}>
                {maskAccount(formData.bank.accountNumber)} ({formData.bank.accountType})
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>IFSC Code</Text>
              <Text style={styles.infoValue}>{formData.bank.ifscCode || "—"}</Text>
            </View>
          </View>
        </View>

        {/* ========================================================
            SECTION 6: DOCUMENTS
        ======================================================== */}
        <View style={styles.reviewCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="document-attach-outline" size={18} color={BrandColors.PRIMARY_BLUE} />
              <Text style={styles.cardTitle}>
                Documents ({uploadedDocs.length})
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditDocuments}
              style={styles.editButton}
            >
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

        {/* ========================================================
            SECTION 7: TAX CALCULATION
        ======================================================== */}
        {calculation && <TaxCalculationBreakdownCard breakdown={calculation} />}
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmitApplication}
          disabled={isSubmitting}
          style={styles.proceedButton}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={BrandColors.WHITE} />
          ) : (
            <>
              <Text style={styles.proceedButtonText}>Submit for CA Review</Text>
              <Ionicons name="checkmark-circle" size={18} color={BrandColors.WHITE} />
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


