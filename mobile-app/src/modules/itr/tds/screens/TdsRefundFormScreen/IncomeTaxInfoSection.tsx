import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { IncomeTaxDetails } from "../../types/customerIncome.types";
import { CustomerFormErrors } from "../../validation/tdsCustomerSchema";
import { TdsConditionalIncomeSection } from "../../components/form/TdsConditionalIncomeSection";
import { styles } from "./TdsRefundFormScreen.styles";
import { TdsFormInputRefs, UpdateIncomeField, SectionHeader } from "./TdsRefundFormSections.types";

interface IncomeSectionProps {
  income: IncomeTaxDetails;
  inputs: TdsFormInputRefs;
  updateIncome: UpdateIncomeField;
  errors?: CustomerFormErrors;
  onBlurField?: (key: string) => void;
}

export const IncomeTaxInfoSection: React.FC<IncomeSectionProps> = ({
  income,
  inputs: { salaryRef, otherIncomeRef, interestRef, tdsRef },
  updateIncome,
  errors = {},
  onBlurField,
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
        style={[styles.textInput, errors["income.salaryIncome"] ? styles.textInputError : null]}
        placeholder="Enter salary"
        placeholderTextColor="#94A3B8"
        keyboardType="numeric"
        value={income.salaryIncome}
        onChangeText={(t) => updateIncome("salaryIncome", t.replace(/[^0-9]/g, ""))}
        onBlur={() => onBlurField?.("income.salaryIncome")}
        maxLength={12}
        returnKeyType="next"
        onSubmitEditing={() => otherIncomeRef.current?.focus()}
      />
      {errors["income.salaryIncome"] && (
        <Text style={styles.errorText}>{errors["income.salaryIncome"]}</Text>
      )}
    </View>

    {/* Other & Interest Income */}
    <View style={styles.fieldRow}>
      <View style={[styles.fieldGroup, styles.fieldRowItem]}>
        <Text style={styles.fieldLabel}>Other Income (₹)</Text>
        <TextInput
          ref={otherIncomeRef}
          style={[styles.textInput, errors["income.otherIncome"] ? styles.textInputError : null]}
          placeholder="Enter other income"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={income.otherIncome}
          onChangeText={(t) => updateIncome("otherIncome", t.replace(/[^0-9]/g, ""))}
          onBlur={() => onBlurField?.("income.otherIncome")}
          maxLength={12}
          returnKeyType="next"
          onSubmitEditing={() => interestRef.current?.focus()}
        />
        {errors["income.otherIncome"] && (
          <Text style={styles.errorText}>{errors["income.otherIncome"]}</Text>
        )}
      </View>

      <View style={[styles.fieldGroup, styles.fieldRowItem]}>
        <Text style={styles.fieldLabel}>Interest Income (₹)</Text>
        <TextInput
          ref={interestRef}
          style={[styles.textInput, errors["income.interestIncome"] ? styles.textInputError : null]}
          placeholder="Enter interest"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={income.interestIncome}
          onChangeText={(t) => updateIncome("interestIncome", t.replace(/[^0-9]/g, ""))}
          onBlur={() => onBlurField?.("income.interestIncome")}
          maxLength={12}
          returnKeyType="next"
          onSubmitEditing={() => tdsRef.current?.focus()}
        />
        {errors["income.interestIncome"] && (
          <Text style={styles.errorText}>{errors["income.interestIncome"]}</Text>
        )}
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
              style={[styles.textInput, errors["income.rentalIncome"] ? styles.textInputError : null]}
              placeholder="Enter rental income"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={income.rentalIncome}
              onChangeText={(t) => updateIncome("rentalIncome", t.replace(/[^0-9]/g, ""))}
              onBlur={() => onBlurField?.("income.rentalIncome")}
              maxLength={12}
            />
            {errors["income.rentalIncome"] && (
              <Text style={styles.errorText}>{errors["income.rentalIncome"]}</Text>
            )}
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Property Taxes Paid (₹)</Text>
            <TextInput
              style={[styles.textInput, errors["income.municipalTaxesPaid"] ? styles.textInputError : null]}
              placeholder="Enter municipal taxes"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={income.municipalTaxesPaid}
              onChangeText={(t) => updateIncome("municipalTaxesPaid", t.replace(/[^0-9]/g, ""))}
              onBlur={() => onBlurField?.("income.municipalTaxesPaid")}
              maxLength={12}
            />
            {errors["income.municipalTaxesPaid"] && (
              <Text style={styles.errorText}>{errors["income.municipalTaxesPaid"]}</Text>
            )}
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
                style={[styles.textInput, errors["income.shortTermCapitalGains"] ? styles.textInputError : null]}
                placeholder="Enter STCG"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.shortTermCapitalGains}
                onChangeText={(t) => updateIncome("shortTermCapitalGains", t.replace(/[^0-9]/g, ""))}
                onBlur={() => onBlurField?.("income.shortTermCapitalGains")}
                maxLength={12}
              />
              {errors["income.shortTermCapitalGains"] && (
                <Text style={styles.errorText}>{errors["income.shortTermCapitalGains"]}</Text>
              )}
            </View>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Long-Term Gains (₹)</Text>
              <TextInput
                style={[styles.textInput, errors["income.longTermCapitalGains"] ? styles.textInputError : null]}
                placeholder="Enter LTCG"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.longTermCapitalGains}
                onChangeText={(t) => updateIncome("longTermCapitalGains", t.replace(/[^0-9]/g, ""))}
                onBlur={() => onBlurField?.("income.longTermCapitalGains")}
                maxLength={12}
              />
              {errors["income.longTermCapitalGains"] && (
                <Text style={styles.errorText}>{errors["income.longTermCapitalGains"]}</Text>
              )}
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
                style={[styles.textInput, errors["income.grossTurnover"] ? styles.textInputError : null]}
                placeholder="Enter turnover"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.grossTurnover}
                onChangeText={(t) => updateIncome("grossTurnover", t.replace(/[^0-9]/g, ""))}
                onBlur={() => onBlurField?.("income.grossTurnover")}
                maxLength={12}
              />
              {errors["income.grossTurnover"] && (
                <Text style={styles.errorText}>{errors["income.grossTurnover"]}</Text>
              )}
            </View>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Net Profit (₹)</Text>
              <TextInput
                style={[styles.textInput, errors["income.netBusinessProfit"] ? styles.textInputError : null]}
                placeholder="Enter profit"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.netBusinessProfit}
                onChangeText={(t) => updateIncome("netBusinessProfit", t.replace(/[^0-9]/g, ""))}
                onBlur={() => onBlurField?.("income.netBusinessProfit")}
                maxLength={12}
              />
              {errors["income.netBusinessProfit"] && (
                <Text style={styles.errorText}>{errors["income.netBusinessProfit"]}</Text>
              )}
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
              style={[styles.textInput, errors["income.homeLoanInterestSec24b"] ? styles.textInputError : null]}
              placeholder="Enter interest paid"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={income.homeLoanInterestSec24b}
              onChangeText={(t) => updateIncome("homeLoanInterestSec24b", t.replace(/[^0-9]/g, ""))}
              onBlur={() => onBlurField?.("income.homeLoanInterestSec24b")}
              maxLength={12}
            />
            {errors["income.homeLoanInterestSec24b"] && (
              <Text style={styles.errorText}>{errors["income.homeLoanInterestSec24b"]}</Text>
            )}
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
                style={[styles.textInput, errors["income.deductions80C"] ? styles.textInputError : null]}
                placeholder="Up to ₹1.5L"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.deductions80C}
                onChangeText={(t) => updateIncome("deductions80C", t.replace(/[^0-9]/g, ""))}
                onBlur={() => onBlurField?.("income.deductions80C")}
                maxLength={12}
              />
              {errors["income.deductions80C"] && (
                <Text style={styles.errorText}>{errors["income.deductions80C"]}</Text>
              )}
            </View>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>80D (Health Ins.) (₹)</Text>
              <TextInput
                style={[styles.textInput, errors["income.deductions80D"] ? styles.textInputError : null]}
                placeholder="Up to ₹75k"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={income.deductions80D}
                onChangeText={(t) => updateIncome("deductions80D", t.replace(/[^0-9]/g, ""))}
                onBlur={() => onBlurField?.("income.deductions80D")}
                maxLength={12}
              />
              {errors["income.deductions80D"] && (
                <Text style={styles.errorText}>{errors["income.deductions80D"]}</Text>
              )}
            </View>
          </View>
        </View>
      )}
    </TdsConditionalIncomeSection>
  </View>
);

