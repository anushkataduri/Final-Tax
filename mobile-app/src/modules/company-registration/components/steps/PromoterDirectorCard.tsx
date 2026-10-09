import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { DirectorInfo } from '../../types/director.types';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import {
  formatDobInput,
  validateDirectorPan,
  validateDirectorEmail,
  validateDirectorMobile,
  validateDirectorDob,
} from '../../validation/directorSchema';
import { styles } from './StepPromoters.styles';

export interface PromoterDirectorCardProps {
  director: DirectorInfo;
  index: number;
  isExpanded: boolean;
  canRemove: boolean;
  shareholdingPct: string;
  onToggleExpand: () => void;
  onSave: (updated: Partial<DirectorInfo>) => void;
  onDeleteRequest: () => void;
}

export const PromoterDirectorCard: React.FC<PromoterDirectorCardProps> = ({
  director,
  index,
  isExpanded,
  canRemove,
  shareholdingPct,
  onToggleExpand,
  onSave,
  onDeleteRequest,
}) => {
  const fieldErrors = useCompanyRegistrationStore((state) => state.fieldErrors);
  const setFieldErrors = useCompanyRegistrationStore((state) => state.setFieldErrors);
  const [formData, setFormData] = useState<DirectorInfo>(director);

  useEffect(() => { setFormData(director); }, [director]);

  const getErr = (fieldKey: string) => fieldErrors[`dir_${director.id}_${fieldKey}`];

  const clearFieldError = (fieldKey: string) => {
    const fullKey = `dir_${director.id}_${fieldKey}`;
    if (fieldErrors[fullKey]) {
      const next = { ...fieldErrors };
      delete next[fullKey];
      setFieldErrors(next);
    }
  };

  const setSingleFieldError = (fieldKey: string, msg: string) => {
    const fullKey = `dir_${director.id}_${fieldKey}`;
    setFieldErrors({ ...fieldErrors, [fullKey]: msg });
  };

  const updateField = (fields: Partial<DirectorInfo>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handlePanChange = (val: string) => {
    const upper = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    updateField({ pan: upper });
    if (!validateDirectorPan(upper)) clearFieldError('pan');
  };

  const handleEmailChange = (val: string) => {
    updateField({ email: val });
    if (!validateDirectorEmail(val)) clearFieldError('email');
  };

  const handleMobileChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    updateField({ phone: digits });
    if (!validateDirectorMobile(digits)) clearFieldError('phone');
  };

  const handleDobChange = (val: string) => {
    const formatted = formatDobInput(val);
    updateField({ dob: formatted });
    if (!validateDirectorDob(formatted)) clearFieldError('dob');
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <TouchableOpacity style={styles.cardHeaderLeft} onPress={onToggleExpand} activeOpacity={0.8}>
          <View style={styles.avatarBox}><Text style={styles.avatarText}>#{index + 1}</Text></View>
          <View style={styles.cardTitleGroup}>
            <Text style={styles.cardTitle}>👤 Director #{index + 1}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>{director.name || 'Enter Director Details'}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.cardHeaderRight}>
          <TouchableOpacity style={styles.editBtnHeader} onPress={onToggleExpand} activeOpacity={0.7}>
            <Ionicons name={isExpanded ? 'chevron-up' : 'pencil'} size={16} color="#FF8A00" />
            <Text style={styles.editBtnHeaderText}>{isExpanded ? 'Collapse' : 'Edit'}</Text>
          </TouchableOpacity>
          {canRemove && (
            <TouchableOpacity style={styles.deleteBtnHeader} onPress={onDeleteRequest} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isExpanded && (
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>PAN: <Text style={styles.summaryBold}>{director.pan || 'N/A'}</Text></Text>
            <Text style={styles.summaryText}>Mobile: <Text style={styles.summaryBold}>{director.phone || 'N/A'}</Text></Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Email: <Text style={styles.summaryBold}>{director.email || 'N/A'}</Text></Text>
            <Text style={styles.summaryText}>Shareholding: <Text style={styles.summaryBold}>{shareholdingPct}</Text></Text>
          </View>
        </View>
      )}

      {isExpanded && (
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Full Name (as in PAN) *</Text>
              <TextInput
                style={[styles.input, !!getErr('name') && styles.inputError]}
                value={formData.name}
                onChangeText={(val) => { updateField({ name: val }); if (val.trim()) clearFieldError('name'); }}
                onBlur={() => { if (!formData.name?.trim()) setSingleFieldError('name', 'Full Name as in PAN is required.'); }}
                placeholder="Full Legal Name"
                placeholderTextColor="#94A3B8"
              />
              {!!getErr('name') && <Text style={styles.errorText}>{getErr('name')}</Text>}
            </View>

            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>PAN Number *</Text>
              <TextInput
                style={[styles.input, !!getErr('pan') && styles.inputError]}
                value={formData.pan}
                onChangeText={handlePanChange}
                onBlur={() => {
                  const err = validateDirectorPan(formData.pan);
                  if (err) setSingleFieldError('pan', err);
                }}
                placeholder="10-character PAN"
                autoCapitalize="characters"
                maxLength={10}
                placeholderTextColor="#94A3B8"
              />
              {!!getErr('pan') && <Text style={styles.errorText}>{getErr('pan')}</Text>}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Date of Birth *</Text>
              <TextInput
                style={[styles.input, !!getErr('dob') && styles.inputError]}
                value={formData.dob || ''}
                onChangeText={handleDobChange}
                onBlur={() => {
                  const err = validateDirectorDob(formData.dob);
                  if (err) setSingleFieldError('dob', err);
                }}
                placeholder="DD-MM-YYYY"
                keyboardType="numeric"
                maxLength={10}
                placeholderTextColor="#94A3B8"
              />
              {!!getErr('dob') && <Text style={styles.errorText}>{getErr('dob')}</Text>}
            </View>

            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Designation *</Text>
              <TextInput
                style={[styles.input, !!getErr('designation') && styles.inputError]}
                value={formData.designation || ''}
                onChangeText={(val) => { updateField({ designation: val }); if (val.trim()) clearFieldError('designation'); }}
                onBlur={() => { if (!formData.designation?.trim()) setSingleFieldError('designation', 'Designation is required.'); }}
                placeholder="e.g. Director"
                placeholderTextColor="#94A3B8"
              />
              {!!getErr('designation') && <Text style={styles.errorText}>{getErr('designation')}</Text>}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[styles.input, !!getErr('email') && styles.inputError]}
                value={formData.email || ''}
                onChangeText={handleEmailChange}
                onBlur={() => {
                  const err = validateDirectorEmail(formData.email);
                  if (err) setSingleFieldError('email', err);
                }}
                placeholder="Enter Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                maxLength={254}
                placeholderTextColor="#94A3B8"
              />
              {!!getErr('email') && <Text style={styles.errorText}>{getErr('email')}</Text>}
            </View>

            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={[styles.input, !!getErr('phone') && styles.inputError]}
                value={formData.phone || ''}
                onChangeText={handleMobileChange}
                onBlur={() => {
                  const err = validateDirectorMobile(formData.phone);
                  if (err) setSingleFieldError('phone', err);
                }}
                placeholder="Enter 10-digit Mobile"
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor="#94A3B8"
              />
              {!!getErr('phone') && <Text style={styles.errorText}>{getErr('phone')}</Text>}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>DIN (if already allotted)</Text>
            <TextInput
              style={[styles.input, !!getErr('din') && styles.inputError]}
              value={formData.din || ''}
              onChangeText={(val) => {
                const digits = val.replace(/\D/g, '').slice(0, 8);
                updateField({ din: digits, hasDin: !!digits });
              }}
              placeholder="8-digit DIN (Optional)"
              keyboardType="numeric"
              maxLength={8}
              placeholderTextColor="#94A3B8"
            />
            {!!getErr('din') && <Text style={styles.errorText}>{getErr('din')}</Text>}
          </View>

          <View style={styles.cardActionsRow}>
            <TouchableOpacity style={styles.cancelFormBtn} onPress={onToggleExpand} activeOpacity={0.7}>
              <Text style={styles.cancelFormText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveFormBtn} onPress={() => onSave(formData)} activeOpacity={0.7}>
              <Ionicons name="checkmark-sharp" size={16} color="#FFFFFF" />
              <Text style={styles.saveFormText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
