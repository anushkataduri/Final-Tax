import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { useApplicationStore } from "@/store/applicationStore";
import { ScreenLayout, SCREEN_BOTTOM_PADDING } from "@/shared/components/ScreenLayout";
import { getProfileScrollStyle } from "./ProfileScreen.styles";
import { useProfileManager } from "@/components/screens/profile/useProfileManager";
import { PersonalDetailsModal } from "@/components/screens/profile/PersonalDetailsModal";
import { KycDetailsModal } from "@/components/screens/profile/KycDetailsModal";
import { ProfileSectionModal, type ProfileModalType } from "@/components/screens/profile/ProfileSectionModal";
import { useAuthStore } from "@/store/authStore";
import { isPlaceholderCustomerName } from "@/modules/authentication/store/authStore.helpers";
import { ProfileHeroSection } from "./ProfileHeroSection";
import { ProfileStatsCard } from "./ProfileStatsCard";
import { ProfileIncompleteBanner } from "./ProfileIncompleteBanner";
import { ProfileMenuList, type MenuRow, type MenuSection, type RowAction } from "./ProfileMenuList";

const SECTIONS: MenuSection[] = [
  {
    title: "Account",
    rows: [
      { label: "Personal Information", icon: "person", tint: "#6D28D9", tintBg: "#F1ECFE", action: { kind: "modal", modal: "personal" } },
      { label: "KYC Details", icon: "card", tint: "#2563EB", tintBg: "#EAF1FE", action: { kind: "modal", modal: "kyc" } },
      { label: "GST Details", icon: "receipt", tint: "#7C3AED", tintBg: "#F1ECFE", action: { kind: "modal", modal: "gst" } },
      { label: "ITR History", icon: "reader", tint: "#EA580C", tintBg: "#FEF0E6", action: { kind: "modal", modal: "itr" } },
      { label: "Loan History", icon: "business", tint: "#475569", tintBg: "#EEF2F6", action: { kind: "modal", modal: "loans" } },
    ],
  },
  {
    title: "Services",
    rows: [
      { label: "My Applications", icon: "folder", tint: "#D97706", tintBg: "#FDF2E3", action: { kind: "route", href: "/(main)/applications" } },
      { label: "Payments & Invoices", icon: "card", tint: "#0891B2", tintBg: "#E5F5F9", action: { kind: "route", href: "/(main)/payments" } },
      { label: "Notifications", icon: "notifications", tint: "#EA580C", tintBg: "#FEF0E6", action: { kind: "route", href: "/notifications" } },
    ],
  },
  {
    title: "Preferences",
    rows: [
      { label: "Appearance & Settings", icon: "color-palette", tint: "#FF7A00", tintBg: "#FEF0E6", action: { kind: "route", href: "/settings" } },
    ],
  },
  {
    title: "Security",
    rows: [
      { label: "Change Password", icon: "lock-closed", tint: "#DC2626", tintBg: "#FDEBEB", action: { kind: "soon" } },
      { label: "Two-Factor Authentication", icon: "keypad", tint: "#6D28D9", tintBg: "#F1ECFE", action: { kind: "soon" } },
      { label: "Login History", icon: "time", tint: "#475569", tintBg: "#EEF2F6", action: { kind: "soon" } },
      { label: "Privacy Settings", icon: "shield-half", tint: "#D97706", tintBg: "#FDF2E3", action: { kind: "soon" } },
    ],
  },
  {
    title: "Support",
    rows: [
      { label: "Customer Support", icon: "chatbubbles", tint: "#2563EB", tintBg: "#EAF1FE", action: { kind: "route", href: "/chat/support" } },
      { label: "Rate TaxEdge", icon: "star", tint: "#D97706", tintBg: "#FDF2E3", action: { kind: "soon" } },
      { label: "Terms & Conditions", icon: "document-text", tint: "#475569", tintBg: "#EEF2F6", action: { kind: "soon" } },
      { label: "Privacy Policy", icon: "shield-checkmark", tint: "#0891B2", tintBg: "#E5F5F9", action: { kind: "soon" } },
    ],
  },
];

const compactRupees = (value: number): string =>
  value >= 100000
    ? `₹${(value / 100000).toFixed(1)}L`
    : value >= 1000
      ? `₹${(value / 1000) % 1 === 0 ? value / 1000 : (value / 1000).toFixed(1)}K`
      : `₹${value}`;

