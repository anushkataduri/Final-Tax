import React, { useState, memo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatDateDDMMYYYY, parseDDMMYYYY } from "@/shared/formatters/dateFormatter";
import { styles } from "./GstDatePickerModal.styles";

export interface GstDatePickerModalProps {
  visible: boolean;
  title: string;
  selectedDate?: string;
  onSelectDate: (formattedDate: string) => void;
  onClose: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const GstDatePickerModal: React.FC<GstDatePickerModalProps> = memo(({
  visible,
  title,
  selectedDate,
  onSelectDate,
  onClose,
  minimumDate,
  maximumDate,
}) => {
  const initialDate = selectedDate ? parseDDMMYYYY(selectedDate) || new Date() : new Date();
  const [internalDate, setInternalDate] = useState<Date>(initialDate);

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setInternalDate(date);
      if (Platform.OS === "android") {
        onSelectDate(formatDateDDMMYYYY(date));
      }
    }
  };

  const handleConfirm = () => {
    onSelectDate(formatDateDDMMYYYY(internalDate));
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.indicator} />
              <View style={styles.headerRow}>
                <Text style={styles.titleText}>{title}</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={internalDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                />
              </View>

              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={styles.confirmBtn}
                  activeOpacity={0.8}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmBtnText}>Confirm Date</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

GstDatePickerModal.displayName = "GstDatePickerModal";

export default GstDatePickerModal;
