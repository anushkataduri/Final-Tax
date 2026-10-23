import type React from "react";
import type { Customer } from "@/shared/types/domain";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { useCustomerStore } from "@/modules/customer/store/customerStore";
import { authApi } from "@/modules/authentication/services/authApi";
import { tdsDraftService } from "../../services/tdsDraftService";
import { logger } from "@/core/logging/logger";
import type { TdsCustomerIncomeFormData, PersonalDetails } from "../../types/customerIncome.types";

interface SaveProfileDeps {
  formData: TdsCustomerIncomeFormData;
  setFormData: React.Dispatch<React.SetStateAction<TdsCustomerIncomeFormData>>;
}

export function useTdsSaveProfile({ formData, setFormData }: SaveProfileDeps) {
  const handleSaveProfile = async (updated: PersonalDetails): Promise<void> => {
    const cleanMob = updated.mobileNumber ? updated.mobileNumber.replace(/\D/g, "").slice(-10) : "";
    const normalizedPersonal: PersonalDetails = {
      ...updated,
      mobileNumber: cleanMob || updated.mobileNumber,
    };

    const nextFormState: TdsCustomerIncomeFormData = {
      ...formData,
      personal: normalizedPersonal,
      bank: {
        ...formData.bank,
        accountHolderName: formData.bank.accountHolderName || normalizedPersonal.fullName,
      },
    };

    setFormData(nextFormState);

    const currentCust = useAuthStore.getState().customer;
    const currentAuthUser = useAuthStore.getState().authenticatedUser;
    const authUserTyped = currentAuthUser as { customerId?: string; custId?: string; passcode?: string } | null;

    const updatedCustomer: Customer = {
      name: normalizedPersonal.fullName,
      email: normalizedPersonal.email,
      mobile: cleanMob || normalizedPersonal.mobileNumber,
      pan: normalizedPersonal.pan,
      aadhaar: normalizedPersonal.aadhaar,
      dob: normalizedPersonal.dob,
      customerType: currentCust?.customerType || "Individual",
      addressLine1: normalizedPersonal.residentialAddress,
      addressLine2: currentCust?.addressLine2 || "",
      city: normalizedPersonal.city,
      state: normalizedPersonal.state,
      pincode: normalizedPersonal.pinCode,
      address: `${normalizedPersonal.residentialAddress}, ${normalizedPersonal.city}, ${normalizedPersonal.state} - ${normalizedPersonal.pinCode}`,
      customerId: currentCust?.customerId || authUserTyped?.customerId || authUserTyped?.custId || "",
      avatarUri: currentCust?.avatarUri || null,
      profileCompleted: true,
      hasPasscode: currentCust?.hasPasscode ?? Boolean(authUserTyped?.passcode),
    };

    useAuthStore.setState({ customer: updatedCustomer, profileCompleted: true });
    try {
      useCustomerStore.getState().setProfile(updatedCustomer);
    } catch {}

    try {
      const existingUser = authStorage.getUser() || {};
      authStorage.saveUser({
        ...existingUser,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        mobileNumber: updatedCustomer.mobile,
        pan: updatedCustomer.pan,
        aadhaar: updatedCustomer.aadhaar,
        dob: updatedCustomer.dob,
        address: `${updatedCustomer.addressLine1 || ""} ${updatedCustomer.addressLine2 || ""}`.trim(),
        addressLine1: updatedCustomer.addressLine1,
        addressLine2: updatedCustomer.addressLine2,
        city: updatedCustomer.city,
        state: updatedCustomer.state,
        pincode: updatedCustomer.pincode,
        customerType: updatedCustomer.customerType,
      } as Parameters<typeof authStorage.saveUser>[0]);

      if (cleanMob) {
        authStorage.saveSession({ ...authStorage.getSession(), isLoggedIn: true, activeMobile: cleanMob });
      }
    } catch {}

    try {
      const updateResult = await authApi.updateCustomerProfile({
        custId: updatedCustomer.customerId || undefined,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        mobileNumber: updatedCustomer.mobile,
        pan: updatedCustomer.pan,
        aadhaar: updatedCustomer.aadhaar,
        dob: updatedCustomer.dob,
        addressLine1: updatedCustomer.addressLine1,
        addressLine2: updatedCustomer.addressLine2,
        city: updatedCustomer.city,
        state: updatedCustomer.state,
        pincode: updatedCustomer.pincode,
        address: updatedCustomer.address,
      });

      if (!updateResult.success) {
        logger.warn("[useTdsSaveProfile] Customer profile update returned non-success from backend");
      }
    } catch (err: unknown) {
      logger.warn("[useTdsSaveProfile] Error sending customer update to backend", { error: err });
    }

    await tdsDraftService.saveFormDraft(nextFormState);
  };

  return { handleSaveProfile };
}
