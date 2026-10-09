import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepSubmissionSuccess.styles';

export const StepSubmissionSuccess: React.FC = () => {
  const draft = useCompanyRegistrationStore((state) => state.draft);
  const setStep = useCompanyRegistrationStore((state) => state.setStep);

  const appliedDateStr = draft.createdAt || new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark-done-circle" size={48} color="#166534" />
      </View>
      <Text style={styles.heading}>Application Submitted Successfully</Text>
      <Text style={styles.subheading}>
        Your company incorporation application has been submitted successfully.
      </Text>

      {/* Confirmation Summary Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Application Reference Number</Text>
          <Text style={styles.value}>{draft.id || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Proposed Company Name</Text>
          <Text style={styles.value}>{draft.company.proposedName1 || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Entity Structure</Text>
          <Text style={styles.value}>{draft.company.companyType || 'Private Limited'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Submission Date</Text>
          <Text style={styles.value}>{appliedDateStr}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Current Status</Text>
          <Text style={[styles.value, { color: '#166534' }]}>{draft.status || 'Submitted'}</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.btnPrimaryContainer} onPress={() => setStep(8)} activeOpacity={0.8}>
        <LinearGradient
          colors={['#FF8A00', '#FF5500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btnPrimary}
        >
          <Text style={styles.btnPrimaryText}>Track Application</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
