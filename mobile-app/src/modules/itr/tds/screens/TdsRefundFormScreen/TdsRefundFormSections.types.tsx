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
  accHolderRef: RefObject<any>;
  accNumRef: RefObject<any>;
  confirmAccNumRef: RefObject<any>;
  ifscRef: RefObject<any>;
  salaryRef: RefObject<any>;
  otherIncomeRef: RefObject<any>;
  interestRef: RefObject<any>;
  tdsRef: RefObject<any>;
  tcsRef: RefObject<any>;
  advanceTaxRef: RefObject<any>;
  selfTaxRef: RefObject<any>;
}

export const SectionHeader: React.FC<{ number: number; title: string }> = ({ number, title }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionNumberBadge}>
      <Text style={styles.sectionNumberText}>{number}</Text>
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

