import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanDocumentItem,
  CustomerProfileSummary,
} from "../../../types/loans.types";
import { VehicleLoanDetailsFormData } from "../../types/vehicleLoan.types";
import { DocumentPreviewModal } from "../../../components/DocumentPreviewModal";
import { formatReviewAmount } from "../../../utils/loanFormatting";
import { maskAccountNumber } from "../../../utils/maskingUtils";
import { styles } from "./VehicleLoanReviewStep.styles";

export interface VehicleLoanReviewStepProps {
  loanDetails: VehicleLoanDetailsFormData;
  businessDetails?: LoanBusinessFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
  profile?: Partial<CustomerProfileSummary>;
  isConsentChecked: boolean;
  onConsentToggle: (checked: boolean) => void;
  onGoToStep: (stepIndex: number) => void;
}

export const VehicleLoanReviewStep: React.FC<VehicleLoanReviewStepProps> = ({
  loanDetails,
  businessDetails,
  bankingDetails,
  documents,
  profile,
  isConsentChecked,
  onConsentToggle,
  onGoToStep,
}) => {
  const [previewDoc, setPreviewDoc] = useState<LoanDocumentItem | null>(null);

  const uploadedDocs = documents.filter((d) => Boolean(d.fileUri));

  return (
    <View style={styles.container}>
      {/* 1. Borrower Information Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="person-circle-outline"
              size={18}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Borrower Profile</Text>
          </View>
          <View style={styles.verifiedRow}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
            <Text style={styles.verifiedText}>
              Verified Profile
            </Text>
          </View>
        </View>

        <View style={styles.readOnlyGrid}>
          <View style={styles.row}>
            <Text style={styles.label}>Applicant Name</Text>
            <Text style={styles.value}>{profile?.name || "Client Name"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mobile</Text>
            <Text style={styles.value}>{profile?.mobile || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>PAN</Text>
            <Text style={styles.value}>{profile?.pan || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Aadhaar</Text>
            <Text style={styles.value}>
              {profile?.aadhaar ? `XXXX-XXXX-${profile.aadhaar.slice(-4)}` : "—"}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Vehicle Financing Terms Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="car-outline"
              size={18}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Vehicle Financing Terms</Text>
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
            <Text style={styles.label}>Required Loan Amount</Text>
            <Text style={styles.highlightValue}>
              {formatReviewAmount(loanDetails.requiredAmount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vehicle Category / Purpose</Text>
            <Text style={styles.value}>
              {loanDetails.purpose === "Others" && loanDetails.customPurpose
                ? `${loanDetails.purpose} (${loanDetails.customPurpose})`
                : loanDetails.purpose || "Not specified"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vehicle Condition</Text>
            <Text style={styles.value}>
              {loanDetails.vehicleCondition || "Not specified"}
            </Text>
          </View>
          {Boolean(loanDetails.vehicleMakeModel) && (
            <View style={styles.row}>
              <Text style={styles.label}>Make & Model</Text>
              <Text style={styles.value}>{loanDetails.vehicleMakeModel}</Text>
            </View>
          )}
          {Boolean(loanDetails.onRoadPrice) && (
            <View style={styles.row}>
              <Text style={styles.label}>On-Road Price / Valuation</Text>
              <Text style={styles.value}>
                {formatReviewAmount(loanDetails.onRoadPrice)}
              </Text>
            </View>
          )}
          {Boolean(loanDetails.downPayment) && (
            <View style={styles.row}>
              <Text style={styles.label}>Down Payment / Margin</Text>
              <Text style={styles.value}>
                {formatReviewAmount(loanDetails.downPayment)}
              </Text>
            </View>
          )}
          {Boolean(loanDetails.registrationNumber) && (
            <View style={styles.row}>
              <Text style={styles.label}>Registration Number</Text>
              <Text style={styles.value}>{loanDetails.registrationNumber}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Repayment Tenure</Text>
            <Text style={styles.value}>
              {loanDetails.preferredTenureMonths
                ? `${loanDetails.preferredTenureMonths} Months (${Math.round(
                    Number(loanDetails.preferredTenureMonths) / 12
                  )} Yrs)`
                : "Not specified"}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Employment & Income Profile Card */}
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
            <Text style={styles.label}>Employment Category</Text>
            <Text style={styles.value}>
              {loanDetails.employmentType || "Not specified"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly In-Hand Income</Text>
            <Text style={styles.value}>
              {loanDetails.monthlyIncomeOrTurnover
                ? formatReviewAmount(loanDetails.monthlyIncomeOrTurnover)
                : "Not specified"}
            </Text>
          </View>

          {Boolean(businessDetails?.businessName) && (
            <View style={styles.row}>
              <Text style={styles.label}>Business / Firm Name</Text>
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
                ? formatReviewAmount(loanDetails.existingEmi)
                : "No Running EMIs"}
            </Text>
          </View>
        </View>
      </View>

      {/* 4. Disbursement Account & ITR Compliance Card */}
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
            <Text style={styles.label}>Operating Bank</Text>
            <Text style={styles.value}>
              {bankingDetails.primaryBankName || "Not specified"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Account Number</Text>
            <Text style={styles.value}>{maskAccountNumber(bankingDetails.accountNumber)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>IFSC Code</Text>
            <Text style={styles.value}>
              {bankingDetails.ifscCode || "Not specified"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ITR Filing Status</Text>
            <Text style={styles.value}>
              {bankingDetails.itrFilingStatus || "Not specified"}
            </Text>
          </View>
          {Boolean(bankingDetails.grossTotalIncome) && (
            <View style={styles.row}>
              <Text style={styles.label}>Declared Gross Annual Income</Text>
              <Text style={styles.value}>
                {formatReviewAmount(bankingDetails.grossTotalIncome)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 5. Uploaded Auto Dossier - Structured Vertical List with Preview */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>
              Uploaded Records ({uploadedDocs.length})
            </Text>
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
                    ✓ {doc.fileName || "Uploaded"}{" "}
                    {doc.fileSize ? `(${doc.fileSize})` : ""}
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

      {/* 6. Consent Declaration Checkbox */}
      <TouchableOpacity
        style={styles.consentContainer}
        activeOpacity={0.8}
        onPress={() => onConsentToggle(!isConsentChecked)}
      >
        <View
          style={[styles.checkbox, isConsentChecked && styles.checkboxActive]}
        >
          {isConsentChecked && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
        <Text style={styles.consentText}>
          I authorize TaxEdge to evaluate my credit report and share my vehicle purchase details,
          dealer quotation, and income verification records with partner banks and NBFC auto-financiers
          for hypothecation sanction.
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

export default VehicleLoanReviewStep;
