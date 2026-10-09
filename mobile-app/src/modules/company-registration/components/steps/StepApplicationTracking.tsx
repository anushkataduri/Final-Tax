import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { companyRegistrationApi } from '../../services/companyRegistrationApi';
import { getErrorMessage } from '@/core/error-handling/errorMessage';
import { styles } from './StepApplicationTracking.styles';

export const StepApplicationTracking: React.FC = () => {
  const router = useRouter();
  const draft = useCompanyRegistrationStore((state) => state.draft);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const stages = draft.trackingStages || [];

  const handleRefreshStatus = async () => {
    if (!draft.id) return;
    setIsRefreshing(true);
    try {
      await companyRegistrationApi.fetchStatus(draft.id);
      Alert.alert('Status Updated', 'Latest application status retrieved successfully.');
    } catch (e) {
      Alert.alert('Status Update', getErrorMessage(e) || 'Your application has been submitted. Tracking updates will appear when available.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Application Tracking</Text>
      <Text style={styles.subheading}>
        Live progress tracker for your company incorporation application.
      </Text>

      {/* Application Summary Card */}
      <View style={styles.metaCardContainer}>
        <LinearGradient
          colors={['#083B75', '#0B4F9C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.metaCard}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.metaId}>Ref #: {draft.id || 'N/A'}</Text>
            <TouchableOpacity onPress={handleRefreshStatus} disabled={isRefreshing} style={{ opacity: isRefreshing ? 0.6 : 1 }}>
              {isRefreshing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="refresh-circle-outline" size={26} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.metaText}>
            Company: {draft.company?.proposedName1 || 'N/A'}
          </Text>
          <Text style={styles.metaSub}>
            Type: {draft.company?.companyType || 'Private Limited'} • Submitted: {draft.createdAt || new Date().toISOString().split('T')[0]}
          </Text>
        </LinearGradient>
      </View>

      {/* Vertical Tracking Timeline */}
      <View style={styles.timeline}>
        {stages.map((stg, idx) => {
          const isDone = stg.status === 'completed';
          const isCurrent = stg.status === 'current';
          const isLast = idx === stages.length - 1;

          return (
            <View key={stg.id || `stg-${idx}`} style={styles.stageRow}>
              <View style={styles.iconColumn}>
                <Ionicons
                  name={isDone ? 'checkmark-circle' : isCurrent ? 'time' : 'ellipse-outline'}
                  size={22}
                  color={isDone ? '#166534' : isCurrent ? '#EA580C' : '#94A3B8'}
                />
                {!isLast && (
                  <View style={[styles.line, isDone && styles.lineCompleted]} />
                )}
              </View>

              <View style={styles.stageContent}>
                <Text style={styles.stageTitle}>{stg.title}</Text>
                {stg.description ? (
                  <Text style={styles.stageDesc}>{stg.description}</Text>
                ) : null}

                <View style={styles.statusFooterRow}>
                  {isDone ? (
                    <>
                      <Text style={styles.stageTime}>{stg.updatedAt || 'Completed'}</Text>
                      <Text style={styles.statusCompletedText}>✓ Completed</Text>
                    </>
                  ) : isCurrent ? (
                    <>
                      <Text style={styles.statusCurrentText}>In Progress</Text>
                      <Text style={styles.statusCurrentText}>• Active Step</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.statusPendingText}>Pending</Text>
                      <Text style={styles.statusPendingText}>Upcoming</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.homeBtnContainer} onPress={() => router.replace('/(main)/home')} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FF8A00', '#FF5500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.homeBtn}
          >
            <Ionicons name="home-outline" size={20} color="#FFFFFF" />
            <Text style={styles.homeBtnText}>Go to Home Dashboard</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.trackBtn} onPress={() => router.replace('/(main)/applications')} activeOpacity={0.8}>
          <Ionicons name="folder-open-outline" size={20} color="#475569" />
          <Text style={styles.trackBtnText}>Track in My Applications</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
