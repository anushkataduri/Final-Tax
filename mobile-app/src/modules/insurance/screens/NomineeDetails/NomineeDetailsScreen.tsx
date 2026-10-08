import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { NomineeForm } from '../../components/NomineeForm/NomineeForm';
import { usePolicy } from '../../hooks/usePolicy';
import { styles } from './NomineeDetailsScreen.styles';

export const NomineeDetailsScreen: React.FC = () => {
  const { nominee, setNominee } = usePolicy();

  return (
    <View style={styles.container}>
      <AppHeader title="Nominee Details" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <NomineeForm nominee={nominee || {}} onChange={(k, v) => setNominee({ ...(nominee || {}), [k]: v } as any)} />
      </ScrollView>
    </View>
  );
};

export default NomineeDetailsScreen;
