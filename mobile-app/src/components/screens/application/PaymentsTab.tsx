import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/app/application/[id].styles";
import type { Application } from "@/types/domain";

interface PaymentsTabProps {
  app: Application;
  isGstAmendment: boolean;
  appliedDate: string;
}

export function PaymentsTab({
  app,
  isGstAmendment,
  appliedDate,
}: PaymentsTabProps) {
  const amount = Number(app.paymentAmount || 0);
  const formattedAmount = `₹ ${amount.toFixed(2)}`;
  const formData = (app.formData || {}) as Record<string, any>;

  const isPaid =
    isGstAmendment ||
    (app.paymentStatus || "").toLowerCase() === "paid" ||
    (app.status || "").toLowerCase() === "submitted" ||
    (app.status || "").toLowerCase().includes("complete");

  // Derive service-specific fee type
  const sid = (app.serviceId || "").toLowerCase();
  const feeType =
    formData.feeType ||
    (sid.includes("amendment")
      ? "Amendment Fee"
      : sid.includes("filing")
        ? "Filing Fee"
        : sid.includes("loan")
          ? "Processing Fee"
          : sid.includes("itr")
            ? "Tax Filing Fee"
            : "Registration Fee");

  const paymentMode =
    formData.paymentMethod || formData.paymentMode || "UPI";

  const paymentDate =
    formData.paymentDate || appliedDate || "22 Oct 2025, 11:46 AM";

  const transactionId =
    formData.transactionId ||
    formData.txnId ||
    (formData.arn
      ? `TXN${String(formData.arn).replace(/[^0-9A-Z]/gi, "")}`
      : formData.applicationId
        ? `TXN${String(formData.applicationId).replace(/[^0-9A-Z]/gi, "")}`
        : "TXN202510220945");

  const paymentDetailsRows = [
    { label: "Fee Type", value: feeType },
    { label: "Amount", value: formattedAmount },
    { label: "Payment Mode", value: paymentMode },
    { label: "Payment Date", value: paymentDate },
    { label: "Transaction ID", value: transactionId },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Payment Summary</Text>

      {/* ── Peach Highlight Box (Screen 5 Reference) ── */}
      <View style={styles.paymentSummaryBox}>
        <View style={styles.paymentSummaryLeft}>
          <View style={styles.rupeeCircle}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: "#EA580C" }}>
              ₹
            </Text>
          </View>
          <View>
            <Text style={styles.paymentTotalLabel}>Total Amount</Text>
            <Text style={styles.paymentTotalAmount}>{formattedAmount}</Text>
          </View>
        </View>

        <View
          style={[
            styles.paymentPaidBadge,
            { backgroundColor: isPaid ? "#DCFCE7" : "#FFEDD5" },
          ]}
        >
          <Text
            style={[
              styles.paymentPaidBadgeText,
              { color: isPaid ? "#16A34A" : "#EA580C" },
            ]}
          >
            {isPaid ? "Paid" : "Pending"}
          </Text>
        </View>
      </View>

      {/* ── Payment Details Section (Screen 5 Reference) ── */}
      <Text style={[styles.cardTitle, { marginTop: 4, marginBottom: 10 }]}>
        Payment Details
      </Text>

      <View style={styles.cardRowsGap12}>
        {paymentDetailsRows.map((row) => (
          <View key={row.label} style={styles.itemRow}>
            <Text style={styles.itemRowLabel}>{row.label}</Text>
            <Text style={styles.itemRowValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      {/* ── Payment Success Banner (Screen 5 Bottom Reference) ── */}
      {isPaid && (
        <View style={styles.paymentSuccessBanner}>
          <Ionicons name="checkmark-circle" size={17} color="#16A34A" />
          <Text style={styles.paymentSuccessText}>
            Payment completed successfully.
          </Text>
        </View>
      )}
    </View>
  );
}
