import { useState, useCallback, useRef, useEffect } from "react";
import { pinCodeService } from "@/shared/services/lookup/pinCodeService";
import { ifscService } from "@/shared/services/lookup/ifscService";
import { logger } from "@/core/logging/logger";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import { GstBusinessFormData } from "../components/GstBusinessStep/GstBusinessStep";

export interface UseGstLookupsProps {
  data: GstBusinessFormData;
  onChange: (fields: Partial<GstBusinessFormData>) => void;
}

export const useGstFieldLookups = ({ data, onChange }: UseGstLookupsProps) => {
  const [pinLoading, setPinLoading] = useState(false);
  const [ifscLoading, setIfscLoading] = useState(false);
  const [ifscError, setIfscError] = useState<string | null>(null);

  const latestPinRef = useRef<string>("");
  const latestIfscRef = useRef<string>("");
  const latestRequestIdRef = useRef<number>(0);
  const ifscErrorRef = useRef<string | null>(null);
  const dataRef = useRef(data);

  const updateIfscError = useCallback((err: string | null) => {
    ifscErrorRef.current = err;
    setIfscError(err);
  }, []);

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
      if (latestPinRef.current !== cleanPin) return;
      const current = dataRef.current;
      const resolvedCity = current.city || res.city;
      const resolvedDistrict = current.district || res.district;
      if (resolvedCity && !GstValidators.isValidCity(resolvedCity)) {
        logger.warn("[useGstFieldLookups] PIN lookup city conflicts with alphabetic-only rule:", {
          city: resolvedCity,
          pin: cleanPin,
        });
      }
      if (resolvedDistrict && !GstValidators.isValidDistrict(resolvedDistrict)) {
        logger.warn("[useGstFieldLookups] PIN lookup district conflicts with alphabetic-only rule:", {
          district: resolvedDistrict,
          pin: cleanPin,
        });
      }
      onChange({
        pinCode: cleanPin,
        city: resolvedCity,
        district: resolvedDistrict,
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
    const clean = (code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    latestIfscRef.current = clean;
    const requestId = ++latestRequestIdRef.current;

    if (!ifscService.isValidFormat(clean)) {
      setIfscLoading(false);
      updateIfscError(clean.length === 11 ? "Enter a valid 11-digit IFSC code" : null);
      onChange({
        ifscCode: clean,
        bankName: "",
        branchName: "",
      });
      return;
    }

    updateIfscError(null);
    setIfscLoading(true);
    onChange({
      ifscCode: clean,
      bankName: "",
      branchName: "",
    });

    try {
      const res = await ifscService.lookup(clean);
      if (requestId !== latestRequestIdRef.current) return;
      onChange({
        ifscCode: clean,
        bankName: res.bank,
        branchName: res.branch,
      });
      updateIfscError(null);
    } catch (e) {
      if (requestId !== latestRequestIdRef.current) return;
      const errorMsg = e instanceof Error && e.message ? e.message : "IFSC code not found";
      updateIfscError(errorMsg);
      onChange({
        ifscCode: clean,
        bankName: "",
        branchName: "",
      });
      logger.warn("[useGstFieldLookups] IFSC lookup failed:", { code: clean, error: e });
    } finally {
      if (requestId === latestRequestIdRef.current) {
        setIfscLoading(false);
      }
    }
  }, [onChange, updateIfscError]);

  const handleIfscChange = useCallback((code: string) => {
    const clean = (code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    latestIfscRef.current = clean;

    if (clean.length === 11) {
      handleIfscLookup(clean);
    } else {
      latestRequestIdRef.current += 1;
      setIfscLoading(false);
      updateIfscError(null);
      onChange({
        ifscCode: clean,
        bankName: "",
        branchName: "",
      });
    }
  }, [handleIfscLookup, onChange, updateIfscError]);

  return {
    pinLoading,
    ifscLoading,
    ifscError,
    getIfscError: () => ifscErrorRef.current,
    handlePinLookup,
    handleIfscLookup,
    handleIfscChange,
  };
};
