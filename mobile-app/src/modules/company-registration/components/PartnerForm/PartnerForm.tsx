import React, { useState } from 'react';
import { View } from 'react-native';
import { FormInput } from '../../../../shared/components/Input/FormInput';
import { PrimaryButton } from '../../../../shared/components/Button/PrimaryButton';
import type { PartnerInfo } from '../../types/director.types';
import { generateId } from '../../../../shared/utils/helpers';
import { CompanySectionCard } from '../CompanySectionCard/CompanySectionCard';
import {
  validateAadhaar,
  validateDirectorEmail,
  validateDirectorMobile,
  validateDirectorPan,
  validatePercentage,
  validatePersonName,
} from '../../validation/directorSchema';
import { validateCapitalNumeric } from '../../validation/companySchema';
import { styles } from './PartnerForm.styles';

export interface PartnerFormProps {
  onAddPartner: (partner: PartnerInfo) => void;
}

export const PartnerForm: React.FC<PartnerFormProps> = ({ onAddPartner }) => {
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profitSharingRatio, setProfitSharingRatio] = useState('50');
  const [capitalContribution, setCapitalContribution] = useState('50000');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, val: string) => {
    let err: string | null = null;
    if (field === 'name') err = validatePersonName(val, true, 'Full Name');
    else if (field === 'pan') err = validateDirectorPan(val);
    else if (field === 'aadhaar') err = val.trim() ? validateAadhaar(val, false) : null;
    else if (field === 'email') err = validateDirectorEmail(val);
    else if (field === 'phone') err = validateDirectorMobile(val);
    else if (field === 'profitSharingRatio') err = validatePercentage(val, 'Profit Sharing Ratio', false);
    else if (field === 'capitalContribution') err = validateCapitalNumeric(val, 'Capital Contribution');

    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
    return err;
  };

  const handleAdd = () => {
    const eName = validateField('name', name);
    const ePan = validateField('pan', pan);
    const eEmail = validateField('email', email);
    const ePhone = validateField('phone', phone);
    const eAadhaar = aadhaar.trim() ? validateField('aadhaar', aadhaar) : null;
    const eProfit = profitSharingRatio.trim() ? validateField('profitSharingRatio', profitSharingRatio) : null;
    const eCap = capitalContribution.trim() ? validateField('capitalContribution', capitalContribution) : null;

    if (eName || ePan || eEmail || ePhone || eAadhaar || eProfit || eCap) return;
    if (!name || !pan || !email || !phone) return;

    onAddPartner({
      id: generateId('partner'),
      name,
      pan: pan.toUpperCase(),
      aadhaar,
      email,
      phone,
      contributionAmount: parseFloat(capitalContribution) || 0,
      profitSharePercentage: parseFloat(profitSharingRatio) || 0,
      capitalContribution: parseFloat(capitalContribution) || 0,
      profitSharingRatio: parseFloat(profitSharingRatio) || 0,
    });

    setName('');
    setPan('');
    setAadhaar('');
    setEmail('');
    setPhone('');
    setProfitSharingRatio('50');
    setCapitalContribution('50000');
    setErrors({});
  };

  return (
    <View style={styles.container}>
      <CompanySectionCard
        iconName="people-outline"
        title="Add Designated Partner"
        subtitle="LLP partner contribution & profit share"
      >
        <FormInput
          label="Full Name"
          value={name}
          onChangeText={(t) => {
            setName(t);
            validateField('name', t);
          }}
          onBlur={() => validateField('name', name)}
          placeholder="As per PAN"
          error={errors.name}
          required
        />
        <FormInput
          label="PAN Number"
          value={pan}
          onChangeText={(t) => {
            const upper = t.toUpperCase();
            setPan(upper);
            validateField('pan', upper);
          }}
          onBlur={() => validateField('pan', pan)}
          placeholder="ABCDE1234F"
          maxLength={10}
          autoCapitalize="characters"
          error={errors.pan}
          required
        />
        <FormInput
          label="Aadhaar Number"
          value={aadhaar}
          onChangeText={(t) => {
            setAadhaar(t);
            validateField('aadhaar', t);
          }}
          onBlur={() => validateField('aadhaar', aadhaar)}
          placeholder="12-digit Aadhaar"
          keyboardType="numeric"
          maxLength={12}
          error={errors.aadhaar}
        />
        <FormInput
          label="Email ID"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            validateField('email', t);
          }}
          onBlur={() => validateField('email', email)}
          placeholder="partner@llp.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          required
        />
        <FormInput
          label="Phone Number"
          value={phone}
          onChangeText={(t) => {
            setPhone(t);
            validateField('phone', t);
          }}
          onBlur={() => validateField('phone', phone)}
          placeholder="10-digit mobile"
          keyboardType="phone-pad"
          maxLength={10}
          error={errors.phone}
          required
        />
        <FormInput
          label="Profit Sharing Ratio (%)"
          value={profitSharingRatio}
          onChangeText={(t) => {
            setProfitSharingRatio(t);
            validateField('profitSharingRatio', t);
          }}
          onBlur={() => validateField('profitSharingRatio', profitSharingRatio)}
          placeholder="e.g. 50"
          keyboardType="numeric"
          error={errors.profitSharingRatio}
        />
        <FormInput
          label="Capital Contribution (₹)"
          value={capitalContribution}
          onChangeText={(t) => {
            setCapitalContribution(t);
            validateField('capitalContribution', t);
          }}
          onBlur={() => validateField('capitalContribution', capitalContribution)}
          placeholder="e.g. 50000"
          keyboardType="numeric"
          error={errors.capitalContribution}
        />
        <PrimaryButton title="Add Partner" onPress={handleAdd} colorType="orange" />
      </CompanySectionCard>
    </View>
  );
};

export default PartnerForm;
