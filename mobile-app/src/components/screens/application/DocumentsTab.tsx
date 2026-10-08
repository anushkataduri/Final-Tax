import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/app/application/[id].styles";

interface DocumentsTabProps {
  isGstAmendment: boolean;
  formData: Record<string, any>;
  documents: any[];
  onUploadDocument: (docName: string) => void;
}

export function DocumentsTab({
  isGstAmendment,
  formData,
  documents,
  onUploadDocument,
}: DocumentsTabProps) {
  const hasNoDocs =
    documents.length === 0 && !(isGstAmendment && formData.document);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Ionicons name="folder-open-outline" size={20} color="#083B75" />
        <Text style={styles.cardHeaderTitle}>
          {isGstAmendment ? "Supporting Documents" : "Required Documents"}
        </Text>
      </View>
      <View style={styles.docsListWrap}>
        {hasNoDocs ? (
          <View style={styles.docEmptyContainer}>
            <Ionicons name="folder-open-outline" size={44} color="#94A3B8" />
            <Text style={styles.docEmptyText}>
              No documents uploaded for this application.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onUploadDocument("Additional Document")}
              style={[styles.actionBtnFilled, styles.docEmptyUploadBtn]}
            >
              <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionBtnFilledText}>Upload Document</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {isGstAmendment && formData.document && (
              <View style={styles.docItemCard}>
                <View style={styles.docIconWrap}>
                  <Ionicons name="checkmark-circle" size={24} color="#083B75" />
                </View>
                <View style={styles.docMetaWrap}>
                  <Text style={styles.docNameText}>
                    {formData.document.name}
                  </Text>
                  {formData.document.size ? (
                    <Text style={styles.docSubText}>
                      {formData.document.size}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.uploadedPill}>
                  <Ionicons name="checkmark-circle" size={14} color="#083B75" />
                  <Text style={styles.uploadedPillText}>Attached</Text>
                </View>
              </View>
            )}

            {documents.map((doc: any, i: number) => {
              const isUploaded = doc.status === "Uploaded";
              return (
                <View key={i} style={styles.docItemCard}>
                  <View style={styles.docIconWrap}>
                    <Ionicons
                      name={
                        isUploaded
                          ? "checkmark-circle"
                          : "document-text-outline"
                      }
                      size={24}
                      color={isUploaded ? "#059669" : "#EA580C"}
                    />
                  </View>
                  <View style={styles.docMetaWrap}>
                    <Text style={styles.docNameText}>{doc.name}</Text>
                    {doc.fileUri && (
                      <Text style={styles.docSubText} numberOfLines={1}>
                        {doc.fileUri.split("/").pop()}
                      </Text>
                    )}
                  </View>
                  {!isUploaded ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onUploadDocument(doc.name)}
                      style={styles.uploadPeachBtn}
                    >
                      <Text style={styles.uploadPeachBtnText}>Upload</Text>
                      <Ionicons
                        name="cloud-upload-outline"
                        size={15}
                        color="#EA580C"
                      />
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={[
                        styles.uploadedPill,
                        { backgroundColor: "#ECFDF5" },
                      ]}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color="#059669"
                      />
                      <Text
                        style={[
                          styles.uploadedPillText,
                          { color: "#059669" },
                        ]}
                      >
                        Uploaded
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}
      </View>
    </View>
  );
}
