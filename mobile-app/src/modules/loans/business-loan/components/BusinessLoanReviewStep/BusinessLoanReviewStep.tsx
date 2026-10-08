import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  LoanDetailsFormData,
  LoanBusinessFormData,
  LoanBankingFormData,
  LoanDocumentItem,
  CustomerProfileSummary,
} from "../../../types/loans.types";
import { BrandColors } from "../../../../../shared/theme";
import { formatTenureEquivalent } from "../BusinessLoanFinancialsStep/BusinessLoanFinancialsStep";
import { styles } from "./BusinessLoanReviewStep.styles";

export interface BusinessLoanReviewStepProps {
  loanDetails: LoanDetailsFormData;
  businessDetails: LoanBusinessFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
  profile?: Partial<CustomerProfileSummary>;
  isConsentChecked: boolean;
  onConsentToggle: (checked: boolean) => void;
  onGoToStep: (stepIndex: number) => void;
}

export const BusinessLoanReviewStep: React.FC<BusinessLoanReviewStepProps> = ({
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
    if (!val) return "—";
    const num = Number(val);
    if (isNaN(num)) return String(val);
    return "₹" + num.toLocaleString("en-IN");
  };

  const maskAcc = (acc?: string) => {
    if (!acc) return "—";
    if (acc.length <= 4) return acc;
    return `XXXXXX${acc.slice(-4)}`;
  };

  const maskAadhaar = (aadhaar?: string) => {
    if (!aadhaar) return "—";
    if (aadhaar.length <= 4) return aadhaar;
    return `XXXX-XXXX-${aadhaar.slice(-4)}`;
  };

  const uploadedDocs = documents.filter((d) => Boolean(d.fileUri && d.fileUri.trim() !== ""));

  return (
    <View style={styles.container}>
      {/* Title Banner */}
      <Text style={styles.sectionTitle}>Application Dossier Review</Text>
      <Text style={styles.sectionSubtitle}>
        Please review all the details and uploaded documents before submitting to our lending partners.
      </Text>

      {/* 1. Applicant Information */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, styles.iconBoxBlue]}>
              <Ionicons name="person" size={16} color="#2563EB" />
            </View>
            <Text style={styles.cardTitle}>Applicant Information</Text>
          </View>
          {profile?.name ? (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#166534" />
              <Text style={styles.verifiedText}>Verified Profile</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{profile?.name || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{profile?.mobile || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile?.email || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>PAN Number</Text>
          <Text style={styles.value}>{profile?.pan || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Aadhaar</Text>
          <Text style={styles.value}>{maskAadhaar(profile?.aadhaar)}</Text>
        </View>
      </View>

      {/* 2. Loan Requirement */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, styles.iconBoxOrange]}>
              <Ionicons name="cash" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Loan Requirement</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(0)} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={14} color={BrandColors.PRIMARY_ORANGE || "#EA580C"} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Facility Type</Text>
          <Text style={styles.value}>{loanDetails.loanType || "Business Loan"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Requested Amount</Text>
          <Text style={styles.value}>{formatCurrency(loanDetails.requiredAmount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Purpose</Text>
          <Text style={styles.value}>{loanDetails.purpose || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Preferred Tenure</Text>
          <Text style={styles.value}>
            {loanDetails.preferredTenureMonths
              ? formatTenureEquivalent(loanDetails.preferredTenureMonths)
              : "—"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Existing Loans</Text>
          <Text style={styles.value}>{loanDetails.hasExistingLoans ? "Yes" : "No"}</Text>
        </View>
        {loanDetails.hasExistingLoans && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Existing Lender Name</Text>
              <Text style={styles.value}>{bankingDetails.existingLenderName || "—"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Active Limit</Text>
              <Text style={styles.value}>{formatCurrency(bankingDetails.existingLoanOutstanding)}</Text>
            </View>
            {Boolean(loanDetails.existingEmi) && (
              <View style={styles.row}>
                <Text style={styles.label}>Existing EMI</Text>
                <Text style={styles.value}>{formatCurrency(loanDetails.existingEmi)}</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* 3. Business Details */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, styles.iconBoxPurple]}>
              <Ionicons name="git-network-outline" size={16} color="#7C3AED" />
            </View>
            <Text style={styles.cardTitle}>Business Details</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(1)} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={14} color={BrandColors.PRIMARY_ORANGE || "#EA580C"} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Firm / Business Name</Text>
          <Text style={styles.value}>{businessDetails.businessName || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Business Constitution</Text>
          <Text style={styles.value}>{businessDetails.businessConstitution || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Authorized Signatory</Text>
          <Text style={styles.value}>{businessDetails.signatoryName || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>GSTIN</Text>
          <Text style={styles.value}>{businessDetails.gstin || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Udyam Registration</Text>
          <Text style={styles.value}>
            {businessDetails.hasUdyam && businessDetails.udyamRegistration
              ? `Yes (${businessDetails.udyamRegistration})`
              : businessDetails.hasUdyam
              ? "Yes"
              : "No"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Business Vintage</Text>
          <Text style={styles.value}>
            {businessDetails.businessVintageYears ? `${businessDetails.businessVintageYears}` : "—"}
          </Text>
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

      {/* 4. Banking & Tax Details */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, styles.iconBoxRed]}>
              <Ionicons name="business" size={16} color="#DC2626" />
            </View>
            <Text style={styles.cardTitle}>Banking & Tax Details</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(2)} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={14} color={BrandColors.PRIMARY_ORANGE || "#EA580C"} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Bank</Text>
          <Text style={styles.value}>{bankingDetails.primaryBankName || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Account Number</Text>
          <Text style={styles.value}>{maskAcc(bankingDetails.accountNumber)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>IFSC Code</Text>
          <Text style={styles.value}>{bankingDetails.ifscCode || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ITR Status</Text>
          <Text style={styles.value}>
            {bankingDetails.itrAckNumber
              ? `Filed (Ack: ${bankingDetails.itrAckNumber})`
              : bankingDetails.itrFilingStatus || "Not Filed"}
          </Text>
        </View>
        {Boolean(bankingDetails.grossTotalIncome) && (
          <View style={styles.row}>
            <Text style={styles.label}>Gross Total Income</Text>
            <Text style={styles.value}>{formatCurrency(bankingDetails.grossTotalIncome)}</Text>
          </View>
        )}
      </View>

      {/* 5. Uploaded Documents */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, styles.iconBoxGreen]}>
              <Ionicons name="document-text" size={16} color="#166534" />
            </View>
            <Text style={styles.cardTitle}>Uploaded Documents</Text>
          </View>

          <View style={styles.docHeaderActions}>
            <Text style={styles.docCountText}>
              {uploadedDocs.length} uploaded
            </Text>
            <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(3)} activeOpacity={0.7}>
              <Ionicons name="create-outline" size={14} color={BrandColors.PRIMARY_ORANGE || "#EA580C"} />
              <Text style={styles.editText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.docsGrid}>
          {uploadedDocs.length > 0 ? (
            uploadedDocs.map((doc) => (
              <View key={doc.id} style={styles.docBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#166534" />
                <Text style={styles.docBadgeText}>{doc.name}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDocsText}>No documents uploaded yet.</Text>
          )}
        </View>
      </View>

      {/* 6. Consent Authorization Box */}
      <TouchableOpacity
        style={styles.consentContainer}
        activeOpacity={0.8}
        onPress={() => onConsentToggle(!isConsentChecked)}
      >
        <View style={[styles.checkbox, isConsentChecked && styles.checkboxActive]}>
          {isConsentChecked && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
        </View>
        <Text style={styles.consentText}>
          I hereby authorize TaxEdge and its lending partners to fetch my credit bureau report (CIBIL/Experian), verify submitted tax/bank statements, and represent my loan file before financial institutions.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BusinessLoanReviewStep;
