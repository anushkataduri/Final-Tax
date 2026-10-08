import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  styles,
  getHeaderBarStyle,
  getBottomBarStyle,
} from "./GstNonCoreAmendmentEdit.styles";
import {
  AmendmentSectionConfig,
  AmendmentFormData,
  RegisteredDetails,
  SupportingDoc,
} from "../../types/gstAmendmentTypes";
import { BANK_ACCOUNT_TYPES, NON_CORE_ACCEPTED_PROOFS } from "../../config/gstNonCoreAmendmentConfig";
import { InputField, DropdownField, DateField, PhoneField } from "../GstAmendmentFields";
import { GstAmendmentProofs } from "../GstAmendmentProofs";

interface GstNonCoreAmendmentEditProps {
  selectedSection: AmendmentSectionConfig;
  registeredDetails: RegisteredDetails;
  formData: AmendmentFormData;
  errors: Record<string, string>;
  supportingDoc: SupportingDoc | null;
  isProofsExpanded: boolean;
  insets: { top: number; bottom: number };
  scrollViewRef: React.RefObject<ScrollView | null>;
  onBack: () => void;
  onUpdateField: (field: keyof AmendmentFormData, value: string) => void;
  onClearError: (key: string) => void;
  onOpenPicker: (title: string, options: string[], selectedVal: string, onSelect: (val: string) => void) => void;
  onBrowseFiles: () => void;
  onScanFile: () => void;
  onDeleteDoc: () => void;
  onToggleExpandProofs: () => void;
  onReviewChanges: () => void;
  isEditMode?: boolean;
  isSaving?: boolean;
}

