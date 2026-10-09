import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DatePickerDialog } from "@/shared/components/DatePickerDialog";
import { BrandColors } from "../../../../../shared/theme";
import { LoanApplicantFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanApplicantStep.styles";
import { PropertyApplicantPersonalDetailsCard } from "./PropertyApplicantPersonalDetailsCard";
import { PropertyApplicantPersonalInfoCard } from "./PropertyApplicantPersonalInfoCard";
import {
  PropertyApplicantEmploymentCard,
  ApplicantDropdownKey,
} from "./PropertyApplicantEmploymentCard";
import { PropertyLoanDropdownModal } from "../PropertyLoanDropdownModal";

export interface PropertyLoanApplicantStepProps {
  data: LoanApplicantFormData;
  onChange: (field: keyof LoanApplicantFormData, value: string | boolean | null) => void;
  errors?: Record<string, string>;
}

const GENDERS = ["Male", "Female", "Other"];
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];
const RESIDENCE_TYPES = [
  "Owned by Self/Spouse",
  "Rented",
  "Owned by Parents",
  "Corporate / Company Provided",
];
const YEARS_AT_ADDRESS = ["< 1 Year", "1-3 Years", "3-5 Years", "5+ Years"];
const EMPLOYER_CATEGORIES = [
  "Salaried - MNC",
  "Salaried - Public Sector",
  "Salaried - Private Ltd",
  "Self-Employed Professional",
  "Business Owner",
];
const TOTAL_EXPERIENCES = [
  "< 1 Year",
  "1-3 Years",
  "3-5 Years",
  "5-10 Years",
  "10+ Years",
];
const YEARS_IN_CURRENT_JOB = ["< 1 Year", "1-3 Years", "3-5 Years", "5+ Years"];

function formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDDMMYYYYToDate(str?: string): Date {
  if (!str) return new Date(1995, 0, 1);
  const parts = str.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return new Date(1995, 0, 1);
}

export const PropertyLoanApplicantStep: React.FC<PropertyLoanApplicantStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [activePicker, setActivePicker] = useState<ApplicantDropdownKey | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(() =>
    parseDDMMYYYYToDate(data.dob)
  );

  const getPickerOptions = (): string[] => {
    switch (activePicker) {
      case "gender":
        return GENDERS;
      case "maritalStatus":
        return MARITAL_STATUSES;
      case "residenceType":
        return RESIDENCE_TYPES;
      case "yearsAtCurrentAddress":
        return YEARS_AT_ADDRESS;
      case "employerCategory":
        return EMPLOYER_CATEGORIES;
      case "totalWorkExperience":
        return TOTAL_EXPERIENCES;
      case "yearsInCurrentJob":
        return YEARS_IN_CURRENT_JOB;
      default:
        return [];
    }
  };

  const getPickerTitle = (): string => {
    switch (activePicker) {
      case "gender":
        return "Select Gender";
      case "maritalStatus":
        return "Select Marital Status";
      case "residenceType":
        return "Select Residence Type";
      case "yearsAtCurrentAddress":
        return "Select Years at Address";
      case "employerCategory":
        return "Select Employer Category";
      case "totalWorkExperience":
        return "Select Total Work Experience";
      case "yearsInCurrentJob":
        return "Select Years in Current Job";
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

  const handleDateConfirm = (selectedDate: Date) => {
    setShowDatePicker(false);
    onChange("dob", formatDateToDDMMYYYY(selectedDate));
  };

  return (
    <View style={styles.container}>
      {/* 1. Personal Details */}
      <PropertyApplicantPersonalDetailsCard
        data={data}
        onChange={onChange}
        errors={errors}
        onOpenDatePicker={() => {
          setPickerDate(parseDDMMYYYYToDate(data.dob));
          setShowDatePicker(true);
        }}
      />

      {/* 2. Personal Information */}
      <PropertyApplicantPersonalInfoCard
        data={data}
        errors={errors}
        onOpenPicker={(key) => setActivePicker(key)}
      />

      {/* 3. Employment Details */}
      <PropertyApplicantEmploymentCard
        data={data}
        onChange={onChange}
        errors={errors}
        onOpenPicker={(key) => setActivePicker(key)}
      />

      {/* 4. Existing Loans & Obligations */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="card" size={16} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
            </View>
            <Text style={styles.cardTitle}>Existing Loans & Obligations</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Do you have any existing loans? <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.twoBoxRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onChange("hasExistingLoans", true)}
              style={[
                styles.separateBox,
                data.hasExistingLoans === true && styles.separateBoxActive,
              ]}
            >
              <Text
                style={[
                  styles.separateBoxText,
                  data.hasExistingLoans === true && styles.separateBoxTextActive,
                ]}
              >
                YES
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onChange("hasExistingLoans", false)}
              style={[
                styles.separateBox,
                data.hasExistingLoans === false && styles.separateBoxActive,
              ]}
            >
              <Text
                style={[
                  styles.separateBoxText,
                  data.hasExistingLoans === false && styles.separateBoxTextActive,
                ]}
              >
                NO
              </Text>
            </TouchableOpacity>
          </View>
          {Boolean(errors.hasExistingLoans) && (
            <Text style={styles.errorText}>{errors.hasExistingLoans}</Text>
          )}
        </View>
      </View>

      {/* Dropdown Options Modal */}
      <PropertyLoanDropdownModal
        visible={activePicker !== null}
        title={getPickerTitle()}
        options={getPickerOptions()}
        selectedValue={activePicker ? data[activePicker] : undefined}
        onSelect={handleSelectOption}
        onClose={() => setActivePicker(null)}
      />

      <DatePickerDialog
        visible={showDatePicker}
        value={pickerDate}
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
        title="Select Date of Birth"
      />
    </View>
  );
};

export default PropertyLoanApplicantStep;
