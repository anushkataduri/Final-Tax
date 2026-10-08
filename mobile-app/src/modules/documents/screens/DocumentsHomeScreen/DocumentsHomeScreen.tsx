import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { ScreenLayout } from "../../../../components/ScreenLayout";
import {
  useDocumentVaultStore,
  CATEGORY_DEFINITIONS,
} from "../../store/documentVaultStore";
import { MainVaultView } from "../../components/MainVaultView";
import { DocumentUploadView } from "../../components/DocumentUploadView";
import { styles } from "./DocumentsHomeScreen.styles";

export function DocumentsHomeScreen() {
  const [viewMode, setViewMode] = useState<"VAULT" | "UPLOAD">("VAULT");

  const selectedCategoryId = useDocumentVaultStore((state) => state.selectedCategoryId);
  const setSelectedCategoryId = useDocumentVaultStore((state) => state.setSelectedCategoryId);
  const categoryDocs = useDocumentVaultStore((state) => state.categoryDocs);
  const uploadDocument = useDocumentVaultStore((state) => state.uploadDocument);
  const reuploadDocument = useDocumentVaultStore((state) => state.reuploadDocument);
  const deleteDocument = useDocumentVaultStore((state) => state.deleteDocument);

  const categoriesWithCounts = CATEGORY_DEFINITIONS.map((cat) => ({
    ...cat,
    fileCount: (categoryDocs[cat.id] || []).length,
  }));

  const activeCategory =
    CATEGORY_DEFINITIONS.find((c) => c.id === selectedCategoryId) ||
    CATEGORY_DEFINITIONS[0];

  const currentDocs = categoryDocs[selectedCategoryId] || [];

  const handleSelectCategoryFromVault = (catId: string) => {
    setSelectedCategoryId(catId);
    setViewMode("UPLOAD");
  };

  const handleUpload = (docIdOrName: string, file: { name: string; size?: number; uri?: string }) => {
    uploadDocument(selectedCategoryId, docIdOrName, file);
  };

  const handleReupload = (docId: string) => {
    reuploadDocument(selectedCategoryId, docId);
  };

  const handleDelete = (docId: string) => {
    deleteDocument(selectedCategoryId, docId);
  };

  return (
    <ScreenLayout
      title={viewMode === "VAULT" ? "My Documents" : "Upload Documents"}
      showBack={viewMode === "UPLOAD"}
      onBack={() => setViewMode("VAULT")}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.responsiveContainer}>
          {viewMode === "VAULT" ? (
            <MainVaultView
              categories={categoriesWithCounts}
              onSelectCategory={handleSelectCategoryFromVault}
            />
          ) : (
            <DocumentUploadView
              categoryTitle={activeCategory.name}
              categoryDescription={activeCategory.description}
              documents={currentDocs}
              onUploadFile={handleUpload}
              onReuploadFile={handleReupload}
              onDeleteFile={handleDelete}
              onContinueReview={() => setViewMode("VAULT")}
              showContinueButton={true}
              continueButtonText="Submit"
            />
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

export default DocumentsHomeScreen;
