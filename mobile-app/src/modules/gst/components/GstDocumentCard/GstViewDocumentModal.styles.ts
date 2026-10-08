import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "@/shared/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  previewBox: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  placeholderBox: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  placeholderText: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: "600",
    color: "#475569",
  },
  metaContainer: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  fileNameText: {
    fontSize: Typography.fontSize.sm + 0.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  fileMetaText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: "500",
    color: "#64748B",
  },
  doneButton: {
    height: 46,
    borderRadius: 23,
    backgroundColor: BrandColors.PRIMARY_BLUE,
    justifyContent: "center",
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
