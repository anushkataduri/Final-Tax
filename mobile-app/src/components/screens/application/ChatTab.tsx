import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/app/application/[id].styles";
import type { ChatMessage } from "@/types/domain";

interface ChatTabProps {
  chatHistory?: ChatMessage[];
  assignedCA?: string;
  isLoans?: boolean;
  appliedDate?: string;
  chatInput: string;
  setChatInput: (text: string) => void;
  isSendingChat: boolean;
  onSendMessage: () => void;
  formatDisplayDate: (dateStr?: string) => string;
}

export function ChatTab({
  chatHistory = [],
  assignedCA,
  isLoans,
  appliedDate,
  chatInput,
  setChatInput,
  isSendingChat,
  onSendMessage,
  formatDisplayDate,
}: ChatTabProps) {
  const canSend = Boolean(chatInput.trim()) && !isSendingChat;
  const caInitials = isLoans ? "LO" : "CA";
  const headingTitle = isLoans ? "Chat with Your Loan Officer" : "Chat with Your CA";
  const defaultTime = appliedDate ? `${appliedDate}, 12:10 PM` : "22 Oct 2025, 12:10 PM";

  const hasMessages = Array.isArray(chatHistory) && chatHistory.length > 0;

  return (
    <View style={styles.card}>
      {/* ── Chat Header Area (Screen 6 Reference) ── */}
      <View style={styles.chatHeaderArea}>
        <Text style={styles.chatHeading}>{headingTitle}</Text>
        <Text style={styles.chatSubheading}>
          Get quick help and updates about your application.
        </Text>
      </View>

      {/* ── Message Thread (Screen 6 Reference) ── */}
      <View style={styles.chatMessagesWrap}>
        {/* Default initial message from CA if history is empty */}
        {!hasMessages ? (
          <>
            {/* CA Greeting Message on Left */}
            <View style={styles.chatRowCA}>
              <View style={styles.chatAvatarCA}>
                <Text style={styles.chatAvatarTextCA}>{caInitials}</Text>
              </View>
              <View>
                <View style={styles.chatBubbleCA}>
                  <Text style={styles.chatTextCA}>
                    Hello! Your application has been submitted successfully. We will review it shortly.
                  </Text>
                </View>
                <Text style={styles.chatTimestamp}>{defaultTime}</Text>
              </View>
            </View>
          </>
        ) : (
          chatHistory.map((msg) => {
            const isUser = msg.sender === "user";
            const timeStr = formatDisplayDate(msg.timestamp);

            if (isUser) {
              return (
                <View key={msg.id} style={styles.chatRowUser}>
                  <View style={{ alignItems: "flex-end" }}>
                    <View style={styles.chatBubbleUser}>
                      <Text style={styles.chatTextUser}>{msg.text}</Text>
                    </View>
                    <Text style={styles.chatTimestamp}>{timeStr}</Text>
                  </View>
                  <View style={styles.chatAvatarUser}>
                    <Ionicons name="person" size={16} color="#0284C7" />
                  </View>
                </View>
              );
            }

            return (
              <View key={msg.id} style={styles.chatRowCA}>
                <View style={styles.chatAvatarCA}>
                  <Text style={styles.chatAvatarTextCA}>{caInitials}</Text>
                </View>
                <View>
                  <View style={styles.chatBubbleCA}>
                    <Text style={styles.chatTextCA}>{msg.text}</Text>
                  </View>
                  <Text style={styles.chatTimestamp}>{timeStr}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* ── Input Field & Send Action (Screen 6 Reference) ── */}
      <View style={styles.chatInputRow}>
        <TextInput
          style={styles.chatTextInput}
          placeholder="Type a message..."
          placeholderTextColor="#94A3B8"
          value={chatInput}
          onChangeText={setChatInput}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSendMessage}
          disabled={!canSend}
          style={[styles.chatSendBtn, { opacity: !canSend ? 0.6 : 1 }]}
        >
          {isSendingChat ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="send" size={15} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* ── Lock Security Note (Screen 6 Bottom Reference) ── */}
      <View style={styles.chatSecurityNote}>
        <Ionicons name="lock-closed-outline" size={12} color="#94A3B8" />
        <Text style={styles.chatSecurityNoteText}>
          Your conversation is secure and confidential.
        </Text>
      </View>
    </View>
  );
}
