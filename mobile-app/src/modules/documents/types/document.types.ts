export interface DocumentItem {
  id: string;
  name: string;
  fileName?: string;
  category: string;
  fileSize?: number;
  uri?: string;
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED';
  uploadedAt?: string;
  description?: string;
}

export interface DocumentCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  fileCount: number;
}
