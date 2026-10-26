import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/app/application/[id].styles";
import type { TimelineStep } from "@/types/domain";

interface StatusTabProps {
  timelineSteps: TimelineStep[];
  currentStatus: string;
}

export function StatusTab({
  timelineSteps,
  currentStatus,
}: StatusTabProps) {
  const isCompleted = currentStatus.toLowerCase().includes("complete") ||
    currentStatus.toLowerCase().includes("approved");

  const statusSubtext = isCompleted
    ? "Your application has been processed and approved."
    : "Your application is under review.";

  return (
    <>
      {/* ── Main Timeline Card (Screen 3 Reference) ── */}
      <View style={styles.card}>
        <View style={styles.timelineContainer}>
          {timelineSteps.map((step, index) => {
            const isLast = index === timelineSteps.length - 1;
            const isStepCompleted = step.status === "completed";
            const isStepCurrent = step.status === "current";

            return (
              <View key={index} style={styles.timelineStepRow}>
                {/* Left Column: Icon Circle + Connecting Line */}
                <View style={styles.timelineLeftCol}>
                  {isStepCompleted ? (
                    <View style={styles.circleCompleted}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                  ) : isStepCurrent ? (
                    <View style={styles.circleCurrent}>
                      <Ionicons name="shield-outline" size={14} color="#0284C7" />
                    </View>
                  ) : (
                    <View style={styles.circlePending}>
                      <Ionicons name="checkmark" size={14} color="#94A3B8" />
                    </View>
                  )}

                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: isStepCompleted
                            ? "#16A34A"
                            : "#E2E8F0",
                        },
                      ]}
                    />
                  )}
                </View>

                {/* Right Column: Title, Date/Badge, Description */}
                <View style={styles.timelineRightCol}>
                  <View style={styles.timelineStepTitleRow}>
                    <Text
                      style={[
                        styles.timelineStepTitle,
                        {
                          color: isStepCurrent
                            ? "#0F172A"
                            : isStepCompleted
                              ? "#0F172A"
                              : "#64748B",
                        },
                      ]}
                    >
                      {step.title}
                    </Text>
                    {step.date && isStepCompleted && (
                      <Text style={styles.timelineStepDate}>{step.date}</Text>
                    )}
                  </View>

                  {!isStepCompleted && (
                    <View style={styles.timelinePendingBadge}>
                      <Text style={styles.timelinePendingBadgeText}>
                        {isStepCurrent ? "Pending" : "Pending"}
                      </Text>
                    </View>
                  )}

                  {step.description && (
                    <Text style={styles.timelineStepDesc}>
                      {step.description}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* ── Current Status Card (Screen 3 Bottom Reference) ── */}
      <View style={styles.currentStatusCard}>
        <View style={styles.currentStatusIconBox}>
          <Ionicons name="time-outline" size={24} color="#0284C7" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.currentStatusLabel}>Current Status</Text>
          <Text style={styles.currentStatusValue}>
            {currentStatus || "Submitted"}
          </Text>
          <Text style={styles.currentStatusSub}>{statusSubtext}</Text>
        </View>
      </View>
    </>
  );
}
