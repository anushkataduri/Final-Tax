import { StyleSheet } from "react-native";
import { BrandColors, Typography } from "../../../../../shared/theme";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  timelineCol: {
    alignItems: "center",
    width: 32,
    marginRight: 12,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E2E8F0",
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  dotCompleted: {
    backgroundColor: BrandColors.PRIMARY_BLUE,
    borderColor: BrandColors.PRIMARY_BLUE,
  },
  dotCurrent: {
    backgroundColor: BrandColors.PRIMARY_ORANGE,
    borderColor: BrandColors.PRIMARY_ORANGE,
    shadowColor: BrandColors.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  dotRejected: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  dotHold: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: "#E2E8F0",
    marginTop: 4,
  },
  lineCompleted: {
    backgroundColor: BrandColors.PRIMARY_BLUE,
  },
  contentCol: {
    flex: 1,
    paddingTop: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stageTitle: {
    fontSize: Typography.FONT_SIZE_SM,
    fontWeight: "600",
    color: "#64748B",
  },
  stageTitleCurrent: {
    color: BrandColors.PRIMARY_ORANGE_DARK,
    fontWeight: "700",
  },
  stageTitleCompleted: {
    color: "#0F172A",
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 10,
    color: "#94A3B8",
  },
  description: {
    fontSize: Typography.FONT_SIZE_XS,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  actionBox: {
    marginTop: 8,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 8,
    padding: 10,
  },
  actionText: {
    fontSize: Typography.FONT_SIZE_XS,
    color: BrandColors.PRIMARY_BLUE,
    fontWeight: "600",
  },
});
