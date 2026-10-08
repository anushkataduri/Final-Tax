import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanDocumentItem,
  CustomerProfileSummary,
} from "../../../types/loans.types";
import { DocumentPreviewModal } from "../DocumentPreviewModal";
import { styles } from "./HomeLoanReviewStep.styles";

export interface HomeLoanReviewStepProps {
  loanDetails: LoanDetailsFormData;
  businessDetails?: LoanBusinessFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
  profile?: Partial<CustomerProfileSummary>;
  isConsentChecked: boolean;
  onConsentToggle: (checked: boolean) => void;
  onGoToStep: (stepIndex: number) => void;
}

export const HomeLoanReviewStep: React.FC<HomeLoanReviewStepProps> = ({
  loanDetails,
  businessDetails,
  bankingDetails,
  documents,
  isConsentChecked,
  onConsentToggle,
  onGoToStep,
}) => {
  const [previewDoc, setPreviewDoc] = useState<LoanDocumentItem | null>(null);

  const formatCurrency = (val?: string | number) => {
    if (!val) return "—";
    const str = String(val).trim();
    if (
      str.startsWith("₹") ||
      str.includes("-") ||
      str.toLowerCase().includes("below") ||
      str.toLowerCase().includes("above")
    ) {
      return str;
    }
    const num = Number(val);
    if (isNaN(num)) return str;
    return "₹" + num.toLocaleString("en-IN");
  };

  const maskAcc = (acc?: string) => {
    if (!acc || acc.length < 5) return acc || "Not provided";
    return `•••• •••• ${acc.slice(-4)}`;
  };

  const uploadedDocs = documents.filter((d) => Boolean(d.fileUri));
  const purposeDisplay =
    loanDetails.purpose === "Others" && loanDetails.customPurpose
      ? `${loanDetails.customPurpose} (Custom)`
      : loanDetails.purpose || "Not specified";

  return (
    <View style={styles.container}>
      {/* 1. Housing Loan & Property Details Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="home-outline"
              size={18}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Loan & Property Requirements</Text>
          </View>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(0)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE_DARK || "#EA580C"}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.readOnlyGrid}>
          <View style={styles.row}>
            <Text style={styles.label}>Requested Amount</Text>
            <Text style={styles.highlightValue}>
              {loanDetails.requiredAmount
                ? formatCurrency(loanDetails.requiredAmount)
                : "Not specified"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Property Intent</Text>
            <Text style={styles.value}>{purposeDisplay}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Repayment Tenure</Text>
            <Text style={styles.value}>
              {loanDetails.preferredTenureMonths
                ? `${loanDetails.preferredTenureMonths} Months (${Math.round(Number(loanDetails.preferredTenureMonths) / 12)} Years)`
                : "Not specified"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Property Stage</Text>
            <Text style={styles.value}>{loanDetails.propertyStage || "Not specified"}</Text>
          </View>
          {Boolean(loanDetails.estimatedPropertyValue) && (
            <View style={styles.row}>
              <Text style={styles.label}>Estimated Property Cost</Text>
              <Text style={styles.value}>
                {formatCurrency(loanDetails.estimatedPropertyValue)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 2. Employment & Financial Profile Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="briefcase-outline"
              size={18}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Employment & Income Profile</Text>
          </View>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(1)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE_DARK || "#EA580C"}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.readOnlyGrid}>
          <View style={styles.row}>
            <Text style={styles.label}>Occupation Category</Text>
            <Text style={styles.value}>{loanDetails.employmentType || "Not specified"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly Net Income</Text>
            <Text style={styles.value}>
              {loanDetails.monthlyIncomeOrTurnover
                ? formatCurrency(loanDetails.monthlyIncomeOrTurnover)
                : "Not specified"}
            </Text>
          </View>

          {Boolean(businessDetails?.businessName) && (
            <View style={styles.row}>
              <Text style={styles.label}>Business Firm Name</Text>
              <Text style={styles.value}>{businessDetails?.businessName}</Text>
            </View>
          )}
          {Boolean(businessDetails?.gstin) && (
            <View style={styles.row}>
              <Text style={styles.label}>GSTIN</Text>
              <Text style={styles.value}>{businessDetails?.gstin}</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Other Ongoing EMIs</Text>
            <Text style={styles.value}>
              {loanDetails.hasExistingLoans && loanDetails.existingEmi
                ? formatCurrency(loanDetails.existingEmi)
                : "No Running EMIs"}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Disbursement Account & ITR Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="wallet-outline"
              size={18}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Banking & ITR Compliance</Text>
          </View>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(2)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE_DARK || "#EA580C"}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.readOnlyGrid}>
          <View style={styles.row}>
            <Text style={styles.label}>Disbursement Bank</Text>
            <Text style={styles.value}>
              {bankingDetails.primaryBankName || "Not specified"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Account Number</Text>
            <Text style={styles.value}>{maskAcc(bankingDetails.accountNumber)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>IFSC Code</Text>
            <Text style={styles.value}>{bankingDetails.ifscCode || "Not specified"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ITR Filing Status</Text>
            <Text style={styles.value}>{bankingDetails.itrFilingStatus || "Not specified"}</Text>
          </View>
          {Boolean(bankingDetails.grossTotalIncome) && (
            <View style={styles.row}>
              <Text style={styles.label}>Declared Gross Income</Text>
              <Text style={styles.value}>
                {formatCurrency(bankingDetails.grossTotalIncome)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 4. Uploaded Property & Income Dossier - Structured List with Preview */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Uploaded Records ({uploadedDocs.length})</Text>
          </View>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(3)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE_DARK || "#EA580C"}
            />
            <Text style={styles.editText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.docsList}>
          {uploadedDocs.map((doc) => (
            <View key={doc.id} style={styles.docRow}>
              <View style={styles.docRowLeft}>
                <View style={styles.docIconCircle}>
                  <Ionicons name="shield-checkmark" size={16} color="#166534" />
                </View>
                <View style={styles.docMetaCol}>
                  <Text style={styles.docTitle} numberOfLines={1}>
                    {doc.name}
                  </Text>
                  <Text style={styles.docSub} numberOfLines={1}>
                    ✓ {doc.fileName || "Uploaded"} {doc.fileSize ? `(${doc.fileSize})` : ""}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.previewBtn}
                onPress={() => setPreviewDoc(doc)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="eye-outline"
                  size={13}
                  color={BrandColors.PRIMARY_ORANGE_DARK || "#EA580C"}
                />
                <Text style={styles.previewBtnText}>Preview</Text>
              </TouchableOpacity>
            </View>
          ))}

          {uploadedDocs.length === 0 && (
            <Text style={[styles.label, { fontStyle: "italic", marginVertical: 4 }]}>
              No documents uploaded yet.
            </Text>
          )}
        </View>
      </View>

      {/* 5. Consent Declaration */}
      <TouchableOpacity
        style={styles.consentContainer}
        activeOpacity={0.8}
        onPress={() => onConsentToggle(!isConsentChecked)}
      >
        <View
          style={[styles.checkbox, isConsentChecked && styles.checkboxActive]}
        >
          {isConsentChecked && (
            <Ionicons
              name="checkmark"
              size={14}
              color="#FFFFFF"
            />
          )}
        </View>
        <Text style={styles.consentText}>
          I authorize TaxEdge to evaluate my credit report and share my property purchase details
          and income proofs with partner housing finance institutions for home loan underwriting.
        </Text>
      </TouchableOpacity>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        visible={Boolean(previewDoc)}
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </View>
  );
};

export default HomeLoanReviewStep;
