import { useState, useEffect, useCallback } from "react";
import { Alert, type AlertButton } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/modules/authentication/services/authApi";
import { logger } from "@/core/logging/logger";
import {
  validatePersonalForm,
  buildPersonalUpdatePayload,
  type PersonalFormState,
} from "./profileManager.helpers";

export type { PersonalFormState };

export function useProfileManager() {
  const router = useRouter();
  const { customer, logout, setAvatar, fetchAndSyncProfile } = useAuthStore();

  const [pickingPhoto, setPickingPhoto] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [fetchingPersonal, setFetchingPersonal] = useState(false);
  const [personalDetails, setPersonalDetails] = useState<Record<string, unknown> | null>(null);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [personalErrors, setPersonalErrors] = useState<Record<string, string>>({});
  const [personalForm, setPersonalForm] = useState<PersonalFormState>({
    name: "",
    email: "",
    dob: "",
    address: "",
  });

  const fetchPersonalDetails = useCallback(async () => {
    const custId = customer?.customerId;
    if (!custId) return;
    setFetchingPersonal(true);
    try {
      const res = await authApi.getCustomerDetails(custId);
      if (res.success && res.data) {
        setPersonalDetails(res.data as unknown as Record<string, unknown>);
        setPersonalForm({
          name: res.data.name || customer?.name || "",
          email: res.data.email || customer?.email || "",
          dob: res.data.dob || customer?.dob || "",
          address: res.data.address || customer?.address || "",
        });
      } else {
        logger.warn("[useProfileManager] Failed to fetch personal details", {
          message: "message" in res ? res.message : undefined,
        });
      }
    } catch (err) {
      logger.error("[useProfileManager] Error fetching personal details:", { error: err });
    } finally {
      setFetchingPersonal(false);
    }
  }, [customer]);

  const updatePersonalField = (field: keyof PersonalFormState, value: string) => {
    setPersonalForm((current) => ({ ...current, [field]: value }));
    if (personalErrors[field]) {
      setPersonalErrors((current) => ({ ...current, [field]: "" }));
    }
  };

  const handleSavePersonal = async () => {
    const errors = validatePersonalForm(personalForm);

    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      setPersonalErrors(errors);
      return;
    }
    setSavingPersonal(true);
    setPersonalErrors({});
    try {
      const payload = buildPersonalUpdatePayload(personalDetails, customer, personalForm);
      const result = await authApi.updateCustomerProfile(payload);
      if (result.success) {
        await fetchAndSyncProfile(customer?.mobile);
        await fetchPersonalDetails();
        setIsEditingPersonal(false);
        Alert.alert("Profile updated", "Your personal information was updated successfully.");
      } else {
        setPersonalErrors({
          form: "Unable to update personal information. Please try again.",
        });
      }
    } catch (err) {
      logger.warn("[useProfileManager] Failed to update personal profile:", { error: err });
      setPersonalErrors({
        form: "Unable to update personal information. Please try again.",
      });
    } finally {
      setSavingPersonal(false);
    }
  };

  const closePersonalModal = () => {
    if (!savingPersonal) {
      setIsEditingPersonal(false);
      setPersonalErrors({});
      setShowPersonalModal(false);
    }
  };

  useEffect(() => {
    const custId = customer?.customerId;
    const timer = custId
      ? setTimeout(() => {
          void fetchPersonalDetails();
        }, 0)
      : undefined;
    return () => {
      timer && clearTimeout(timer);
    };
  }, [customer?.customerId, fetchPersonalDetails]);

  /* Profile Photo Actions */
  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow photo access to choose a profile picture.");
      return;
    }
    setPickingPhoto(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatar(result.assets[0].uri);
      }
    } finally {
      setPickingPhoto(false);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow camera access to take a photo.");
      return;
    }
    setPickingPhoto(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatar(result.assets[0].uri);
      }
    } finally {
      setPickingPhoto(false);
    }
  };

  const handleChangePhoto = () => {
    const baseOptions: AlertButton[] = [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Gallery", onPress: pickFromLibrary },
    ];
    const removeOption: AlertButton[] = customer?.avatarUri
      ? [
          {
            text: "Remove Photo",
            style: "destructive",
            onPress: () => setAvatar(null),
          },
        ]
      : [];
    const cancelOption: AlertButton = { text: "Cancel", style: "cancel" };
    const options = [...baseOptions, ...removeOption, cancelOption];

    Alert.alert("Profile Photo", "Choose a picture for your profile", options);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out of TaxEdge?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return {
    customer,
    pickingPhoto,
    showKycModal,
    setShowKycModal,
    showPersonalModal,
    setShowPersonalModal,
    fetchingPersonal,
    personalDetails,
    isEditingPersonal,
    setIsEditingPersonal,
    savingPersonal,
    personalErrors,
    setPersonalErrors,
    personalForm,
    fetchPersonalDetails,
    updatePersonalField,
    handleSavePersonal,
    closePersonalModal,
    handleChangePhoto,
    handleLogout,
  };
}
