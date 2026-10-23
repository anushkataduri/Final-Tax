import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  ItrFilingFormData,
  MissingInfoItem,
} from "../../types/itrFiling.types";
import { MissingInfoBanner } from "../../../components/MissingInfoBanner";
import { ItrTaxCalculationCard } from "./ItrTaxCalculationCard";
import { styles } from "./Step5TaxSummaryReview.styles";

interface Step5TaxSummaryReviewProps {
  formData: ItrFilingFormData;
  isSubmitting: boolean;
  onEditStep: (stepIndex: number) => void;
  onToggleDeclaration: (accepted: boolean) => void;
  onSubmit: () => void;
}

export const Step5TaxSummaryReview: React.FC<Step5TaxSummaryReviewProps> = ({
  formData,
  isSubmitting,
  onEditStep,
  onToggleDeclaration,
  onSubmit,
}) => {
  const {
    personalInfo,
    bankDetails,
    incomeSources,
    determinedForm,
    regime,
    calculation,
    documents,
    gstReconciliation,
    declarationAccepted,
  } = formData;

  // Filter uploaded or profile verified documents
  const verifiedOrUploadedDocs = documents.filter((d) => d.fileUri || d.isProfileVerified);

  // Derive Missing Information / Discrepancy list
  const missingItems: MissingInfoItem[] = [];

  if (gstReconciliation && gstReconciliation.hasVariance) {
    missingItems.push({
      id: "miss-gst",
      severity: "WARNING",
      title: `GST turnover differs from books turnover by ₹${gstReconciliation.variance.toLocaleString("en-IN")}`,
      actionLabel: "Review",
      targetStep: 1,
    });
  }

  const missingRequiredDocs = documents.filter((d) => d.required && !d.fileUri && !d.isProfileVerified);
  if (missingRequiredDocs.length > 0) {
    missingItems.push({
      id: "miss-doc",
      severity: "REQUIRED",
      title: `${missingRequiredDocs.length} required documents missing`,
      actionLabel: "Upload",
      targetStep: 3,
    });
  }

  const handleSubmitPress = () => {
    if (!declarationAccepted) {
      Alert.alert(
        "Declaration Required",
        "Please accept the declaration below before submitting your application for CA review."
      );
      return;
    }
    onSubmit();
  };

  const isRefund = calculation.finalType === "REFUND";
  const maskedBankNumber = bankDetails.accountNumber
    ? `•••• ${bankDetails.accountNumber.slice(-4)}`
    : "";

  // Summary Rows for declared items
  const baseSummaryRows = [
    {
      id: "rec-personal",
      title: "Taxpayer Identity",
      sub: `PAN: ${personalInfo.pan || "Not provided"} • Name: ${personalInfo.name || "Client"}`,
      tagText: "Profile Verified",
      tagType: "verified" as const,
      visible: true,
    },
    {
      id: "rec-bank",
      title: "Refund Bank Account",
      sub: bankDetails.bankName
        ? `${bankDetails.bankName} (${maskedBankNumber})`
        : "Bank account selected",
      tagText: bankDetails.isPrimaryRefund ? "Selected" : "Bank Added",
      tagType: "verified" as const,
      visible: Boolean(bankDetails.bankName),
    },
    {
      id: "rec-salary",
      title: "Salary Income",
      sub: `${incomeSources.salary.employerName || "Salary"} (TDS: ₹${Number(incomeSources.salary.tdsDeducted || 0).toLocaleString("en-IN")})`,
      amount: `₹ ${Number(incomeSources.salary.grossSalary || 0).toLocaleString("en-IN")}`,
      tagText: incomeSources.salary.source === "FORM_16" ? "Form 16 Matched" : "Declared",
      tagType: incomeSources.salary.source === "FORM_16" ? ("verified" as const) : ("imported" as const),
      visible: incomeSources.salary.enabled && Number(incomeSources.salary.grossSalary || 0) > 0,
    },
    {
      id: "rec-business",
      title: "Business Turnover",
      sub: incomeSources.business.businessName || "Business / Profession Declared",
      amount: `₹ ${Number(incomeSources.business.grossTurnover || 0).toLocaleString("en-IN")}`,
      tagText: gstReconciliation?.hasVariance ? "Variance Noted" : "Declared",
      tagType: gstReconciliation?.hasVariance ? ("warning" as const) : ("verified" as const),
      visible: incomeSources.business.enabled && Number(incomeSources.business.grossTurnover || 0) > 0,
    },
    {
      id: "rec-cg",
      title: "Capital Gains",
      sub: incomeSources.capitalGains.brokerName
        ? `${incomeSources.capitalGains.brokerName} statement`
        : "Capital gains declared",
      amount: `₹ ${(Number(incomeSources.capitalGains.shortTermGains || 0) + Number(incomeSources.capitalGains.longTermGains || 0)).toLocaleString("en-IN")}`,
      tagText: incomeSources.capitalGains.statementUploaded ? "Broker Parsed" : "Declared",
      tagType: "imported" as const,
      visible:
        incomeSources.capitalGains.enabled &&
        (Number(incomeSources.capitalGains.shortTermGains || 0) > 0 ||
          Number(incomeSources.capitalGains.longTermGains || 0) > 0),
    },
    {
      id: "rec-other",
      title: "Other Sources (Interest & Dividends)",
      sub: "Savings interest, FD interest, dividends",
      amount: `₹ ${(Number(incomeSources.otherSources.savingsInterest || 0) + Number(incomeSources.otherSources.fdInterest || 0) + Number(incomeSources.otherSources.dividendIncome || 0)).toLocaleString("en-IN")}`,
      tagText: incomeSources.otherSources.source === "AIS_TIS" ? "AIS Imported" : "Declared",
      tagType: "imported" as const,
      visible:
        incomeSources.otherSources.enabled &&
        Number(incomeSources.otherSources.savingsInterest || 0) +
          Number(incomeSources.otherSources.fdInterest || 0) +
          Number(incomeSources.otherSources.dividendIncome || 0) >
          0,
    },
    {
      id: "rec-tds",
      title: "Taxes Deducted (TDS Credits)",
      sub: "Form 26AS / Employer TDS credits",
      amount: `₹ ${calculation.tdsCredits.toLocaleString("en-IN")}`,
      tagText: "Tax Credit",
      tagType: "verified" as const,
      visible: calculation.tdsCredits > 0,
    },
  ];

  const summaryRows = baseSummaryRows.filter((r) => r.visible);

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.bannerCard}>
        <Ionicons name="shield-checkmark" size={24} color="#059669" />
        <View style={styles.bannerTextCol}>
          <Text style={styles.bannerTitle}>Review Your ITR Application</Text>
          <Text style={styles.bannerSubtitle}>
            Review your declared income, deductions, and tax summary before submitting for CA review.
          </Text>
        </View>
      </View>

      {/* Actionable Missing Information Banner */}
      {missingItems.length > 0 && (
        <MissingInfoBanner items={missingItems} onResolve={onEditStep} />
      )}

      {/* 1. Summary & Declared Income */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="git-network-outline" size={18} color="#083B75" />
            <Text style={styles.cardHeaderTitle}>Summary & Declared Income</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onEditStep(1)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reconciliationTable}>
          {summaryRows.map((row) => (
            <View key={row.id} style={styles.reconciliationRow}>
              <View style={styles.reconciliationColLeft}>
                <Text style={styles.reconciliationTitle}>{row.title}</Text>
                <Text style={styles.reconciliationSub}>{row.sub}</Text>
              </View>

              <View style={styles.reconciliationColRight}>
                {row.amount && (
                  <Text style={styles.reconciliationAmount}>{row.amount}</Text>
                )}
                <View
                  style={
                    row.tagType === "verified"
                      ? styles.tagVerified
                      : row.tagType === "warning"
                      ? styles.tagWarning
                      : styles.tagImported
                  }
                >
                  <Ionicons
                    name={
                      row.tagType === "verified"
                        ? "checkmark-circle"
                        : row.tagType === "warning"
                        ? "alert-circle"
                        : "document-text"
                    }
                    size={11}
                    color={
                      row.tagType === "verified"
                        ? "#166534"
                        : row.tagType === "warning"
                        ? "#B45309"
                        : "#083B75"
                    }
                  />
                  <Text
                    style={
                      row.tagType === "verified"
                        ? styles.tagVerifiedText
                        : row.tagType === "warning"
                        ? styles.tagWarningText
                        : styles.tagImportedText
                    }
                  >
                    {row.tagText}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <ItrTaxCalculationCard
        calculation={calculation}
        regime={regime}
        isRefund={isRefund}
        bankName={bankDetails.bankName}
        maskedBankNumber={maskedBankNumber}
      />

      {/* 3. Filing Details Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="person-outline" size={18} color="#083B75" />
            <Text style={styles.cardHeaderTitle}>Filing & Taxpayer Details</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onEditStep(0)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Assessment Year</Text>
          <Text style={styles.detailValueBold}>AY {personalInfo.assessmentYear}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Applicable Return Form</Text>
          <Text style={styles.detailValueBold}>{determinedForm.form}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Full Name</Text>
          <Text style={styles.detailValue}>{personalInfo.name || "Client"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>PAN Number</Text>
          <Text style={styles.detailValue}>{personalInfo.pan || "Not provided"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Residential Status</Text>
          <Text style={styles.detailValue}>{personalInfo.residentialStatus || "Resident"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Primary Bank Account</Text>
          <Text style={styles.detailValue}>
            {bankDetails.bankName ? `${bankDetails.bankName} (${maskedBankNumber})` : "Not provided"}
          </Text>
        </View>
      </View>

      {/* 4. Uploaded & Verified Documents */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="attach-outline" size={18} color="#083B75" />
            <Text style={styles.cardHeaderTitle}>
              Uploaded Documents ({verifiedOrUploadedDocs.length})
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onEditStep(2)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.uploadedList}>
          {verifiedOrUploadedDocs.map((doc) => (
            <View key={doc.id} style={styles.uploadedItemRow}>
              <View style={styles.docCheckIcon}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
              </View>
              <View style={styles.docNameCol}>
                <Text style={styles.docItemName}>{doc.name}</Text>
                <Text style={styles.docItemFile}>
                  {doc.isProfileVerified
                    ? doc.profileVerifiedLabel || "Verified from Profile"
                    : `${doc.fileName || "Uploaded Document"} • ${doc.fileSize || "< 2 MB"}`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 5. Single Confirmation Checkbox */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.declarationBox}
        onPress={() => onToggleDeclaration(!declarationAccepted)}
      >
        <Ionicons
          name={declarationAccepted ? "checkbox" : "square-outline"}
          size={22}
          color={declarationAccepted ? BrandColors.PRIMARY_ORANGE : "#64748B"}
        />
        <Text style={styles.declarationText}>
          I confirm that the income details, deductions, bank account, and documents provided are correct and complete to the best of my knowledge.
        </Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isSubmitting}
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmitPress}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit for CA Review</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
