import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { gstApi } from "@/modules/gst/services/gstApi";
import { getCurrentFinancialYear } from "@/modules/gst/utils/gstDateUtils";
import { dismissKeyboardThen } from "@/shared/components/KeyboardAwareFormLayout";
import { styles } from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/GstFilingPeriodStep.styles";
import { GstFilingSelectModal } from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/GstFilingSelectModal";
import { GstCalculationMethodSection } from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/GstCalculationMethodSection";
import { GstFilingTaxpayerCard } from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/GstFilingTaxpayerCard";
import { RecursivePills } from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/RecursivePills";
import {
  validateGstin,
  validateEstimatedAmount,
} from "@/modules/gst/gst-filing/utils/gstFilingValidation";
import {
  FILING_PERIODS,
  FILING_NATURE_OPTIONS,
  FINANCIAL_YEARS,
  getFilingPeriodsForFrequency,
  getReturnTypesForFrequency,
} from "@/modules/gst/gst-filing/components/GstFilingPeriodStep/gstPeriodUtils";

export {
  FILING_PERIODS,
  FILING_NATURE_OPTIONS,
  FINANCIAL_YEARS,
  getFilingPeriodsForFrequency,
  getReturnTypesForFrequency,
};

export interface GstFilingPeriodData {
  periodType: string;
  financialYear?: string;
  filingPeriod?: string;
  filingMonth: string;
  gstin: string;
  filingType: string;
  filingNature?: "Regular Return" | "Nil Return";
  businessName?: string;
  tradeName?: string;
  legalName?: string;
  taxpayerScheme?: string;
  state?: string;
  isVerifiedEntity?: boolean;
  calculationMethod?: "ca_assisted" | "manual_estimates";
  taxableSales?: string;
  turnover?: string;
  exemptSales?: string;
  taxablePurchases?: string;
  eligibleItc?: string;
  customerId?: string;
  filingId?: string;
}

interface GstFilingPeriodStepProps {
  data: GstFilingPeriodData;
  onChange: (fields: Partial<GstFilingPeriodData>) => void;
  onBlurField?: (field: keyof GstFilingPeriodData) => void;
  onError?: (field: string, error: string) => void;
  errors?: Record<string, string>;
}

