import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  formatIndianNumberInput,
  toRawNumericString,
} from "@/shared/formatters/currencyFormatter";
import { styles } from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/GstFilingPeriodStep.styles";

interface GstCalculationMethodSectionProps {
  calculationMethod?: "ca_assisted" | "manual_estimates";
  taxableSales?: string;
  taxablePurchases?: string;
  eligibleItc?: string;
  onChange: (fields: {
    calculationMethod?: "ca_assisted" | "manual_estimates";
    taxableSales?: string;
    taxablePurchases?: string;
    eligibleItc?: string;
  }) => void;
}

export const GstCalculationMethodSection: React.FC<GstCalculationMethodSectionProps> = ({
  calculationMethod,
  taxableSales,
  taxablePurchases,
  eligibleItc,
  onChange,
}) => {
  const hasFigures = Boolean(
    (taxableSales && String(taxableSales).trim() !== "" && String(taxableSales).trim() !== "0") ||
    (taxablePurchases && String(taxablePurchases).trim() !== "" && String(taxablePurchases).trim() !== "0") ||
    (eligibleItc && String(eligibleItc).trim() !== "" && String(eligibleItc).trim() !== "0")
  );
  const isManual = calculationMethod === "manual_estimates" || (!calculationMethod && hasFigures);
  const isCaAssisted = !isManual;

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Tax Calculation Method</Text>

      <TouchableOpacity
        style={[styles.methodCard, isCaAssisted && styles.methodCardActive]}
        onPress={() => onChange({ calculationMethod: "ca_assisted" })}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isCaAssisted ? "radio-button-on" : "radio-button-off"}
          size={18}
          color={isCaAssisted ? BrandColors.PRIMARY_ORANGE : "#94A3B8"}
        />
        <View style={styles.methodContent}>
          <Text style={styles.methodTitle}>
            Let TaxEdge CA calculate from documents
          </Text>
          <Text style={styles.methodSubtitle}>
            Upload your invoices & GSTR-2B; our CA computes sales, purchases & ITC
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodCard,
          isManual && styles.methodCardActive,
          styles.methodCardSecond,
        ]}
        onPress={() => onChange({ calculationMethod: "manual_estimates" })}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isManual ? "radio-button-on" : "radio-button-off"}
          size={18}
          color={isManual ? BrandColors.PRIMARY_ORANGE : "#94A3B8"}
        />
        <View style={styles.methodContent}>
          <Text style={styles.methodTitle}>
            I already have estimated figures (Optional)
          </Text>
          <Text style={styles.methodSubtitle}>
            Quickly provide estimated sales, purchases, or ITC summary
          </Text>
        </View>
      </TouchableOpacity>

      {isManual ? (
        <View style={styles.estimatesContainer}>
          <View style={styles.estimateInputRow}>
            <Text style={styles.estimateLabel}>
              Estimated Taxable Sales (₹)
            </Text>
            <TextInput
              style={styles.estimateInput}
              placeholder="Enter sales amount"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={formatIndianNumberInput(taxableSales)}
              onChangeText={(val) =>
                onChange({
                  taxableSales: toRawNumericString(val),
                  calculationMethod: "manual_estimates",
                })
              }
            />
          </View>

          <View style={styles.estimateInputRow}>
            <Text style={styles.estimateLabel}>
              Estimated Taxable Purchases (₹)
            </Text>
            <TextInput
              style={styles.estimateInput}
              placeholder="Enter purchases amount"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={formatIndianNumberInput(taxablePurchases)}
              onChangeText={(val) =>
                onChange({
                  taxablePurchases: toRawNumericString(val),
                  calculationMethod: "manual_estimates",
                })
              }
            />
          </View>

          <View style={styles.estimateInputRow}>
            <Text style={styles.estimateLabel}>
              Estimated Eligible ITC (₹)
            </Text>
            <TextInput
              style={styles.estimateInput}
              placeholder="Enter eligible ITC amount"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={formatIndianNumberInput(eligibleItc)}
              onChangeText={(val) =>
                onChange({
                  eligibleItc: toRawNumericString(val),
                  calculationMethod: "manual_estimates",
                })
              }
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};
