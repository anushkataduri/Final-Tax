/**
 * Component: GstPaymentMethodStep
 * Migrated from internal StyleSheet to external styles module.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, getMethodIconBoxStyle } from "@/modules/gst/gst-filing/components/payment/GstPaymentMethodStep/GstPaymentMethodStep.styles";

const PAYMENT_METHODS = [
  { id: "upi", title: "UPI", subtitle: "Pay via Google Pay, PhonePe, Paytm, BHIM", iconName: "phone-portrait", iconBg: "#DCFCE7", iconColor: "#16A34A" },
  { id: "debit", title: "Debit Card", subtitle: "Visa / Mastercard / RuPay", iconName: "card", iconBg: "#E0F2FE", iconColor: "#0284C7" },
  { id: "credit", title: "Credit Card", subtitle: "Visa / Mastercard / Amex", iconName: "card", iconBg: "#E0F2FE", iconColor: "#2563EB" },
  { id: "netbanking", title: "Net Banking", subtitle: "All major Indian banks", iconName: "business", iconBg: "#F1F5F9", iconColor: "#64748B" },
];

const UPI_APPS = [
  { label: "PhonePe", suffix: "@ybl" },
  { label: "GPay", suffix: "@okaxis" },
  { label: "Paytm", suffix: "@paytm" },
  { label: "BHIM", suffix: "@upi" },
];

export interface GstPaymentMethodStepProps {
  amount?: string;
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  upiId: string;
  onChangeUpiId: (id: string) => void;
  upiError?: string;
}

export const GstPaymentMethodStep: React.FC<GstPaymentMethodStepProps> = ({
  amount = "₹2,344",
  selectedMethod,
  onSelectMethod,
  upiId,
  onChangeUpiId,
  upiError,
}) => {
  const handleSelectApp = (suffix: string) => {
    const username = upiId.includes("@") ? upiId.split("@")[0] : upiId;
    onChangeUpiId(username ? `${username}${suffix}` : suffix);
  };

  return (
    <View style={styles.container}>
      {/* Top Total Amount Card */}
      <View style={styles.topAmountCard}>
        <View style={styles.topRow}>
          <Text style={styles.discountLabel}>Filing Service & Reconciliation</Text>
          <Text style={styles.discountValue}>Includes 18% GST</Text>
        </View>
        <View style={styles.amountDivider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Payable Amount</Text>
          <Text style={styles.totalValue}>{amount}</Text>
        </View>
      </View>

      {/* Section: Choose Payment Method */}
      <Text style={styles.sectionHeading}>Choose Payment Method</Text>

      <View style={styles.methodsList}>
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              activeOpacity={0.8}
              onPress={() => onSelectMethod(method.id)}
              style={[styles.methodCard, isSelected && styles.methodCardSelected]}
            >
              <View style={[styles.methodIconBox, getMethodIconBoxStyle(method.iconBg)]}>
                <Ionicons name={method.iconName as any} size={20} color={method.iconColor} />
              </View>
              <View style={styles.methodTextCol}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
              </View>
              <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                {isSelected && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Expanded UPI Section */}
      {selectedMethod === "upi" && (
        <View style={styles.upiCard}>
          <Text style={styles.upiLabel}>ENTER UPI ID *</Text>
          <TextInput
            style={[styles.upiInput, upiError ? styles.upiInputError : null]}
            value={upiId}
            onChangeText={onChangeUpiId}
            placeholder="Enter UPI ID (e.g. name@upi)"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
          />
          {upiError ? <Text style={styles.errorText}>{upiError}</Text> : null}

          <View style={styles.upiAppsRow}>
            {UPI_APPS.map((app) => (
              <TouchableOpacity
                key={app.label}
                style={styles.appPill}
                activeOpacity={0.7}
                onPress={() => handleSelectApp(app.suffix)}
              >
                <Text style={styles.appPillText}>{app.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Security Note */}
      <View style={styles.securityBox}>
        <Ionicons name="shield-checkmark" size={16} color="#083B75" />
        <Text style={styles.securityText}>
          256-bit encrypted & PCI-DSS compliant secure checkout
        </Text>
      </View>
    </View>
  );
};
