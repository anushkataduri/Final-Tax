import { useState } from "react";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { useCustomerStore } from "@/modules/customer/store/customerStore";
import { authApi } from "@/modules/authentication/services/authApi";
import type { Customer } from "@/shared/types/domain";
import { TdsCustomerIncomeFormData, PersonalDetails } from "../../types/customerIncome.types";

export function useTdsProfileSync(
  setFormData: React.Dispatch<React.SetStateAction<TdsCustomerIncomeFormData>>
) {
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileFetchError, setProfileFetchError] = useState<string | null>(null);

  const fetchAndPopulateProfile = async (): Promise<PersonalDetails | null> => {
    setIsProfileLoading(true);
    setProfileFetchError(null);
    try {
      useAuthStore.getState().syncFromDevAuth();
      const currentAuthUser = useAuthStore.getState().authenticatedUser;
      let currentCustomer = useAuthStore.getState().customer;

      const activeMobile =
        currentCustomer?.mobile ||
        currentAuthUser?.mobileNumber ||
        authStorage.getSession().activeMobile ||
        useAuthStore.getState().mobileNumber;

      const activeCustId =
        currentCustomer?.customerId ||
        currentAuthUser?.customerId;

      const cleanMob = activeMobile ? String(activeMobile).replace(/\D/g, "").slice(-10) : "";

      let apiRes: Record<string, unknown> | null = null;
      const lookupId = activeCustId || cleanMob;
      if (lookupId) {
        const backendRes = await authApi.getCustomerDetails(lookupId);
        if (backendRes.success && backendRes.data) {
          apiRes = backendRes.data as unknown as Record<string, unknown>;
        }
      }

      if (!apiRes) {
        apiRes = ((cleanMob ? authStorage.getUserByMobile(cleanMob) : null) || authStorage.getUser()) as unknown as Record<string, unknown> | null;
      }

      const sv = (v: unknown) => (v ? String(v) : "");
      if (apiRes && (apiRes.name || apiRes.fullName || apiRes.mobileNumber || apiRes.mobile || apiRes.pan || apiRes.aadhaar)) {
        const mergedCust: Customer = {
          name: sv(apiRes.name) || sv(apiRes.fullName) || currentCustomer?.name || "",
          email: sv(apiRes.email) || currentCustomer?.email || "",
          mobile: sv(apiRes.mobileNumber) || sv(apiRes.mobile) || currentCustomer?.mobile || activeMobile || "",
          pan: sv(apiRes.pan) || currentCustomer?.pan || "",
          aadhaar: sv(apiRes.aadhaar) || currentCustomer?.aadhaar || "",
          dob: sv(apiRes.dob) || sv(apiRes.dateOfBirth) || currentCustomer?.dob || "",
          customerType: sv(apiRes.customerType) || sv(apiRes.custType) || currentCustomer?.customerType || "Individual",
          addressLine1: sv(apiRes.addressLine1) || currentCustomer?.addressLine1 || "",
          addressLine2: sv(apiRes.addressLine2) || currentCustomer?.addressLine2 || "",
          city: sv(apiRes.city) || currentCustomer?.city || "",
          state: sv(apiRes.state) || currentCustomer?.state || "",
          pincode: sv(apiRes.pincode) || sv(apiRes.pinCode) || currentCustomer?.pincode || "",
          address: sv(apiRes.address) || currentCustomer?.address || "",
          customerId: sv(apiRes.custId) || sv(apiRes.customerId) || currentCustomer?.customerId || activeCustId || "",
          avatarUri: currentCustomer?.avatarUri || null,
          profileCompleted: true,
          hasPasscode: currentCustomer?.hasPasscode ?? Boolean(currentAuthUser?.passcode),
        };
        currentCustomer = mergedCust;
        useAuthStore.setState({ customer: mergedCust, profileCompleted: true });
        try {
          useCustomerStore.getState().setProfile(mergedCust);
        } catch {}
      }

      if (!currentCustomer && !currentAuthUser && !apiRes) {
        setProfileFetchError("Unable to load your profile information.");
        return null;
      }

      const rawPan = String(apiRes?.pan ?? "") || currentCustomer?.pan || currentAuthUser?.pan || "";
      const rawAadhaar = String(apiRes?.aadhaar ?? "") || currentCustomer?.aadhaar || currentAuthUser?.aadhaar || "";
      const rawDob = String(apiRes?.dob ?? apiRes?.dateOfBirth ?? "") || currentCustomer?.dob || currentAuthUser?.dob || "";
      const rawMobile = String(apiRes?.mobileNumber ?? apiRes?.mobile ?? "") || currentCustomer?.mobile || currentAuthUser?.mobileNumber || "";
      const rawEmail = String(apiRes?.email ?? "") || currentCustomer?.email || currentAuthUser?.email || "";
      const rawName = String(apiRes?.name ?? apiRes?.fullName ?? "") || currentCustomer?.name || currentAuthUser?.name || "";

      let rawAddress = sv(apiRes?.addressLine1) || currentCustomer?.addressLine1 || sv(apiRes?.address) || currentCustomer?.address || "";
      if (apiRes?.addressLine2 || currentCustomer?.addressLine2) {
        const line2 = sv(apiRes?.addressLine2) || currentCustomer?.addressLine2 || "";
        rawAddress = rawAddress ? `${rawAddress}, ${line2}` : line2;
      }

      const rawCity = sv(apiRes?.city) || currentCustomer?.city || "";
      const rawState = sv(apiRes?.state) || currentCustomer?.state || "";
      const rawPin = sv(apiRes?.pincode) || sv(apiRes?.pinCode) || currentCustomer?.pincode || "";

      const populatedPersonal: PersonalDetails = {
        fullName: rawName,
        pan: rawPan,
        aadhaar: rawAadhaar,
        dob: rawDob,
        mobileNumber: rawMobile,
        email: rawEmail,
        residentialAddress: rawAddress,
        city: rawCity,
        state: rawState,
        pinCode: rawPin,
      };

      setFormData((prev) => ({
        ...prev,
        personal: populatedPersonal,
        bank: {
          ...prev.bank,
          accountHolderName: prev.bank.accountHolderName || rawName,
        },
      }));

      return populatedPersonal;
    } catch (e: unknown) {
      setProfileFetchError((e as { message?: string })?.message || "Failed to load profile.");
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  };

  return { isProfileLoading, profileFetchError, fetchAndPopulateProfile };
}
