import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DatePickerDialog } from "@/shared/components/DatePickerDialog";
import { styles } from "./ProjectFinanceDatePicker.styles";

interface ProjectFinanceDatePickerProps {
  label?: string;
  value: string;
  onChange: (dateStr: string) => void;
  placeholder?: string;
  required?: boolean;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = MONTHS[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

function parseDate(str?: string): Date {
  if (!str) return new Date();
  const clean = str.trim();
  const parts = clean.split(" ");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTHS.indexOf(parts[1]);
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }
  const parsed = new Date(clean);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export const ProjectFinanceDatePicker: React.FC<
  ProjectFinanceDatePickerProps
> = ({
  label,
  value,
  onChange,
  placeholder = "DD MMM YYYY",
  required = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(() => parseDate(value));

  const handleOpen = () => {
    setPickerDate(parseDate(value));
    setShowPicker(true);
  };

  const handleConfirm = (selectedDate: Date) => {
    setShowPicker(false);
    onChange(formatDate(selectedDate));
  };

  return (
    <View style={styles.fieldGroup}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={styles.dateContainer}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.dateText : styles.placeholderText}>
          {value || placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={18} color="#64748B" />
      </TouchableOpacity>

      <DatePickerDialog
        visible={showPicker}
        value={pickerDate}
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(false)}
        title={label}
      />
    </View>
  );
};

export default ProjectFinanceDatePicker;
