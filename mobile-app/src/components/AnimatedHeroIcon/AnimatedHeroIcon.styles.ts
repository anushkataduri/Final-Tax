import { StyleSheet } from "react-native";
import type { IconName } from "@/types/domain";

export const CYCLE_ICONS: IconName[] = [
  "receipt",
  "calculator",
  "wallet",
  "shield-checkmark",
  "business",
];

export const SWAP_INTERVAL = 2200;
export const FADE_OUT = 240;
export const FADE_IN = 280;

export const styles = StyleSheet.create({
  wrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  halo: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
});
