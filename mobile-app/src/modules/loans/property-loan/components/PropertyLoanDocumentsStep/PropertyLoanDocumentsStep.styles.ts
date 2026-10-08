import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "../../../../../shared/theme";

export const getProgressFillDynamic = (progressPercent: number) => ({
  height: "100%" as const,
  width: `${progressPercent}%` as const,
  backgroundColor: progressPercent === 100 ? "#16A34A" : BrandColors.PRIMARY_ORANGE,
  borderRadius: 3,
});

export const getDocIconBoxDynamic = (iconBg?: string) => ({
  backgroundColor: iconBg || "#F1F5F9",
});

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: "#64748B",
    marginBottom: 14,
    lineHeight: 18,
  },
  progressContainer: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: "#1E293B",
  },
  progressCount: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "700",
    color: BrandColors.PRIMARY_ORANGE,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  categoryContainer: {
    marginBottom: 14,
  },
  categoryHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  categoryIconBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: "#FEF0E6",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  docCard: {
    backgroundColor: BrandColors.WHITE,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  docCardUploaded: {
    borderColor: "#86EFAC",
    backgroundColor: "#F0FDF4",
  },
  docLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  docInfo: {
    flex: 1,
  },
  docNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  docName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: "600",
    color: "#0F172A",
  },
  starText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#EF4444",
  },
  docSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  fileMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  fileNameText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#15803D",
    maxWidth: 130,
  },
  fileSizeText: {
    fontSize: 10,
    color: "#64748B",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF0E6",
    borderWidth: 1,
    borderColor: BrandColors.PRIMARY_ORANGE,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 3,
  },
  viewButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: BrandColors.PRIMARY_ORANGE,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 3,
  },
  deleteButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#DC2626",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: BrandColors.PRIMARY_ORANGE,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  uploadButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: "600",
    color: BrandColors.PRIMARY_ORANGE,
  },
});
