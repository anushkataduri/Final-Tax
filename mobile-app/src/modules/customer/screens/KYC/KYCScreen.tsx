import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScreenLayout } from '../../../../shared/components/ScreenLayout/ScreenLayout';
import { useTheme } from '../../../../hooks/use-theme';
import { useAuthStore } from '../../../authentication/store/authStore';
import { useApplicationStore } from '../../../../store/applicationStore';
import type { Application, ApplicationDocument } from '../../../../shared/types/domain';
import {
  styles,
  getCardThemedStyle,
  getInfoKeyThemedStyle,
  getInfoValueThemedStyle,
  getStatusTextThemedStyle,
} from './KYCScreen.styles';

export function KYCScreen() {
  const colors = useTheme();
  const customer = useAuthStore((state) => state.customer);
  const applications = useApplicationStore((state) => state.applications);

  const allDocuments = applications.flatMap((app: Application) => app.documents);
  const hasUploaded = (keyword: string) =>
    allDocuments.some(
      (doc: ApplicationDocument) =>
        doc.name.toLowerCase().includes(keyword) && doc.status === 'Uploaded'
    );
  const kycVerified = hasUploaded('pan') && hasUploaded('aadhaar');

  const infoRow = (label: string, value: string) => (
    <View key={label} style={styles.infoRow}>
      <Text style={[styles.infoKey, getInfoKeyThemedStyle(colors.textSecondary)]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, getInfoValueThemedStyle(colors.text)]}>{value}</Text>
    </View>
  );

  return (
    <ScreenLayout title="KYC Verification" showBack>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.card, getCardThemedStyle(colors.backgroundElement, colors.border)]}>
          {infoRow(
            'PAN Number',
            customer?.pan
              ? customer.pan.substring(0, 5) + '****' + customer.pan.substring(9)
              : 'N/A'
          )}
          {infoRow(
            'Aadhaar Number',
            customer?.aadhaar
              ? '**** **** ' + customer.aadhaar.substring(8)
              : 'N/A'
          )}
          <View style={styles.infoRow}>
            <Text style={[styles.infoKey, getInfoKeyThemedStyle(colors.textSecondary)]}>
              Verification Status
            </Text>
            <View style={styles.statusLabelContainer}>
              <Ionicons
                name={kycVerified ? 'checkmark-circle' : 'time'}
                size={16}
                color={kycVerified ? colors.success : colors.orange}
              />
              <Text
                style={[
                  styles.statusText,
                  getStatusTextThemedStyle(kycVerified ? colors.success : colors.orange),
                ]}
              >
                {kycVerified ? 'Verified' : 'Action Required'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

export default KYCScreen;
