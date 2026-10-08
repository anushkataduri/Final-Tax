import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { IncomeHousePropertyData } from "../../../types/itrFiling.types";
import { styles } from "../Step2IncomeSources.styles";

interface Step2HousePropertyIncomeProps {
  data: IncomeHousePropertyData;
  onUpdate: (data: Partial<IncomeHousePropertyData>) => void;
}

export const Step2HousePropertyIncome: React.FC<Step2HousePropertyIncomeProps> = ({
  data,
  onUpdate,
}) => {
  if (!data.enabled) return null;

  return (
    <View style={[styles.card, styles.cardActive]}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.sourceHeaderRow}
        onPress={() => onUpdate({ enabled: !data.enabled })}
      >
        <View style={styles.sourceHeaderLeft}>
          <View style={[styles.sourceIconBox, styles.sourceIconBoxActive]}>
            <Ionicons name="home-outline" size={20} color={BrandColors.PRIMARY_ORANGE} />
          </View>
          <View style={styles.sourceTitleCol}>
            <Text style={styles.sourceTitle}>House Property</Text>
            <Text style={styles.sourceSubtitle}>Self-occupied home loan or rental income</Text>
          </View>
        </View>
        <View style={styles.checkboxBtn}>
          <Ionicons name="checkbox" size={22} color={BrandColors.PRIMARY_ORANGE} />
        </View>
      </TouchableOpacity>

      <View style={styles.expandedForm}>
        <Text style={styles.inputLabel}>Property Classification</Text>
        <View style={styles.pillRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.pill, data.propertyType === "self_occupied" && styles.pillSelected]}
            onPress={() => onUpdate({ propertyType: "self_occupied" })}
          >
            <Text style={[styles.pillText, data.propertyType === "self_occupied" && styles.pillTextSelected]}>
              Self-Occupied
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.pill, data.propertyType === "let_out" && styles.pillSelected]}
            onPress={() => onUpdate({ propertyType: "let_out" })}
          >
            <Text style={[styles.pillText, data.propertyType === "let_out" && styles.pillTextSelected]}>
              Let-Out (Rented)
            </Text>
          </TouchableOpacity>
        </View>

        {data.propertyType === "let_out" && (
          <View style={styles.inputRow}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>Annual Rent Received</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="e.g. 2,40,000"
                  placeholderTextColor="#94A3B8"
                  value={data.annualRentReceived}
                  onChangeText={(val) =>
                    onUpdate({
                      annualRentReceived: val.replace(/[^0-9]/g, ""),
                    })
                  }
                  maxLength={12}
                />
              </View>
            </View>

            <View style={styles.inputGroupHalf}>
              <Text style={styles.inputLabel}>Municipal Taxes Paid</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="e.g. 10,000"
                  placeholderTextColor="#94A3B8"
                  value={data.municipalTaxesPaid}
                  onChangeText={(val) =>
                    onUpdate({
                      municipalTaxesPaid: val.replace(/[^0-9]/g, ""),
                    })
                  }
                  maxLength={12}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Home Loan Interest Paid (Sec 24b)</Text>
          <View style={styles.inputBox}>
            <Text style={styles.currencyPrefix}>₹</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="Max ₹2,00,000 for self-occupied"
              placeholderTextColor="#94A3B8"
              value={data.homeLoanInterest}
              onChangeText={(val) =>
                onUpdate({
                  homeLoanInterest: val.replace(/[^0-9]/g, ""),
                })
              }
              maxLength={12}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
