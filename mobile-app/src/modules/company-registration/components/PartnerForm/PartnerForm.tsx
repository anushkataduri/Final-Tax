import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { FormInput } from '../../../../shared/components/Input/FormInput';
import { PrimaryButton } from '../../../../shared/components/Button/PrimaryButton';
import type { PartnerInfo } from '../../types/director.types';
import { generateId } from '../../../../shared/utils/helpers';
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

  const handleAdd = () => {
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Designated Partner</Text>
      <FormInput label="Full Name" value={name} onChangeText={setName} placeholder="As per PAN" required />
      <FormInput label="PAN Number" value={pan} onChangeText={(t) => setPan(t.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} required />
      <FormInput label="Aadhaar Number" value={aadhaar} onChangeText={setAadhaar} placeholder="12-digit Aadhaar" keyboardType="numeric" maxLength={12} required />
      <FormInput label="Email ID" value={email} onChangeText={setEmail} placeholder="partner@llp.com" keyboardType="email-address" required />
      <FormInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="10-digit mobile" keyboardType="phone-pad" maxLength={10} required />
      <FormInput label="Profit Sharing Ratio (%)" value={profitSharingRatio} onChangeText={setProfitSharingRatio} placeholder="e.g. 50" keyboardType="numeric" />
      <FormInput label="Capital Contribution (₹)" value={capitalContribution} onChangeText={setCapitalContribution} placeholder="e.g. 50000" keyboardType="numeric" />
      <PrimaryButton title="Add Partner" onPress={handleAdd} colorType="orange" />
    </View>
  );
};

export default PartnerForm;
