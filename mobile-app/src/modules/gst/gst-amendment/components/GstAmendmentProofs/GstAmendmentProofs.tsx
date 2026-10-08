import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { styles } from "./GstAmendmentProofs.styles";
import { SupportingDoc } from "../../types/gstAmendmentTypes";
import { GstDocumentCard } from "@/modules/gst/components/GstDocumentCard";

interface GstAmendmentProofsProps {
  supportingDoc: SupportingDoc | null;
  onUploadSuccess?: (doc: SupportingDoc) => void;
  onBrowseFiles?: () => void;
  onScanFile?: () => void;
  onDeleteDoc: () => void;
  error?: string;
  acceptedProofs?: { initial: string[]; all: string[] };
  isProofsExpanded: boolean;
  onToggleExpandProofs: () => void;
}

export const GstAmendmentProofs: React.FC<GstAmendmentProofsProps> = ({
  supportingDoc,
  onUploadSuccess,
  onBrowseFiles,
  onDeleteDoc,
  error,
  acceptedProofs,
  isProofsExpanded,
  onToggleExpandProofs,
}) => {
  const displayedProofs = acceptedProofs
    ? isProofsExpanded
      ? acceptedProofs.all
      : acceptedProofs.initial
    : [];

  const hasMoreProofs = acceptedProofs
    ? acceptedProofs.all.length > acceptedProofs.initial.length
    : false;

  return (
    <>
      <Text style={styles.formSectionTitle}>Supporting Proof</Text>

      <GstDocumentCard
        item={{
          id: "amendment-proof",
          name: "Supporting Proof Document",
          subtitle: "Attach proof evidencing this change (PDF, JPG, PNG - max 10 MB)",
          required: true,
          fileUri: supportingDoc?.uri,
          fileName: supportingDoc?.name,
          fileSize: supportingDoc?.size,
          iconName: "document-text",
          iconBg: "#FFF1E8",
          iconColor: BrandColors.PRIMARY_ORANGE,
          errorMessage: error,
        }}
        onUploadSuccess={(_id, asset) => {
          if (onUploadSuccess) {
            onUploadSuccess({
              uri: asset.uri,
              name: asset.name,
              size: asset.size,
            });
          } else if (onBrowseFiles) {
            onBrowseFiles();
          }
        }}
        onRemove={() => onDeleteDoc()}
      />

      {acceptedProofs && (
        <View style={styles.acceptedProofsCard}>
          <View style={styles.acceptedProofsHeader}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={BrandColors.PRIMARY_ORANGE}
            />
            <Text style={styles.acceptedProofsTitle}>Accepted proofs</Text>
          </View>

          <View style={styles.acceptedProofList}>
            {displayedProofs.map((proof, idx) => (
              <View key={idx} style={styles.acceptedProofItem}>
                <Text style={styles.acceptedProofBullet}>•</Text>
                <Text style={styles.acceptedProofText}>{proof}</Text>
              </View>
            ))}
          </View>

          {hasMoreProofs && (
            <TouchableOpacity
              style={styles.viewMoreBtn}
              activeOpacity={0.7}
              onPress={onToggleExpandProofs}
            >
              <Text style={styles.viewMoreText}>
                {isProofsExpanded ? "View Less" : "View More"}
              </Text>
              <Ionicons
                name={isProofsExpanded ? "chevron-up" : "chevron-down"}
                size={14}
                color={BrandColors.PRIMARY_ORANGE}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};
