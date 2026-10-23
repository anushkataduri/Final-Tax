import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  formatIndianCurrency,
  formatIndianNumberInput,
  toRawNumericString,
} from "@/shared/formatters/currencyFormatter";
import { styles } from "./GstFilingReviewStep.styles";

interface GstFilingComputationModalProps {
  visible: boolean;
  editTurnoverStr: string;
  editPurchasesStr: string;
  editItcStr: string;
  modalErrors: Record<string, string>;
  onChangeTurnover: (val: string) => void;
  onChangePurchases: (val: string) => void;
  onChangeItc: (val: string) => void;
  onSave: () => void;
  onClose: () => void;
  onFullForm?: () => void;
}

const toNum = (s: string): number => {
  const n = parseFloat(s.replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
};

const fmt = (val: number): string => formatIndianCurrency(Math.round(val));

export const GstFilingComputationModal: React.FC<GstFilingComputationModalProps> = ({
  visible,
  editTurnoverStr,
  editPurchasesStr,
  editItcStr,
  modalErrors,
  onChangeTurnover,
  onChangePurchases,
  onChangeItc,
  onSave,
  onClose,
  onFullForm,
}) => {
  const previewOutputGst = Math.round(toNum(editTurnoverStr) * 0.18);
  const previewNetLiability = Math.max(0, previewOutputGst - toNum(editItcStr));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalBackdrop}
      >
        <View style={styles.modalBox}>
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>Edit Tax Computation</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSub}>
            Adjust your taxable turnover and eligible ITC figures below. Tax liability will recalculate automatically.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gross Taxable Turnover (₹)</Text>
            <TextInput
              style={[styles.modalInput, modalErrors.turnover ? styles.modalInputError : undefined]}
              keyboardType="numeric"
              value={formatIndianNumberInput(editTurnoverStr)}
              onChangeText={(val) => onChangeTurnover(toRawNumericString(val))}
              placeholder="Enter gross taxable turnover"
              placeholderTextColor="#94A3B8"
            />
            {modalErrors.turnover ? (
              <Text style={styles.modalErrorText}>{modalErrors.turnover}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Estimated Taxable Purchases (₹)</Text>
            <TextInput
              style={[styles.modalInput, modalErrors.purchases ? styles.modalInputError : undefined]}
              keyboardType="numeric"
              value={formatIndianNumberInput(editPurchasesStr)}
              onChangeText={(val) => onChangePurchases(toRawNumericString(val))}
              placeholder="Enter estimated taxable purchases"
              placeholderTextColor="#94A3B8"
            />
            {modalErrors.purchases ? (
              <Text style={styles.modalErrorText}>{modalErrors.purchases}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Eligible Input Tax Credit (ITC) (₹)</Text>
            <TextInput
              style={[styles.modalInput, modalErrors.itc ? styles.modalInputError : undefined]}
              keyboardType="numeric"
              value={formatIndianNumberInput(editItcStr)}
              onChangeText={(val) => onChangeItc(toRawNumericString(val))}
              placeholder="Enter eligible ITC amount"
              placeholderTextColor="#94A3B8"
            />
            {modalErrors.itc ? (
              <Text style={styles.modalErrorText}>{modalErrors.itc}</Text>
            ) : null}
          </View>

          <View style={styles.modalSummaryBox}>
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryLabel}>Output GST (18%):</Text>
              <Text style={styles.modalSummaryVal}>{fmt(previewOutputGst)}</Text>
            </View>
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryLabel}>Net Tax Liability:</Text>
              <Text style={[styles.modalSummaryVal, styles.modalSummaryValHighlight]}>
                {fmt(previewNetLiability)}
              </Text>
            </View>
          </View>

          <View style={styles.modalBtnRow}>
            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={onFullForm}>
              <Text style={styles.modalSecondaryBtnText}>Full Form</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={onSave}>
              <Text style={styles.modalPrimaryBtnText}>Apply & Recalculate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
