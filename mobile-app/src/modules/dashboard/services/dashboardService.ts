import { SERVICE_CATALOGUE } from "../../../data/catalogue";
import type { Deadline, ServiceTile } from "../types/dashboard.types";

export const dashboardService = {
  getServiceCatalogue: () => SERVICE_CATALOGUE,
  getUpcomingDeadlines: (): Deadline[] => [],
};

export default dashboardService;
