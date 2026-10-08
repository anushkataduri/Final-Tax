import React from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../Step2IncomeSources.styles";
import { IncomeSalaryData } from "../../../types/itrFiling.types";
import { BrandColors } from "@/shared/theme";

interface Props {
  data: IncomeSalaryData;
  onUpdate: (data: Partial<IncomeSalaryData>) => void;
}

export const Step2SalaryIncome: React.FC<Props> = ({ data, onUpdate }) => {
  if (!data.enabled) return null;
  return (
    <>
      {/* 1. Salary Income */}
      <View style={[styles.card, styles.cardActive]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.sourceHeaderRow}
            onPress={() => onUpdate({ enabled: !data.enabled })}
          >
            <View style={styles.sourceHeaderLeft}>
              <View style={[styles.sourceIconBox, styles.sourceIconBoxActive]}>
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color={BrandColors.PRIMARY_ORANGE}
                />
              </View>
              <View style={styles.sourceTitleCol}>
                <View style={styles.sourceTitleRow}>
                  <Text style={styles.sourceTitle}>Salary Income</Text>
                  {data.isVerified &&
                    data.source === "FORM_16" && (
                      <View style={styles.sourceTagVerified}>
                        <Ionicons
                          name="shield-checkmark"
                          size={10}
                          color="#166534"
                        />
                        <Text style={styles.sourceTagVerifiedText}>
                          Form 16 Imported
                        </Text>
                      </View>
                    )}
                </View>
                <Text style={styles.sourceSubtitle}>
                  Employer Form 16, payslips, TDS credits
                </Text>
              </View>
            </View>
            <View style={styles.checkboxBtn}>
              <Ionicons
                name="checkbox"
                size={22}
                color={BrandColors.PRIMARY_ORANGE}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.expandedForm}>
            {/* Form 16 Import Snapshot Card */}
            {data.isVerified &&
              data.source === "FORM_16" &&
              Boolean(data.employerName) && (
                <View style={styles.form16Card}>
                  <View style={styles.form16TopRow}>
                    <Text style={styles.form16Title}>
                      Detected from Form 16
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        Alert.alert(
                          "Form 16 Details",
                          `Employer: ${data.employerName}\nGross Salary: ₹${Number(data.grossSalary || 0).toLocaleString("en-IN")}\nAllowances u/s 10: ₹${Number(data.allowances || 0).toLocaleString("en-IN")}\nTDS Deducted: ₹${Number(data.tdsDeducted || 0).toLocaleString("en-IN")}`,
                        )
                      }
                    >
                      <Text style={styles.sourceSubtitle}>View Details</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.form16StatsRow}>
                    <Text style={styles.form16StatLabel}>Employer</Text>
                    <Text style={styles.form16StatValue}>
                      {data.employerName}
                    </Text>
                  </View>
                  <View style={styles.form16StatsRow}>
                    <Text style={styles.form16StatLabel}>
                      TDS Deducted (Tax Credit)
                    </Text>
                    <Text style={styles.form16StatValue}>
                      ₹{" "}
                      {Number(data.tdsDeducted || 0).toLocaleString(
                        "en-IN",
                      )}
                    </Text>
                  </View>
                </View>
              )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Employer Legal Name</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Acme Technologies Ltd"
                  placeholderTextColor="#94A3B8"
                  value={data.employerName}
                  onChangeText={(val) =>
                    onUpdate({ employerName: val.replace(/[^a-zA-Z\s]/g, "") })
                  }
                  maxLength={100}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Gross Salary (Annual)</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 8,50,000"
                    placeholderTextColor="#94A3B8"
                    value={data.grossSalary}
                    onChangeText={(val) =>
                      onUpdate({
                        grossSalary: val.replace(/[^0-9]/g, ""),
                      })}
                    maxLength={12}
                  />
                </View>
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>
                  Exempt Allowances (HRA, LTA)
                </Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 50,000"
                    placeholderTextColor="#94A3B8"
                    value={data.allowances}
                    onChangeText={(val) =>
                      onUpdate({ allowances: val.replace(/[^0-9]/g, "") })}
                    maxLength={12}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>TDS Deducted by Employer</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="e.g. 45,000"
                  placeholderTextColor="#94A3B8"
                  value={data.tdsDeducted}
                  onChangeText={(val) =>
                    onUpdate({ tdsDeducted: val.replace(/[^0-9]/g, "") })}
                  maxLength={12}
                />
              </View>
            </View>
          </View>
        </View>
      
    </>
  );
};
