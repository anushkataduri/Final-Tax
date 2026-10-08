import { StyleSheet } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeBtn: {
    padding: 4,
  },
  pickerWrapper: {
    marginBottom: 20,
    alignItems: "center",
  },
  confirmBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
