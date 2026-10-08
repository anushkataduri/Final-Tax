import React, { useState } from "react";
import { View, Text } from "react-native";
import { FormInput } from "../../../../shared/components/Input/FormInput";
import { PrimaryButton } from "../../../../shared/components/Button/PrimaryButton";
import type { DirectorInfo } from "../../types/director.types";
import { generateId } from "../../../../shared/utils/helpers";
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

  const handleAdd = () => {
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Director / Shareholder</Text>
      <FormInput label="Full Name" value={name} onChangeText={setName} placeholder="As per PAN" required />
      <FormInput label="PAN Number" value={pan} onChangeText={(t) => setPan(t.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} required />
      <FormInput label="Aadhaar Number" value={aadhaar} onChangeText={setAadhaar} placeholder="12-digit Aadhaar" keyboardType="numeric" maxLength={12} required />
      <FormInput label="Email ID" value={email} onChangeText={setEmail} placeholder="director@company.com" keyboardType="email-address" required />
      <FormInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="10-digit mobile" keyboardType="phone-pad" maxLength={10} required />
      <FormInput label="Shareholding (%)" value={sharesPercentage} onChangeText={setSharesPercentage} placeholder="e.g. 50" keyboardType="numeric" />
      <PrimaryButton title="Add Director" onPress={handleAdd} colorType="orange" />
    </View>
  );
};

export default DirectorForm;
