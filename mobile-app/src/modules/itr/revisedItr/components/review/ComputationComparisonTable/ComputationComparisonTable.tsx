import React from "react";
import { View, Text } from "react-native";
import { COMPARISON_TABLE_ROWS } from "../../../mock/revisedItrData";
import { styles } from "./ComputationComparisonTable.styles";

export const ComputationComparisonTable: React.FC = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Tax Summary</Text>

      {COMPARISON_TABLE_ROWS.map((row, idx) => {
        const isLast = idx === COMPARISON_TABLE_ROWS.length - 1;

        return (
          <View
            key={row.particular}
            style={[styles.itemBlock, isLast ? styles.itemBlockLast : null]}
          >
            <Text style={styles.particularTitle}>{row.particular}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Original</Text>
              <Text style={styles.value}>{row.original}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Revised</Text>
              <Text style={styles.value}>{row.revised}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Change</Text>
              <Text
                style={
                  row.change === "—" || row.change === "₹0"
                    ? styles.neutralChange
                    : styles.changeValue
                }
              >
                {row.change}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};
