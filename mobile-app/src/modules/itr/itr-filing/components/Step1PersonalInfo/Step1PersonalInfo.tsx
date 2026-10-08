import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
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
import { getSupportedAssessmentYears } from "../../../taxRules";
import { BankSelectorModal } from "../../../components/BankSelectorModal";
import { useITRStore } from "../../../store/itrStore";
import { styles } from "./Step1PersonalInfo.styles";
import { Step1PriorItrImport } from "./components/Step1PriorItrImport";

interface Step1PersonalInfoProps {
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
}

const RESIDENTIAL_STATUS_OPTIONS: { id: ResidentialStatus; label: string }[] = [
  { id: "Resident", label: "Resident" },
  { id: "NRI", label: "Non-Resident (NRI)" },
  { id: "RNOR", label: "Resident but NOR" },
];

const FILING_TYPES: { id: FilingType; title: string; section: string; sub: string }[] = [
  {
    id: "139_1_original",
    title: "Original Return",
    section: "u/s 139(1)",
    sub: "Filing on or before statutory due date.",
  },
  {
    id: "139_4_belated",
    title: "Belated Return",
    section: "u/s 139(4)",
    sub: "Filing after statutory due date with applicable late fees.",
  },
  {
    id: "139_5_revised",
    title: "Revised Return",
    section: "u/s 139(5)",
    sub: "Correct omission or error in previously filed return.",
  },
  {
    id: "139_8a_updated",
    title: "Updated Return (ITR-U)",
    section: "u/s 139(8A)",
    sub: "Filing within 24 months from the end of relevant AY.",
  },
];

