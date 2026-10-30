import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/authStore";
import { useApplicationStore } from "@/store/applicationStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useServiceAccessGuard } from "@/shared/hooks/useServiceAccessGuard";
import { SCREEN_BOTTOM_PADDING } from "@/shared/components/ScreenLayout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Spacing } from "@/shared/theme";
import { styles } from "@/styles/app/(main)/home.styles";
import type { DashboardServiceTile } from "@/types/home.types";

// ── Extracted sub-components ──────────────────────────────────────────────────
import { HomeHeader } from "@/components/screens/home/HomeHeader";
import { ApplyBannerCarousel, type ApplyBanner } from "@/components/screens/home/ApplyBannerCarousel";
import { ServicesGrid } from "@/components/screens/home/ServicesGrid";
import { StatsGrid, type StatTile } from "@/components/screens/home/StatsGrid";
import { DraftBanner } from "@/components/screens/home/DraftBanner";
import { RecentApplicationCard } from "@/components/screens/home/RecentApplicationCard";
import { HomeProfileSetupCard } from "@/components/screens/home/HomeProfileSetupCard";

// ── Types ─────────────────────────────────────────────────────────────────────

export type { DashboardServiceTile };

// ── Constants ─────────────────────────────────────────────────────────────────

const SERVICE_3D_IMAGES = {
  incorporation: require("../../../assets/images/services_3d/incorporation.png"),
  gst: require("../../../assets/images/services_3d/gst.png"),
  itr: require("../../../assets/images/services_3d/itr.png"),
  projects: require("../../../assets/images/services_3d/projects.png"),
  loans: require("../../../assets/images/services_3d/loans.png"),
  insurance: require("../../../assets/images/services_3d/insurance.png"),
  business: require("../../../assets/images/services_3d/business.png"),
};

export const DASHBOARD_SERVICES: DashboardServiceTile[] = [
  { id: "incorporation", label: "Incorporation", image: SERVICE_3D_IMAGES.incorporation, route: "/service/company-registration", description: "Company\nregistration", bgColor: "#FFF8F1", borderColor: "#FED7AA", arrowColor: "#EA580C" },
  { id: "gst", label: "GST", image: SERVICE_3D_IMAGES.gst, route: "/service/gst", description: "Registration,\nfiling & compliance", bgColor: "#F0F7FF", borderColor: "#BFDBFE", arrowColor: "#2563EB" },
  { id: "itr", label: "ITR", image: SERVICE_3D_IMAGES.itr, route: "/service/itr", description: "Income Tax\nFiling", bgColor: "#F5F3FF", borderColor: "#DDD6FE", arrowColor: "#7C3AED" },
  { id: "projects", label: "Projects", image: SERVICE_3D_IMAGES.projects, route: { pathname: "/service/loans", params: { category: "project-finance" } }, description: "Project\nManagement", bgColor: "#F0FDF4", borderColor: "#BBF7D0", arrowColor: "#059669" },
  { id: "loans", label: "Loans", image: SERVICE_3D_IMAGES.loans, route: "/service/loans", description: "Personal, Home\n& Business Loans", bgColor: "#FFFBEB", borderColor: "#FDE68A", arrowColor: "#D97706" },
  { id: "insurance", label: "Insurance", image: SERVICE_3D_IMAGES.insurance, route: "/service/health-insurance", description: "Coverage\nfor your future", bgColor: "#F0F9FF", borderColor: "#BAE6FD", arrowColor: "#0284C7" },
  { id: "business", label: "Business", image: SERVICE_3D_IMAGES.business, route: "/service/accounting-bookkeeping", description: "Business Solutions & Support", bgColor: "#F5F3FF", borderColor: "#DDD6FE", arrowColor: "#7C3AED", isFullWidth: true },
];

const BANNER_NAVY = "#083B75";
const BANNER_NAVY_DEEP = "#052750";

