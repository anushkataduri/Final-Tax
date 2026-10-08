import React, { useState } from "react";
import { View } from "react-native";
import { LoanOwnershipFormData } from "../../../types/loans.types";
import { PropertyLoanDropdownModal } from "../PropertyLoanDropdownModal";
import { PropertyOwnershipTypeCard } from "./PropertyOwnershipTypeCard";
import { PropertyCoOwnerCard } from "./PropertyCoOwnerCard";
import { PropertyExistingLoanCard } from "./PropertyExistingLoanCard";
import { styles } from "./PropertyLoanOwnershipStep.styles";

export interface PropertyLoanOwnershipStepProps {
  data: LoanOwnershipFormData;
  onChange: (field: keyof LoanOwnershipFormData, value: string | boolean) => void;
  errors?: Record<string, string>;
}

const RELATIONSHIPS = [
  "Spouse",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Partner / Business Associate",
];

const LENDERS = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India (SBI)",
  "Axis Bank",
  "Bajaj Housing Finance",
  "LIC Housing Finance",
  "L&T Housing Finance",
  "Tata Capital",
  "Other Bank / NBFC",
];

const EXISTING_LOAN_TYPES = [
  "Home Loan",
  "Loan Against Property (LAP)",
  "Commercial Purchase Loan",
  "Top-up Loan",
  "Others",
];

type DropdownKey = "coOwnerRelationship" | "currentLender" | "existingLoanType";

export const PropertyLoanOwnershipStep: React.FC<PropertyLoanOwnershipStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [activePicker, setActivePicker] = useState<DropdownKey | null>(null);

  const getPickerOptions = (): string[] => {
    switch (activePicker) {
      case "coOwnerRelationship":
        return RELATIONSHIPS;
      case "currentLender":
        return LENDERS;
      case "existingLoanType":
        return EXISTING_LOAN_TYPES;
      default:
        return [];
    }
  };

  const getPickerTitle = (): string => {
    switch (activePicker) {
      case "coOwnerRelationship":
        return "Select Relationship";
      case "currentLender":
        return "Select Lender";
      case "existingLoanType":
        return "Select Existing Loan Type";
      default:
        return "Select Option";
    }
  };

  const handleSelectOption = (value: string) => {
    if (activePicker) {
      onChange(activePicker, value);
    }
    setActivePicker(null);
  };

  return (
    <View style={styles.container}>
      {/* 1. Ownership Type Selection */}
      <PropertyOwnershipTypeCard
        ownershipType={data.ownershipType}
        onSelectOwnershipType={(type) => onChange("ownershipType", type)}
        error={errors.ownershipType}
      />

      {/* 2. Co-owner Details */}
      <PropertyCoOwnerCard
        data={data}
        onChange={onChange}
        errors={errors}
        onOpenRelationshipPicker={() => setActivePicker("coOwnerRelationship")}
      />

      {/* 3. Existing Property Loan & Confirmation */}
      <PropertyExistingLoanCard
        data={data}
        onChange={onChange}
        errors={errors}
        onOpenLenderPicker={() => setActivePicker("currentLender")}
        onOpenLoanTypePicker={() => setActivePicker("existingLoanType")}
      />

      {/* Selection Modal */}
      <PropertyLoanDropdownModal
        visible={activePicker !== null}
        title={getPickerTitle()}
        options={getPickerOptions()}
        selectedValue={activePicker ? data[activePicker] : undefined}
        onSelect={handleSelectOption}
        onClose={() => setActivePicker(null)}
      />
    </View>
  );
};

export default PropertyLoanOwnershipStep;
