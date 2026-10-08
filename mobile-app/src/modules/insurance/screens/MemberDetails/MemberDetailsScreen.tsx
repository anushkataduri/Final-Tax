import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { MemberForm } from '../../components/MemberForm/MemberForm';
import { usePolicy } from '../../hooks/usePolicy';
import { styles } from './MemberDetailsScreen.styles';

export const MemberDetailsScreen: React.FC = () => {
  const [member, setMember] = useState({ fullName: '', dob: '', relation: 'Self' as const, gender: 'MALE' as const, preExistingDiseases: [] });

  return (
    <View style={styles.container}>
      <AppHeader title="Insured Members" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <MemberForm member={member} onChange={(k, v) => setMember({ ...member, [k]: v })} />
      </ScrollView>
    </View>
  );
};

export default MemberDetailsScreen;
