import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  LoanDetailsFormData,
  LoanBankingFormData,
  LoanDocumentItem,
  CustomerProfileSummary,
} from "../../../types/loans.types";
import { styles } from "./PersonalLoanReviewStep.styles";

export interface PersonalLoanReviewStepProps {
  loanDetails: LoanDetailsFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
  profile?: Partial<CustomerProfileSummary>;
  isConsentChecked: boolean;
  onConsentToggle: (checked: boolean) => void;
  onGoToStep: (stepIndex: number) => void;
}

export const PersonalLoanReviewStep: React.FC<PersonalLoanReviewStepProps> = ({
  loanDetails,
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
      <Text style={styles.sectionTitle}>Application Dossier Review</Text>
      <Text style={styles.sectionSubtitle}>
        Double-check your personal loan parameters and documents before lodging.
      </Text>

      {/* Applicant Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Applicant Information</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="checkmark-circle" size={14} color={BrandColors.PRIMARY_ORANGE} />
            <Text style={{ fontSize: 11, fontWeight: "600", color: BrandColors.PRIMARY_ORANGE_DARK }}>
              Verified Profile
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{profile?.name || "Client Name"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{profile?.mobile || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>PAN Number</Text>
          <Text style={styles.value}>{profile?.pan || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Aadhaar</Text>
          <Text style={styles.value}>
            {profile?.aadhaar ? `XXXX-XXXX-${profile.aadhaar.slice(-4)}` : "—"}
          </Text>
        </View>
      </View>

      {/* Loan Requirement Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Loan Requirement</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(0)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE}
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
        <View style={styles.row}>
          <Text style={styles.label}>Monthly In-Hand</Text>
          <Text style={styles.value}>
            {formatCurrency(loanDetails.monthlyIncomeOrTurnover)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Existing EMI</Text>
          <Text style={styles.value}>
            {loanDetails.hasExistingLoans
              ? formatCurrency(loanDetails.existingEmi)
              : "None (₹0)"}
          </Text>
        </View>
      </View>

      {/* Banking Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Disbursement Account</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(1)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Bank</Text>
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

      {/* Uploaded Documents Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Uploaded Records</Text>
          <TouchableOpacity
            style={styles.editAction}
            onPress={() => onGoToStep(2)}
          >
            <Ionicons
              name="create-outline"
              size={14}
              color={BrandColors.PRIMARY_ORANGE}
            />
            <Text style={styles.editText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.docsGrid}>
          {uploadedDocs.map((doc) => (
            <View key={doc.id} style={styles.docBadge}>
              <Ionicons name="document-text" size={12} color={BrandColors.PRIMARY_ORANGE} />
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
          I authorize TaxEdge and its partner lenders to check my credit score (CIBIL/Experian)
          and verify my employment & income credentials for processing this personal loan.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PersonalLoanReviewStep;
