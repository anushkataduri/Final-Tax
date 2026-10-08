import { StyleSheet } from "react-native";
import { BrandColors } from "../../../../design-system/colors";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.PRIMARY_BLUE_DARK,
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: BrandColors.PRIMARY_ORANGE,
    fontSize: 12,
    fontWeight: "700",
  },
  amountText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  subText: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 2,
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "500",
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 12,
  },
});
