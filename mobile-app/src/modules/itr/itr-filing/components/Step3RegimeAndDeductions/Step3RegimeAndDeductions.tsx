import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type {
  TaxRegimeType,
  ItrStructuredDeductions,
  TaxCalculationBreakdown,
  AdditionalDeductionItem,
} from "../../types/itrFiling.types";
import { RegimeComparisonTable } from "../../../components/RegimeComparisonTable";
import { StructuredDeductionsForm } from "./StructuredDeductionsForm";
import { AddDeductionModal } from "./AddDeductionModal";
import { styles } from "./Step3RegimeAndDeductions.styles";

interface Step3RegimeAndDeductionsProps {
  isEditing?: boolean;
  regime: TaxRegimeType;
  onChangeRegime: (regime: TaxRegimeType) => void;
  deductions: ItrStructuredDeductions;
  onChangeDeductions: (deductions: Partial<ItrStructuredDeductions>) => void;
  calculation: TaxCalculationBreakdown;
  assessmentYear: string;
  onContinue: () => void;
}

export const Step3RegimeAndDeductions: React.FC<Step3RegimeAndDeductionsProps> = ({
  isEditing,
  regime,
  onChangeRegime,
  deductions,
  onChangeDeductions,
  calculation,
  assessmentYear,
  onContinue,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeductionTitle, setNewDeductionTitle] = useState("");
  const [newDeductionAmount, setNewDeductionAmount] = useState("");

  const hasExistingDeductions =
    Number(deductions.sec80c.epf || 0) > 0 ||
    Number(deductions.sec80c.ppf || 0) > 0 ||
    Number(deductions.sec80c.lic || 0) > 0 ||
    Number(deductions.sec80c.elss || 0) > 0 ||
    Number(deductions.sec80c.tuitionFees || 0) > 0 ||
    Number(deductions.sec80c.housingPrincipal || 0) > 0 ||
    Number(deductions.sec80d.selfSpouseChildren || 0) > 0 ||
    Number(deductions.sec80d.parents || 0) > 0 ||
    Number(deductions.sec24b || 0) > 0 ||
    deductions.otherDeductionsList.length > 0;

  const [wantsDeductions, setWantsDeductions] = useState<boolean>(hasExistingDeductions || true);

  const handleAddDeduction = () => {
    if (!newDeductionAmount.trim()) {
      Alert.alert("Amount Required", "Please enter the deduction amount.");
      return;
    }
    const newItem: AdditionalDeductionItem = {
      id: `ded-${Date.now()}`,
      type: "80G",
      title: newDeductionTitle.trim() || "80G Charitable Donations",
      amount: newDeductionAmount.replace(/[^0-9]/g, ""),
    };
    onChangeDeductions({ otherDeductionsList: [...deductions.otherDeductionsList, newItem] });
    setNewDeductionTitle("");
    setNewDeductionAmount("");
    setShowAddModal(false);
  };

  const handleProceed = () => {
    if (regime === "old") {
      const hasDeductions =
        Object.values(deductions.sec80c).some((val) => Number(val) > 0) ||
        Object.values(deductions.sec80d).some((val) => typeof val === "string" && Number(val) > 0) ||
        Number(deductions.sec24b) > 0 ||
        deductions.otherDeductionsList.length > 0;

      if (!hasDeductions) {
        Alert.alert(
          "No Deductions Entered",
          "You selected the Old Tax Regime but haven't claimed any deductions. Please enter your deductions or switch to the New Tax Regime."
        );
        return;
      }
    }
    onContinue();
  };

  return (
    <View style={styles.container}>
      <RegimeComparisonTable
        calculation={calculation}
        selectedRegime={regime}
        onChangeRegime={onChangeRegime}
        assessmentYear={assessmentYear}
      />

      {regime === "new" ? (
        <View style={styles.newRegimeSuppressedCard}>
          <View style={styles.newRegimeSuppressedHeader}>
            <Ionicons name="information-circle" size={18} color="#1E40AF" />
            <Text style={styles.newRegimeSuppressedTitle}>Deductions Under New Tax Regime</Text>
          </View>
          <Text style={styles.newRegimeSuppressedText}>
            Most Chapter VI-A deductions (Section 80C, 80D, 24b) are not available under the New Tax Regime. Eligible salaried taxpayers receive the applicable standard deduction of ₹75,000 automatically.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.deductionDecisionCard}>
            <Text style={styles.deductionDecisionTitle}>Do you want to claim deductions?</Text>
            <Text style={styles.deductionDecisionSubtitle}>
              Under the Old Tax Regime, you can declare Section 80C, 80D, and 24(b) to reduce your taxable income.
            </Text>
            <View style={styles.pillRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.pill, wantsDeductions && styles.pillSelected]}
                onPress={() => setWantsDeductions(true)}
              >
                <Text style={[styles.pillText, wantsDeductions && styles.pillTextSelected]}>Yes, Claim Deductions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.pill, !wantsDeductions && styles.pillSelected]}
                onPress={() => {
                  setWantsDeductions(false);
                  onChangeDeductions({
                    sec80c: { epf: "", ppf: "", lic: "", elss: "", tuitionFees: "", housingPrincipal: "", other80c: "" },
                    sec80d: { selfSpouseChildren: "", parents: "", isParentSeniorCitizen: false },
                    sec24b: "",
                    otherDeductionsList: [],
                  });
                }}
              >
                <Text style={[styles.pillText, !wantsDeductions && styles.pillTextSelected]}>No Deductions to Claim</Text>
              </TouchableOpacity>
            </View>
          </View>

          {!wantsDeductions ? (
            <View style={styles.noDeductionsCard}>
              <Text style={styles.noDeductionsText}>
                No Chapter VI-A deductions will be claimed. If you do not have eligible deductions, the New Tax Regime typically offers lower tax liability.
              </Text>
            </View>
          ) : (
            <StructuredDeductionsForm
              deductions={deductions}
              onChangeDeductions={onChangeDeductions}
              onOpenAddModal={() => setShowAddModal(true)}
            />
          )}
        </>
      )}

      <TouchableOpacity activeOpacity={0.85} style={styles.continueButton} onPress={handleProceed}>
        <Text style={styles.continueButtonText}>{isEditing ? "Update and Continue" : "Confirm & Continue to Documents"}</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>

      <AddDeductionModal
        visible={showAddModal}
        title={newDeductionTitle}
        amount={newDeductionAmount}
        onChangeTitle={setNewDeductionTitle}
        onChangeAmount={setNewDeductionAmount}
        onAdd={handleAddDeduction}
        onClose={() => setShowAddModal(false)}
      />
    </View>
  );
};
