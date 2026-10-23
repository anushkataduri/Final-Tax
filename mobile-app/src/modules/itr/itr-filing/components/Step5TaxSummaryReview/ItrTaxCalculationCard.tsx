import React from "react";
import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { TaxCalculationBreakdown, TaxRegimeType } from "../../types/itrFiling.types";
import { styles } from "./Step5TaxSummaryReview.styles";

interface ItrTaxCalculationCardProps {
  calculation: TaxCalculationBreakdown;
  regime: TaxRegimeType;
  isRefund: boolean;
  bankName: string;
  maskedBankNumber: string;
}

const fmt = (n: number) => n.toLocaleString("en-IN");

export const ItrTaxCalculationCard: React.FC<ItrTaxCalculationCardProps> = ({
  calculation,
  regime,
  isRefund,
  bankName,
  maskedBankNumber,
}) => (
  <View style={styles.taxHeroCard}>
    <View style={styles.taxHeroHeader}>
      <View style={styles.taxHeroHeaderLeft}>
        <Ionicons name="calculator-outline" size={20} color="#083B75" />
        <Text style={styles.taxHeroTitle}>Estimated Tax Summary</Text>
      </View>
      <View style={styles.regimeBadge}>
        <Text style={styles.regimeBadgeText}>
          {regime === "new" ? "New Tax Regime" : "Old Tax Regime"}
        </Text>
      </View>
    </View>

    <View style={styles.calcRow}>
      <Text style={styles.calcLabel}>1. Gross Total Income</Text>
      <Text style={styles.calcValue}>₹ {fmt(calculation.grossTotalIncome)}</Text>
    </View>

    <View style={styles.calcRow}>
      <Text style={styles.calcLabel}>2. Less: Standard Deduction</Text>
      <Text style={styles.calcValueDeduction}>- ₹ {fmt(calculation.standardDeduction)}</Text>
    </View>

    {regime === "old" && calculation.totalChapterVIA > 0 && (
      <View style={styles.calcRow}>
        <Text style={styles.calcLabel}>3. Less: Chapter VI-A Deductions</Text>
        <Text style={styles.calcValueDeduction}>- ₹ {fmt(calculation.totalChapterVIA)}</Text>
      </View>
    )}

    <View style={styles.calcDivider} />

    <View style={styles.calcRow}>
      <Text style={styles.calcValueTaxable}>Net Taxable Income</Text>
      <Text style={styles.calcValueTaxable}>₹ {fmt(calculation.taxableIncome)}</Text>
    </View>

    <View style={styles.calcDivider} />

    <View style={styles.calcRow}>
      <Text style={styles.calcLabel}>Gross Income Tax (per Slabs)</Text>
      <Text style={styles.calcValue}>₹ {fmt(calculation.grossTaxLiability)}</Text>
    </View>

    {calculation.rebate87A > 0 && (
      <View style={styles.calcRow}>
        <Text style={styles.calcLabel}>Less: Section 87A Rebate</Text>
        <Text style={styles.calcValueDeduction}>- ₹ {fmt(calculation.rebate87A)}</Text>
      </View>
    )}

    <View style={styles.calcRow}>
      <Text style={styles.calcLabel}>Health & Education Cess (4%)</Text>
      <Text style={styles.calcValue}>₹ {fmt(calculation.cess)}</Text>
    </View>

    <View style={styles.calcRow}>
      <Text style={styles.calcLabel}>Total Tax Liability</Text>
      <Text style={styles.calcValue}>₹ {fmt(calculation.totalTaxLiability)}</Text>
    </View>

    <View style={styles.calcRow}>
      <Text style={styles.calcLabel}>Less: Taxes Already Paid (TDS Credits)</Text>
      <Text style={styles.calcValueDeduction}>- ₹ {fmt(calculation.totalTaxesPaid)}</Text>
    </View>

    <View
      style={[
        styles.netResultBox,
        isRefund ? styles.netResultBoxRefund : styles.netResultBoxPayable,
      ]}
    >
      <View>
        <Text style={styles.netResultLabel}>
          {isRefund ? "Net Estimated Refund" : "Net Tax Payable"}
        </Text>
        <Text style={styles.netResultSub}>
          {isRefund
            ? `Directly credited to ${bankName || "Bank Account"} (${maskedBankNumber})`
            : "Payable before return filing"}
        </Text>
      </View>
      <Text style={isRefund ? styles.netResultAmountRefund : styles.netResultAmountPayable}>
        ₹ {fmt(calculation.finalAmount)}
      </Text>
    </View>

    <View style={styles.disclaimerBox}>
      <Ionicons name="information-circle" size={16} color="#92400E" />
      <Text style={styles.disclaimerText}>
        This is an initial estimation based on your declared figures. Your assigned CA will thoroughly review your documents, verify TDS credits with the Income Tax Department, and prepare the final return for your confirmation before e-filing.
      </Text>
    </View>
  </View>
);
