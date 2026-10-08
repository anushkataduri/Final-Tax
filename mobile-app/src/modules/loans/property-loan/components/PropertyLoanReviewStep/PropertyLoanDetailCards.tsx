import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  LoanPropertyFormData,
  LoanOwnershipFormData,
  LoanDocumentItem,
} from "../../../types/loans.types";
import { formatReviewAmountDigits } from "../../../utils/loanFormatting";
import { maskPan as maskPanBase } from "../../../utils/maskingUtils";
import { styles } from "./PropertyLoanReviewStep.styles";

const maskPan = (pan?: string): string => maskPanBase(pan, { visibleStart: 5, visibleEnd: 1 });
const formatCurrency = formatReviewAmountDigits;

export interface PropertyLoanDetailCardsProps {
  propertyDetails: LoanPropertyFormData;
  ownershipDetails: LoanOwnershipFormData;
  documents: LoanDocumentItem[];
  onGoToStep: (stepIndex: number) => void;
}

export const PropertyLoanDetailCards: React.FC<PropertyLoanDetailCardsProps> = ({
  propertyDetails,
  ownershipDetails,
  documents,
  onGoToStep,
}) => {
  const uploadedDocs = documents.filter((d) => Boolean(d.fileUri));
  const hasExistingLoan = Boolean(
    ownershipDetails.currentLender ||
      (ownershipDetails.outstandingLoanAmount &&
        ownershipDetails.outstandingLoanAmount !== "0")
  );

  return (
    <>
      {/* 3. Property & Asset Details Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="business" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Property & Asset Details</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(2)}>
            <Ionicons name="create-outline" size={14} color={BrandColors.PRIMARY_ORANGE} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Property Type</Text>
          <Text style={styles.value}>
            {propertyDetails.propertyType || "—"}
            {propertyDetails.propertySubType ? ` • ${propertyDetails.propertySubType}` : ""}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Construction & Usage</Text>
          <Text style={styles.value}>
            {propertyDetails.constructionStatus || "—"}
            {propertyDetails.currentUsage ? ` (${propertyDetails.currentUsage})` : ""}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Area</Text>
          <Text style={styles.value}>
            {propertyDetails.area ? `${propertyDetails.area} sq. ft.` : "—"}
            {propertyDetails.areaType ? ` (${propertyDetails.areaType})` : ""}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Property Age</Text>
          <Text style={styles.value}>{propertyDetails.propertyAge || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Approving Authority</Text>
          <Text style={styles.value}>{propertyDetails.approvingAuthority || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estimated Market Valuation</Text>
          <Text style={styles.highlightValue}>
            {formatCurrency(propertyDetails.estimatedMarketValue)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location / Address</Text>
          <Text style={styles.value} numberOfLines={2}>
            {propertyDetails.propertyAddress || "—"}
            {propertyDetails.city ? `, ${propertyDetails.city}` : ""}
            {propertyDetails.state ? `, ${propertyDetails.state}` : ""}
            {propertyDetails.pincode ? ` - ${propertyDetails.pincode}` : ""}
          </Text>
        </View>
      </View>

      {/* 4. Ownership & Security Details Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="key" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Ownership & Security Details</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(3)}>
            <Ionicons name="create-outline" size={14} color={BrandColors.PRIMARY_ORANGE} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ownership Type</Text>
          <Text style={styles.value}>{ownershipDetails.ownershipType || "—"}</Text>
        </View>
        {ownershipDetails.ownershipType === "Joint Ownership" ? (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Co-owner Name</Text>
              <Text style={styles.value}>{ownershipDetails.coOwnerFullName || "—"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Relationship</Text>
              <Text style={styles.value}>{ownershipDetails.coOwnerRelationship || "—"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Co-owner PAN</Text>
              <Text style={styles.value}>{maskPan(ownershipDetails.coOwnerPan)}</Text>
            </View>
          </>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>Existing Property Loan</Text>
          <Text style={styles.value}>
            {hasExistingLoan
              ? `${ownershipDetails.currentLender || "Lender on File"} (${ownershipDetails.existingLoanType || "LAP"})`
              : "None / Unencumbered"}
          </Text>
        </View>
        {hasExistingLoan && ownershipDetails.outstandingLoanAmount ? (
          <View style={styles.row}>
            <Text style={styles.label}>Outstanding Balance</Text>
            <Text style={styles.value}>{formatCurrency(ownershipDetails.outstandingLoanAmount)}</Text>
          </View>
        ) : null}
      </View>

      {/* 5. Uploaded Records Card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="document-text" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Uploaded Records</Text>
          </View>
          <TouchableOpacity style={styles.editAction} onPress={() => onGoToStep(4)}>
            <Ionicons name="create-outline" size={14} color={BrandColors.PRIMARY_ORANGE} />
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
            <Text style={styles.emptyDocsText}>No documents uploaded yet.</Text>
          )}
        </View>
      </View>
    </>
  );
};
