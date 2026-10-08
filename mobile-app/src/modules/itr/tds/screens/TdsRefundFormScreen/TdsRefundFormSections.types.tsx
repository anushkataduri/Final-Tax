import React, { RefObject } from "react";
import { View, Text, TextInput } from "react-native";
import { BankAccountType, BankRefundDetails, IncomeTaxDetails } from "../../types/customerIncome.types";
import { styles } from "./TdsRefundFormScreen.styles";

export type UpdateBankField = <K extends keyof BankRefundDetails>(
  field: K,
  value: BankRefundDetails[K]
) => void;

export type UpdateIncomeField = <K extends keyof IncomeTaxDetails>(
  field: K,
  value: IncomeTaxDetails[K]
) => void;

export interface TdsFormInputRefs {
  accHolderRef: RefObject<TextInput | null>;
  accNumRef: RefObject<TextInput | null>;
  confirmAccNumRef: RefObject<TextInput | null>;
  ifscRef: RefObject<TextInput | null>;
  salaryRef: RefObject<TextInput | null>;
  otherIncomeRef: RefObject<TextInput | null>;
  interestRef: RefObject<TextInput | null>;
  tdsRef: RefObject<TextInput | null>;
  tcsRef: RefObject<TextInput | null>;
  advanceTaxRef: RefObject<TextInput | null>;
  selfTaxRef: RefObject<TextInput | null>;
}

export const SectionHeader: React.FC<{ number: number; title: string }> = ({ number, title }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionNumberBadge}>
      <Text style={styles.sectionNumberText}>{number}</Text>
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

