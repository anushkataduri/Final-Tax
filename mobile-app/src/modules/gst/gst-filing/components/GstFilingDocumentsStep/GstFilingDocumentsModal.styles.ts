import { Dimensions, StyleSheet } from "react-native";
import { BrandColors } from "@/shared/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const modalStyles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    maxHeight: SCREEN_HEIGHT * 0.82,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  modalHeaderInfo: {
    flex: 1,
    marginRight: 12,
  },

  modalDocTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
  },

  modalDocMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  modalImageContainer: {
    height: 340,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },

  modalImage: {
    width: "100%",
    height: "100%",
  },

  modalPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  modalPlaceholderText: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 8,
  },

  modalFooter: {
    flexDirection: "row",
    padding: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  modalReplaceBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EAF1FE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  modalReplaceText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: BrandColors.PRIMARY_BLUE,
  },

  modalDoneBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },

  modalDoneText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
