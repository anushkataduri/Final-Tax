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
} from "./GstCoreAmendmentEdit.styles";
import {
  AmendmentSectionConfig,
  AmendmentFormData,
  RegisteredDetails,
  SupportingDoc,
} from "../../types/gstAmendmentTypes";
import {
  INDIAN_STATES_AND_UTS,
  NATURE_OF_PREMISES_OPTIONS,
  CORE_ACCEPTED_PROOFS,
} from "../../config/gstCoreAmendmentConfig";
import { InputField, DropdownField } from "../GstAmendmentFields";
import { GstAmendmentProofs } from "../GstAmendmentProofs";

interface GstCoreAmendmentEditProps {
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

export const GstCoreAmendmentEdit: React.FC<GstCoreAmendmentEditProps> = ({
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
  const acceptedProofConfig = CORE_ACCEPTED_PROOFS[sectionId];

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
          <Text style={styles.headerSubtitle}>Core field amendment</Text>
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

            {sectionId === "legal-name" && (
              <View style={styles.currentFieldRow}>
                <Text style={styles.currentFieldLabel}>Legal Name</Text>
                <Text style={styles.currentFieldValue}>{registeredDetails.legalBusinessName}</Text>
              </View>
            )}

            {sectionId === "principal-place" && (
              <>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Address</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.principalAddress}</Text>
                </View>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>City / State</Text>
                  <Text style={styles.currentFieldValue}>{`${registeredDetails.principalCity}, ${registeredDetails.principalState} - ${registeredDetails.principalPincode}`}</Text>
                </View>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Premises Proof</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.principalProofType}</Text>
                </View>
              </>
            )}

            {sectionId === "additional-place" && (
              <>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Additional Address</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.additionalAddress || "None recorded"}</Text>
                </View>
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>City / PIN</Text>
                  <Text style={styles.currentFieldValue}>{`${registeredDetails.additionalCity || "—"} - ${registeredDetails.additionalPincode || "—"}`}</Text>
                </View>
              </>
            )}
          </View>

          {/* Form Fields Section */}
          <Text style={styles.formSectionTitle}>Amended details</Text>

          {sectionId === "legal-name" && (
            <InputField
              label="New Legal Business Name"
              value={formData.newLegalBusinessName}
              onChangeText={(val) => {
                onUpdateField("newLegalBusinessName", val);
                onClearError("newLegalBusinessName");
              }}
              placeholder="Enter amended legal name"
              error={errors.newLegalBusinessName}
            />
          )}

          {sectionId === "principal-place" && (
            <>
              <InputField
                label="New Principal Business Address"
                value={formData.newPrincipalAddress}
                onChangeText={(val) => {
                  onUpdateField("newPrincipalAddress", val);
                  onClearError("newPrincipalAddress");
                }}
                placeholder="Building Name, Floor, Flat No., Street"
                error={errors.newPrincipalAddress}
              />
              <InputField
                label="City / Town"
                value={formData.newPrincipalCity}
                onChangeText={(val) => {
                  onUpdateField("newPrincipalCity", val);
                  onClearError("newPrincipalCity");
                }}
                placeholder="City or Town"
                error={errors.newPrincipalCity}
              />
              <InputField
                label="District"
                value={formData.newPrincipalDistrict}
                onChangeText={(val) => {
                  onUpdateField("newPrincipalDistrict", val);
                  onClearError("newPrincipalDistrict");
                }}
                placeholder="District"
                error={errors.newPrincipalDistrict}
              />
              <DropdownField
                label="State / Union Territory"
                value={formData.newPrincipalState}
                placeholder="Select State"
                error={errors.newPrincipalState}
                onPress={() =>
                  onOpenPicker("Select State", INDIAN_STATES_AND_UTS, formData.newPrincipalState, (val) => {
                    onUpdateField("newPrincipalState", val);
                    onClearError("newPrincipalState");
                  })
                }
              />
              <InputField
                label="PIN Code"
                value={formData.newPrincipalPincode}
                onChangeText={(val) => {
                  onUpdateField("newPrincipalPincode", val.replace(/[^0-9]/g, "").slice(0, 6));
                  onClearError("newPrincipalPincode");
                }}
                placeholder="6-digit PIN code"
                keyboardType="number-pad"
                maxLength={6}
                error={errors.newPrincipalPincode}
              />
              <DropdownField
                label="Nature of Possession of Premises"
                value={formData.newPrincipalNatureOfPremises}
                placeholder="Select Nature of Premises"
                error={errors.newPrincipalNatureOfPremises}
                onPress={() =>
                  onOpenPicker(
                    "Select Nature of Premises",
                    NATURE_OF_PREMISES_OPTIONS,
                    formData.newPrincipalNatureOfPremises,
                    (val) => {
                      onUpdateField("newPrincipalNatureOfPremises", val);
                      onClearError("newPrincipalNatureOfPremises");
                    }
                  )
                }
              />
            </>
          )}

          {sectionId === "additional-place" && (
            <>
              <InputField
                label="New Additional Place Address"
                value={formData.newAdditionalAddress}
                onChangeText={(val) => {
                  onUpdateField("newAdditionalAddress", val);
                  onClearError("newAdditionalAddress");
                }}
                placeholder="Building Name, Unit No., Street"
                error={errors.newAdditionalAddress}
              />
              <InputField
                label="City / Town"
                value={formData.newAdditionalCity}
                onChangeText={(val) => {
                  onUpdateField("newAdditionalCity", val);
                  onClearError("newAdditionalCity");
                }}
                placeholder="City or Town"
                error={errors.newAdditionalCity}
              />
              <InputField
                label="PIN Code"
                value={formData.newAdditionalPincode}
                onChangeText={(val) => {
                  onUpdateField("newAdditionalPincode", val.replace(/[^0-9]/g, "").slice(0, 6));
                  onClearError("newAdditionalPincode");
                }}
                placeholder="6-digit PIN code"
                keyboardType="number-pad"
                maxLength={6}
                error={errors.newAdditionalPincode}
              />
              <DropdownField
                label="Nature of Possession"
                value={formData.newAdditionalNatureOfPremises}
                placeholder="Select Nature of Premises"
                error={errors.newAdditionalNatureOfPremises}
                onPress={() =>
                  onOpenPicker(
                    "Select Nature of Premises",
                    NATURE_OF_PREMISES_OPTIONS,
                    formData.newAdditionalNatureOfPremises,
                    (val) => {
                      onUpdateField("newAdditionalNatureOfPremises", val);
                      onClearError("newAdditionalNatureOfPremises");
                    }
                  )
                }
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
