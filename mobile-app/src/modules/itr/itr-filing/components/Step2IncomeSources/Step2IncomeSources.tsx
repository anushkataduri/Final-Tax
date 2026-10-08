import { Step2SalaryIncome } from "./components/Step2SalaryIncome";
import { Step2HousePropertyIncome } from "./components/Step2HousePropertyIncome";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  IncomeSourcesState,
  IncomeSalaryData,
  IncomeHousePropertyData,
  IncomeBusinessData,
  IncomeCapitalGainsData,
  IncomeOtherSourcesData,
  DeterminedFormInfo,
  GstReconciliationSummary,
  ItrCategoryType,
} from "../../types/itrFiling.types";
import { GstReconciliationCard } from "../../../components/GstReconciliationCard";
import { styles } from "./Step2IncomeSources.styles";
import {
  BusinessIncomeForm,
  CapitalGainsIncomeForm,
} from "./components/Step2BusinessAndCapitalGains";
import { OtherSourcesIncomeForm } from "./components/Step2OtherSources";

interface Step2IncomeSourcesProps {
  isEditing?: boolean;
  sources: IncomeSourcesState;
  determinedForm: DeterminedFormInfo;
  gstReconciliation?: GstReconciliationSummary;
  category?: ItrCategoryType | null;
  onSwitchCategory?: (category: ItrCategoryType) => void;
  onUpdateSalary: (data: Partial<IncomeSalaryData>) => void;
  onUpdateHouseProperty: (data: Partial<IncomeHousePropertyData>) => void;
  onUpdateBusiness: (data: Partial<IncomeBusinessData>) => void;
  onUpdateCapitalGains: (data: Partial<IncomeCapitalGainsData>) => void;
  onUpdateOtherSources: (data: Partial<IncomeOtherSourcesData>) => void;
  onContinue: () => void;
}

