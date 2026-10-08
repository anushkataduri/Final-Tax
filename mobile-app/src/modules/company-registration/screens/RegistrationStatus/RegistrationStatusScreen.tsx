import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { RegistrationStatusTracker } from '../../components/RegistrationStatusTracker/RegistrationStatusTracker';
import type { TimelineStep } from '../../../../shared/types/domain';
import { styles } from './RegistrationStatusScreen.styles';

export const RegistrationStatusScreen: React.FC = () => {
  const steps: TimelineStep[] = [
    { title: 'Name Approval (RUN / SPICe+ Part A)', description: 'Processed by ROC', status: 'completed', date: '02 Mar 2026' },
    { title: 'DSC & DIN Generation', description: 'Digital signatures generated', status: 'completed', date: '03 Mar 2026' },
    { title: 'SPICe+ Part B Filing & MOA/AOA', description: 'Filing in progress', status: 'current', date: 'In Progress' },
    { title: 'Certificate of Incorporation (COI)', description: 'Final MCA issuance', status: 'pending' },
    { title: 'PAN, TAN & Bank Account Setup', description: 'Corporate numbers setup', status: 'pending' },
  ];

  return (
    <View style={styles.container}>
      <AppHeader title="Incorporation Status" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <RegistrationStatusTracker steps={steps} />
      </ScrollView>
    </View>
  );
};

export default RegistrationStatusScreen;
