import React, { useState } from "react";
import { View } from "react-native";
import { FormInput } from "../../../../shared/components/Input/FormInput";
import { PrimaryButton } from "../../../../shared/components/Button/PrimaryButton";
import type { DirectorInfo } from "../../types/director.types";
import { generateId } from "../../../../shared/utils/helpers";
import { CompanySectionCard } from "../CompanySectionCard/CompanySectionCard";
import {
  validateAadhaar,
  validateDirectorEmail,
  validateDirectorMobile,
  validateDirectorPan,
  validatePercentage,
  validatePersonName,
} from "../../validation/directorSchema";
import { styles } from "./DirectorForm.styles";

export interface DirectorFormProps {
  onAddDirector: (director: DirectorInfo) => void;
}

export const DirectorForm: React.FC<DirectorFormProps> = ({ onAddDirector }) => {
  const [name, setName] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sharesPercentage, setSharesPercentage] = useState("50");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, val: string) => {
    let err: string | null = null;
    if (field === 'name') err = validatePersonName(val, true, 'Full Name');
    else if (field === 'pan') err = validateDirectorPan(val);
    else if (field === 'aadhaar') err = val.trim() ? validateAadhaar(val, false) : null;
    else if (field === 'email') err = validateDirectorEmail(val);
    else if (field === 'phone') err = validateDirectorMobile(val);
    else if (field === 'sharesPercentage') err = validatePercentage(val, 'Shareholding', false);

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
    const eShares = sharesPercentage.trim() ? validateField('sharesPercentage', sharesPercentage) : null;

    if (eName || ePan || eEmail || ePhone || eAadhaar || eShares) return;
    if (!name || !pan || !email || !phone) return;

    onAddDirector({
      id: generateId("dir"),
      name,
      pan: pan.toUpperCase(),
      aadhaar,
      email,
      phone,
      hasDin: false,
      sharesPercentage: parseFloat(sharesPercentage) || 0,
      residentialAddress: "",
    });

    setName("");
    setPan("");
    setAadhaar("");
    setEmail("");
    setPhone("");
    setSharesPercentage("50");
    setErrors({});
  };

  return (
    <View style={styles.container}>
      <CompanySectionCard
        iconName="person-add-outline"
        title="Add Director / Shareholder"
        subtitle="Promoter personal & shareholding details"
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
          placeholder="director@company.com"
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
          label="Shareholding (%)"
          value={sharesPercentage}
          onChangeText={(t) => {
            setSharesPercentage(t);
            validateField('sharesPercentage', t);
          }}
          onBlur={() => validateField('sharesPercentage', sharesPercentage)}
          placeholder="e.g. 50"
          keyboardType="numeric"
          error={errors.sharesPercentage}
        />
        <PrimaryButton title="Add Director" onPress={handleAdd} colorType="orange" />
      </CompanySectionCard>
    </View>
  );
};

export default DirectorForm;
