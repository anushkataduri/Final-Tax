import React from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/app/application/[id].styles";
import type { ApplicationDocument } from "@/types/domain";

interface DocumentsTabProps {
  isGstAmendment: boolean;
  formData: Record<string, any>;
  documents?: ApplicationDocument[];
  appliedDate?: string;
}

export function DocumentsTab({
  isGstAmendment,
  formData,
  documents = [],
  appliedDate,
}: DocumentsTabProps) {
  // Only display documents actually associated and uploaded for this application
  const uploadedDocs = (documents || []).filter(
    (doc) => doc.status === "Uploaded" || Boolean(doc.fileUri)
  );

  const hasAttachedSupportingDoc =
    isGstAmendment && Boolean(formData.document && formData.document.name);

  const hasNoDocs = uploadedDocs.length === 0 && !hasAttachedSupportingDoc;

  const handlePreviewDoc = async (uri?: string, name?: string) => {
    if (!uri) {
      Alert.alert(
        name || "Document Preview",
        "This document is securely stored on file with your application."
      );
      return;
    }
    try {
      const supported = await Linking.canOpenURL(uri);
      if (supported) {
        await Linking.openURL(uri);
      } else {
        Alert.alert(
          name || "Document Preview",
          `Document URI: ${uri}\n\nStored securely with your application submission.`
        );
      }
    } catch {
      Alert.alert(
        name || "Document Preview",
        `Viewing document: ${name || "Document"}`
      );
    }
  };

  const displayDate = appliedDate || "22 Oct 2025";

  return (
    <>
      {/* ── Uploaded Documents Card (Screen 4 Reference) ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Uploaded Documents</Text>

        {hasNoDocs ? (
          <View style={{ paddingVertical: 20, alignItems: "center" }}>
            <Ionicons name="document-text-outline" size={40} color="#94A3B8" />
            <Text
              style={{
                fontSize: 13,
                color: "#64748B",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              No uploaded documents associated with this application.
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 4 }}>
            {/* GST Amendment Supporting Proof */}
            {hasAttachedSupportingDoc && (
              <View style={styles.docItemRow}>
                <View style={styles.docPdfIconBox}>
                  <Ionicons name="document-text" size={20} color="#EF4444" />
                </View>
                <View style={styles.docItemContent}>
                  <Text style={styles.docItemTitle} numberOfLines={1}>
                    {formData.document.name}
                  </Text>
                  <Text style={styles.docItemSubtitle}>
                    {formData.document.size ? `PDF • ${formData.document.size}` : "PDF • 245 KB"}
                  </Text>
                  <View style={styles.docItemDateRow}>
                    <Ionicons name="calendar-outline" size={11} color="#94A3B8" />
                    <Text style={styles.docItemDateText}>{displayDate}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handlePreviewDoc(formData.document.uri, formData.document.name)}
                  style={styles.docEyeButton}
                >
                  <Ionicons name="eye-outline" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            )}

            {/* Uploaded Documents List */}
            {uploadedDocs.map((doc, idx) => {
              const fileName =
                (doc as any).fileName ||
                (doc.fileUri ? doc.fileUri.split("/").pop() : undefined);
              const fileSize = (doc as any).fileSize || "245 KB";
              const fileType = fileName?.endsWith(".png") || fileName?.endsWith(".jpg") ? "IMAGE" : "PDF";

              return (
                <View key={idx} style={styles.docItemRow}>
                  <View style={styles.docPdfIconBox}>
                    <Ionicons name="document-text" size={20} color="#EF4444" />
                  </View>
                  <View style={styles.docItemContent}>
                    <Text style={styles.docItemTitle} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text style={styles.docItemSubtitle}>
                      {fileType} • {fileSize}
                    </Text>
                    <View style={styles.docItemDateRow}>
                      <Ionicons name="calendar-outline" size={11} color="#94A3B8" />
                      <Text style={styles.docItemDateText}>{displayDate}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handlePreviewDoc(doc.fileUri, doc.name)}
                    style={styles.docEyeButton}
                  >
                    <Ionicons name="eye-outline" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* ── Bottom Informational Banner (Screen 4 Reference) ── */}
      <View style={styles.infoNoteCard}>
        <Ionicons name="information-circle-outline" size={18} color="#0284C7" />
        <Text style={styles.infoNoteText}>
          These are the documents you uploaded during the application.
        </Text>
      </View>
    </>
  );
}
