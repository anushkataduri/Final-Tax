import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../authentication/store/authStore";
import { useApplicationStore } from "../../../store/applicationStore";
import { useNotificationStore } from "../../../store/notificationStore";
import { dashboardService } from "../services/dashboardService";

export function useDashboard() {
  const customer = useAuthStore((state) => state.customer);
  const applications = useApplicationStore((state) => state.applications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const [moreOpen, setMoreOpen] = useState(false);
  const [moreQuery, setMoreQuery] = useState("");

  const activeCount = applications.filter((app) => app.status !== "Completed").length;
  const pendingDocsCount = applications.reduce(
    (sum, app) => sum + app.documents.filter((d) => d.status === "Pending").length,
    0
  );
  const completedCount = applications.filter((app) => app.status === "Completed").length;
  const paymentDue = applications
    .filter((app) => app.paymentStatus === "Pending")
    .reduce((sum, app) => sum + (app.paymentAmount || 0), 0);

  const recentApps = applications.slice(0, 3);
  const deadlines = dashboardService.getUpcomingDeadlines();

  return {
    customer,
    applications,
    unreadCount,
    activeCount,
    pendingDocsCount,
    completedCount,
    paymentDue,
    recentApps,
    deadlines,
    moreOpen,
    setMoreOpen,
    moreQuery,
    setMoreQuery,
  };
}

export default useDashboard;
