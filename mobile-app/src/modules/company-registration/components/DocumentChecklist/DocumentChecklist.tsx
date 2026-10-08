import React from 'react';
import { DocumentChecklist as SharedDocChecklist } from '../../../../shared/components/DocumentUploader/DocumentChecklist';
import type { ApplicationDocument } from '../../../../shared/types/domain';

export interface DocumentChecklistProps {
  documents: ApplicationDocument[];
  onUpload: (docName: string, fileUri: string) => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = (props) => {
  return <SharedDocChecklist {...props} />;
};
export default DocumentChecklist;
