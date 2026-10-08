import React, { useState } from "react";
import { View } from "react-native";
import { LoanPropertyFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanPropertyStep.styles";
import {
  PropertyLocationCard,
  PropertyDropdownKey,
} from "./PropertyLocationCard";
import { PropertyTypeUsageCard } from "./PropertyTypeUsageCard";
import { PropertyValueCard } from "./PropertyValueCard";
import { PropertyLoanDropdownModal } from "../PropertyLoanDropdownModal";

export interface PropertyLoanPropertyStepProps {
  data: LoanPropertyFormData;
  onChange: (field: keyof LoanPropertyFormData, value: string) => void;
  errors?: Record<string, string>;
}

const STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Delhi NCR",
  "Gujarat",
  "West Bengal",
  "Kerala",
  "Rajasthan",
  "Uttar Pradesh",
];

const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Plot / Open Land",
];

const PROPERTY_SUB_TYPES = [
  "Residential Apartment / Flat",
  "Independent House / Villa",
  "Commercial Office Space",
  "Commercial Shop / Showroom",
  "Industrial Warehouse / Factory",
  "Open Plot / Land",
];

const CONSTRUCTION_STATUSES = [
  "Ready to Move",
  "Under Construction",
  "Vacant Plot / Land",
];

const CURRENT_USAGES = ["Self Occupied", "Rented Out / Leased", "Vacant"];

const AREA_TYPES = [
  "Built-up Area",
  "Carpet Area",
  "Plot Area",
  "Super Built-up Area",
];

const PROPERTY_AGES = [
  "New Construction (< 1 Year)",
  "1 - 5 Years",
  "5 - 10 Years",
  "10 - 20 Years",
  "20+ Years",
];

const APPROVING_AUTHORITIES = [
  "Municipal Corporation (GHMC/HMDA/etc.)",
  "Gram Panchayat",
  "DTCP / Urban Development Authority",
  "Unapproved / Others",
];

export const PropertyLoanPropertyStep: React.FC<PropertyLoanPropertyStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [activePicker, setActivePicker] = useState<PropertyDropdownKey | null>(null);

  const getPickerOptions = (): string[] => {
    switch (activePicker) {
      case "state":
        return STATES;
      case "propertyType":
        return PROPERTY_TYPES;
      case "propertySubType":
        return PROPERTY_SUB_TYPES;
      case "constructionStatus":
        return CONSTRUCTION_STATUSES;
      case "currentUsage":
        return CURRENT_USAGES;
      case "areaType":
        return AREA_TYPES;
      case "propertyAge":
        return PROPERTY_AGES;
      case "approvingAuthority":
        return APPROVING_AUTHORITIES;
      default:
        return [];
    }
  };

  const getPickerTitle = (): string => {
    switch (activePicker) {
      case "state":
        return "Select State";
      case "propertyType":
        return "Select Property Type";
      case "propertySubType":
        return "Select Property Sub-Type";
      case "constructionStatus":
        return "Select Construction Status";
      case "currentUsage":
        return "Select Current Usage";
      case "areaType":
        return "Select Area Type";
      case "propertyAge":
        return "Select Property Age";
      case "approvingAuthority":
        return "Select Approving Authority";
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
      {/* 1. Property Location */}
      <PropertyLocationCard
        data={data}
        onChange={onChange}
        onOpenPicker={(key) => setActivePicker(key)}
        errors={errors}
      />

      {/* 2. Property Type & Usage */}
      <PropertyTypeUsageCard
        data={data}
        onChange={onChange}
        onOpenPicker={(key) => setActivePicker(key)}
        errors={errors}
      />

      {/* 3. Property Value */}
      <PropertyValueCard
        data={data}
        onChange={onChange}
        errors={errors}
      />

      {/* Modal Selection */}
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

export default PropertyLoanPropertyStep;
