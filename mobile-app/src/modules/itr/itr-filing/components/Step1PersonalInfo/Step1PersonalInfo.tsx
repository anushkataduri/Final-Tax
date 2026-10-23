import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  ItrPersonalInfo,
  ItrBankDetails,
  ItrSelectableBank,
  ItrPriorFilingAndNotice,
  ResidentialStatus,
  FilingType,
} from "../../types/itrFiling.types";
import { useITRStore } from "../../../store/itrStore";
import { styles } from "./Step1PersonalInfo.styles";
import { Step1PriorItrImport } from "./components/Step1PriorItrImport";
import { Step1TaxpayerIdentityCard } from "./components/Step1TaxpayerIdentityCard";
import { Step1AssessmentYearPicker } from "./components/Step1AssessmentYearPicker";
import { Step1RefundBankSection } from "./components/Step1RefundBankSection";

interface Step1PersonalInfoProps {
  isLoading?: boolean;
  isEditing?: boolean;
  personalInfo: ItrPersonalInfo;
  onUpdatePersonalInfo: (info: Partial<ItrPersonalInfo>) => void;
  bankDetails: ItrBankDetails;
  bankAccountsList: ItrSelectableBank[];
  onSelectRefundBank: (bankId: string) => void;
  onAddBankAccount: (bank: ItrSelectableBank) => void;
  priorItrNotice: ItrPriorFilingAndNotice;
  onUpdatePriorItrNotice: (data: Partial<ItrPriorFilingAndNotice>) => void;
  onImportPriorItrData: (selectedKeys: {
    income?: boolean;
    deductions?: boolean;
    losses?: boolean;
    bank?: boolean;
    filing?: boolean;
  }) => void;
  onContinue: () => void;
  onUpdateAndContinue?: () => void;
}

const RESIDENTIAL_STATUS_OPTIONS: { id: ResidentialStatus; label: string }[] = [
  { id: "Resident", label: "Resident" },
  { id: "NRI", label: "Non-Resident (NRI)" },
  { id: "RNOR", label: "Resident but NOR" },
];

const FILING_TYPES: { id: FilingType; title: string; section: string; sub: string }[] = [
  { id: "139_1_original", title: "Original Return", section: "u/s 139(1)", sub: "Filing on or before statutory due date." },
  { id: "139_4_belated", title: "Belated Return", section: "u/s 139(4)", sub: "Filing after statutory due date with applicable late fees." },
  { id: "139_5_revised", title: "Revised Return", section: "u/s 139(5)", sub: "Correct omission or error in previously filed return." },
  { id: "139_8a_updated", title: "Updated Return (ITR-U)", section: "u/s 139(8A)", sub: "Filing within 24 months from the end of relevant AY." },
];

export const Step1PersonalInfo: React.FC<Step1PersonalInfoProps> = ({
  isLoading = false,
  isEditing,
  personalInfo,
  onUpdatePersonalInfo,
  bankDetails,
  bankAccountsList,
  onSelectRefundBank,
  onAddBankAccount,
  priorItrNotice,
  onUpdatePriorItrNotice,
  onImportPriorItrData,
  onContinue,
  onUpdateAndContinue,
}) => {
  const [showBankModal, setShowBankModal] = useState(false);
  const [isPreviousItrExpanded, setIsPreviousItrExpanded] = useState(false);
  const [showCustomAy] = useState(false);

  useEffect(() => {
    useITRStore.getState().fetchAndPopulateUserProfile();
  }, []);

  const handleValidateAndContinue = () => {
    if (!personalInfo.residentialStatus) {
      Alert.alert("Residential Status Required", "Please select your residential status (Resident, NRI, or RNOR).");
      return;
    }
    if (!personalInfo.filingType) {
      Alert.alert("Filing Type Required", "Please select your applicable filing type.");
      return;
    }
    if (!bankDetails.bankName.trim() || !bankDetails.accountNumber.trim()) {
      Alert.alert("Missing Refund Bank Account", "Please select or add a bank account to receive direct income tax refund credit.");
      return;
    }
    onContinue();
  };

  return (
    <View style={styles.container}>
      <Step1TaxpayerIdentityCard personalInfo={personalInfo} />

      <Step1AssessmentYearPicker
        assessmentYear={personalInfo.assessmentYear}
        onUpdate={onUpdatePersonalInfo}
        showCustomAy={showCustomAy}
      />

      {/* Residential Status */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="globe-outline" size={18} color="#083B75" />
            <Text style={styles.cardTitle}>Residential Status</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Select your residential status in India for the selected financial year.
        </Text>
        <View style={styles.pickerRow}>
          {RESIDENTIAL_STATUS_OPTIONS.map((res) => {
            const isSelected = personalInfo.residentialStatus === res.id;
            return (
              <TouchableOpacity
                key={res.id}
                activeOpacity={0.8}
                style={[styles.pickerPill, isSelected && styles.pickerPillSelected]}
                onPress={() => onUpdatePersonalInfo({ residentialStatus: res.id, residentialStatusConfirmed: true })}
              >
                <Text style={[styles.pickerPillText, isSelected && styles.pickerPillTextSelected]}>
                  {res.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {Boolean(personalInfo.residentialStatus) && (
          <View style={styles.residencyInfoBox}>
            <Text style={styles.residencyInfoText}>
              Selected Status:{" "}
              <Text style={styles.residencyInfoHighlight}>
                {RESIDENTIAL_STATUS_OPTIONS.find((r) => r.id === personalInfo.residentialStatus)?.label || personalInfo.residentialStatus}
              </Text>
              {personalInfo.residentialStatus === "Resident"
                ? " — Applicable to individuals residing primarily in India during the financial year."
                : " — Special provisions for foreign income and DTAA apply."}
            </Text>
          </View>
        )}
      </View>

      {/* Filing Type */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="receipt-outline" size={18} color="#083B75" />
            <Text style={styles.cardTitle}>Filing Type</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Select your return filing type according to the Income Tax Act, 1961.
        </Text>
        <View style={styles.radioList}>
          {FILING_TYPES.map((type) => {
            const isSelected = personalInfo.filingType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                activeOpacity={0.8}
                style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                onPress={() => onUpdatePersonalInfo({ filingType: type.id })}
              >
                <Ionicons
                  name={isSelected ? "radio-button-on" : "radio-button-off"}
                  size={18}
                  color={isSelected ? BrandColors.PRIMARY_ORANGE : "#64748B"}
                />
                <View style={styles.radioCardTextCol}>
                  <Text style={styles.radioCardTitle}>{type.title} ({type.section})</Text>
                  <Text style={styles.radioCardSubtitle}>{type.sub}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Step1RefundBankSection
        bankDetails={bankDetails}
        bankAccountsList={bankAccountsList}
        onSelectRefundBank={onSelectRefundBank}
        onAddBankAccount={onAddBankAccount}
        showBankModal={showBankModal}
        setShowBankModal={setShowBankModal}
      />

      <Step1PriorItrImport
        priorItrNotice={priorItrNotice}
        isPreviousItrExpanded={isPreviousItrExpanded}
        setIsPreviousItrExpanded={setIsPreviousItrExpanded}
        onUpdatePriorItrNotice={onUpdatePriorItrNotice}
        onImportPriorItrData={onImportPriorItrData}
      />

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.continueButton}
        onPress={isEditing ? (onUpdateAndContinue || handleValidateAndContinue) : handleValidateAndContinue}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.continueButtonText}>
              {isEditing ? "Update & Continue" : "Confirm & Continue to Income"}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
