import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { ItrBankDetails, ItrSelectableBank } from "../../../types/itrFiling.types";
import { BankSelectorModal } from "../../../../components/BankSelectorModal";
import { styles } from "../Step1PersonalInfo.styles";

interface Props {
  bankDetails: ItrBankDetails;
  bankAccountsList: ItrSelectableBank[];
  onSelectRefundBank: (bankId: string) => void;
  onAddBankAccount: (bank: ItrSelectableBank) => void;
  showBankModal: boolean;
  setShowBankModal: (v: boolean) => void;
}

export const Step1RefundBankSection: React.FC<Props> = ({
  bankDetails,
  bankAccountsList,
  onSelectRefundBank,
  onAddBankAccount,
  showBankModal,
  setShowBankModal,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons name="card-outline" size={18} color="#083B75" />
          <Text style={styles.cardTitle}>Refund Bank Account</Text>
        </View>
      </View>

      <Text style={styles.cardDescription}>
        Select the bank account to receive direct tax refund credit from the Income Tax Department.
      </Text>

      {bankAccountsList.length === 0 ? (
        <View style={styles.emptyBankCard}>
          <Text style={styles.emptyBankText}>
            No bank accounts added yet. Please add a bank account for refund credit.
          </Text>
        </View>
      ) : (
        <View style={styles.bankList}>
          {bankAccountsList.map((bank) => {
            const isSelected =
              bankDetails.accountNumber === bank.accountNumber &&
              Boolean(bankDetails.accountNumber);
            return (
              <TouchableOpacity
                key={bank.id}
                activeOpacity={0.8}
                style={[styles.bankSelectableCard, isSelected && styles.bankSelectableCardSelected]}
                onPress={() => onSelectRefundBank(bank.id)}
              >
                <View style={styles.bankInfoCol}>
                  <View style={styles.bankTitleRow}>
                    <Text style={styles.bankNameText}>{bank.bankName}</Text>
                    {bank.validationStatus === "Validated" && (
                      <View style={styles.verifiedTag}>
                        <Ionicons name="shield-checkmark" size={11} color="#166534" />
                        <Text style={styles.verifiedTagText}>Validated</Text>
                      </View>
                    )}
                    {isSelected && (
                      <View style={styles.verifiedTag}>
                        <Ionicons name="checkmark-circle" size={11} color="#166534" />
                        <Text style={styles.verifiedTagText}>Selected</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.bankMaskedNumber}>
                    {bank.maskedAccountNumber || `•••• •••• ${bank.accountNumber.slice(-4)}`}
                  </Text>
                  <Text style={styles.bankSubText}>
                    IFSC: {bank.ifscCode} {bank.accountType ? `• ${bank.accountType}` : ""}
                  </Text>
                </View>
                <View style={styles.bankRadioCol}>
                  <Ionicons
                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={isSelected ? BrandColors.PRIMARY_ORANGE : "#94A3B8"}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.changeBankBtn}
        onPress={() => setShowBankModal(true)}
      >
        <Ionicons name="add-circle-outline" size={16} color="#083B75" />
        <Text style={styles.changeBankBtnText}>Add Another Bank Account</Text>
      </TouchableOpacity>

      <BankSelectorModal
        visible={showBankModal}
        banks={bankAccountsList}
        selectedBankId={bankAccountsList.find((b) => b.isPrimaryRefund)?.id}
        onSelectBank={(id) => onSelectRefundBank(id)}
        onAddBank={(newBank) => onAddBankAccount(newBank)}
        onClose={() => setShowBankModal(false)}
      />
    </View>
  );
};
