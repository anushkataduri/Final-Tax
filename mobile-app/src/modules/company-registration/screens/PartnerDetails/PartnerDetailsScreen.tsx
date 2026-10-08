import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { PartnerForm } from '../../components/PartnerForm/PartnerForm';
import { useDirectors } from '../../hooks/useDirectors';
import { styles } from './PartnerDetailsScreen.styles';

export const PartnerDetailsScreen: React.FC = () => {
  const { addPartner } = useDirectors();

  return (
    <View style={styles.container}>
      <AppHeader title="Partner Details (LLP)" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <PartnerForm onAddPartner={addPartner} />
      </ScrollView>
    </View>
  );
};

export default PartnerDetailsScreen;
