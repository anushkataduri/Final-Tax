import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { DocumentChecklist } from '../../../../shared/components/DocumentUploader/DocumentChecklist';
import type { ApplicationDocument } from '../../../../shared/types/domain';
import { styles } from './DocumentUploadScreen.styles';

export const DocumentUploadScreen: React.FC = () => {
  const docs: ApplicationDocument[] = [
    { name: 'PAN Card', status: 'Uploaded' },
    { name: 'Aadhaar Card', status: 'Pending' },
    { name: 'Bank Statement', status: 'Pending' },
  ];

  return (
    <View style={styles.container}>
      <AppHeader title="Upload File" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <DocumentChecklist
          documents={docs}
          onUpload={(docName, fileUri) => {}}
        />
      </ScrollView>
    </View>
  );
};

export default DocumentUploadScreen;
