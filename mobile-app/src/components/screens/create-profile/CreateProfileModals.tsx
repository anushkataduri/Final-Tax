import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
  type LayoutChangeEvent,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors, Colors, BorderWidth } from "@/shared/theme";
import { styles } from "@/styles/app/(auth)/create-profile.styles";
import { GENDER_OPTIONS, INDIAN_STATES_AND_UTS } from "./types";
import type { IconName } from "@/types/domain";

// ─── Shared Form Field ────────────────────────────────────────────────────────

export interface FieldProps {
  label?: string;
  labelRight?: React.ReactNode;
  leftIcon?: IconName;
  value: string;
  onChange: (t: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  rightIcon?: IconName;
  onRightIcon?: () => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmit?: () => void;
  secure?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  onLayout?: (e: LayoutChangeEvent) => void;
  fieldRef?: React.RefObject<TextInput | null>;
}

export function FormField({
  label, labelRight, leftIcon, value, onChange, onFocus, onBlur,
  placeholder, rightIcon, onRightIcon, error, keyboardType, maxLength,
  returnKeyType, onSubmit, secure, autoCapitalize, onLayout, fieldRef,
}: FieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const boxStyle = [
    styles.inputBox,
    error
      ? { borderColor: Colors.error, backgroundColor: "#FEF2F2" }
      : { borderColor: isFocused ? BrandColors.PRIMARY_ORANGE : BrandColors.BORDER, backgroundColor: BrandColors.WHITE },
    { borderWidth: isFocused || error ? BorderWidth.regular : BorderWidth.thin },
  ];
  return (
    <View style={styles.fieldContainer} onLayout={onLayout}>
      {label && (labelRight ? (
        <View style={styles.labelWithActionRow}><Text style={styles.label}>{label}</Text>{labelRight}</View>
      ) : <Text style={styles.label}>{label}</Text>)}
      <View style={boxStyle}>
        {leftIcon && <Ionicons name={leftIcon} size={20} color={error ? Colors.error : BrandColors.PRIMARY_ORANGE} style={styles.leftIcon} />}
        <TextInput
          ref={fieldRef} style={styles.input} value={value} onChangeText={onChange}
          onFocus={() => { setIsFocused(true); onFocus?.(); }}
          onBlur={() => { setIsFocused(false); onBlur?.(); }}
          placeholder={placeholder} placeholderTextColor={BrandColors.TEXT_MUTED}
          keyboardType={keyboardType} maxLength={maxLength} returnKeyType={returnKeyType}
          onSubmitEditing={onSubmit} secureTextEntry={secure} autoCapitalize={autoCapitalize}
        />
        {rightIcon && (onRightIcon ? (
          <TouchableOpacity onPress={onRightIcon} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.rightIconTouch}>
            <Ionicons name={rightIcon} size={20} color={BrandColors.TEXT_SECONDARY} />
          </TouchableOpacity>
        ) : <Ionicons name={rightIcon} size={18} color={BrandColors.TEXT_SECONDARY} style={styles.rightIcon} />)}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ─── Gender Picker Modal ──────────────────────────────────────────────────────

interface GenderModalProps {
  visible: boolean;
  selectedGender: string;
  onSelect: (gender: string) => void;
  onClose: () => void;
}

export function GenderPickerModal({
  visible,
  selectedGender,
  onSelect,
  onClose,
}: GenderModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.genderModalContent}>
          <View style={styles.calendarHeader}>
            <Text style={[styles.calendarTitle, { color: BrandColors.PRIMARY_BLUE_DARK }]}>
              Select Gender
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {GENDER_OPTIONS.map((g) => {
            const isSelected = selectedGender === g;
            return (
              <TouchableOpacity
                key={g}
                activeOpacity={0.7}
                onPress={() => onSelect(g)}
                style={[styles.genderOption, isSelected && styles.genderOptionSelected]}
              >
                <Text style={[styles.genderOptionText, isSelected && styles.genderOptionTextSelected]}>
                  {g}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={BrandColors.PRIMARY_ORANGE} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

// ─── State / UT Picker Modal ──────────────────────────────────────────────────

interface StateModalProps {
  visible: boolean;
  selectedState: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (state: string) => void;
  onClose: () => void;
}

export function StatePickerModal({
  visible,
  selectedState,
  searchQuery,
  onSearchChange,
  onSelect,
  onClose,
}: StateModalProps) {
  const filteredStates = !searchQuery.trim()
    ? INDIAN_STATES_AND_UTS
    : INDIAN_STATES_AND_UTS.filter((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.stateModalContent}>
          <View style={styles.calendarHeader}>
            <Text style={[styles.calendarTitle, { color: BrandColors.PRIMARY_BLUE_DARK }]}>
              Select State / UT
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.stateSearchBox}>
            <Ionicons name="search-outline" size={18} color={BrandColors.TEXT_MUTED} />
            <TextInput
              style={styles.stateSearchInput}
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Search State / UT"
              placeholderTextColor={BrandColors.TEXT_MUTED}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => onSearchChange("")}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* State List */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredStates.map((s) => {
              const isSelected = selectedState === s;
              return (
                <TouchableOpacity
                  key={s}
                  activeOpacity={0.7}
                  onPress={() => onSelect(s)}
                  style={[styles.stateItem, isSelected && styles.stateItemSelected]}
                >
                  <Text style={[styles.stateItemText, isSelected && styles.stateItemTextSelected]}>
                    {s}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={BrandColors.PRIMARY_ORANGE} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
