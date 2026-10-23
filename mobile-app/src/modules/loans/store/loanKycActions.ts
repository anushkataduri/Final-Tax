import type { StoreApi } from "zustand";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { isProfileComplete } from "@/shared/guards/serviceAccess";
import { loanKycService } from "../services/loanKycService";
import { validateLoanKyc } from "../validation/loanKycValidation";
import type { LoanKycData, LoanKycAddress, LoanKycErrors } from "../types/loanKyc.types";
import { createInitialKycData, type LoansStoreState } from "./loansStore.types";

type Set = StoreApi<LoansStoreState>["setState"];
type Get = StoreApi<LoansStoreState>["getState"];

const normalizeApiDob = (rawDob: string): string => {
  const apiFormat = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawDob.trim());
  return apiFormat ? `${apiFormat[3]}-${apiFormat[2]}-${apiFormat[1]}` : rawDob;
};

const splitAddressLine = (line1: string, line2: string): { house: string; street: string } => {
  if (line2) return { house: line1, street: line2 };
  if (!line1) return { house: "", street: "" };
  const parts = line1.split(/,|\n/).map((p) => p.trim()).filter(Boolean);
  return parts.length > 1
    ? { house: parts[0], street: parts.slice(1).join(", ") }
    : { house: "", street: line1 };
};

const LOCKED_PROFILE_FIELDS = new Set<keyof LoanKycData>([
  "fullName", "mobile", "email", "pan", "aadhaar", "dob",
]);

export const createLoanKycActions = (set: Set, get: Get) => ({
  setKycField: <K extends keyof LoanKycData>(field: K, value: LoanKycData[K]) =>
    set((state) => {
      const isLocked = state.isProfileLocked || state.kycData.isProfileLocked;
      if (isLocked && LOCKED_PROFILE_FIELDS.has(field)) return state;
      const nextErrors = { ...state.kycErrors };
      delete nextErrors[field as keyof LoanKycErrors];
      return { kycData: { ...state.kycData, [field]: value }, kycErrors: nextErrors };
    }),

  setCurrentAddressField: (field: keyof LoanKycAddress, value: string) =>
    set((state) => {
      if (state.isProfileLocked || state.kycData.isProfileLocked) return state;
      const updatedCurrent = { ...state.kycData.currentAddress, [field]: value };
      const nextErrors = { ...state.kycErrors };
      delete nextErrors[`currentAddress.${field}` as keyof LoanKycErrors];
      return {
        kycData: {
          ...state.kycData,
          currentAddress: updatedCurrent,
          permanentAddress: state.kycData.isPermanentSameAsCurrent
            ? { ...updatedCurrent }
            : state.kycData.permanentAddress,
        },
        kycErrors: nextErrors,
      };
    }),

  setPermanentAddressField: (field: keyof LoanKycAddress, value: string) =>
    set((state) => {
      if (state.isProfileLocked || state.kycData.isProfileLocked) return state;
      const nextErrors = { ...state.kycErrors };
      delete nextErrors[`permanentAddress.${field}` as keyof LoanKycErrors];
      return {
        kycData: {
          ...state.kycData,
          permanentAddress: { ...state.kycData.permanentAddress, [field]: value },
        },
        kycErrors: nextErrors,
      };
    }),

  setPermanentSameAsCurrent: (isSame: boolean) =>
    set((state) => {
      if (state.isProfileLocked || state.kycData.isProfileLocked) return state;
      return {
        kycData: {
          ...state.kycData,
          isPermanentSameAsCurrent: isSame,
          permanentAddress: isSame
            ? { ...state.kycData.currentAddress }
            : state.kycData.permanentAddress,
        },
      };
    }),

  setConsent: (consent: boolean) =>
    set((state) => {
      const nextErrors = { ...state.kycErrors };
      if (consent) delete nextErrors.consentGiven;
      return { kycData: { ...state.kycData, consentGiven: consent }, kycErrors: nextErrors };
    }),

  populateFromUserProfile: () => {
    try {
      const authState = useAuthStore.getState();
      const storageUser = authStorage.getUser();
      const profile = (authState.customer ?? authState.authenticatedUser ?? storageUser) as Record<string, string> | null;
      if (!profile) return;

      const isComplete = isProfileComplete({
        profileCompleted: authState.profileCompleted,
        isExistingUser: authState.isExistingUser,
        customerExists: authState.customerExists,
        customer: authState.customer ?? (storageUser as Parameters<typeof isProfileComplete>[0]["customer"]),
        authenticatedUser: authState.authenticatedUser ?? (storageUser as Parameters<typeof isProfileComplete>[0]["authenticatedUser"]),
      });

      const pan = (profile.pan || profile.panNumber || "").toUpperCase();
      const aadhaar = profile.aadhaar || profile.aadhaarNumber || "";
      const name = profile.name || profile.fullName || "";
      const rawDob = profile.dob || profile.dateOfBirth || "";
      const mobile = profile.mobileNumber || profile.mobile || "";
      const email = profile.email || "";
      const addressLine1 = profile.addressLine1 || profile.address || "";
      const addressLine2 = profile.addressLine2 || "";
      const city = profile.city || "";
      const state = profile.state || "";
      const pincode = profile.pincode || profile.pinCode || "";
      const normalizedDob = rawDob ? normalizeApiDob(rawDob) : rawDob;
      const { house, street } = splitAddressLine(addressLine1, addressLine2);
      const hasProfileData = Boolean(name || mobile || pan || aadhaar);

      set((prev) => ({
        isProfileLocked: isComplete ? true : prev.isProfileLocked,
        kycStatus: "not_connected",
        kycData: {
          ...prev.kycData,
          fullName: name || prev.kycData.fullName,
          mobile: mobile || prev.kycData.mobile,
          email: email || prev.kycData.email,
          pan: pan || prev.kycData.pan,
          aadhaar: aadhaar || prev.kycData.aadhaar,
          dob: normalizedDob || prev.kycData.dob,
          currentAddress: {
            houseNumber: house || prev.kycData.currentAddress.houseNumber,
            street: street || prev.kycData.currentAddress.street,
            city: city || prev.kycData.currentAddress.city,
            state: state || prev.kycData.currentAddress.state,
            pincode: pincode || prev.kycData.currentAddress.pincode,
          },
          permanentAddress: prev.kycData.isPermanentSameAsCurrent
            ? {
                houseNumber: house || prev.kycData.currentAddress.houseNumber,
                street: street || prev.kycData.currentAddress.street,
                city: city || prev.kycData.currentAddress.city,
                state: state || prev.kycData.currentAddress.state,
                pincode: pincode || prev.kycData.currentAddress.pincode,
              }
            : prev.kycData.permanentAddress,
          isProfilePrefilled: hasProfileData || prev.kycData.isProfilePrefilled,
          isProfileLocked: isComplete ? true : prev.kycData.isProfileLocked,
        },
      }));
    } catch {
      // Graceful fallback: proceed without prefill
    }
  },

  validateForm: (): boolean => {
    const requirements = loanKycService.getProviderRequirements(get().selectedCategory?.id);
    const { isValid, errors } = validateLoanKyc(get().kycData, requirements);
    set({ kycErrors: errors });
    return isValid;
  },

  clearKycErrors: () => set({ kycErrors: {} }),
  resetKycData: () => set({ kycData: createInitialKycData(), kycErrors: {} }),
});