export const GstFilingPeriodStep: React.FC<GstFilingPeriodStepProps> = ({
  data,
  onChange,
  onBlurField,
  onError,
  errors = {},
}) => {
  const [showYearModal, setShowYearModal] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const gstinLookupRequestId = useRef(0);
  const lastQueriedGstinRef = useRef<string>("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const rawGstin = data.gstin ? data.gstin.trim().toUpperCase() : "";

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!rawGstin || validateGstin(rawGstin, false) !== null) {
      return;
    }

    if (data.isVerifiedEntity && lastQueriedGstinRef.current === rawGstin) {
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (lastQueriedGstinRef.current === rawGstin && data.isVerifiedEntity) {
        return;
      }

      lastQueriedGstinRef.current = rawGstin;
      const requestId = ++gstinLookupRequestId.current;
      setIsLookingUp(true);

      try {
        const entity = await gstApi.lookupGstin(rawGstin);
        if (
          requestId === gstinLookupRequestId.current &&
          entity &&
          entity.gstin === rawGstin
        ) {
          onChange({
            businessName: entity.legalName,
            tradeName: entity.tradeName,
            taxpayerScheme: entity.taxpayerScheme,
            state: entity.state,
            isVerifiedEntity: true,
          });
        }
      } catch {
        // Safe failover on lookup failure
      } finally {
        if (requestId === gstinLookupRequestId.current) {
          setIsLookingUp(false);
        }
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data.gstin, data.isVerifiedEntity, onChange]);

  const handleGstinChange = (text: string) => {
    const cleaned = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 15);
    if (cleaned === data.gstin) {
      return;
    }

    if (isLookingUp) {
      setIsLookingUp(false);
    }

    onChange({
      gstin: cleaned,
      isVerifiedEntity: false,
      businessName: undefined,
      tradeName: undefined,
      legalName: undefined,
      taxpayerScheme: undefined,
      state: undefined,
    });

    // Field-level real-time validation:
    // 1. If empty, clear error
    // 2. If >= 2 and < 15 characters, validate state code in real time
    // 3. Immediately upon reaching 15 characters, run full structural validation
    if (cleaned.length === 0) {
      onError?.("gstin", "");
    } else if (cleaned.length >= 2 && cleaned.length < 15) {
      const stateErr = validateGstin(cleaned, false);
      onError?.("gstin", stateErr || "");
    } else if (cleaned.length === 15) {
      const fullErr = validateGstin(cleaned, true);
      onError?.("gstin", fullErr || "");
    } else {
      onError?.("gstin", "");
    }
  };

  const currentPeriods = useMemo(
    () =>
      getFilingPeriodsForFrequency(
        data.periodType,
        data.financialYear || getCurrentFinancialYear("FY ")
      ),
    [data.periodType, data.financialYear]
  );

  const currentReturnTypes = useMemo(
    () => getReturnTypesForFrequency(data.periodType),
    [data.periodType]
  );

  const getPeriodModalTitle = () => {
    if (data.periodType === "Quarterly") return "Select Filing Quarter";
    if (data.periodType === "Monthly") return "Select Filing Month";
    if (data.periodType === "Annual") return "Select Filing Year";
    return "Select Filing Period";
  };

  const selectedPeriodValue = data.filingPeriod || data.filingMonth;

  return (
    <View style={styles.container}>
      {/* CARD 1: Filing Frequency & Period */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconBox}>
            <Ionicons name="calendar-outline" size={18} color={BrandColors.PRIMARY_ORANGE} />
          </View>
          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionMainTitle}>Filing Frequency & Period</Text>
            <Text style={styles.sectionSubtitle}>Select filing frequency and return period</Text>
          </View>
        </View>

        {/* 1. Select Filing Frequency (Pills) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Select Filing Frequency *</Text>
          <View style={styles.periodPillsRow}>
            <RecursivePills
              items={FILING_PERIODS}
              selectedValue={data.periodType}
              onSelect={(period: string) => {
                onChange({
                  periodType: period,
                  filingPeriod: "",
                  filingMonth: "",
                  filingType: "",
                });
                onError?.("periodType", "");
                onError?.("filingPeriod", "");
                onBlurField?.("periodType");
              }}
            />
          </View>
          <Text style={styles.frequencyHint}>
            Frequency filters both the period list and the return types below.
          </Text>
          {errors.periodType ? (
            <Text style={styles.errorText}>{errors.periodType}</Text>
          ) : null}
        </View>

        {/* 2. Financial Year Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Financial Year *</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => dismissKeyboardThen(() => setShowYearModal(true))}
            style={[styles.selectInput, errors.financialYear && styles.inputError]}
          >
            <Text
              style={[styles.selectText, !data.financialYear && styles.placeholderText]}
            >
              {data.financialYear || "Select financial year"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          <Text style={styles.frequencyHint}>
            Historical periods are available based on GST portal eligibility and filing rules.
          </Text>
          {errors.financialYear ? (
            <Text style={styles.errorText}>{errors.financialYear}</Text>
          ) : null}
        </View>

        {/* 3. Filing Period / Return Period Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Filing Period / Return Period *</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (!data.periodType) {
                onError?.("filingPeriod", "Select filing frequency first");
                return;
              }
              dismissKeyboardThen(() => setShowPeriodModal(true));
            }}
            style={[
              styles.selectInput,
              (errors.filingPeriod || errors.filingMonth) && styles.inputError,
              !data.periodType && { opacity: 0.75 },
            ]}
          >
            <Text
              style={[styles.selectText, !selectedPeriodValue && styles.placeholderText]}
            >
              {selectedPeriodValue || (!data.periodType ? "Select filing frequency first" : "Select return period")}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          {errors.filingPeriod || errors.filingMonth ? (
            <Text style={styles.errorText}>
              {errors.filingPeriod || errors.filingMonth}
            </Text>
          ) : null}
        </View>
      </View>

      <GstFilingTaxpayerCard
        data={data}
        errors={errors}
        isLookingUp={isLookingUp}
        onGstinChange={handleGstinChange}
        onBlurField={onBlurField}
        onError={onError}
        onChange={onChange}
        onOpenTypeModal={() => setShowTypeModal(true)}
      />

      {/* 7. Tax Calculation Method */}
      {data.filingNature !== "Nil Return" ? (
        <GstCalculationMethodSection
          calculationMethod={data.calculationMethod}
          taxableSales={data.taxableSales}
          taxablePurchases={data.taxablePurchases}
          eligibleItc={data.eligibleItc}
          errors={errors}
          onChange={(fields) => {
            if (fields.taxableSales !== undefined) {
              const err = validateEstimatedAmount(fields.taxableSales, "sales", false);
              onError?.("taxableSales", err || "");
            }
            if (fields.taxablePurchases !== undefined) {
              const err = validateEstimatedAmount(fields.taxablePurchases, "purchases", false);
              onError?.("taxablePurchases", err || "");
            }
            if (fields.eligibleItc !== undefined) {
              const err = validateEstimatedAmount(fields.eligibleItc, "eligible ITC", false);
              onError?.("eligibleItc", err || "");
            }
            onChange(fields);
          }}
        />
      ) : null}

      {/* Dynamic Financial Year Selection Modal */}
      <GstFilingSelectModal
        visible={showYearModal}
        title="Select Financial Year"
        data={FINANCIAL_YEARS}
        selectedValue={data.financialYear}
        onSelect={(item) => {
          onChange({
            financialYear: item,
            filingPeriod: "",
            filingMonth: "",
          });
          setShowYearModal(false);
        }}
        onClose={() => setShowYearModal(false)}
      />

      {/* Period Selection Modal (Monthly / Quarterly / Annual) */}
      <GstFilingSelectModal
        visible={showPeriodModal}
        title={getPeriodModalTitle()}
        data={currentPeriods}
        selectedValue={selectedPeriodValue}
        onSelect={(item) => {
          onChange({
            filingPeriod: item,
            filingMonth: item,
          });
          setShowPeriodModal(false);
        }}
        onClose={() => setShowPeriodModal(false)}
      />

      {/* Filing Type Selection Modal */}
      <GstFilingSelectModal
        visible={showTypeModal}
        title="Select Return Type"
        data={currentReturnTypes}
        selectedValue={data.filingType}
        numberOfLines={2}
        onSelect={(item) => {
          onChange({ filingType: item });
          setShowTypeModal(false);
        }}
        onClose={() => setShowTypeModal(false)}
      />
    </View>
  );
};
