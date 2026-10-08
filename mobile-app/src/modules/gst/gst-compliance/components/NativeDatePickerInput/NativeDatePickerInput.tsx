import React from "react";
import { UniversalDatePicker } from "@/shared/components/UniversalDatePicker";

export interface NativeDatePickerInputProps {
  label: string;
  value: string;
  onChange: (formattedDate: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  helperText?: string;
  validateMinDate?: string;
}

export const NativeDatePickerInput: React.FC<NativeDatePickerInputProps> = (props) => {
  return <UniversalDatePicker {...props} />;
};

export default NativeDatePickerInput;
