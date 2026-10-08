import { StyleSheet, Dimensions } from "react-native";
import type { ServiceCategoryId } from "@/types/domain";

export const { width: WINDOW_WIDTH } = Dimensions.get("window");
export const CARD_WIDTH = WINDOW_WIDTH - 40;

export const SUB_SERVICES_MAP: Record<ServiceCategoryId, string[]> = {
  GST: ["Registration", "Filing", "Compliance", "Amendment", "Certificate"],
  ITR: [
    "ITR Filing",
    "TDS Refund",
    "Previous Year ITR",
    "Revised ITR",
    "Tax Notice Assistance",
  ],
  LOANS: [
    "Business Loan",
    "Personal Loan",
    "Home Loan",
    "Property Loan",
    "Vehicle Loan",
  ],
  INSURANCE: [
    "Health Insurance",
    "Life Insurance",
    "Motor Insurance",
    "Home Insurance",
    "Business Insurance",
  ],
  BUSINESS: [
    "Business Registration",
    "Company / LLP Incorporation",
    "Udyam / MSME Registration",
    "ROC Compliance",
    "Accounting & Bookkeeping",
  ],
};

export const SUBTITLE_TEXT_MAP: Record<ServiceCategoryId, string> = {
  GST: "GST Registration & Filing Services",
  ITR: "Income Tax Services",
  LOANS: "Personal & Business Loans",
  INSURANCE: "Personal & Commercial",
  BUSINESS: "Business & Compliance",
};

export const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  listContent: {
    paddingHorizontal: 12,
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  cardHeader: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  iconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  cardSubTitle: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  body: {
    padding: 20,
    gap: 8,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bulletItem: {
    fontSize: 14,
    fontWeight: "600",
  },
  exploreBtn: {
    height: 44,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  exploreText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    gap: 6,
  },
  indicatorDot: {
    height: 8,
    borderRadius: 4,
  },
});
