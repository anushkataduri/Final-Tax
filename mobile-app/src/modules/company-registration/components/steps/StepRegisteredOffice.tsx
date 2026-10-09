import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { validatePinCode, validateCompanyEmail, validateCompanyMobile } from '../../validation/companySchema';
import { CompanySectionCard } from '../CompanySectionCard/CompanySectionCard';
import { styles } from './StepRegisteredOffice.styles';

export const StepRegisteredOffice: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const updateDetails = useCompanyRegistrationStore((state) => state.updateCompanyDetails);
  const fieldErrors = useCompanyRegistrationStore((state) => state.fieldErrors);
  const setFieldErrors = useCompanyRegistrationStore((state) => state.setFieldErrors);

  const clearError = (key: string) => {
    if (fieldErrors[key]) {
      const next = { ...fieldErrors };
      delete next[key];
      setFieldErrors(next);
    }
  };

  const handleOwnershipChange = (status: 'Rented' | 'Owned' | 'Leased') => {
    clearError('premisesOwnership');
    updateDetails({ premisesOwnership: status });
  };

  const handlePincodeChange = (val: string) => {
    const digits = val.replace(/[^0-9]/g, '').slice(0, 6);
    updateDetails({ registeredPincode: digits });
    if (!validatePinCode(digits)) clearError('registeredPincode');
  };

  const handleEmailChange = (val: string) => {
    updateDetails({ companyEmail: val });
    if (!validateCompanyEmail(val)) clearError('companyEmail');
  };

  const handleMobileChange = (val: string) => {
    const digits = val.replace(/[^0-9]/g, '').slice(0, 10);
    updateDetails({ companyMobile: digits });
    if (!validateCompanyMobile(digits)) clearError('companyMobile');
  };

  return (
    <View style={styles.container}>
      {/* CARD A — BUILDING / ADDRESS */}
      <CompanySectionCard title="Building / Address" description="Provide official communication address for MCA, ROC, and statutory authorities.">
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Building / Premises Address Line *</Text>
          <TextInput
            style={[styles.input, !!fieldErrors.registeredAddressLine && styles.inputError]}
            value={company.registeredAddressLine || ''}
            onChangeText={(val) => { updateDetails({ registeredAddressLine: val }); if (val.trim()) clearError('registeredAddressLine'); }}
            onBlur={() => { if (!company.registeredAddressLine?.trim()) setFieldErrors({ ...fieldErrors, registeredAddressLine: 'Address line is required.' }); }}
            placeholder="Enter registered address"
            placeholderTextColor="#94A3B8"
          />
          {!!fieldErrors.registeredAddressLine && <Text style={styles.errorText}>{fieldErrors.registeredAddressLine}</Text>}
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={[styles.input, !!fieldErrors.registeredCity && styles.inputError]}
              value={company.registeredCity || ''}
              onChangeText={(val) => { updateDetails({ registeredCity: val }); if (val.trim()) clearError('registeredCity'); }}
              onBlur={() => { if (!company.registeredCity?.trim()) setFieldErrors({ ...fieldErrors, registeredCity: 'City is required.' }); }}
              placeholder="Enter city"
              placeholderTextColor="#94A3B8"
            />
            {!!fieldErrors.registeredCity && <Text style={styles.errorText}>{fieldErrors.registeredCity}</Text>}
          </View>
          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>District *</Text>
            <TextInput
              style={[styles.input, !!fieldErrors.registeredDistrict && styles.inputError]}
              value={company.registeredDistrict || ''}
              onChangeText={(val) => { updateDetails({ registeredDistrict: val }); if (val.trim()) clearError('registeredDistrict'); }}
              onBlur={() => { if (!company.registeredDistrict?.trim()) setFieldErrors({ ...fieldErrors, registeredDistrict: 'District is required.' }); }}
              placeholder="Enter district"
              placeholderTextColor="#94A3B8"
            />
            {!!fieldErrors.registeredDistrict && <Text style={styles.errorText}>{fieldErrors.registeredDistrict}</Text>}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              style={[styles.input, !!fieldErrors.registeredState && styles.inputError]}
              value={company.registeredState || ''}
              onChangeText={(val) => { updateDetails({ registeredState: val }); if (val.trim()) clearError('registeredState'); }}
              onBlur={() => { if (!company.registeredState?.trim()) setFieldErrors({ ...fieldErrors, registeredState: 'State is required.' }); }}
              placeholder="Enter state"
              placeholderTextColor="#94A3B8"
            />
            {!!fieldErrors.registeredState && <Text style={styles.errorText}>{fieldErrors.registeredState}</Text>}
          </View>
          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>PIN Code *</Text>
            <TextInput
              style={[styles.input, !!fieldErrors.registeredPincode && styles.inputError]}
              value={company.registeredPincode || ''}
              onChangeText={handlePincodeChange}
              onBlur={() => {
                const err = validatePinCode(company.registeredPincode);
                if (err) setFieldErrors({ ...fieldErrors, registeredPincode: err });
              }}
              placeholder="Enter 6-digit PIN code"
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor="#94A3B8"
            />
            {!!fieldErrors.registeredPincode && <Text style={styles.errorText}>{fieldErrors.registeredPincode}</Text>}
          </View>
        </View>
      </CompanySectionCard>

      {/* CARD B — PREMISES OWNERSHIP */}
      <CompanySectionCard title="Premises Ownership">
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Premises Ownership Status *</Text>
          <View style={styles.chipRow}>
            {(['Rented', 'Owned', 'Leased'] as const).map((status) => {
              const isSelected = company.premisesOwnership === status;
              return (
                <TouchableOpacity key={status} style={[styles.chip, isSelected && styles.chipSelected]} onPress={() => handleOwnershipChange(status)} activeOpacity={0.8}>
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{status}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {!!fieldErrors.premisesOwnership && <Text style={styles.errorText}>{fieldErrors.premisesOwnership}</Text>}
        </View>
      </CompanySectionCard>

      {/* CARD C — CONTACT DETAILS */}
      <CompanySectionCard title="Contact Details">
        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>Company Email *</Text>
            <TextInput
              style={[styles.input, !!fieldErrors.companyEmail && styles.inputError]}
              value={company.companyEmail || ''}
              onChangeText={handleEmailChange}
              onBlur={() => {
                const err = validateCompanyEmail(company.companyEmail);
                if (err) setFieldErrors({ ...fieldErrors, companyEmail: err });
              }}
              placeholder="Enter company email"
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={254}
              placeholderTextColor="#94A3B8"
            />
            {!!fieldErrors.companyEmail && <Text style={styles.errorText}>{fieldErrors.companyEmail}</Text>}
          </View>
          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>Mobile *</Text>
            <TextInput
              style={[styles.input, !!fieldErrors.companyMobile && styles.inputError]}
              value={company.companyMobile || ''}
              onChangeText={handleMobileChange}
              onBlur={() => {
                const err = validateCompanyMobile(company.companyMobile);
                if (err) setFieldErrors({ ...fieldErrors, companyMobile: err });
              }}
              placeholder="Enter 10-digit mobile"
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor="#94A3B8"
            />
            {!!fieldErrors.companyMobile && <Text style={styles.errorText}>{fieldErrors.companyMobile}</Text>}
          </View>
        </View>
      </CompanySectionCard>
    </View>
  );
};

export default StepRegisteredOffice;
