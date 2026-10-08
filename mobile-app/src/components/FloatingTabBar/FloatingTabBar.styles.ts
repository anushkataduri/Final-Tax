import { StyleSheet } from "react-native";
import type { IconName } from "@/types/domain";

export const FLOATING_TAB_HEIGHT = 60;
export const FLOATING_TAB_GAP = 12;

export const BAR_BG = "#1E3A5F"; // Royal Navy Blue capsule background
export const ACTIVE_PILL_BG = "#FFFFFF"; // Clean white active pill
export const ACTIVE_ICON_COLOR = "#FF5722"; // Vibrant Orange icon when clicked/active
export const INACTIVE_ICON_COLOR = "#FFFFFF"; // Crisp white icon on blue background

export const HIDDEN_FROM_BAR = new Set(["gst", "documents"]);

export interface TabMeta {
  label: string;
  icon: IconName;
  iconOutline: IconName;
}

export const FALLBACK_META: TabMeta = {
  label: "Tab",
  icon: "ellipse",
  iconOutline: "ellipse-outline",
};

export const TAB_META: Record<string, TabMeta> = {
  home: { label: "Home", icon: "home", iconOutline: "home-outline" },
  applications: {
    label: "Applications",
    icon: "grid",
    iconOutline: "grid-outline",
  },
  documents: {
    label: "Documents",
    icon: "document-text",
    iconOutline: "document-text-outline",
  },
  payments: { label: "Payments", icon: "card", iconOutline: "card-outline" },
  profile: { label: "Profile", icon: "person", iconOutline: "person-outline" },
};

export function metaFor(routeName: string): TabMeta {
  return (
    TAB_META[routeName] ??
    TAB_META[routeName.replace(/\/index$/, "")] ??
    TAB_META[routeName.split("/")[0]] ??
    FALLBACK_META
  );
}

export const SPRING = { damping: 18, stiffness: 200, mass: 0.6 };

export const styles = StyleSheet.create({
  floatingWrapper: {
    position: "absolute",
    left: 12,
    right: 12,
    zIndex: 100,
    elevation: 20,
    alignItems: "center",
  },
  capsuleContainer: {
    width: "100%",
    height: FLOATING_TAB_HEIGHT,
    backgroundColor: BAR_BG,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingVertical: 4,
    shadowColor: "#0A192F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 14,
  },
  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    backgroundColor: ACTIVE_PILL_BG,
    width: "92%",
    maxWidth: 62,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  inactivePill: {
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
