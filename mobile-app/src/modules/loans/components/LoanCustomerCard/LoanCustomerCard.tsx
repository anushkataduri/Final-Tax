import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { CustomerProfileSummary } from "../../types/loans.types";
import { maskPan, maskAadhaar } from "../../utils/maskingUtils";
import { styles, customerCardColors } from "./LoanCustomerCard.styles";

/** Wording that differs between loan products. Every field falls back to the default below. */
export interface LoanCustomerCardLabels {
  title: string;
  infoText: string;
  nameLabel: string;
  addressLabel: string;
}

export interface LoanCustomerCardProps {
  profile?: Partial<CustomerProfileSummary>;
  labels?: Partial<LoanCustomerCardLabels>;
  /** Colour of the shield icon in the "Verified Profile" badge. */
  verifiedIconColor?: string;
}

const DEFAULT_LABELS: LoanCustomerCardLabels = {
  title: "Applicant Identity Details",
  infoText:
    "Personal details are automatically loaded from your verified customer account. Manual re-entry is skipped.",
  nameLabel: "Applicant Name",
  addressLabel: "Address",
};

interface DetailRowProps {
  label: string;
  value: string;
  numberOfLines?: number;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, numberOfLines }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue} numberOfLines={numberOfLines}>
      {value}
    </Text>
  </View>
);

export const LoanCustomerCard: React.FC<LoanCustomerCardProps> = ({
  profile,
  labels,
  verifiedIconColor = customerCardColors.verifiedIcon,
}) => {
  const text = { ...DEFAULT_LABELS, ...labels };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Ionicons name="person-circle-outline" size={22} color={customerCardColors.titleIcon} />
          <Text style={styles.cardTitle}>{text.title}</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={12} color={verifiedIconColor} />
          <Text style={styles.verifiedText}>Verified Profile</Text>
        </View>
      </View>

      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>{text.infoText}</Text>
      </View>

      <View style={styles.detailsGrid}>
        <DetailRow label={text.nameLabel} value={profile?.name || "Client Name"} />
        <DetailRow label="Mobile" value={profile?.mobile || "Not available"} />
        <DetailRow label="Email" value={profile?.email || "Not available"} />
        <DetailRow label="PAN" value={maskPan(profile?.pan)} />
        <DetailRow label="Aadhaar" value={maskAadhaar(profile?.aadhaar)} />
        <DetailRow label="Date of Birth" value={profile?.dob || "Not provided"} />
        <DetailRow
          label={text.addressLabel}
          value={profile?.address || "Address linked to customer account"}
          numberOfLines={2}
        />
      </View>
    </View>
  );
};

export default LoanCustomerCard;
