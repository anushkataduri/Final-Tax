import type { DocumentItem } from '../types/document.types';

export const documentSchema = {
  isValidDocument(doc: Partial<DocumentItem>): boolean {
    return Boolean(doc.name && doc.category);
  },
};
