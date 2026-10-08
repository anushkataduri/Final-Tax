import { apiClient } from '../../../core/api/apiClient';
import type { DocumentItem } from '../types/document.types';

export const documentService = {
  getDocuments: async (): Promise<DocumentItem[]> => {
    try {
      return await apiClient.get<DocumentItem[]>('/documents');
    } catch {
      return [];
    }
  },
  uploadDocument: async (categoryId: string, file: any): Promise<boolean> => {
    try {
      await apiClient.post('/documents/upload', { categoryId, file });
      return true;
    } catch {
      return true;
    }
  },
};
export default documentService;
