import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { styles } from "./GstBusinessStep.styles";
 
interface InputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  keyboardType?: any;
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}
 
export const FormInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  keyboardType,
  maxLength,
  autoCapitalize,
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      keyboardType={keyboardType}
      maxLength={maxLength}
      autoCapitalize={autoCapitalize}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);
 
interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  error?: string;
  placeholder?: string;
}
 
export const FormSelect: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  error,
  placeholder,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        style={[styles.selectInput, error && styles.inputError]}
      >
        <Text style={[styles.selectText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#1E293B" />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
 
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Select {label.replace(" *", "")}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    value === item && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    onChange(item);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      value === item && styles.modalOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {value === item && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={BrandColors.PRIMARY_BLUE}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
 
interface DatePickerProps {
  label: string;
  value: string;
  onPress: () => void;
  error?: string;
  placeholder?: string;
}
 
export const FormDatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onPress,
  error,
  placeholder,
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.dateInput,
        styles.formDatePickerBtn,
        error && styles.inputError,
      ]}
    >
      <Text
        style={[
          styles.selectText,
          styles.formDatePickerText,
          !value && styles.placeholderText,
        ]}
        numberOfLines={1}
      >
        {value || placeholder}
      </Text>
      <Ionicons
        name="calendar-outline"
        size={18}
        color={error ? "#DC2626" : "#0284C7"}
      />
    </TouchableOpacity>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);
 
 