export const APPLY_BANNERS: ApplyBanner[] = (
  [
    { key: "b-gst", id: "GST", route: "/service/gst", title: "GST", desc: "Registration, filing & compliance", cta: "Apply Now", icon: "receipt" },
    { key: "b-itr", id: "ITR", route: "/service/itr", title: "ITR & TDS", desc: "File returns, claim your refund", cta: "File Now", icon: "calculator" },
    { key: "b-loans", id: "LOANS", route: "/service/loans", title: "LOANS", desc: "Explore our loan solutions", cta: "Explore", icon: "wallet" },
    { key: "b-ins", id: "INSURANCE", route: "/service/health-insurance", title: "INSURANCE", desc: "Health & life cover plans", cta: "Get Quote", icon: "shield-checkmark" },
    { key: "b-company", id: "BUSINESS", route: "/service/company-registration", title: "COMPANY SETUP", desc: "Incorporation & registrations", cta: "Start Now", icon: "business" },
    { key: "b-acct", id: "BUSINESS", route: "/service/accounting-bookkeeping", title: "ACCOUNTING", desc: "Bookkeeping & monthly reports", cta: "Know More", icon: "stats-chart" },
  ] as const
).map((banner, i) => ({ ...banner, bg: i % 2 === 0 ? BANNER_NAVY : BANNER_NAVY_DEEP }));

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusTone = (status: string) => {
  if (status === "Completed") return { fg: "#047857", bg: "#E6F5F0" };
  if (status === "Rejected") return { fg: "#B91C1C", bg: "#FDEBEB" };
  if (status === "Verification") return { fg: "#6D28D9", bg: "#F1ECFE" };
  return { fg: "#1D4ED8", bg: "#EAF1FE" };
};

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const colors = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { accessService } = useServiceAccessGuard();

  const customer = useAuthStore((s) => s.customer);
  const applications = useApplicationStore((s) => s.applications);
  const gstDraft = useApplicationStore((s) => s.gstDraft);
  const gstFilingDraft = useApplicationStore((s) => s.gstFilingDraft);
  const itrDraft = useApplicationStore((s) => s.itrDraft);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  useFocusEffect(
    useCallback(() => {
      useApplicationStore.getState().loadApplications();

      const onBackPress = () => {
        Alert.alert(
          "Exit TaxEdge",
          "Are you sure you want to exit the application?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Exit",
              style: "destructive",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  // ── Derived values ──────────────────────────────────────────────────────────

  const hasRealName = Boolean(
    customer?.name &&
    customer.name.trim() !== "" &&
    customer.name.toLowerCase() !== "valued client" &&
    customer.name.toLowerCase() !== "valued" &&
    customer.name.toLowerCase() !== "priya" &&
    customer.profileCompleted
  );

  const greetingTitle = hasRealName
    ? `Hello, ${customer!.name.trim().split(" ")[0]} 👋`
    : "Welcome to TaxEdge 👋";

  const activeCount = (applications || []).filter((a) => a?.status !== "Completed").length;
  const pendingDocsCount = (applications || []).reduce(
    (sum, a) => sum + ((a?.documents || []).filter((d) => d?.status === "Pending").length), 0
  );
  const completedCount = (applications || []).filter((a) => a?.status === "Completed").length;
  const paymentDue = (applications || [])
    .filter((a) => a?.paymentStatus === "Pending")
    .reduce((sum, a) => sum + (a?.paymentAmount || 0), 0);

  const recentApps = applications.slice(0, 3);

  const STATS: StatTile[] = [
    { id: "active", label: "Active\nApplications", value: `${activeCount}`, tint: "#059669", tintBg: "#E6F5F0", icon: "folder", route: "/(main)/applications" },
    { id: "docs", label: "Pending\nDocuments", value: `${pendingDocsCount}`, tint: "#EA580C", tintBg: "#FEF0E6", icon: "document-attach", route: "/(main)/applications" },
    { id: "due", label: "Payment Due", value: `₹${paymentDue.toLocaleString("en-IN")}`, tint: "#DC2626", tintBg: "#FDEBEB", icon: "card", route: "/(main)/payments" },
    { id: "done", label: "Completed\nServices", value: `${completedCount}`, tint: "#2563EB", tintBg: "#EAF1FE", icon: "checkbox", route: "/(main)/applications" },
  ];

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleBannerSelect = (banner: ApplyBanner) => {
    accessService(banner.route);
  };

  const openTile = (tile: DashboardServiceTile) => {
    // accessService applies the one profile rule (shared/guards/serviceAccess) for every tile.
    if (tile.route) accessService(tile.route);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FocusAwareStatusBar barStyle="light-content" />

      {/* Blue hero header */}
      <HomeHeader
        greetingTitle={greetingTitle}
        unreadCount={unreadCount}
        colors={colors}
        topInset={insets.top + Spacing.sm}
        onNotificationsPress={() => router.push("/notifications")}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: SCREEN_BOTTOM_PADDING }]}
        showsVerticalScrollIndicator={false}
      >
        {!customer?.profileCompleted && (
          <HomeProfileSetupCard
            onComplete={() => router.push("/(auth)/createprofile")}
            completionPercentage={60}
          />
        )}

        {/* Apply-for banner carousel */}
        <ApplyBannerCarousel
          banners={APPLY_BANNERS}
          colors={colors}
          onSelect={handleBannerSelect}
        />

        {/* Services section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Services</Text>
        </View>
        <ServicesGrid
          services={DASHBOARD_SERVICES}
          isDark={isDark}
          colors={colors}
          onPress={openTile}
        />

        {/* Financial overview section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Financial Overview</Text>
          <TouchableOpacity
            onPress={() => router.push("/(main)/applications")}
            hitSlop={8}
            style={styles.linkRow}
            accessibilityRole="button"
            accessibilityLabel="View All Applications"
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <StatsGrid stats={STATS} isDark={isDark} colors={colors} />

        {/* In-progress draft banners */}
        {gstDraft && (
          <DraftBanner
            updatedAt={gstDraft.updatedAt}
            stepIndex={gstDraft.stepIndex || 0}
            totalSteps="4"
            accentColor={colors.orange}
            lightBg="#FEF0E6"
            lightBorder="#FFD8BF"
            tagLabel="INCOMPLETE APPLICATION"
            title="GST Registration"
            subtitle="Pick up right where you left off"
            resumeLabel="Resume Application"
            isDark={isDark}
            colors={colors}
            onPress={() => accessService("/service/gst-registration")}
          />
        )}
        {gstFilingDraft && (
          <DraftBanner
            updatedAt={gstFilingDraft.updatedAt}
            stepIndex={gstFilingDraft.stepIndex || 0}
            totalSteps="4"
            accentColor={colors.primary}
            lightBg="#EAF1FE"
            lightBorder="#BFDBFE"
            tagLabel="INCOMPLETE FILING"
            title={`GST Return Filing (${gstFilingDraft.periodData?.filingMonth || "Current Period"})`}
            subtitle="Continue your return filing"
            resumeLabel="Resume Filing"
            isDark={isDark}
            colors={colors}
            onPress={() => accessService("/service/gst-filing")}
          />
        )}
        {itrDraft && (
          <DraftBanner
            updatedAt={itrDraft.updatedAt}
            stepIndex={itrDraft.stepIndex || 0}
            totalSteps="5"
            accentColor={colors.orange}
            lightBg="#FEF0E6"
            lightBorder="#FFD8BF"
            tagLabel="INCOMPLETE APPLICATION"
            title={`ITR Filing - ${itrDraft.categoryTitle || "Income Tax Return"}`}
            subtitle="Pick up right where you left off"
            resumeLabel="Resume Application"
            isDark={isDark}
            colors={colors}
            onPress={() => accessService("/service/itr-filing")}
          />
        )}

        {/* Recent applications */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Applications</Text>
          <TouchableOpacity onPress={() => router.push("/(main)/applications")} hitSlop={8} style={styles.linkRow}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {recentApps.length === 0 ? (
          <View style={[styles.card, styles.cardPadded, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No applications yet. Start a service to see it here.
            </Text>
          </View>
        ) : (
          recentApps.map((app) => (
            <RecentApplicationCard
              key={app.id}
              app={app}
              isDark={isDark}
              colors={colors}
              statusTone={statusTone}
            />
          ))
        )}

        {/* Need help */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/chat/support")}
          style={styles.helpCard}
        >
          <View style={styles.helpIcon}>
            <Ionicons name="chatbubble-ellipses" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.helpText}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpDesc}>Our experts are available 24/7</Text>
          </View>
          <View style={styles.helpBtn}>
            <Text style={styles.helpBtnText}>Chat</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
