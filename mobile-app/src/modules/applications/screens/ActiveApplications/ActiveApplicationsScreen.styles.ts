import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  /* Navy Header */
  navyHeader: {
    backgroundColor: "#0A2346",
    paddingHorizontal: 16,
    paddingBottom: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 1,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  taxedgeLogoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  taxedgeLogoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  taxedgeLogoAccent: {
    color: "#EA580C",
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleWrap: {
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 4,
  },

  /* 4-Column Overview KPI Card */
  overviewCardWrapper: {
    marginTop: -34,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  overviewCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  overviewCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeOverviewCol: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },
  activeOverviewColDark: {
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#FF5722",
  },
  overviewTotalNum: {
    fontSize: 22,
    fontWeight: "800",
    color: "#EA580C",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  circleIconInProgress: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  circleIconCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  circleIconVerification: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  circleNumVerification: {
    fontSize: 15,
    fontWeight: "800",
    color: "#EA580C",
  },
  overviewSub: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
    fontWeight: "500",
  },
  overviewDivider: {
    width: 1,
    height: 36,
    alignSelf: "center",
  },

  /* Search Bar & Filter Button */
  searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 44,
  },
  searchContainerDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  searchInputDark: {
    color: "#F8FAFC",
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtnDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },

  /* Category Filter Pills */
  categoryPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 14,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeCategoryPill: {
    backgroundColor: "#EA580C",
    borderColor: "#EA580C",
  },
  categoryPillText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#475569",
  },
  activeCategoryPillText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* Scrollable Body & List */
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  recentHeaderRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  /* Application Card (Screen 1 Reference) */
  appCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1.5,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 6,
  },
  serviceNameText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  appIdText: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11.5,
    color: "#94A3B8",
    fontWeight: "500",
  },
  cardRightColumn: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  cardBadgeWithArrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cardChevron: {
    marginLeft: 2,
  },
  resumeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },
  resumeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#EA580C",
  },

  /* Loading, Error, Empty */
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "#FFF",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  errorText: {
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#0A2346",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 4,
  },

  /* Modal */
  categoryModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  categoryModalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  categoryModalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
  },
  categoryModalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  categoryModalOptionActive: {
    backgroundColor: "#FFF7ED",
  },
  categoryModalOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryModalOptionLabel: {
    fontSize: 14.5,
    fontWeight: "600",
    color: "#334155",
  },
  categoryModalOptionLabelActive: {
    color: "#EA580C",
    fontWeight: "700",
  },
  categoryModalCloseBtn: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 10,
  },
  categoryModalCloseText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  /* CategoryTab / Document Icon */
  docIconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  docIconTag: {
    position: "absolute",
    bottom: 4.5,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
});