export function ProfileScreen() {
  const colors = useTheme();
  const router = useRouter();
  const applications = useApplicationStore((state) => state.applications);

  const {
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
  } = useProfileManager();

  const profileCompleted = useAuthStore((state) => state.profileCompleted);
  const isProfileComplete = Boolean(
    profileCompleted &&
    customer?.profileCompleted !== false &&
    customer?.name &&
    !isPlaceholderCustomerName(customer.name)
  );

  const [activeProfileModal, setActiveProfileModal] = useState<ProfileModalType | null>(null);

  const activeCount = applications.filter((app) => app.status !== "Completed").length;
  const completedCount = applications.filter((app) => app.status === "Completed").length;
  const totalPaid = applications
    .filter((app) => app.paymentStatus === "Paid")
    .reduce((sum, app) => sum + app.paymentAmount, 0);

  const activePan = isProfileComplete ? ((personalDetails?.pan as string | undefined) || customer?.pan) : undefined;
  const activeAadhaar = isProfileComplete ? ((personalDetails?.aadhaar as string | undefined) || customer?.aadhaar) : undefined;
  const allDocuments = applications.flatMap((app) => app.documents);
  const hasUploaded = (keyword: string) =>
    allDocuments.some((doc) => doc.name.toLowerCase().includes(keyword) && doc.status === "Uploaded");
  const kycVerified =
    (hasUploaded("pan") && hasUploaded("aadhaar")) || Boolean(activePan && activeAadhaar);

  const statItems = [
    { value: `${activeCount}`, label: "Active Apps", color: colors.primary },
    { value: `${completedCount}`, label: "Completed", color: colors.success },
    { value: compactRupees(totalPaid), label: "Total Paid", color: colors.orange },
  ];

  const runAction = (row: MenuRow) => {
    const act: RowAction = row.action;
    if (act.kind === "route") {
      router.push(act.href);
    } else if (act.kind === "modal") {
      if (act.modal === "kyc") {
        setShowKycModal(true);
      } else if (act.modal === "personal") {
        setShowPersonalModal(true);
        fetchPersonalDetails();
      } else {
        setActiveProfileModal(act.modal as ProfileModalType);
      }
    } else {
      Alert.alert(row.label, "This section isn't available yet.");
    }
  };

  return (
    <ScreenLayout title="My Profile">
      <ScrollView
        contentContainerStyle={getProfileScrollStyle(SCREEN_BOTTOM_PADDING)}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeroSection
          colors={colors}
          customer={customer}
          pickingPhoto={pickingPhoto}
          isProfileComplete={isProfileComplete}
          personalDetails={personalDetails}
          kycVerified={kycVerified}
          onChangePhoto={handleChangePhoto}
        />
        <ProfileStatsCard colors={colors} statItems={statItems} />
        {!isProfileComplete && (
          <ProfileIncompleteBanner
            colors={colors}
            onCompleteProfile={() => router.push("/(auth)/createprofile")}
          />
        )}
        <ProfileMenuList
          colors={colors}
          sections={SECTIONS}
          onRunAction={runAction}
          onLogout={handleLogout}
        />
      </ScrollView>

      <PersonalDetailsModal
        visible={showPersonalModal}
        onClose={closePersonalModal}
        colors={colors}
        fetchingPersonal={fetchingPersonal}
        isEditingPersonal={isEditingPersonal}
        setIsEditingPersonal={setIsEditingPersonal}
        savingPersonal={savingPersonal}
        personalDetails={personalDetails}
        customer={customer}
        personalForm={personalForm}
        personalErrors={personalErrors}
        updatePersonalField={updatePersonalField}
        handleSavePersonal={handleSavePersonal}
        onCancelEdit={() => { setIsEditingPersonal(false); setPersonalErrors({}); }}
        isProfileComplete={isProfileComplete}
        onCompleteProfile={() => { closePersonalModal(); router.push("/(auth)/createprofile"); }}
      />

      <KycDetailsModal
        visible={showKycModal}
        onClose={() => setShowKycModal(false)}
        colors={colors}
        activePan={activePan}
        activeAadhaar={activeAadhaar}
        kycVerified={kycVerified}
        isProfileComplete={isProfileComplete}
        onCompleteProfile={() => { setShowKycModal(false); router.push("/(auth)/createprofile"); }}
      />

      <ProfileSectionModal
        visible={Boolean(activeProfileModal)}
        onClose={() => setActiveProfileModal(null)}
        colors={colors}
        modalType={activeProfileModal}
        applications={applications}
      />
    </ScreenLayout>
  );
}

export default ProfileScreen;
