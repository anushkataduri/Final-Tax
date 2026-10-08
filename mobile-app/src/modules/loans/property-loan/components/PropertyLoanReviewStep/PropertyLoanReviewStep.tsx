import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  LoanDetailsFormData,
  LoanApplicantFormData,
  LoanPropertyFormData,
  LoanOwnershipFormData,
  LoanDocumentItem,
} from "../../../types/loans.types";
import { styles } from "./PropertyLoanReviewStep.styles";
import { PropertyLoanHeaderCards } from "./PropertyLoanHeaderCards";
import { PropertyLoanDetailCards } from "./PropertyLoanDetailCards";

export interface PropertyLoanReviewStepProps {
  loanDetails: LoanDetailsFormData;
  applicantDetails: LoanApplicantFormData;
  propertyDetails: LoanPropertyFormData;
  ownershipDetails: LoanOwnershipFormData;
  documents: LoanDocumentItem[];
  isConsentChecked: boolean;
  onConsentToggle: (checked: boolean) => void;
  onGoToStep: (stepIndex: number) => void;
}

export const PropertyLoanReviewStep: React.FC<PropertyLoanReviewStepProps> = ({
  loanDetails,
  applicantDetails,
  propertyDetails,
  ownershipDetails,
  documents,
  isConsentChecked,
  onConsentToggle,
  onGoToStep,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mortgage Application Dossier Review</Text>
      <Text style={styles.sectionSubtitle}>
        Double-check your loan against property terms, title details, and financial papers.
      </Text>

      {/* Header Cards (1 & 2) */}
      <PropertyLoanHeaderCards
        loanDetails={loanDetails}
        applicantDetails={applicantDetails}
        onGoToStep={onGoToStep}
      />

      {/* Detail Cards (3, 4 & 5) */}
      <PropertyLoanDetailCards
        propertyDetails={propertyDetails}
        ownershipDetails={ownershipDetails}
        documents={documents}
        onGoToStep={onGoToStep}
      />

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
          I authorize TaxEdge to conduct technical valuation, legal search title inquiry,
          and share financial dossiers with partnered banks & NBFCs for Property Loan underwriting.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PropertyLoanReviewStep;
