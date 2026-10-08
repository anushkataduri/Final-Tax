import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { DirectorForm } from '../../components/DirectorForm/DirectorForm';
import { useDirectors } from '../../hooks/useDirectors';
import { styles } from './DirectorDetailsScreen.styles';

export const DirectorDetailsScreen: React.FC = () => {
  const { addDirector } = useDirectors();

  return (
    <View style={styles.container}>
      <AppHeader title="Director / Partner Info" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <DirectorForm onAddDirector={addDirector} />
      </ScrollView>
    </View>
  );
};

export default DirectorDetailsScreen;
