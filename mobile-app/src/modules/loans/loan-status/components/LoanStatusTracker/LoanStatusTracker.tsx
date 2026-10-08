import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanApplicationStatus } from "../../../types/loans.types";
import { styles } from "./LoanStatusTracker.styles";

export interface TimelineItem {
  status: LoanApplicationStatus;
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  isCurrent: boolean;
}

export interface LoanStatusTrackerProps {
  currentStatus: LoanApplicationStatus;
  timeline: TimelineItem[];
}

export const LoanStatusTracker: React.FC<LoanStatusTrackerProps> = ({
  currentStatus,
  timeline,
}) => {
  const currentStageIndex = getStageIndex(currentStatus);
  const stages = [
    "Application Submitted",
    "Agent Review",
    "Lender Review",
    "Sanctioned",
    "Disbursed",
  ];

  return (
    <View style={styles.container}>
      {stages.map((title, index) => {
        const isLast = index === stages.length - 1;
        const isCompleted = index < currentStageIndex;
        const isCurrent = index === currentStageIndex;

        return (
          <View key={title} style={styles.stageRow}>
            {/* Vertical timeline indicator */}
            <View style={styles.timelineCol}>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isCurrent && styles.dotCurrent,
                ]}
              >
                {isCompleted ? (
                  <Ionicons
                    name="checkmark"
                    size={12}
                    color={BrandColors.COLOR_WHITE}
                  />
                ) : isCurrent ? (
                  <Ionicons
                    name="ellipse"
                    size={8}
                    color={BrandColors.COLOR_WHITE}
                  />
                ) : null}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.line,
                    isCompleted && styles.lineCompleted,
                  ]}
                />
              )}
            </View>

            {/* Content Column */}
            <View style={styles.contentCol}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.stageTitle,
                    isCompleted && styles.stageTitleCompleted,
                    isCurrent && styles.stageTitleCurrent,
                  ]}
                >
                  {title}
                </Text>
              </View>

              <Text style={styles.description}>
                {isCurrent ? currentStatus : isCompleted ? "Completed" : "Pending"}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

function getStageIndex(status: LoanApplicationStatus): number {
  switch (status) {
    case "New Lead":
    case "Application Received":
    case "Documents Pending":
      return 0;
    case "Documents Received":
    case "Eligibility Verification":
    case "Application Prepared":
      return 1;
    case "Submitted to Lender":
    case "Under Credit Review":
    case "Query Raised":
    case "Query Resolved":
      return 2;
    case "Sanctioned":
    case "Sanction Letter":
    case "Documentation":
      return 3;
    case "Disbursement":
    case "Completed":
      return 4;
    case "Rejected":
    case "On Hold":
      return 2;
    default:
      return 0;
  }
}

export default LoanStatusTracker;
