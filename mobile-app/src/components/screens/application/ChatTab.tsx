import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/app/application/[id].styles";
import type { ChatMessage } from "@/types/domain";

interface ChatTabProps {
  chatHistory?: ChatMessage[];
  assignedCA: string;
  formatDisplayDate: (dateStr?: string) => string;
}


export function ChatTab({
  chatHistory,
  assignedCA,
  formatDisplayDate,
}: ChatTabProps) {
  const hasNoMessages = !chatHistory || chatHistory.length === 0;

  return (
    <View style={styles.tabContentGap}>
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Ionicons
            name="chatbubbles-outline"
            size={20}
            color="#083B75"
          />
          <Text style={styles.cardHeaderTitle}>CA Consultation</Text>
        </View>

        {hasNoMessages ? (
          <View style={styles.emptyChatWrap}>
            <View style={styles.emptyChatIconCircle}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={30}
                color="#FF5722"
              />
            </View>
            <Text style={styles.emptyChatTitle}>Direct CA Consultation</Text>
            <Text style={styles.emptyChatSubtitle}>
              Have questions about this application? Send a direct message to{" "}
              {assignedCA}.
            </Text>
            <View style={styles.chatSecurityBadge}>
              <Ionicons
                name="shield-checkmark"
                size={14}
                color="#059669"
              />
              <Text style={styles.chatSecurityText}>
                Application-Specific & Confidential
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.chatListWrap}>
            {chatHistory.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <View
                  key={msg.id}
                  style={isUser ? styles.chatBubbleUser : styles.chatBubbleCA}
                >
                  <Text
                    style={[
                      styles.chatSenderLabel,
                      isUser ? styles.chatSenderLabelUser : styles.chatSenderLabelCA,
                    ]}
                  >
                    {isUser
                      ? "You"
                      : assignedCA !== "CA not assigned yet"
                        ? assignedCA
                        : "TaxEdge CA"}
                  </Text>
                  <Text
                    style={isUser ? styles.chatTextUser : styles.chatTextCA}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    style={isUser ? styles.chatTimeUser : styles.chatTimeCA}
                  >
                    {formatDisplayDate(msg.timestamp)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
