import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanDetailsFormData, LoanApplicantFormData } from "../../../types/loans.types";
import { formatReviewAmountDigits, formatTenureEquivalent } from "../../../utils/loanFormatting";
import { maskPan as maskPanBase, maskMobile } from "../../../utils/maskingUtils";
import { styles } from "./PropertyLoanReviewStep.styles";

const maskPan = (pan?: string): string => maskPanBase(pan, { visibleStart: 5, visibleEnd: 1 });
const formatCurrency = formatReviewAmountDigits;

export interface PropertyLoanHeaderCardsProps {
  loanDetails: LoanDetailsFormData;
  applicantDetails: LoanApplicantFormData;
  onGoToStep: (stepIndex: number) => void;
}

export const PropertyLoanHeaderCards: React.FC<PropertyLoanHeaderCardsProps> = ({
  loanDetails,
  applicantDetails,
  onGoToStep,
}) => {
  return (
    <>
      {/* 1. Loan Requirement Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="home" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Loan Requirement</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(0)}>
            <Ionicons name="create-outline" size={14} color={BrandColors.PRIMARY_ORANGE} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Requested Amount</Text>
          <Text style={styles.highlightValue}>{formatCurrency(loanDetails.requiredAmount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Loan Type</Text>
          <Text style={styles.value}>{loanDetails.customPurpose || loanDetails.purpose || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Preferred Tenure</Text>
          <Text style={styles.value}>
            {loanDetails.preferredTenureMonths
              ? formatTenureEquivalent(loanDetails.preferredTenureMonths)
              : "—"}
          </Text>
        </View>
        {loanDetails.employmentType ? (
          <View style={styles.row}>
            <Text style={styles.label}>Employment Type</Text>
            <Text style={styles.value}>{loanDetails.employmentType}</Text>
          </View>
        ) : null}
      </View>

      {/* 2. Applicant & Income Profile Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="person" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Applicant & Income Profile</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(1)}>
            <Ionicons name="create-outline" size={14} color={BrandColors.PRIMARY_ORANGE} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Applicant Full Name</Text>
          <Text style={styles.value}>{applicantDetails.fullName || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>PAN</Text>
          <Text style={styles.value}>{maskPan(applicantDetails.pan)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{maskMobile(applicantDetails.mobile)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>{applicantDetails.dob || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Employment / Sector</Text>
          <Text style={styles.value}>
            {applicantDetails.employerName
              ? `${applicantDetails.employerName} (${applicantDetails.employerCategory || "Salaried"})`
              : applicantDetails.employerCategory || "—"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Declared Annual Income</Text>
          <Text style={styles.highlightValue}>{formatCurrency(applicantDetails.annualIncome)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Current Address</Text>
          <Text style={styles.value} numberOfLines={2}>
            {applicantDetails.currentAddress || "—"}
          </Text>
        </View>
      </View>
    </>
  );
};
