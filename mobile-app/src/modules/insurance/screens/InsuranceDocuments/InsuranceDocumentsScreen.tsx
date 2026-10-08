import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { DocumentChecklist } from '../../../../shared/components/DocumentUploader/DocumentChecklist';
import type { ApplicationDocument } from '../../../../shared/types/domain';
import { styles } from './InsuranceDocumentsScreen.styles';

export const InsuranceDocumentsScreen: React.FC = () => {
  const docs: ApplicationDocument[] = [
    { name: 'PAN Card of Proposer', status: 'Uploaded' },
    { name: 'Aadhaar Card (Address Proof)', status: 'Uploaded' },
    { name: 'Medical Reports (if applicable)', status: 'Pending' },
  ];

  return (
    <View style={styles.container}>
      <AppHeader title="Upload KYC Documents" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <DocumentChecklist documents={docs} onUpload={() => {}} />
      </ScrollView>
    </View>
  );
};

export default InsuranceDocumentsScreen;
