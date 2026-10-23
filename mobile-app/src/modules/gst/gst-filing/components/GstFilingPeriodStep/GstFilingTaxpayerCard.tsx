import React from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { dismissKeyboardThen } from "@/shared/components/KeyboardAwareFormLayout";
import { validateGstin } from "@/modules/gst/gst-filing/utils/gstFilingValidation";
import { RecursivePills } from "./RecursivePills";
import { FILING_NATURE_OPTIONS } from "./gstPeriodUtils";
import { styles } from "./GstFilingPeriodStep.styles";
import type { GstFilingPeriodData } from "./GstFilingPeriodStep";

interface GstFilingTaxpayerCardProps {
  data: GstFilingPeriodData;
  errors: Record<string, string>;
  isLookingUp: boolean;
  onGstinChange: (text: string) => void;
  onBlurField?: (field: keyof GstFilingPeriodData) => void;
  onError?: (field: string, error: string) => void;
  onChange: (fields: Partial<GstFilingPeriodData>) => void;
  onOpenTypeModal: () => void;
}

export const GstFilingTaxpayerCard: React.FC<GstFilingTaxpayerCardProps> = ({
  data,
  errors,
  isLookingUp,
  onGstinChange,
  onBlurField,
  onError,
  onChange,
  onOpenTypeModal,
}) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconBox}>
        <Ionicons name="document-text-outline" size={18} color={BrandColors.PRIMARY_ORANGE} />
      </View>
      <View style={styles.sectionTitleWrap}>
        <Text style={styles.sectionMainTitle}>Taxpayer & Return Details</Text>
        <Text style={styles.sectionSubtitle}>Enter 15-character GSTIN & return type</Text>
      </View>
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>GSTIN (15-Character) *</Text>
      <TextInput
        style={[styles.input, errors.gstin ? styles.inputError : undefined]}
        placeholder="Enter GSTIN"
        placeholderTextColor="#94A3B8"
        value={data.gstin}
        onChangeText={onGstinChange}
        onBlur={() => {
          if (data.gstin) {
            const err = validateGstin(data.gstin, true);
            onError?.("gstin", err || "");
          }
          onBlurField?.("gstin");
        }}
        onSubmitEditing={() => {
          if (data.gstin) {
            const err = validateGstin(data.gstin, true);
            onError?.("gstin", err || "");
          }
        }}
        returnKeyType="done"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={15}
      />
      {isLookingUp ? (
        <ActivityIndicator
          size="small"
          color={BrandColors.PRIMARY_ORANGE}
          style={styles.lookupIndicator}
        />
      ) : null}
      {errors.gstin ? <Text style={styles.errorText}>{errors.gstin}</Text> : null}

      {data.isVerifiedEntity ? (
        <View style={styles.verifiedCard}>
          <View style={styles.verifiedTopRow}>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={15} color="#059669" />
              <Text style={styles.verifiedBadgeText}>Verified from GST Portal</Text>
            </View>
            <Text style={styles.verifiedStateText}>{data.state || "Active"}</Text>
          </View>
          <Text style={styles.verifiedTradeName}>{data.tradeName || data.businessName}</Text>
          <Text style={styles.verifiedLegalName}>{data.businessName}</Text>
          <View style={styles.schemePill}>
            <Text style={styles.schemePillText}>
              {data.taxpayerScheme || "Regular Scheme"}
            </Text>
          </View>
        </View>
      ) : null}
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Filing Return Type *</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => dismissKeyboardThen(onOpenTypeModal)}
        style={[styles.selectInput, errors.filingType ? styles.inputError : undefined]}
      >
        <Text
          style={[styles.selectText, !data.filingType && styles.placeholderText]}
          numberOfLines={1}
        >
          {data.filingType || "Select return type"}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#64748B" />
      </TouchableOpacity>
      {errors.filingType ? <Text style={styles.errorText}>{errors.filingType}</Text> : null}
    </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Filing Type *</Text>
      <View style={styles.periodPillsRow}>
        <RecursivePills
          items={FILING_NATURE_OPTIONS}
          selectedValue={data.filingNature || "Regular Return"}
          onSelect={(type) =>
            onChange({ filingNature: type as "Regular Return" | "Nil Return" })
          }
        />
      </View>
    </View>
  </View>
);