export const GstNonCoreAmendmentEdit: React.FC<GstNonCoreAmendmentEditProps> = ({
  selectedSection,
  registeredDetails,
  formData,
  errors,
  supportingDoc,
  isProofsExpanded,
  insets,
  scrollViewRef,
  onBack,
  onUpdateField,
  onClearError,
  onOpenPicker,
  onBrowseFiles,
  onScanFile,
  onDeleteDoc,
  onToggleExpandProofs,
  onReviewChanges,
  isEditMode = false,
  isSaving = false,
}) => {
  const sectionId = selectedSection.id;
  const acceptedProofConfig = NON_CORE_ACCEPTED_PROOFS[sectionId];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={[styles.headerBar, getHeaderBarStyle(insets.top)]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.roundBackButton}
        >
          <Ionicons name="chevron-back" size={22} color={BrandColors.PRIMARY_BLUE} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerMainTitle}>{selectedSection.title}</Text>
          <Text style={styles.headerSubtitle}>Non-core field amendment</Text>
        </View>
        <View style={styles.placeholderBox} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.editContainer}>
          {/* Current Registered Info */}
          <View style={styles.currentRegisteredCard}>
            <Text style={styles.currentRegisteredHeader}>Currently Registered on Portal</Text>
            <Text style={styles.currentRegisteredSubtitle}>Read-only baseline from GST profile</Text>

            {sectionId === "bank-accounts" && (
              <>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Bank Name</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.bankName}</Text>
                </View>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Account Number</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.bankAccountNumber}</Text>
                </View>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>IFSC Code</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.ifscCode}</Text>
                </View>
              </>
            )}

            {sectionId === "authorised-signatories" && (
              <>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Signatory Name</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.signatoryName}</Text>
                </View>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Designation</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.signatoryDesignation}</Text>
                </View>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Contact</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.signatoryMobile}</Text>
                </View>
              </>
            )}

            {sectionId === "contact-details" && (
              <>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Registered Mobile</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.contactMobile}</Text>
                </View>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Registered Email</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.contactEmail}</Text>
                </View>
              </>
            )}
          </View>

          {/* Form Fields Section */}
          <Text style={styles.formSectionTitle}>Amended details</Text>

          {sectionId === "bank-accounts" && (
            <>
              <InputField
                label="New Bank Name"
                value={formData.newBankName}
                onChangeText={(val) => {
                  onUpdateField("newBankName", val);
                  onClearError("newBankName");
                }}
                placeholder="Enter bank name"
                error={errors.newBankName}
              />
              <InputField
                label="New Bank Account Number"
                value={formData.newBankAccountNumber}
                onChangeText={(val) => {
                  onUpdateField("newBankAccountNumber", val.replace(/[^0-9]/g, ""));
                  onClearError("newBankAccountNumber");
                }}
                placeholder="Enter bank account number"
                keyboardType="number-pad"
                error={errors.newBankAccountNumber}
              />
              <InputField
                label="Confirm Bank Account Number"
                value={formData.confirmBankAccountNumber}
                onChangeText={(val) => {
                  onUpdateField("confirmBankAccountNumber", val.replace(/[^0-9]/g, ""));
                  onClearError("confirmBankAccountNumber");
                }}
                placeholder="Re-enter bank account number"
                keyboardType="number-pad"
                error={errors.confirmBankAccountNumber}
              />
              <InputField
                label="IFSC Code"
                value={formData.newIfscCode}
                onChangeText={(val) => {
                  onUpdateField("newIfscCode", val.toUpperCase());
                  onClearError("newIfscCode");
                }}
                placeholder="Enter IFSC code"
                autoCapitalize="characters"
                maxLength={11}
                error={errors.newIfscCode}
              />
              <DropdownField
                label="Account Type"
                value={formData.newAccountType}
                placeholder="Select Account Type"
                error={errors.newAccountType}
                onPress={() =>
                  onOpenPicker("Select Account Type", BANK_ACCOUNT_TYPES, formData.newAccountType, (val) => {
                    onUpdateField("newAccountType", val);
                    onClearError("newAccountType");
                  })
                }
              />
            </>
          )}

          {sectionId === "authorised-signatories" && (
            <>
              <InputField
                label="Full Name of Signatory"
                value={formData.newSignatoryName}
                onChangeText={(val) => {
                  onUpdateField("newSignatoryName", val);
                  onClearError("newSignatoryName");
                }}
                placeholder="Full name as per PAN"
                error={errors.newSignatoryName}
              />
              <InputField
                label="PAN Number"
                value={formData.newSignatoryPan}
                onChangeText={(val) => {
                  onUpdateField("newSignatoryPan", val.toUpperCase());
                  onClearError("newSignatoryPan");
                }}
                placeholder="Enter PAN number"
                autoCapitalize="characters"
                maxLength={10}
                error={errors.newSignatoryPan}
              />
              <DateField
                label="Date of Birth (as on PAN)"
                value={formData.newSignatoryDob}
                onChangeText={(val) => {
                  onUpdateField("newSignatoryDob", val);
                  onClearError("newSignatoryDob");
                }}
                placeholder="dd-mm-yyyy"
                error={errors.newSignatoryDob}
              />
              <InputField
                label="Designation / Status"
                value={formData.newSignatoryDesignation}
                onChangeText={(val) => {
                  onUpdateField("newSignatoryDesignation", val);
                  onClearError("newSignatoryDesignation");
                }}
                placeholder="Enter designation"
                error={errors.newSignatoryDesignation}
              />
              <PhoneField
                label="Mobile Number"
                value={formData.newSignatoryMobile}
                onChangeText={(val) => {
                  onUpdateField("newSignatoryMobile", val.replace(/[^0-9]/g, "").slice(0, 10));
                  onClearError("newSignatoryMobile");
                }}
                placeholder="Enter 10-digit mobile number"
                error={errors.newSignatoryMobile}
              />
              <InputField
                label="Email Address"
                value={formData.newSignatoryEmail}
                onChangeText={(val) => {
                  onUpdateField("newSignatoryEmail", val.toLowerCase());
                  onClearError("newSignatoryEmail");
                }}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.newSignatoryEmail}
              />
            </>
          )}

          {sectionId === "contact-details" && (
            <>
              <PhoneField
                label="New Primary Contact Mobile"
                value={formData.newContactMobile}
                onChangeText={(val) => {
                  onUpdateField("newContactMobile", val.replace(/[^0-9]/g, "").slice(0, 10));
                  onClearError("newContactMobile");
                }}
                placeholder="Enter 10-digit mobile number"
                error={errors.newContactMobile}
              />
              <InputField
                label="New Primary Contact Email"
                value={formData.newContactEmail}
                onChangeText={(val) => {
                  onUpdateField("newContactEmail", val.toLowerCase());
                  onClearError("newContactEmail");
                }}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.newContactEmail}
              />
            </>
          )}

          {/* Supporting Proof Upload */}
          <GstAmendmentProofs
            supportingDoc={supportingDoc}
            onBrowseFiles={onBrowseFiles}
            onScanFile={onScanFile}
            onDeleteDoc={onDeleteDoc}
            error={errors.supportingDoc}
            acceptedProofs={acceptedProofConfig}
            isProofsExpanded={isProofsExpanded}
            onToggleExpandProofs={onToggleExpandProofs}
          />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, getBottomBarStyle(insets.bottom)]}>
        <TouchableOpacity
          style={[styles.primaryBtn, isSaving && { opacity: 0.65 }]}
          activeOpacity={0.8}
          onPress={onReviewChanges}
          disabled={isSaving}
        >
          <Text style={styles.primaryBtnText}>
            {isSaving
              ? (isEditMode ? "Updating Changes..." : "Saving Changes...")
              : (isEditMode ? "Review Updated Changes" : "Review Changes")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