export const Step1PersonalInfo: React.FC<Step1PersonalInfoProps> = ({ isEditing, 
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
}) => {
  const [showBankModal, setShowBankModal] = useState(false);
  const [isPreviousItrExpanded, setIsPreviousItrExpanded] = useState(false);

  useEffect(() => {
    useITRStore.getState().fetchAndPopulateUserProfile();
  }, []);

  const supportedAYs = getSupportedAssessmentYears();

  const maskedAadhaar = personalInfo.aadhaar
    ? `•••• •••• ${personalInfo.aadhaar.slice(-4)}`
    : "Not provided";

  const formattedMobile = personalInfo.mobile
    ? personalInfo.mobile.startsWith("+")
      ? personalInfo.mobile
      : `+91 ${personalInfo.mobile}`
    : "Not provided";

  const formattedAddress =
    personalInfo.address ||
    [personalInfo.city, personalInfo.state].filter(Boolean).join(", ") ||
    "Not provided";

  const handleValidateAndContinue = () => {
    if (!personalInfo.residentialStatus) {
      Alert.alert(
        "Residential Status Required",
        "Please select your residential status (Resident, NRI, or RNOR)."
      );
      return;
    }

    if (!personalInfo.filingType) {
      Alert.alert(
        "Filing Type Required",
        "Please select your applicable filing type."
      );
      return;
    }

    if (!bankDetails.bankName.trim() || !bankDetails.accountNumber.trim()) {
      Alert.alert(
        "Missing Refund Bank Account",
        "Please select or add a bank account to receive direct income tax refund credit."
      );
      return;
    }

    onContinue();
  };

  return (
    <View style={styles.container}>
      {/* 1. Verified Identity (Auto-filled from TaxEdge Profile) */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="person-circle" size={20} color="#083B75" />
            <Text style={styles.cardTitle}>Taxpayer Identity</Text>
          </View>
          <View style={styles.verifiedTag}>
            <Ionicons name="shield-checkmark" size={13} color="#166534" />
            <Text style={styles.verifiedTagText}>Auto-Verified</Text>
          </View>
        </View>

        <Text style={styles.cardDescription}>
          Information verified from your TaxEdge profile. Please verify your legal PAN, Aadhaar, and registered details.
        </Text>

        <View style={styles.readOnlyGrid}>
          <View style={styles.readOnlyRow}>
            <Text style={styles.fieldLabel}>PAN Number</Text>
            <Text style={styles.fieldValueHighlight}>{personalInfo.pan || "Not provided"}</Text>
          </View>
          <View style={styles.readOnlyRow}>
            <Text style={styles.fieldLabel}>Aadhaar Number</Text>
            <Text style={styles.fieldValue}>{maskedAadhaar}</Text>
          </View>
          <View style={styles.readOnlyRow}>
            <Text style={styles.fieldLabel}>Full Legal Name</Text>
            <Text style={styles.fieldValue}>{personalInfo.name || "Not provided"}</Text>
          </View>
          {Boolean(personalInfo.dob) && (
            <View style={styles.readOnlyRow}>
              <Text style={styles.fieldLabel}>Date of Birth</Text>
              <Text style={styles.fieldValue}>{personalInfo.dob}</Text>
            </View>
          )}
          <View style={styles.readOnlyRow}>
            <Text style={styles.fieldLabel}>Mobile Number</Text>
            <Text style={styles.fieldValue}>{formattedMobile}</Text>
          </View>
          <View style={styles.readOnlyRow}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <Text style={styles.fieldValue}>{personalInfo.email || "Not provided"}</Text>
          </View>
          <View style={styles.readOnlyRow}>
            <Text style={styles.fieldLabel}>Registered Address</Text>
            <Text style={styles.fieldValue}>{formattedAddress}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.editProfileBtn}
          onPress={() =>
            Alert.alert(
              "Update Profile Details",
              "To change your legal name, PAN, or address, update your TaxEdge profile or contact support."
            )
          }
        >
          <Text style={styles.editProfileText}>Edit / Update Profile</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Assessment Year & Rule Version Selection */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="calendar-outline" size={18} color="#083B75" />
            <Text style={styles.cardTitle}>Assessment Year (AY)</Text>
          </View>
        </View>

        <Text style={styles.cardDescription}>
          Select the assessment year for which you are filing this income tax return.
        </Text>

        <View style={styles.pickerRow}>
          {supportedAYs.map((ay) => {
            const isSelected = personalInfo.assessmentYear === ay.id;
            return (
              <TouchableOpacity
                key={ay.id}
                activeOpacity={0.8}
                style={[styles.pickerPill, isSelected && styles.pickerPillSelected]}
                onPress={() => onUpdatePersonalInfo({ assessmentYear: ay.id })}
              >
                <Text
                  style={[
                    styles.pickerPillText,
                    isSelected && styles.pickerPillTextSelected,
                  ]}
                >
                  {ay.label}
                </Text>
                <Text
                  style={[
                    styles.pickerPillSubText,
                    isSelected && styles.pickerPillSubTextSelected,
                  ]}
                >
                  FY {ay.financialYear}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Residential Status Confirmation */}
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
                onPress={() =>
                  onUpdatePersonalInfo({
                    residentialStatus: res.id,
                    residentialStatusConfirmed: true,
                  })
                }
              >
                <Text
                  style={[
                    styles.pickerPillText,
                    isSelected && styles.pickerPillTextSelected,
                  ]}
                >
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

      {/* 4. Filing Type Selection */}
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
                  <Text style={styles.radioCardTitle}>
                    {type.title} ({type.section})
                  </Text>
                  <Text style={styles.radioCardSubtitle}>{type.sub}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 5. Refund Bank Account */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="card-outline" size={18} color="#083B75" />
            <Text style={styles.cardTitle}>Refund Bank Account</Text>
          </View>
        </View>

        <Text style={styles.cardDescription}>
          Select the bank account to receive direct tax refund credit from the Income Tax Department.
        </Text>

        {bankAccountsList.length === 0 ? (
          <View style={styles.emptyBankCard}>
            <Text style={styles.emptyBankText}>
              No bank accounts added yet. Please add a bank account for refund credit.
            </Text>
          </View>
        ) : (
          <View style={styles.bankList}>
            {bankAccountsList.map((bank) => {
              const isSelected =
                bankDetails.accountNumber === bank.accountNumber &&
                Boolean(bankDetails.accountNumber);
              return (
                <TouchableOpacity
                  key={bank.id}
                  activeOpacity={0.8}
                  style={[
                    styles.bankSelectableCard,
                    isSelected && styles.bankSelectableCardSelected,
                  ]}
                  onPress={() => onSelectRefundBank(bank.id)}
                >
                  <View style={styles.bankInfoCol}>
                    <View style={styles.bankTitleRow}>
                      <Text style={styles.bankNameText}>{bank.bankName}</Text>
                      {bank.validationStatus === "Validated" && (
                        <View style={styles.verifiedTag}>
                          <Ionicons name="shield-checkmark" size={11} color="#166534" />
                          <Text style={styles.verifiedTagText}>Validated</Text>
                        </View>
                      )}
                      {isSelected && (
                        <View style={styles.verifiedTag}>
                          <Ionicons name="checkmark-circle" size={11} color="#166534" />
                          <Text style={styles.verifiedTagText}>Selected</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.bankMaskedNumber}>
                      {bank.maskedAccountNumber || `•••• •••• ${bank.accountNumber.slice(-4)}`}
                    </Text>
                    <Text style={styles.bankSubText}>
                      IFSC: {bank.ifscCode} {bank.accountType ? `• ${bank.accountType}` : ""}
                    </Text>
                  </View>
                  <View style={styles.bankRadioCol}>
                    <Ionicons
                      name={isSelected ? "radio-button-on" : "radio-button-off"}
                      size={22}
                      color={isSelected ? BrandColors.PRIMARY_ORANGE : "#94A3B8"}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.changeBankBtn}
          onPress={() => setShowBankModal(true)}
        >
          <Ionicons name="add-circle-outline" size={16} color="#083B75" />
          <Text style={styles.changeBankBtnText}>Add Another Bank Account</Text>
        </TouchableOpacity>
      </View>

      {/* 6. Previous ITR Import (Optional & Collapsible) */}
      <Step1PriorItrImport
        priorItrNotice={priorItrNotice}
        isPreviousItrExpanded={isPreviousItrExpanded}
        setIsPreviousItrExpanded={setIsPreviousItrExpanded}
        onUpdatePriorItrNotice={onUpdatePriorItrNotice}
        onImportPriorItrData={onImportPriorItrData}
      />

      {/* Continue Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.continueButton}
        onPress={handleValidateAndContinue}
      >
        <Text style={styles.continueButtonText}>{isEditing ? "Update and Continue" : "Confirm & Continue to Income"}</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Select Refund Bank Account Modal */}
      <BankSelectorModal
        visible={showBankModal}
        banks={bankAccountsList}
        selectedBankId={bankAccountsList.find((b) => b.isPrimaryRefund)?.id}
        onSelectBank={(id) => onSelectRefundBank(id)}
        onAddBank={(newBank) => onAddBankAccount(newBank)}
        onClose={() => setShowBankModal(false)}
      />
    </View>
  );
};
