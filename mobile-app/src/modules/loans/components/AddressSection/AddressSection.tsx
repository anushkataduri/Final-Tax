import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { INDIAN_STATES_AND_UTS } from "@/components/screens/create-profile/types";
import type {
  LoanKycData,
  LoanKycAddress,
  LoanKycErrors,
} from "../../types/loanKyc.types";
import { LoanAddressBlock } from "./LoanAddressBlock";
import { styles } from "./AddressSection.styles";

const STATE_OPTIONS: string[] = [...INDIAN_STATES_AND_UTS];

interface AddressSectionProps {
  data: LoanKycData;
  errors: LoanKycErrors;
  onChangeCurrentAddress: (field: keyof LoanKycAddress, value: string) => void;
  onChangePermanentAddress: (field: keyof LoanKycAddress, value: string) => void;
  onTogglePermanentSame: (isSame: boolean) => void;
  isLocked?: boolean;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  data,
  errors,
  onChangeCurrentAddress,
  onChangePermanentAddress,
  onTogglePermanentSame,
  isLocked = false,
}) => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <View style={[styles.iconBox, isLocked && { backgroundColor: "#EAF1FE" }]}>
          <Ionicons
            name={isLocked ? "lock-closed" : "location-outline"}
            size={18}
            color={isLocked ? "#083B75" : "#EA580C"}
          />
        </View>
        <Text style={styles.title}>
          {isLocked ? "Verified Address Details" : "Address Details"}
        </Text>
      </View>
    </View>

    {isLocked ? (
      <View style={styles.lockNoteRow}>
        <Ionicons name="information-circle-outline" size={14} color="#64748B" />
        <Text style={styles.lockNoteText}>
          Address details fetched from verified KYC records cannot be edited.
        </Text>
      </View>
    ) : (
      <Text style={styles.subtitle}>
        Provide your current communication and permanent address for lender verification.
      </Text>
    )}

    <Text style={styles.sectionSubHeader}>Current Address</Text>
    <LoanAddressBlock
      address={data.currentAddress}
      errorPrefix="currentAddress"
      errors={errors}
      isLocked={isLocked}
      onChange={onChangeCurrentAddress}
      stateOptions={STATE_OPTIONS}
    />

    <View style={styles.toggleBox}>
      <View style={isLocked ? styles.lockedLabelRow : undefined}>
        <Text style={styles.toggleLabel}>
          Permanent Address same as Current Address?
        </Text>
        {isLocked && <Ionicons name="lock-closed-outline" size={12} color="#94A3B8" />}
      </View>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            data.isPermanentSameAsCurrent && styles.toggleBtnActive,
            isLocked && styles.toggleBtnDisabled,
          ]}
          activeOpacity={isLocked ? 1 : 0.8}
          disabled={isLocked}
          onPress={() => { if (!isLocked) onTogglePermanentSame(true); }}
        >
          <Text
            style={[
              styles.toggleBtnText,
              data.isPermanentSameAsCurrent && styles.toggleBtnTextActive,
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            !data.isPermanentSameAsCurrent && styles.toggleBtnActive,
            isLocked && styles.toggleBtnDisabled,
          ]}
          activeOpacity={isLocked ? 1 : 0.8}
          disabled={isLocked}
          onPress={() => { if (!isLocked) onTogglePermanentSame(false); }}
        >
          <Text
            style={[
              styles.toggleBtnText,
              !data.isPermanentSameAsCurrent && styles.toggleBtnTextActive,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>

    {!data.isPermanentSameAsCurrent && (
      <View style={styles.permanentSection}>
        <Text style={styles.sectionSubHeader}>Permanent Address</Text>
        <LoanAddressBlock
          address={data.permanentAddress}
          errorPrefix="permanentAddress"
          errors={errors}
          isLocked={isLocked}
          onChange={onChangePermanentAddress}
          stateOptions={STATE_OPTIONS}
          statePlaceholder="Select Permanent State / UT"
        />
      </View>
    )}
  </View>
);

export default AddressSection;
