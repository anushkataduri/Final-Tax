import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  formatIndianCurrency,
  formatIndianNumberInput,
  toRawNumericString,
} from "@/shared/formatters/currencyFormatter";
import { styles } from "@/modules/gst/gst-filing/components/GstFilingReviewStep/GstFilingReviewStep.styles";

export interface GstFilingReviewStepProps {
  isFetching?: boolean;
  gstin?: string;
  businessName?: string;
  taxpayerScheme?: string;
  filingNature?: string;
  financialYear?: string;
  filingMonth?: string;
  filingType?: string;
  filingFrequency?: string;
  uploadedDocsCount?: number;
  totalRequiredDocsCount?: number;
  missingDocsCount?: number;
  grossTaxableTurnover?: number | string;
  taxablePurchases?: number | string;
  eligibleItc?: number | string;
  caFee?: number;
  platformGst?: number;
  totalPayable?: number;
  onApprove: () => void;
  onRequestChanges?: () => void;
  onEditFilingDetails?: () => void;
  onEditTaxComputation?: () => void;
  onEditFilingFee?: () => void;
  onEditDocuments?: () => void;
  onReuploadDocuments?: () => void;
  onUpdateComputation?: (turnover: number, itc: number, purchases?: number) => void;
}

// Display only; values passed to callbacks/API stay numeric.
const formatInr = (val: number): string => formatIndianCurrency(Math.round(val));

