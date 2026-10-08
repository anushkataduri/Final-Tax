import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/app/application/[id].styles";
import type { TimelineStep } from "@/types/domain";

interface StatusTabProps {
  timelineSteps: TimelineStep[];
  assignedCA: string;
  onChatPress: () => void;
  onWithdraw: () => void;
}

export function StatusTab({
  timelineSteps,
  assignedCA,
  onChatPress,
  onWithdraw,
}: StatusTabProps) {
  return (
    <View style={styles.tabContentGap}>
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="git-branch-outline" size={20} color="#083B75" />
          <Text style={styles.cardHeaderTitle}>Status Timeline</Text>
        </View>
        <View style={styles.timelineWrap}>
          {timelineSteps.map((step, index) => {
            const isLast = index === timelineSteps.length - 1;
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            return (
              <View key={index} style={styles.timelineRow}>
                <View style={styles.timelineLeftCol}>
                  {isCompleted ? (
                    <View style={styles.completedCircle}>
                      <Ionicons name="checkmark" size={12} color="#FFF" />
                    </View>
                  ) : isCurrent ? (
                    <View style={styles.currentCircle}>
                      <Text style={styles.currentCircleText}>
                        {index + 1}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.pendingCircle}>
                      <Text style={styles.pendingCircleText}>
                        {index + 1}
                      </Text>
                    </View>
                  )}
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineConnectingLine,
                        {
                          backgroundColor: isCompleted
                            ? "#16A34A"
                            : isCurrent
                              ? "#FED7AA"
                              : "#E2E8F0",
                        },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContentCol}>
                  <View style={styles.timelineStepTopRow}>
                    <Text
                      style={[
                        styles.timelineStepTitle,
                        {
                          color: isCurrent
                            ? "#EA580C"
                            : isCompleted
                              ? "#0F172A"
                              : "#64748B",
                          fontWeight: isCurrent || isCompleted ? "700" : "600",
                        },
                      ]}
                    >
                      {step.title}
                    </Text>
                    {step.date && (
                      <Text style={styles.timelineStepDate}>{step.date}</Text>
                    )}
                  </View>
                  <Text style={styles.timelineStepSub}>{step.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Status Discussion Shortcut */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onChatPress}
        style={[styles.card, styles.statusDiscussionCard]}
      >
        <View style={styles.statusDiscussionLeft}>
          <Ionicons name="chatbubbles" size={24} color="#EA580C" />
          <View style={styles.flex1}>
            <Text style={styles.statusDiscussionTitle}>
              Need clarification on this status?
            </Text>
            <Text style={styles.statusDiscussionSubtitle}>
              Discuss directly with {assignedCA}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#EA580C" />
      </TouchableOpacity>

      {/* Withdraw Application Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onWithdraw}
        style={styles.withdrawBtn}
      >
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
        <Text style={styles.withdrawBtnText}>Withdraw Application</Text>
      </TouchableOpacity>
    </View>
  );
}
