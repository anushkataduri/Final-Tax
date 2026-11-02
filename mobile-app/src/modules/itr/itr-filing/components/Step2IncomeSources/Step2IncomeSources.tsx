import { Step2SalaryIncome } from "./components/Step2SalaryIncome";
import { Step2HousePropertyIncome } from "./components/Step2HousePropertyIncome";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
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
import { styles } from "./Step2IncomeSources.styles";
import {
  BusinessIncomeForm,
  CapitalGainsIncomeForm,
} from "./components/Step2BusinessAndCapitalGains";
import { OtherSourcesIncomeForm } from "./components/Step2OtherSources";
import {
  IncomeFieldInfoModal,
  type InfoModalContent,
} from "./components/IncomeFieldInfoModal";
import {
  SALARY_CARD_INFO,
  HOUSE_PROPERTY_CARD_INFO,
  BUSINESS_CARD_INFO,
  CAPITAL_GAINS_CARD_INFO,
  OTHER_SOURCES_CARD_INFO,
} from "./components/incomeCardsInfoData";

interface Step2IncomeSourcesProps {
  isLoading?: boolean;
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
  onUpdateAndContinue?: () => void;
}

export const Step2IncomeSources: React.FC<Step2IncomeSourcesProps> = ({
  isLoading = false,
  isEditing, 
  sources,
  determinedForm,
  gstReconciliation,
  onUpdateSalary,
  onUpdateHouseProperty,
  onUpdateBusiness,
  onUpdateCapitalGains,
  onUpdateOtherSources,
  onContinue,
  onUpdateAndContinue,
}) => {
  const [infoModalContent, setInfoModalContent] = useState<InfoModalContent | null>(null);

  const validateInputs = (): boolean => {
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
      return false;
    }

    if (sources.salary.enabled) {
      if (!sources.salary.employerName?.trim()) {
        Alert.alert("Salary Details Required", "Employer Legal Name is mandatory.");
        return false;
      }
      if (!sources.salary.grossSalary?.trim()) {
        Alert.alert("Salary Details Required", "Gross Salary (Annual) is mandatory.");
        return false;
      }
      if (!sources.salary.allowances?.trim()) {
        Alert.alert("Salary Details Required", "Exempt Allowances is mandatory (enter 0 if not applicable).");
        return false;
      }
      if (!sources.salary.tdsDeducted?.trim()) {
        Alert.alert("Salary Details Required", "TDS Deducted by Employer is mandatory (enter 0 if not applicable).");
        return false;
      }
    }
    
    if (sources.houseProperty.enabled) {
      if (sources.houseProperty.propertyType === "let_out") {
        if (!sources.houseProperty.annualRentReceived?.trim()) {
          Alert.alert("House Property Details Required", "Annual Rent Received is mandatory for let-out property.");
          return false;
        }
        if (!sources.houseProperty.municipalTaxesPaid?.trim()) {
          Alert.alert("House Property Details Required", "Municipal Taxes Paid is mandatory (enter 0 if none).");
          return false;
        }
      }
      if (!sources.houseProperty.homeLoanInterest?.trim()) {
        Alert.alert("House Property Details Required", "Home Loan Interest Paid is mandatory (enter 0 if no loan).");
        return false;
      }
    }

    if (sources.business.enabled) {
      if (!sources.business.businessType) {
        Alert.alert("Business Details Required", "Please select how you report this business.");
        return false;
      }
      if (!sources.business.grossTurnover?.trim()) {
        Alert.alert("Business Details Required", "Gross Turnover is mandatory for Business / Profession income.");
        return false;
      }
      if (!sources.business.declaredProfit?.trim()) {
        Alert.alert("Business Details Required", "Declared Profit is mandatory (enter 0 if none).");
        return false;
      }
    }

    if (sources.capitalGains.enabled) {
      const hasAnyAsset =
        sources.capitalGains.hasEquityMf ||
        sources.capitalGains.hasFnoIntraday ||
        sources.capitalGains.hasPropertyAssets ||
        sources.capitalGains.hasCryptoVda;
      if (!hasAnyAsset) {
        Alert.alert("Capital Gains Required", "Please select at least one asset type traded.");
        return false;
      }
      if (!sources.capitalGains.shortTermGains?.trim()) {
        Alert.alert("Capital Gains Details Required", "Short-Term Gains (STCG) is mandatory (enter 0 if none).");
        return false;
      }
      if (!sources.capitalGains.longTermGains?.trim()) {
        Alert.alert("Capital Gains Details Required", "Long-Term Gains (LTCG) is mandatory (enter 0 if none).");
        return false;
      }
    }

    if (sources.otherSources.enabled) {
      if (!sources.otherSources.savingsInterest?.trim()) {
        Alert.alert("Other Sources Required", "Savings Bank Interest is mandatory (enter 0 if none).");
        return false;
      }
      if (!sources.otherSources.fdInterest?.trim()) {
        Alert.alert("Other Sources Required", "FD / Term Interest is mandatory (enter 0 if none).");
        return false;
      }
      if (!sources.otherSources.dividendIncome?.trim()) {
        Alert.alert("Other Sources Required", "Dividend Income is mandatory (enter 0 if none).");
        return false;
      }
      if (!sources.otherSources.otherIncome?.trim()) {
        Alert.alert("Other Sources Required", "Other Miscellaneous income is mandatory (enter 0 if none).");
        return false;
      }
    }

    return true;
  };

  const handleProceed = () => {
    if (validateInputs()) {
      onContinue();
    }
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
      <Step2SalaryIncome
        data={sources.salary}
        onUpdate={onUpdateSalary}
        onPressInfo={() => setInfoModalContent(SALARY_CARD_INFO)}
      />

      {/* 2. House Property Income */}
      <Step2HousePropertyIncome
        data={sources.houseProperty}
        onUpdate={onUpdateHouseProperty}
        onPressInfo={() => setInfoModalContent(HOUSE_PROPERTY_CARD_INFO)}
      />

      {/* 3. Business / Profession */}
      <BusinessIncomeForm
        business={sources.business}
        onUpdateBusiness={onUpdateBusiness}
        onPressInfo={() => setInfoModalContent(BUSINESS_CARD_INFO)}
      />

      {/* 4. Capital Gains & Trading Activity */}
      <CapitalGainsIncomeForm
        capitalGains={sources.capitalGains}
        onUpdateCapitalGains={onUpdateCapitalGains}
        onPressInfo={() => setInfoModalContent(CAPITAL_GAINS_CARD_INFO)}
      />

      {/* 5. Other Sources Income */}
      <OtherSourcesIncomeForm
        otherSources={sources.otherSources}
        onUpdateOtherSources={onUpdateOtherSources}
        onPressInfo={() => setInfoModalContent(OTHER_SOURCES_CARD_INFO)}
      />

      {/* Field Info Explanation Modal */}
      <IncomeFieldInfoModal
        visible={Boolean(infoModalContent)}
        content={infoModalContent}
        onClose={() => setInfoModalContent(null)}
      />

      {/* 2 Distinct Buttons for Update (PUT) and Create (POST) */}
      {isEditing ? (
        /* Separate Button 1: Update & Continue (PUT Method) */
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.continueButton}
          onPress={() => {
            if (validateInputs()) {
              if (onUpdateAndContinue) {
                onUpdateAndContinue();
              } else {
                onContinue();
              }
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.continueButtonText}>Update & Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      ) : (
        /* Separate Button 2: Continue (POST Method) */
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.continueButton}
          onPress={handleProceed}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.continueButtonText}>Confirm & Continue to Deductions</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

