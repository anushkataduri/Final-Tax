import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  TdsHeroCard,
  TdsBenefitsGrid,
  TdsDocumentsGrid,
  TdsInfoBanner,
} from "../../components";
import {
  styles,
  getContainerInsetsStyle,
  getScrollContentInsetsStyle,
  getBottomBarInsetsStyle,
} from "./TdsRefundEntryScreen.styles";

export const TdsRefundEntryScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [draftStep, setDraftStep] = React.useState<string | null>(null);

  React.useEffect(() => {
    import("../../services/tdsDraftService").then(({ tdsDraftService }) => {
      tdsDraftService.getDraftMetadata().then((meta) => {
        if (meta?.step) {
          setDraftStep(meta.step);
        }
      });
    });
  }, []);

  const handleStart = () => {
    if (draftStep === "DOCUMENTS") {
      router.push("/service/tds-checklist" as never);
    } else if (draftStep === "ESTIMATE") {
      router.push("/service/tds-estimate" as never);
    } else if (draftStep === "PAYMENT") {
      router.push("/service/tds-payment" as never);
    } else {
      router.push({
        pathname: "/service/tds-form" as never,
      });
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/service/itr" as never);
    }
  };

  const containerInsetsStyle = getContainerInsetsStyle(insets.top);
  const scrollContentInsetsStyle = getScrollContentInsetsStyle(insets.bottom);
  const bottomBarInsetsStyle = getBottomBarInsetsStyle(insets.bottom);

  return (
    <View style={[styles.container, containerInsetsStyle]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>TDS Refund</Text>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, scrollContentInsetsStyle]}
        showsVerticalScrollIndicator={false}
      >
        {/* Navy Hero Card */}
        <TdsHeroCard />

        {/* Why choose TaxEdge? 2x2 Grid */}
        <TdsBenefitsGrid />


        {/* Documents Required Chips */}
        <TdsDocumentsGrid />

        {/* Info Banner */}
        <TdsInfoBanner />
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, bottomBarInsetsStyle]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleStart}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>Start TDS Refund</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TdsRefundEntryScreen;
