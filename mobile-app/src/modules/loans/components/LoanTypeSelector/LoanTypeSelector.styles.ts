import { StyleSheet } from "react-native";
import { BrandColors } from "../../../../design-system/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BrandColors.BORDER,
    backgroundColor: BrandColors.CARD,
  },
  chipSelected: {
    borderColor: BrandColors.PRIMARY_ORANGE,
    backgroundColor: BrandColors.PRIMARY_LIGHT_ORANGE,
  },
  chipText: {
    fontSize: 14,
    color: BrandColors.TEXT_PRIMARY,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: BrandColors.PRIMARY_ORANGE,
    fontWeight: "700",
  },
});