const parseNumeric = (val: number | string | undefined, defaultVal: number): number => {
  if (typeof val === "number") return isNaN(val) ? defaultVal : val;
  if (typeof val === "string") {
    const cleaned = val.replace(/[^\d.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? defaultVal : parsed;
  }
  return defaultVal;
};

export const GstFilingReviewStep: React.FC<GstFilingReviewStepProps> = ({
  gstin = "Not provided",
  businessName = "Registered Business",
  taxpayerScheme = "Regular Scheme",
  filingNature = "Regular Return",
  financialYear = "FY 2025-26",
  filingMonth = "August 2025",
  filingType = "GSTR-1",
  filingFrequency = "Monthly",
  uploadedDocsCount = 0,
  totalRequiredDocsCount = 0,
  missingDocsCount = 0,
  grossTaxableTurnover = 0,
  taxablePurchases = 0,
  eligibleItc = 0,
  caFee = 1986,
  platformGst = 358,
  totalPayable = 2344,
  onApprove,
  onRequestChanges,
  onEditFilingDetails,
  onEditTaxComputation,
  onEditFilingFee,
  onEditDocuments,
  isFetching,
  onReuploadDocuments,
  onUpdateComputation,
}) => {
  // Numeric computation state
  const baseTurnover = parseNumeric(grossTaxableTurnover, 0);
  const basePurchases = parseNumeric(taxablePurchases, 0);
  const baseItc = parseNumeric(eligibleItc, 0);

  const [currentTurnover, setCurrentTurnover] = useState(baseTurnover);
  const [currentPurchases, setCurrentPurchases] = useState(basePurchases);
  const [currentItc, setCurrentItc] = useState(baseItc);

  // Automatically update computation state when values are retrieved from database
  useEffect(() => {
    setCurrentTurnover(baseTurnover);
  }, [baseTurnover]);

  useEffect(() => {
    setCurrentPurchases(basePurchases);
  }, [basePurchases]);

  useEffect(() => {
    setCurrentItc(baseItc);
  }, [baseItc]);

  // Derived reconciled calculations
  const outputGst = Math.round(currentTurnover * 0.18);
  const netLiability = Math.max(0, outputGst - currentItc);

  // Edit computation modal state
  const [isEditingComputation, setIsEditingComputation] = useState(false);
  const [editTurnoverStr, setEditTurnoverStr] = useState(String(currentTurnover));
  const [editPurchasesStr, setEditPurchasesStr] = useState(String(currentPurchases));
  const [editItcStr, setEditItcStr] = useState(String(currentItc));

  const handleOpenComputationModal = () => {
    setEditTurnoverStr(String(currentTurnover));
    setEditPurchasesStr(String(currentPurchases));
    setEditItcStr(String(currentItc));
    setIsEditingComputation(true);
  };

  const handleSaveComputation = () => {
    const newTurnover = parseNumeric(editTurnoverStr, currentTurnover);
    const newPurchases = parseNumeric(editPurchasesStr, currentPurchases);
    const newItc = parseNumeric(editItcStr, currentItc);
    setCurrentTurnover(newTurnover);
    setCurrentPurchases(newPurchases);
    setCurrentItc(newItc);
    setIsEditingComputation(false);
    onUpdateComputation?.(newTurnover, newItc, newPurchases);
  };

  const returnFormName = filingType ? filingType.split(" ")[0] : "GSTR-1";

  const renderEditButton = (onPress?: () => void) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.editBtn}
    >
      <Ionicons name="pencil" size={12} color={BrandColors.PRIMARY_ORANGE} />
      <Text style={styles.editBtnText}>Edit</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isFetching && (
        <View style={styles.syncBanner}>
          <ActivityIndicator size="small" color={BrandColors.PRIMARY_ORANGE} />
          <Text style={styles.syncBannerText}>
            Synchronizing live details from database...
          </Text>
        </View>
      )}

      {/* Ready for Review Banner */}
      <View style={styles.readyCard}>
        <View style={styles.readyIconBox}>
          <Ionicons name="checkmark-sharp" size={16} color="#059669" />
        </View>
        <View style={styles.readyTextCol}>
          <Text style={styles.readyHeading}>Ready for Review</Text>
          <Text style={styles.readySub}>
            TaxEdge CA has prepared return computation based on your verified business records
          </Text>
        </View>
      </View>

      {/* 1. Filing Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Filing Details</Text>
          {renderEditButton(onEditFilingDetails)}
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>GSTIN</Text>
          <Text style={styles.value}>{gstin || "Not Provided"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Business Entity</Text>
          <Text style={styles.value}>{businessName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Taxpayer Scheme</Text>
          <Text style={styles.value}>{taxpayerScheme}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Filing Type</Text>
          <Text style={styles.value}>{filingNature}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Financial Year</Text>
          <Text style={styles.value}>{financialYear}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Filing Period</Text>
          <Text style={styles.value}>{filingMonth}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Filing Frequency</Text>
          <Text style={styles.value}>{filingFrequency}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Return Form</Text>
          <Text style={styles.value}>{returnFormName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Attached Documents</Text>
          {missingDocsCount > 0 ? (
            <Text style={[styles.value, styles.valueMissing]}>
              {missingDocsCount} {missingDocsCount === 1 ? "Document" : "Documents"} Missing
            </Text>
          ) : (
            <Text style={styles.value}>
              {uploadedDocsCount} {uploadedDocsCount === 1 ? "File" : "Files"} Verified
            </Text>
          )}
        </View>
      </View>

      {/* 2. Tax Computation (Reconciled) Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Tax Computation (Reconciled)</Text>
          {renderEditButton(handleOpenComputationModal)}
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Gross Taxable Turnover</Text>
          <Text style={styles.value}>{formatInr(currentTurnover)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estimated Taxable Purchases</Text>
          <Text style={styles.value}>{formatInr(currentPurchases)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Output GST (18%)</Text>
          <Text style={styles.value}>{formatInr(outputGst)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Eligible Input Tax Credit (ITC)</Text>
          <Text style={[styles.value, styles.valueSuccess]}>- {formatInr(currentItc)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Net Tax Liability (Govt)</Text>
          <Text style={styles.value}>{formatInr(netLiability)}</Text>
        </View>
      </View>

      {/* 3. Professional Filing Fee Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Professional Filing Fee</Text>
          {renderEditButton(onEditFilingFee)}
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>CA Consultancy & Reconciliation</Text>
          <Text style={styles.value}>{formatInr(caFee)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Platform GST (18%)</Text>
          <Text style={styles.value}>{formatInr(platformGst)}</Text>
        </View>

        {/* Total Payable Row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalValue}>{formatInr(totalPayable)}</Text>
        </View>
      </View>

      {/* 4. Documents Card with Real Missing Docs and Reupload Button */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Documents</Text>
          {renderEditButton(onEditDocuments || onReuploadDocuments)}
        </View>
        <View style={styles.divider} />

        {missingDocsCount > 0 ? (
          <View style={styles.missingDocsRow}>
            <View style={styles.missingAlertBox}>
              <Ionicons name="warning-outline" size={24} color="#E11D48" style={styles.alertIconTopMargin} />
              <View style={styles.flex1Col}>
                <Text style={styles.missingAlertTitle}>
                  {missingDocsCount} {missingDocsCount === 1 ? "Document" : "Documents"} Missing
                </Text>
                <Text style={styles.missingAlertSub}>
                  Please upload the missing documents to proceed with filing.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.reuploadBtn}
              activeOpacity={0.8}
              onPress={onReuploadDocuments || onEditDocuments}
            >
              <Ionicons name="cloud-upload-outline" size={17} color={BrandColors.PRIMARY_ORANGE} />
              <Text style={styles.reuploadBtnText}>Reupload Here</Text>
              <Ionicons name="chevron-forward" size={13} color={BrandColors.PRIMARY_ORANGE} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.allDocsUploadedBox}>
            <Ionicons name="checkmark-circle" size={22} color="#059669" />
            <View style={styles.flex1Col}>
              <Text style={styles.allDocsUploadedTitle}>
                All Required Documents Uploaded
              </Text>
              <Text style={styles.allDocsUploadedSub}>
                {uploadedDocsCount} {uploadedDocsCount === 1 ? "document" : "documents"} verified and ready for CA computation.
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Interactive Modal to Edit Tax Computation */}
      <Modal
        visible={isEditingComputation}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditingComputation(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalBox}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Edit Tax Computation</Text>
              <TouchableOpacity onPress={() => setIsEditingComputation(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Adjust your taxable turnover and eligible ITC figures below. Tax liability will recalculate automatically.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gross Taxable Turnover (₹)</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={formatIndianNumberInput(editTurnoverStr)}
                onChangeText={(val) => setEditTurnoverStr(toRawNumericString(val))}
                placeholder="Enter turnover amount"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Estimated Taxable Purchases (₹)</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={formatIndianNumberInput(editPurchasesStr)}
                onChangeText={(val) => setEditPurchasesStr(toRawNumericString(val))}
                placeholder="Enter taxable purchases amount"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Eligible Input Tax Credit (ITC) (₹)</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={formatIndianNumberInput(editItcStr)}
                onChangeText={(val) => setEditItcStr(toRawNumericString(val))}
                placeholder="Enter eligible ITC amount"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.modalSummaryBox}>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Output GST (18%):</Text>
                <Text style={styles.modalSummaryVal}>
                  {formatInr(Math.round(parseNumeric(editTurnoverStr, 0) * 0.18))}
                </Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Net Tax Liability:</Text>
                <Text style={[styles.modalSummaryVal, styles.modalSummaryValHighlight]}>
                  {formatInr(
                    Math.max(
                      0,
                      Math.round(parseNumeric(editTurnoverStr, 0) * 0.18) - parseNumeric(editItcStr, 0)
                    )
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => {
                  setIsEditingComputation(false);
                  onEditTaxComputation?.();
                }}
              >
                <Text style={styles.modalSecondaryBtnText}>Full Form</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={handleSaveComputation}
              >
                <Text style={styles.modalPrimaryBtnText}>Apply & Recalculate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default GstFilingReviewStep;
