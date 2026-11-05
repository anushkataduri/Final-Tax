import React, { useState, useEffect, useRef } from "react";
import {
  TextInput,
  TextInputProps,
  TextInputSelectionChangeEvent,
  NativeSyntheticEvent,
  TargetedEvent,
} from "react-native";
import {
  formatIndianAmount,
  parseIndianAmount,
  calculateIndianAmountCursor,
  computeCursorInCleanText,
} from "@/shared/formatters/currencyFormatter";

export interface AmountTextInputProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string | number | null | undefined;
  onChangeText: (rawNumeric: string) => void;
  allowDecimals?: boolean;
  allowNegative?: boolean;
}

export const AmountTextInput: React.FC<AmountTextInputProps> = ({
  value,
  onChangeText,
  allowDecimals = false,
  allowNegative = false,
  maxLength,
  keyboardType,
  onSelectionChange,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const rawValue = parseIndianAmount(value, allowDecimals, allowNegative);
  const displayValue = formatIndianAmount(rawValue, allowDecimals);

  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>(undefined);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const cursorRef = useRef<number>(displayValue.length);
  const lastFormattedRef = useRef<string>(displayValue);

  // Synchronize internal tracking outside render when external prop updates (e.g. step navigation, draft load, reset)
  useEffect(() => {
    lastFormattedRef.current = displayValue;
    cursorRef.current = displayValue.length;
  }, [displayValue]);

  const handleChangeText = (text: string) => {
    const oldFormatted = lastFormattedRef.current;
    let cleanText = text;

    // Bug 4: Immediate rejection of '.' in integer-only mode
    if (!allowDecimals && text.includes(".")) {
      const rawWithoutDots = text.replace(/\./g, "");
      const digitsOnly = rawWithoutDots.replace(/[^0-9]/g, "");
      const oldDigits = rawValue.replace(/[^0-9]/g, "");
      if (digitsOnly === oldDigits) {
        // Keystroke was '.' inside an existing number or on empty:
        // Strip '.' immediately, preserve existing digits and cursor position
        cleanText = rawWithoutDots;
        const currentCursor = cursorRef.current;
        setSelection({ start: currentCursor, end: currentCursor });
        onChangeText(rawValue);
        return;
      }
    }

    let cursorInCleanText = computeCursorInCleanText(
      oldFormatted,
      cleanText,
      cursorRef.current
    );

    // Handle backspacing on a comma: if a single comma was deleted by backspace,
    // delete the preceding digit as well so the user is not trapped by re-formatting
    if (
      oldFormatted.length === cleanText.length + 1 &&
      cursorInCleanText >= 0 &&
      oldFormatted[cursorInCleanText] === ","
    ) {
      if (cursorInCleanText > 0) {
        cleanText =
          cleanText.slice(0, cursorInCleanText - 1) +
          cleanText.slice(cursorInCleanText);
        cursorInCleanText = cursorInCleanText - 1;
      }
    }

    const raw = parseIndianAmount(cleanText, allowDecimals, allowNegative);
    const constrainedRaw = maxLength ? raw.slice(0, maxLength) : raw;
    const newFormatted = formatIndianAmount(constrainedRaw, allowDecimals);

    const newCursor = calculateIndianAmountCursor(
      oldFormatted,
      cleanText,
      newFormatted,
      cursorInCleanText
    );

    lastFormattedRef.current = newFormatted;
    cursorRef.current = newCursor;
    setSelection({ start: newCursor, end: newCursor });

    onChangeText(constrainedRaw);
  };

  const handleSelectionChange = (
    e: TextInputSelectionChangeEvent
  ) => {
    const { start, end } = e.nativeEvent.selection;
    cursorRef.current = end;
    if (isFocused) {
      setSelection((prev) => {
        if (prev && prev.start === start && prev.end === end) {
          return prev;
        }
        return { start, end };
      });
    }
    if (onSelectionChange) {
      onSelectionChange(e);
    }
  };

  const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(true);
    setSelection({ start: cursorRef.current, end: cursorRef.current });
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(false);
    setSelection(undefined);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <TextInput
      {...restProps}
      value={displayValue}
      onChangeText={handleChangeText}
      onSelectionChange={handleSelectionChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      selection={isFocused ? selection : undefined}
      keyboardType={keyboardType || (allowDecimals ? "decimal-pad" : "numeric")}
    />
  );
};

export default AmountTextInput;
