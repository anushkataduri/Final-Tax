import { useDocumentVaultStore } from '../store/documentVaultStore';

export function useDocuments() {
  const categoryDocs = useDocumentVaultStore((s) => s.categoryDocs);
  const selectedCategoryId = useDocumentVaultStore((s) => s.selectedCategoryId);
  const setSelectedCategoryId = useDocumentVaultStore((s) => s.setSelectedCategoryId);
  const uploadDocument = useDocumentVaultStore((s) => s.uploadDocument);
  const deleteDocument = useDocumentVaultStore((s) => s.deleteDocument);
  const reuploadDocument = useDocumentVaultStore((s) => s.reuploadDocument);

  return {
    categoryDocs,
    selectedCategoryId,
    setSelectedCategoryId,
    uploadDocument,
    deleteDocument,
    reuploadDocument,
  };
}
