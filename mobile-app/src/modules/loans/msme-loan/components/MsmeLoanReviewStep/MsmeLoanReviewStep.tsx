import React from "react";
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
import { styles } from "./MsmeLoanReviewStep.styles";

export interface MsmeLoanReviewStepProps {
  loanDetails: LoanDetailsFormData;
  businessDetails: LoanBusinessFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
  profile?: Partial<CustomerProfileSummary>;
  isConsentChecked: boolean;
  onConsentToggle: (checked: boolean) => void;
  onGoToStep: (stepIndex: number) => void;
}

export const MsmeLoanReviewStep: React.FC<MsmeLoanReviewStepProps> = ({
  loanDetails,
  businessDetails,
  bankingDetails,
  documents,
  profile,
  isConsentChecked,
  onConsentToggle,
  onGoToStep,
}) => {
  const formatCurrency = (val?: string | number) => {
    const num = Number(val);
    if (!val || isNaN(num)) return "₹0";
    return "₹" + num.toLocaleString("en-IN");
  };

  const maskAcc = (acc?: string) => {
    if (!acc || acc.length < 5) return acc || "—";
    return `XXXXXX${acc.slice(-4)}`;
  };

  const uploadedDocs = documents.filter((d) => Boolean(d.fileUri));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MSME Scheme Application Review</Text>
      <Text style={styles.sectionSubtitle}>
        Review enterprise credentials, priority lending requirements, and disbursement account.
      </Text>

      {/* Promoter Identity Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Authorized Signatory</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
            <Text style={{ fontSize: 11, fontWeight: "600", color: "#16A34A" }}>
              Verified Profile
            </Text>
          </View>
        </View>

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
      </View>

      {/* MSME Loan Details Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>MSME Facility Request</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(0)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_BLUE}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Requested Amount</Text>
          <Text style={styles.highlightValue}>
            {formatCurrency(loanDetails.requiredAmount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Purpose</Text>
          <Text style={styles.value}>{loanDetails.purpose || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tenure</Text>
          <Text style={styles.value}>
            {loanDetails.preferredTenureMonths} Months
          </Text>
        </View>
      </View>

      {/* Enterprise / Udyam Profile Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>MSME Enterprise Details</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(1)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_BLUE}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Enterprise Name</Text>
          <Text style={styles.value}>{businessDetails.businessName}</Text>
        </View>
        {businessDetails.udyamRegistration ? (
          <View style={styles.row}>
            <Text style={styles.label}>Udyam Reg. No.</Text>
            <Text style={styles.value}>{businessDetails.udyamRegistration}</Text>
          </View>
        ) : null}
        {businessDetails.gstin ? (
          <View style={styles.row}>
            <Text style={styles.label}>GSTIN</Text>
            <Text style={styles.value}>{businessDetails.gstin}</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>Business Vintage</Text>
          <Text style={styles.value}>{businessDetails.businessVintageYears} Years</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Annual Turnover</Text>
          <Text style={styles.value}>{formatCurrency(businessDetails.annualTurnover)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Net Profit</Text>
          <Text style={styles.value}>{formatCurrency(businessDetails.netProfit)}</Text>
        </View>
      </View>

      {/* Current Banking Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Disbursement Bank Account</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(2)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_BLUE}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Primary Bank</Text>
          <Text style={styles.value}>
            {bankingDetails.primaryBankName || "—"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Account Number</Text>
          <Text style={styles.value}>{maskAcc(bankingDetails.accountNumber)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>IFSC Code</Text>
          <Text style={styles.value}>{bankingDetails.ifscCode || "—"}</Text>
        </View>
      </View>

      {/* Uploaded Records Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Uploaded MSME Documents</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(3)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_BLUE}
            />
            <Text style={styles.editText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.docsGrid}>
          {uploadedDocs.map((doc) => (
            <View key={doc.id} style={styles.docBadge}>
              <Ionicons name="document-text" size={12} color="#15803D" />
              <Text style={styles.docBadgeText}>{doc.name}</Text>
            </View>
          ))}
          {uploadedDocs.length === 0 && (
            <Text style={[styles.label, { fontStyle: "italic" }]}>
              No documents uploaded yet.
            </Text>
          )}
        </View>
      </View>

      {/* Consent Declaration */}
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
              color={BrandColors.WHITE}
            />
          )}
        </View>
        <Text style={styles.consentText}>
          I confirm that the enterprise information provided is genuine and matches Udyam registration
          data. I authorize TaxEdge to process this MSME loan file with partner lending institutions and CGTMSE schemes.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MsmeLoanReviewStep;
