import { StyleSheet } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
  },
  readyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  readyCardDark: {
    backgroundColor: "#064E3B",
    borderColor: "#059669",
  },
  readyIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },
  readyTextCol: {
    flex: 1,
  },
  readyHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#166534",
  },
  readyHeadingDark: {
    color: "#86EFAC",
  },
  readySub: {
    fontSize: 12.5,
    color: "#15803D",
    marginTop: 2,
    lineHeight: 18,
  },
  readySubDark: {
    color: "#BBF7D0",
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLight: {
    backgroundColor: BrandColors.WHITE,
    borderColor: "#E2E8F0",
  },
  cardDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
  },
  cardTitleDark: {
    color: "#F8FAFC",
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "rgba(255, 122, 0, 0.1)",
  },
  editBtnText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: BrandColors.PRIMARY_ORANGE,
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 2,
  },
  dividerDark: {
    backgroundColor: "#334155",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 4,
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    flex: 1,
  },
  labelDark: {
    color: "#94A3B8",
  },
  value: {
    fontSize: 13.5,
    color: BrandColors.TEXT_PRIMARY,
    fontWeight: "600",
    textAlign: "right",
    flex: 1.2,
  },
  valueDark: {
    color: "#F8FAFC",
  },
  valueMultiline: {
    textAlign: "left",
    lineHeight: 18,
  },
  valueSuccess: {
    color: "#16A34A",
  },
  valueMissing: {
    color: "#EF4444",
  },

  // Document item row in review step
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  docRowDark: {
    borderBottomColor: "#334155",
  },
  docLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  docIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
  },
  docIconWrapEmpty: {
    backgroundColor: "#FEF2F2",
  },
  docTextCol: {
    flex: 1,
  },
  docTitleText: {
    fontSize: 13,
    fontWeight: "600",
    color: BrandColors.TEXT_PRIMARY,
  },
  docTitleTextDark: {
    color: "#F8FAFC",
  },
  docMetaText: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 1,
  },
  docMetaTextDark: {
    color: "#94A3B8",
  },
  docStatusMissing: {
    color: "#DC2626",
    fontWeight: "500",
  },

  docViewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  docViewBtnDark: {
    backgroundColor: "#1E3A8A",
    borderColor: "#2563EB",
  },
  docViewBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  docViewBtnTextDark: {
    color: "#93C5FD",
  },

  // Preview Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  previewCard: {
    width: "100%",
    backgroundColor: BrandColors.WHITE,
    borderRadius: 16,
    overflow: "hidden",
  },
  previewCardDark: {
    backgroundColor: "#1E293B",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  previewHeaderDark: {
    borderBottomColor: "#334155",
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.TEXT_PRIMARY,
    flex: 1,
    marginRight: 8,
  },
  previewTitleDark: {
    color: "#F8FAFC",
  },
  previewContent: {
    minHeight: 240,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  pdfFallbackBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 30,
  },
  pdfFallbackText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },
});
