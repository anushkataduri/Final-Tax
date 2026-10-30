import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/app/application/[id].styles";
import type { Application, ApplicationDocument } from "@/types/domain";
import { GstViewDocumentModal } from "@/modules/gst/components/GstDocumentCard/GstViewDocumentModal";
import { extractAllApplicationDocuments } from "@/store/applicationDraftMappers";
import { formatDisplayDate } from "./applicationDetailsUtils";

interface DocumentsTabProps {
  app?: Application;
  isGstAmendment?: boolean;
  formData?: Record<string, any>;
  documents?: ApplicationDocument[];
  appliedDate?: string;
}

interface PreviewDocState {
  title: string;
  fileUri?: string;
  fileName?: string;
  fileSize?: string;
  fileTypeLabel?: string;
}

export function DocumentsTab({
  app,
  isGstAmendment,
  formData = {},
  documents = [],
  appliedDate,
}: DocumentsTabProps) {
  const [previewDoc, setPreviewDoc] = useState<PreviewDocState | null>(null);

  // Extract all associated documents across any application type
  const allDocs = extractAllApplicationDocuments(
    app || { formData, documents, serviceId: isGstAmendment ? "gst-amendment" : undefined },
    documents,
  );

  // Display only documents actually associated and uploaded for this application
  const uploadedDocs = allDocs.filter(
    (doc) => doc.status === "Uploaded" || Boolean(doc.fileUri),
  );

  const hasNoDocs = uploadedDocs.length === 0;
  const displayDate =
    appliedDate ||
    (app?.createdAt ? formatDisplayDate(app.createdAt) : undefined) ||
    "22 Oct 2025";

  const isImageFile = (uri?: string, name?: string) => {
    const target = `${uri || ""} ${name || ""}`.toLowerCase();
    return (
      target.includes(".jpg") ||
      target.includes(".jpeg") ||
      target.includes(".png") ||
      target.includes(".webp") ||
      target.includes("image/") ||
      target.startsWith("data:image")
    );
  };

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
            {uploadedDocs.map((doc, idx) => {
              const fileName =
                doc.fileName ||
                (doc.fileUri ? doc.fileUri.split("/").pop()?.split("?")[0] : undefined) ||
                doc.name;
              const fileSize = doc.fileSize || "245 KB";
              const isImg = isImageFile(doc.fileUri, fileName || doc.name);
              const fileType = isImg ? "IMAGE" : "PDF";
              const docDate = doc.uploadedAt ? formatDisplayDate(doc.uploadedAt) : displayDate;
              const categoryLabel =
                doc.category && doc.category.toLowerCase() !== doc.name.toLowerCase()
                  ? doc.category
                  : "";

              return (
                <View key={`${doc.name}-${idx}`} style={styles.docItemRow}>
                  <View style={styles.docPdfIconBox}>
                    <Ionicons
                      name={isImg ? "image" : "document-text"}
                      size={20}
                      color="#EF4444"
                    />
                  </View>
                  <View style={styles.docItemContent}>
                    <Text style={styles.docItemTitle} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    {Boolean(fileName && fileName !== doc.name) && (
                      <Text style={styles.docItemFileName} numberOfLines={1}>
                        {fileName}
                      </Text>
                    )}
                    <Text style={styles.docItemSubtitle}>
                      {categoryLabel ? `${categoryLabel} • ` : ""}
                      {fileType} • {fileSize}
                    </Text>
                    <View style={styles.docItemDateRow}>
                      <Ionicons name="calendar-outline" size={11} color="#94A3B8" />
                      <Text style={styles.docItemDateText}>{docDate}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      setPreviewDoc({
                        title: doc.name || "Document Preview",
                        fileUri: doc.fileUri,
                        fileName,
                        fileSize,
                        fileTypeLabel: fileType,
                      })
                    }
                    style={styles.docEyeButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Preview ${doc.name}`}
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

      {/* ── Document Preview Modal ── */}
      <GstViewDocumentModal
        visible={Boolean(previewDoc)}
        title={previewDoc?.title || "Document Preview"}
        fileUri={previewDoc?.fileUri}
        fileName={previewDoc?.fileName}
        fileSize={previewDoc?.fileSize}
        fileTypeLabel={previewDoc?.fileTypeLabel}
        onClose={() => setPreviewDoc(null)}
      />
    </>
  );
}
