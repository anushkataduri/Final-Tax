import { useState, useCallback, useRef, useEffect } from "react";
import { pinCodeService } from "@/shared/services/lookup/pinCodeService";
import { ifscService } from "@/shared/services/lookup/ifscService";
import { logger } from "@/core/logging/logger";
import { GstBusinessFormData } from "../components/GstBusinessStep/GstBusinessStep";

export interface UseGstLookupsProps {
  data: GstBusinessFormData;
  onChange: (fields: Partial<GstBusinessFormData>) => void;
}

export const useGstFieldLookups = ({ data, onChange }: UseGstLookupsProps) => {
  const [pinLoading, setPinLoading] = useState(false);
  const [ifscLoading, setIfscLoading] = useState(false);
  const latestPinRef = useRef<string>("");
  const latestIfscRef = useRef<string>("");
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const handlePinLookup = useCallback(async (pin: string) => {
    const cleanPin = (pin || "").trim();
    latestPinRef.current = cleanPin;
    if (!pinCodeService.isValidFormat(cleanPin)) return;
    setPinLoading(true);
    try {
      const res = await pinCodeService.lookup(cleanPin);
      // Abort if user has already entered a different PIN or if input changed
      if (latestPinRef.current !== cleanPin) return;
      const current = dataRef.current;
      onChange({
        pinCode: cleanPin,
        city: current.city || res.city,
        district: current.district || res.district,
        state: current.state || res.state,
      });
    } catch (e) {
      logger.debug("[useGstFieldLookups] PIN lookup skipped or not found:", { error: e });
    } finally {
      if (latestPinRef.current === cleanPin) {
        setPinLoading(false);
      }
    }
  }, [onChange]);

  const handleIfscLookup = useCallback(async (code: string) => {
    const clean = (code || "").trim().toUpperCase();
    latestIfscRef.current = clean;
    if (!ifscService.isValidFormat(clean)) return;
    setIfscLoading(true);
    try {
      const res = await ifscService.lookup(clean);
      // Abort if user has already entered a different IFSC code
      if (latestIfscRef.current !== clean) return;
      const current = dataRef.current;
      onChange({
        ifscCode: clean,
        bankName: current.bankName || res.bank,
        branchName: current.branchName || res.branch,
      });
    } catch (e) {
      logger.warn("[useGstFieldLookups] IFSC lookup skipped or failed:", { error: e });
    } finally {
      if (latestIfscRef.current === clean) {
        setIfscLoading(false);
      }
    }
  }, [onChange]);

  return {
    pinLoading,
    ifscLoading,
    handlePinLookup,
    handleIfscLookup,
  };
};
