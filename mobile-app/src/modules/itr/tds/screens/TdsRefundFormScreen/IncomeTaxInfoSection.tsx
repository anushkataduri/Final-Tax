import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { IncomeTaxDetails } from "../../types/customerIncome.types";
import { TdsConditionalIncomeSection } from "../../components/form/TdsConditionalIncomeSection";
import { styles } from "./TdsRefundFormScreen.styles";
import { TdsFormInputRefs, UpdateIncomeField, SectionHeader } from "./TdsRefundFormSections.types";

interface IncomeSectionProps {
  income: IncomeTaxDetails;
  inputs: TdsFormInputRefs;
  updateIncome: UpdateIncomeField;
}

export const IncomeTaxInfoSection: React.FC<IncomeSectionProps> = ({
  income,
  inputs: { salaryRef, otherIncomeRef, interestRef, tdsRef },
  updateIncome,
}) => (
  <View style={styles.sectionCard}>
    <SectionHeader number={3} title="Income & Tax Information" />

    {/* Regime Selector */}
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>Tax Regime</Text>
      <View style={styles.regimeSelector}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateIncome("taxRegime", "NEW")}
          style={[styles.regimeOption, income.taxRegime === "NEW" ? styles.regimeOptionActive : null]}
        >
          <Text style={[styles.regimeTitle, income.taxRegime === "NEW" ? styles.regimeTitleActive : null]}>
            New Tax Regime
          </Text>
          <Text style={styles.regimeDesc}>u/s 115BAC • Standard Slab</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateIncome("taxRegime", "OLD")}
          style={[styles.regimeOption, income.taxRegime === "OLD" ? styles.regimeOptionActive : null]}
        >
          <Text style={[styles.regimeTitle, income.taxRegime === "OLD" ? styles.regimeTitleActive : null]}>
            Old Tax Regime
          </Text>
          <Text style={styles.regimeDesc}>Supports 80C, 80D, Home Loan</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Salary Income */}
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>Salaried Gross Income (₹)</Text>
      <TextInput
        ref={salaryRef}
        style={styles.textInput}
        placeholder="Enter salary"
        placeholderTextColor="#94A3B8"
        keyboardType="numeric"
        value={income.salaryIncome}
        onChangeText={(t) => updateIncome("salaryIncome", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
        returnKeyType="next"
        onSubmitEditing={() => otherIncomeRef.current?.focus()}
      />
    </View>

    {/* Other & Interest Income */}
    <View style={styles.fieldRow}>
      <View style={[styles.fieldGroup, styles.fieldRowItem]}>
        <Text style={styles.fieldLabel}>Other Income (₹)</Text>
        <TextInput
          ref={otherIncomeRef}
          style={styles.textInput}
          placeholder="Enter other income"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={income.otherIncome}
          onChangeText={(t) => updateIncome("otherIncome", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
          returnKeyType="next"
          onSubmitEditing={() => interestRef.current?.focus()}
        />
      </View>

      <View style={[styles.fieldGroup, styles.fieldRowItem]}>
        <Text style={styles.fieldLabel}>Interest Income (₹)</Text>
        <TextInput
          ref={interestRef}
          style={styles.textInput}
          placeholder="Enter interest"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={income.interestIncome}
          onChangeText={(t) => updateIncome("interestIncome", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
          returnKeyType="next"
          onSubmitEditing={() => tdsRef.current?.focus()}
        />
      </View>
    </View>

    {/* Progressive Disclosure 1: Rental Income */}
    <TdsConditionalIncomeSection
      title="Rental Income"
      subtitle="House property rent"
      enabled={income.hasRentalIncome}
      onToggle={(enabled) => updateIncome("hasRentalIncome", enabled)}
    >
      {income.hasRentalIncome && (
        <View style={styles.conditionalFields}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Annual Rent Received (₹)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter rental income"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={income.rentalIncome}
              onChangeText={(t) => updateIncome("rentalIncome", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Property Taxes Paid (₹)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter municipal taxes"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={income.municipalTaxesPaid}
              onChangeText={(t) => updateIncome("municipalTaxesPaid", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
            />
          </View>
        </View>
      )}
    </TdsConditionalIncomeSection>

    {/* Progressive Disclosure 2: Capital Gains */}
    <TdsConditionalIncomeSection
      title="Capital Gains"
      subtitle="Stocks / MF / Property"
      enabled={income.hasCapitalGains}
      onToggle={(enabled) => updateIncome("hasCapitalGains", enabled)}
    >
      {income.hasCapitalGains && (
        <View style={styles.conditionalFields}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Short-Term Gains (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter STCG"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.shortTermCapitalGains}
                onChangeText={(t) => updateIncome("shortTermCapitalGains", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
              />
            </View>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Long-Term Gains (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter LTCG"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.longTermCapitalGains}
                onChangeText={(t) => updateIncome("longTermCapitalGains", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
              />
            </View>
          </View>
        </View>
      )}
    </TdsConditionalIncomeSection>

    {/* Progressive Disclosure 3: Business Income */}
    <TdsConditionalIncomeSection
      title="Business / Profession"
      subtitle="Freelance or business income"
      enabled={income.hasBusinessIncome}
      onToggle={(enabled) => updateIncome("hasBusinessIncome", enabled)}
    >
      {income.hasBusinessIncome && (
        <View style={styles.conditionalFields}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Turnover (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter turnover"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.grossTurnover}
                onChangeText={(t) => updateIncome("grossTurnover", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
              />
            </View>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Net Profit (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter profit"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.netBusinessProfit}
                onChangeText={(t) => updateIncome("netBusinessProfit", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
              />
            </View>
          </View>
        </View>
      )}
    </TdsConditionalIncomeSection>

    {/* Progressive Disclosure 4: Home Loan */}
    <TdsConditionalIncomeSection
      title="Home Loan Interest"
      subtitle="Self-occupied house property"
      enabled={income.hasHomeLoan}
      onToggle={(enabled) => updateIncome("hasHomeLoan", enabled)}
    >
      {income.hasHomeLoan && (
        <View style={styles.conditionalFields}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Interest Paid (Sec 24b) (₹)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter interest paid"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={income.homeLoanInterestSec24b}
              onChangeText={(t) => updateIncome("homeLoanInterestSec24b", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
            />
          </View>
        </View>
      )}
    </TdsConditionalIncomeSection>

    {/* Progressive Disclosure 5: Deductions (80C, 80D) */}
    <TdsConditionalIncomeSection
      title="Tax Deductions"
      subtitle="Section 80C, 80D, 80G"
      enabled={income.hasDeductions}
      onToggle={(enabled) => updateIncome("hasDeductions", enabled)}
    >
      {income.hasDeductions && (
        <View style={styles.conditionalFields}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>80C (PPF, ELSS, LIC) (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Up to ₹1.5L"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.deductions80C}
                onChangeText={(t) => updateIncome("deductions80C", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
              />
            </View>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>80D (Health Ins.) (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Up to ₹75k"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.deductions80D}
                onChangeText={(t) => updateIncome("deductions80D", t.replace(/[^0-9]/g, ""))}
        maxLength={12}
              />
            </View>
          </View>
        </View>
      )}
    </TdsConditionalIncomeSection>
  </View>
);

