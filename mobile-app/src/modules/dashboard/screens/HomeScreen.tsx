import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../../hooks/use-theme";
import { useColorScheme } from "../../../hooks/use-color-scheme";
import { useAuthStore } from "../../authentication/store/authStore";
import { useApplicationStore } from "../../../store/applicationStore";
import { useNotificationStore } from "../../../store/notificationStore";
import { SERVICE_CATALOGUE } from "../../../data/catalogue";
import { SCREEN_BOTTOM_PADDING } from "../../../shared/components/ScreenLayout/ScreenLayout";
import { Maybe } from "../../../shared/utils/functional";
import { useServiceAccessGuard } from "../../../shared/hooks";
import { CARD_WIDTH } from "../constants/home-screen.constants";
import { HeroHeader, QuickServicesSection } from "../components/HomeScreenTopSections";
import { HomeScreenBannerCarousel } from "../components/HomeScreenBannerCarousel";
import {
  FinancialOverviewSection,
  RecentApplicationsSection,
  HelpSection,
} from "../components/HomeScreenBottomSections";
import { HomeScreenExploreModal } from "../components/HomeScreenExploreModal";
import { styles } from "../styles/home.styles";
import type { CatalogueItem, ServiceCategoryId } from "../../../shared/types/domain";
import type { ServiceTile, StatTile } from "../types/dashboard.types";

const DEFAULT_NAMES = new Set(["valued", "valued client", "client", "priya"]);

export function HomeScreen() {
  const colors = useTheme();
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { accessService } = useServiceAccessGuard();

  const [bannerPage, setBannerPage] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreQuery, setMoreQuery] = useState("");
  const bannerRef = useRef<ScrollView>(null);
  const bannerPageRef = useRef(0);

  const customer = useAuthStore((state) => state.customer);
  const applications = useApplicationStore((state) => state.applications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const rawName = Maybe.of(customer).map((c) => c.name?.trim()).getOrElse("");
  const hasRealName = Boolean(rawName) && !DEFAULT_NAMES.has(rawName.toLowerCase());
  const greetingText = hasRealName
    ? `Hello, ${rawName.split(" ")[0]} 👋`
    : "Welcome to TaxEdge 👋";

  const activeCount = applications.filter((a) => a.status !== "Completed").length;
  const pendingDocsCount = applications.reduce(
    (sum, a) => sum + a.documents.filter((d) => d.status === "Pending").length,
    0,
  );
  const completedCount = applications.filter((a) => a.status === "Completed").length;
  const paymentDue = applications
    .filter((a) => a.paymentStatus === "Pending")
    .reduce((sum, a) => sum + a.paymentAmount, 0);

  const STATS: StatTile[] = [
    { id: "active", label: "Active\nApplications", value: `${activeCount}`, tint: "#059669", tintBg: "#E6F5F0", icon: "folder", route: "/(main)/applications" },
    { id: "docs", label: "Pending\nDocuments", value: `${pendingDocsCount}`, tint: "#EA580C", tintBg: "#FEF0E6", icon: "document-attach", route: "/(main)/applications" },
    { id: "due", label: "Payment Due", value: `₹${paymentDue.toLocaleString("en-IN")}`, tint: "#DC2626", tintBg: "#FDEBEB", icon: "card", route: "/(main)/payments" },
    { id: "done", label: "Completed\nServices", value: `${completedCount}`, tint: "#2563EB", tintBg: "#EAF1FE", icon: "checkbox", route: "/(main)/applications" },
  ];

  const catalogueQuery = moreQuery.trim().toLowerCase();
  const filteredCatalogue = SERVICE_CATALOGUE
    .map((group) => ({
      ...group,
      items: catalogueQuery
        ? group.items.filter((item) => item.label.toLowerCase().includes(catalogueQuery))
        : group.items,
    }))
    .filter((group) => group.items.length > 0);

  const handleExploreCategory = (categoryId: ServiceCategoryId) => {
    router.push({ pathname: "/services", params: { selectedCategory: categoryId } });
  };

  const openCatalogueItem = (item: CatalogueItem, categoryId: ServiceCategoryId) => {
    setMoreOpen(false);
    if (item.serviceId) {
      accessService(`/service/${item.serviceId}`);
    } else {
      router.push({ pathname: "/services", params: { selectedCategory: categoryId } });
    }
  };

  const openTile = (tile: ServiceTile) => {
    if (tile.isMore) {
      setMoreQuery("");
      setMoreOpen(true);
      return;
    }
    setMoreOpen(false);
    if (tile.route) accessService(tile.route);
  };

  const onBannerScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    bannerPageRef.current = page;
    setBannerPage(page);
  };

  const handleSelectApplication = (appId: string) => {
    useApplicationStore.getState().setSelectedApplicationId(appId);
    router.push({ pathname: "/application/[id]", params: { id: appId } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <HeroHeader
        insets={insets}
        colors={colors}
        unreadCount={unreadCount}
        greetingText={greetingText}
        onOpenNotifications={() => router.push("/notifications")}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: SCREEN_BOTTOM_PADDING }]}
        showsVerticalScrollIndicator={false}
      >
        <HomeScreenBannerCarousel
          bannerRef={bannerRef}
          onBannerScroll={onBannerScroll}
          handleExploreCategory={handleExploreCategory}
          bannerPage={bannerPage}
          colors={colors}
        />

        <QuickServicesSection
          colors={colors}
          isDark={isDark}
          openTile={openTile}
          onOpenAllServices={() => { setMoreQuery(""); setMoreOpen(true); }}
        />

        <FinancialOverviewSection
          colors={colors}
          isDark={isDark}
          stats={STATS}
          deadlines={[]}
          onNavigate={(route) => router.push(route)}
        />

        <RecentApplicationsSection
          colors={colors}
          isDark={isDark}
          recentApps={applications.slice(0, 3)}
          onViewAll={() => router.push("/(main)/applications")}
          onSelectApplication={handleSelectApplication}
        />

        <HelpSection onChatSupport={() => router.push("/chat/support")} />
      </ScrollView>

      <HomeScreenExploreModal
        visible={moreOpen}
        onClose={() => setMoreOpen(false)}
        moreQuery={moreQuery}
        setMoreQuery={setMoreQuery}
        filteredCatalogue={filteredCatalogue}
        openCatalogueItem={openCatalogueItem}
        isDark={isDark}
        colors={colors}
        insets={insets}
      />
    </View>
  );
}

export default HomeScreen;
