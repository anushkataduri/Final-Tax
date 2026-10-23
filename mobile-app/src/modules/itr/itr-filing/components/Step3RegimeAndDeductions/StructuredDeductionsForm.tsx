import React from "react";
import { Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import type { AdditionalDeductionItem, ItrStructuredDeductions } from "../../types/itrFiling.types";
import { styles } from "./Step3RegimeAndDeductions.styles";

interface StructuredDeductionsFormProps {
  deductions: ItrStructuredDeductions;
  onChangeDeductions: (deductions: Partial<ItrStructuredDeductions>) => void;
  onOpenAddModal: () => void;
}

export const StructuredDeductionsForm: React.FC<StructuredDeductionsFormProps> = ({
  deductions,
  onChangeDeductions,
  onOpenAddModal,
}) => {
  const update80c = (key: keyof typeof deductions.sec80c, val: string) => {
    onChangeDeductions({ sec80c: { ...deductions.sec80c, [key]: val.replace(/[^0-9]/g, "") } });
  };

  const update80d = (key: keyof typeof deductions.sec80d, val: string | boolean) => {
    onChangeDeductions({ sec80d: { ...deductions.sec80d, [key]: val } });
  };

  const handleRemoveDeduction = (id: string) => {
    onChangeDeductions({ otherDeductionsList: deductions.otherDeductionsList.filter((d: AdditionalDeductionItem) => d.id !== id) });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#083B75" />
          <Text style={styles.cardTitle}>Structured Deductions (Old Regime)</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>
        Enter eligible investments and insurance expenses to claim tax deductions.
      </Text>

      {/* Section 80C */}
      <View style={styles.deductionSection}>
        <View style={styles.deductionHeaderRow}>
          <Text style={styles.deductionSectionTitle}>Section 80C Investments</Text>
          <View style={styles.capBadge}><Text style={styles.capBadgeText}>Capped at ₹1,50,000</Text></View>
        </View>
        <View style={styles.inputGrid}>
          <View style={styles.inputRow}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>EPF (Employee Provident)</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput style={styles.textInput} keyboardType="numeric" placeholder="e.g. 45,000" placeholderTextColor="#94A3B8" value={deductions.sec80c.epf} onChangeText={(v) => update80c("epf", v)} />
              </View>
            </View>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>PPF (Public Provident)</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput style={styles.textInput} keyboardType="numeric" placeholder="e.g. 50,000" placeholderTextColor="#94A3B8" value={deductions.sec80c.ppf} onChangeText={(v) => update80c("ppf", v)} />
              </View>
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>Life Insurance (LIC)</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput style={styles.textInput} keyboardType="numeric" placeholder="e.g. 25,000" placeholderTextColor="#94A3B8" value={deductions.sec80c.lic} onChangeText={(v) => update80c("lic", v)} />
              </View>
            </View>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>ELSS Tax-Saving Funds</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput style={styles.textInput} keyboardType="numeric" placeholder="Mutual fund ELSS" placeholderTextColor="#94A3B8" value={deductions.sec80c.elss} onChangeText={(v) => update80c("elss", v)} />
              </View>
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>Children Tuition Fees</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput style={styles.textInput} keyboardType="numeric" placeholder="School fees" placeholderTextColor="#94A3B8" value={deductions.sec80c.tuitionFees} onChangeText={(v) => update80c("tuitionFees", v)} />
              </View>
            </View>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>Housing Loan Principal</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput style={styles.textInput} keyboardType="numeric" placeholder="Principal repaid" placeholderTextColor="#94A3B8" value={deductions.sec80c.housingPrincipal} onChangeText={(v) => update80c("housingPrincipal", v)} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Section 80D */}
      <View style={styles.deductionSection}>
        <View style={styles.deductionHeaderRow}>
          <Text style={styles.deductionSectionTitle}>Section 80D Health Insurance</Text>
          <View style={styles.capBadge}><Text style={styles.capBadgeText}>Up to ₹25k / ₹50k</Text></View>
        </View>
        <View style={styles.inputGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Self, Spouse & Dependent Children</Text>
            <View style={styles.inputBox}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput style={styles.textInput} keyboardType="numeric" placeholder="Max 25,000" placeholderTextColor="#94A3B8" value={deductions.sec80d.selfSpouseChildren} onChangeText={(v) => update80d("selfSpouseChildren", v.replace(/[^0-9]/g, ""))} />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Parents Health Insurance</Text>
            <View style={styles.inputBox}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput style={styles.textInput} keyboardType="numeric" placeholder="Max 25,000 (50k for senior)" placeholderTextColor="#94A3B8" value={deductions.sec80d.parents} onChangeText={(v) => update80d("parents", v.replace(/[^0-9]/g, ""))} />
            </View>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Are your parents Senior Citizens (60+)?</Text>
            <Switch value={deductions.sec80d.isParentSeniorCitizen} onValueChange={(v) => update80d("isParentSeniorCitizen", v)} trackColor={{ false: "#CBD5E1", true: BrandColors.PRIMARY_ORANGE }} thumbColor="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Section 24b */}
      <View style={styles.deductionSection}>
        <View style={styles.deductionHeaderRow}>
          <Text style={styles.deductionSectionTitle}>Section 24(b) Home Loan Interest</Text>
          <View style={styles.capBadge}><Text style={styles.capBadgeText}>Max ₹2,00,000</Text></View>
        </View>
        <View style={styles.inputGroup}>
          <View style={styles.inputBox}>
            <Text style={styles.currencyPrefix}>₹</Text>
            <TextInput style={styles.textInput} keyboardType="numeric" placeholder="Interest paid on self-occupied property" placeholderTextColor="#94A3B8" value={deductions.sec24b} onChangeText={(v) => onChangeDeductions({ sec24b: v.replace(/[^0-9]/g, "") })} />
          </View>
        </View>
      </View>

      {/* Additional Deductions */}
      {deductions.otherDeductionsList.map((item: AdditionalDeductionItem) => (
        <View key={item.id} style={styles.otherDeductionItem}>
          <View style={styles.otherDeductionInfo}>
            <Text style={styles.otherDeductionTitle}>{item.title}</Text>
            <Text style={styles.otherDeductionAmount}>₹ {Number(item.amount).toLocaleString("en-IN")}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.removeDeductionBtn} onPress={() => handleRemoveDeduction(item.id)}>
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity activeOpacity={0.8} style={styles.addDeductionBtn} onPress={onOpenAddModal}>
        <Ionicons name="add-circle-outline" size={18} color="#083B75" />
        <Text style={styles.addDeductionBtnText}>Add Other Deduction (80G, 80CCD, 80TTA)</Text>
      </TouchableOpacity>
    </View>
  );
};