export const Step2IncomeSources: React.FC<Step2IncomeSourcesProps> = ({ isEditing, 
  sources,
  determinedForm,
  gstReconciliation,
  onUpdateSalary,
  onUpdateHouseProperty,
  onUpdateBusiness,
  onUpdateCapitalGains,
  onUpdateOtherSources,
  onContinue,
}) => {
  const handleProceed = () => {
    const hasAnyIncome =
      sources.salary.enabled ||
      sources.houseProperty.enabled ||
      sources.business.enabled ||
      sources.capitalGains.enabled ||
      sources.otherSources.enabled;

    if (!hasAnyIncome) {
      Alert.alert(
        "Income Source Required",
        "Please select at least one income source to proceed."
      );
      return;
    }

    if (sources.salary.enabled) {
      if (!sources.salary.employerName || !sources.salary.grossSalary) {
        Alert.alert("Salary Details Required", "Please fill in Employer Name and Gross Salary.");
        return;
      }
    }
    
    if (sources.houseProperty.enabled) {
      if (sources.houseProperty.propertyType === "let_out" && !sources.houseProperty.annualRentReceived) {
        Alert.alert("House Property Details Required", "Please fill in Annual Rent Received for let out property.");
        return;
      }
      if (sources.houseProperty.propertyType === "self_occupied" && !sources.houseProperty.homeLoanInterest) {
        Alert.alert("House Property Details Required", "Please fill in Home Loan Interest for self-occupied property.");
        return;
      }
    }

    if (sources.business.enabled) {
      if (!sources.business.grossTurnover) {
        Alert.alert("Business Details Required", "Please fill in Gross Turnover for your business.");
        return;
      }
    }

    if (sources.capitalGains.enabled) {
      if (!sources.capitalGains.hasEquityMf && !sources.capitalGains.hasFnoIntraday && !sources.capitalGains.hasPropertyAssets && !sources.capitalGains.hasCryptoVda) {
        Alert.alert("Capital Gains Required", "Please select at least one type of capital gain.");
        return;
      }
    }

    if (sources.otherSources.enabled) {
      if (!sources.otherSources.savingsInterest && !sources.otherSources.fdInterest && !sources.otherSources.dividendIncome && !sources.otherSources.familyPension && !sources.otherSources.otherIncome) {
        Alert.alert("Other Sources Details Required", "Please fill in at least one other income amount.");
        return;
      }
    }

    onContinue();
  };

  return (
    <View style={styles.container}>
      {/* Dynamic ITR Form Determination Banner */}
      <View style={styles.determinationCard}>
        <View style={styles.determinationHeaderRow}>
          <View style={styles.determinationTitleCol}>
            <Ionicons name="sparkles" size={18} color="#1D4ED8" />
            <Text style={styles.determinationTitle}>
              Applicable Return Form
            </Text>
          </View>
          <View style={styles.formBadge}>
            <Text style={styles.formBadgeText}>{determinedForm.form}</Text>
          </View>
        </View>

        <Text style={styles.determinationRationale}>
          {determinedForm.rationale}
        </Text>

        {/* Dynamic Criteria Checks */}
        {determinedForm.criteriaChecks &&
          determinedForm.criteriaChecks.length > 0 && (
            <View style={styles.determinationCriteriaList}>
              {determinedForm.criteriaChecks.map((check) => (
                <View key={check.id} style={styles.determinationCriteriaRow}>
                  <Ionicons name="checkmark-circle" size={13} color="#1D4ED8" />
                  <Text style={styles.determinationCriteriaText}>
                    {check.label}
                  </Text>
                </View>
              ))}
            </View>
          )}
      </View>

      <Text style={styles.sectionTitle}>Income Sources & Activity</Text>
      <Text style={styles.sectionSubtitle}>
        Select all sources of income you earned this year. Fields will adjust
        automatically.
      </Text>

      {/* Income Source Selector Chips */}
      <View style={styles.sourceSelectorCard}>
        <Text style={styles.sourceSelectorTitle}>
          Select your income sources:
        </Text>
        <View style={styles.sourceChipsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sourceChip,
              sources.salary.enabled && styles.sourceChipActive,
            ]}
            onPress={() => onUpdateSalary({ enabled: !sources.salary.enabled })}
          >
            <Ionicons
              name={
                sources.salary.enabled
                  ? "checkmark-circle"
                  : "add-circle-outline"
              }
              size={16}
              color={
                sources.salary.enabled ? BrandColors.PRIMARY_ORANGE : "#64748B"
              }
            />
            <Text
              style={[
                styles.sourceChipText,
                sources.salary.enabled && styles.sourceChipTextActive,
              ]}
            >
              Salary / Pension
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sourceChip,
              sources.houseProperty.enabled && styles.sourceChipActive,
            ]}
            onPress={() =>
              onUpdateHouseProperty({ enabled: !sources.houseProperty.enabled })
            }
          >
            <Ionicons
              name={
                sources.houseProperty.enabled
                  ? "checkmark-circle"
                  : "add-circle-outline"
              }
              size={16}
              color={
                sources.houseProperty.enabled
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
            <Text
              style={[
                styles.sourceChipText,
                sources.houseProperty.enabled && styles.sourceChipTextActive,
              ]}
            >
              House Property
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sourceChip,
              sources.business.enabled && styles.sourceChipActive,
            ]}
            onPress={() =>
              onUpdateBusiness({ enabled: !sources.business.enabled })
            }
          >
            <Ionicons
              name={
                sources.business.enabled
                  ? "checkmark-circle"
                  : "add-circle-outline"
              }
              size={16}
              color={
                sources.business.enabled
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
            <Text
              style={[
                styles.sourceChipText,
                sources.business.enabled && styles.sourceChipTextActive,
              ]}
            >
              Business / Profession
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sourceChip,
              sources.capitalGains.enabled && styles.sourceChipActive,
            ]}
            onPress={() =>
              onUpdateCapitalGains({ enabled: !sources.capitalGains.enabled })
            }
          >
            <Ionicons
              name={
                sources.capitalGains.enabled
                  ? "checkmark-circle"
                  : "add-circle-outline"
              }
              size={16}
              color={
                sources.capitalGains.enabled
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
            <Text
              style={[
                styles.sourceChipText,
                sources.capitalGains.enabled && styles.sourceChipTextActive,
              ]}
            >
              Capital Gains
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sourceChip,
              sources.otherSources.enabled && styles.sourceChipActive,
            ]}
            onPress={() =>
              onUpdateOtherSources({ enabled: !sources.otherSources.enabled })
            }
          >
            <Ionicons
              name={
                sources.otherSources.enabled
                  ? "checkmark-circle"
                  : "add-circle-outline"
              }
              size={16}
              color={
                sources.otherSources.enabled
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
            <Text
              style={[
                styles.sourceChipText,
                sources.otherSources.enabled && styles.sourceChipTextActive,
              ]}
            >
              Other Sources
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 1. Salary Income */}
      <Step2SalaryIncome data={sources.salary} onUpdate={onUpdateSalary} />

      {/* 2. House Property Income */}
      <Step2HousePropertyIncome data={sources.houseProperty} onUpdate={onUpdateHouseProperty} />

      {/* 3. Business / Profession & GST Bridge */}
      <BusinessIncomeForm
        business={sources.business}
        gstReconciliation={gstReconciliation}
        onUpdateBusiness={onUpdateBusiness}
      />

      {/* 4. Capital Gains & Trading Activity */}
      <CapitalGainsIncomeForm
        capitalGains={sources.capitalGains}
        onUpdateCapitalGains={onUpdateCapitalGains}
      />

      {/* 5. Other Sources Income */}
      <OtherSourcesIncomeForm
        otherSources={sources.otherSources}
        onUpdateOtherSources={onUpdateOtherSources}
      />

      {/* Continue Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.continueButton}
        onPress={handleProceed}
      >
        <Text style={styles.continueButtonText}>
          Confirm & Continue to Deductions
        </Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};
