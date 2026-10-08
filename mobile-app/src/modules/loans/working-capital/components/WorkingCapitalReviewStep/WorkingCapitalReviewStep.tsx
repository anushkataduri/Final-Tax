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
import { styles } from "./WorkingCapitalReviewStep.styles";

export interface WorkingCapitalReviewStepProps {
  loanDetails: LoanDetailsFormData;
  businessDetails: LoanBusinessFormData;
  bankingDetails: LoanBankingFormData;
  documents: LoanDocumentItem[];
  profile?: Partial<CustomerProfileSummary>;
  isConsentChecked: boolean;
  onConsentToggle: (checked: boolean) => void;
  onGoToStep: (stepIndex: number) => void;
}

const formatCurrency = (val?: string | number): string => {
  const num = Number(val);
  if (!val || isNaN(num)) return "₹0";
  return `₹${num.toLocaleString("en-IN")}`;
};

const maskAcc = (acc?: string): string => {
  if (!acc || acc.length < 5) return acc || "—";
  return `XXXXXX${acc.slice(-4)}`;
};

export const WorkingCapitalReviewStep: React.FC<WorkingCapitalReviewStepProps> = ({
  loanDetails,
  businessDetails,
  bankingDetails,
  documents,
  profile,
  isConsentChecked,
  onConsentToggle,
  onGoToStep,
}) => {
  const uploadedDocs = documents.filter((d) => Boolean(d.fileUri));

  const renderCardHeader = (
    title: string,
    stepIndex?: number,
    rightElement?: React.ReactNode
  ) => (
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      {stepIndex !== undefined ? (
        <TouchableOpacity
          style={styles.editAction}
          onPress={() => onGoToStep(stepIndex)}
        >
          <Ionicons
            name="create-outline"
            size={14}
            color={BrandColors.PRIMARY_BLUE}
          />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      ) : (
        rightElement
      )}
    </View>
  );

  const renderRow = (
    label: string,
    value?: string | number,
    isHighlight: boolean = false
  ) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={isHighlight ? styles.highlightValue : styles.value}>
        {value || "—"}
      </Text>
    </View>
  );

  const renderDocBadge = (doc: LoanDocumentItem) => (
    <View key={doc.id} style={styles.docBadge}>
      <Ionicons name="document-text" size={12} color="#15803D" />
      <Text style={styles.docBadgeText}>{doc.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Credit Facility Dossier Review</Text>
      <Text style={styles.sectionSubtitle}>
        Review requested facility limit, enterprise profile, and financial audit files.
      </Text>

      {/* Promoter Identity Card */}
      <View style={styles.summaryCard}>
        {renderCardHeader(
          "Promoter Information",
          undefined,
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
            <Text style={styles.verifiedText}>Verified Profile</Text>
          </View>
        )}
        {renderRow("Applicant Name", profile?.name || "Client Name")}
        {renderRow("Mobile", profile?.mobile)}
        {renderRow("PAN", profile?.pan)}
      </View>

      {/* Facility Card */}
      <View style={styles.summaryCard}>
        {renderCardHeader("Credit Facility Terms", 0)}
        {renderRow("Requested Limit", formatCurrency(loanDetails.requiredAmount), true)}
        {renderRow("Facility Type", loanDetails.purpose)}
        {renderRow(
          "Sanction Period",
          loanDetails.preferredTenureMonths
            ? `${loanDetails.preferredTenureMonths} Months`
            : undefined
        )}
      </View>

      {/* Enterprise Details Card */}
      <View style={styles.summaryCard}>
        {renderCardHeader("Enterprise Profile", 1)}
        {renderRow("Enterprise Name", businessDetails.businessName)}
        {businessDetails.gstin ? renderRow("GSTIN", businessDetails.gstin) : null}
        {businessDetails.udyamRegistration
          ? renderRow("Udyam Reg.", businessDetails.udyamRegistration)
          : null}
        {renderRow(
          "Vintage",
          businessDetails.businessVintageYears
            ? `${businessDetails.businessVintageYears} Years`
            : undefined
        )}
        {renderRow("Turnover", formatCurrency(businessDetails.annualTurnover))}
        {renderRow("Net Profit", formatCurrency(businessDetails.netProfit))}
      </View>

      {/* Current Account Card */}
      <View style={styles.summaryCard}>
        {renderCardHeader("Disbursement Current Account", 1)}
        {renderRow("Bank", bankingDetails.primaryBankName)}
        {renderRow("Account Number", maskAcc(bankingDetails.accountNumber))}
        {renderRow("IFSC Code", bankingDetails.ifscCode)}
      </View>

      {/* Uploaded Documents Card */}
      <View style={styles.summaryCard}>
        {renderCardHeader("Uploaded Records", 2)}
        <View style={styles.docsGrid}>
          {uploadedDocs.map(renderDocBadge)}
          {uploadedDocs.length === 0 && (
            <Text style={styles.emptyDocsText}>
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
          I authorize TaxEdge to share our audited balance sheets, GSTR filings, and operating bank
          statements with consortium banking partners to structure this Working Capital line.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkingCapitalReviewStep;

