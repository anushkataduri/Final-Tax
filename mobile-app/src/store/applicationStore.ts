import { create } from "zustand";
import { applicationService } from "@/modules/applications/services/applicationService";
import { notificationService } from "@/modules/notifications/services/notificationService";
import { getCustomerDrafts } from "@/shared/hooks/useServiceDraft";
import type {
  Application,
  ApplicationDocument,
  ApplicationFormData,
  ChatMessage,
  ChatSender,
  PaymentStatus,
  ServiceCategoryId,
} from "@/types/domain";

import {
  getActiveCustomerMobile,
  getPersistedApplications,
  savePersistedApplications,
  removeDraftRecord,
} from "./applicationStorage";

import {
  draftToApplication,
  getServiceTimeline,
} from "./applicationDraftMappers";
import { logger } from "@/core/logging/logger";
import { getErrorMessage } from "@/core/error-handling/errorMessage";

import {
  DraftSliceState,
  createDraftSlice,
  initialDraftState,
} from "./applicationDraftSlice";

export * from "./applicationDraftTypes";
export * from "./applicationStorage";
export * from "./applicationDraftMappers";
export * from "./applicationDraftSlice";

export interface ApplicationState extends DraftSliceState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  selectedApplicationId: string | null;

  setSelectedApplicationId: (id: string | null) => void;
  setApplications: (apps: Application[]) => void;
  loadApplications: () => Promise<void>;
  addApplication: (app: Application) => void;
  createApplication: (
    serviceId: string,
    serviceName: string,
    category: ServiceCategoryId,
    formData: ApplicationFormData,
    requiredDocs: (string | ApplicationDocument)[],
    paymentAmount: number,
    initialPaymentStatus?: PaymentStatus,
    skipNotification?: boolean,
    customId?: string,
  ) => string;
  uploadDocument: (appId: string, docName: string, fileUri: string) => void;
  addChatMessage: (appId: string, sender: ChatSender, text: string) => void;
  payApplication: (appId: string) => void;
  deleteApplication: (appId: string) => void;
  resetStore: () => void;
}

const timeStamp = (): string =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  isLoading: false,
  error: null,
  selectedApplicationId: null,

  ...createDraftSlice<ApplicationState>(set),

  resetStore: () =>
    set({
      applications: [],
      selectedApplicationId: null,
      error: null,
      ...initialDraftState,
    }),

  setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),

  setApplications: (apps) => {
    set({ applications: apps });
    savePersistedApplications(getActiveCustomerMobile(), apps);
  },

  loadApplications: async () => {
    set({ isLoading: true, error: null });
    const cleanMobile = getActiveCustomerMobile();
    try {
      const [remoteResult, localAppsResult, draftsResult] = await Promise.allSettled([
        applicationService.getApplications(),
        getPersistedApplications(cleanMobile),
        getCustomerDrafts(cleanMobile),
      ]);

      const localApps = localAppsResult.status === "fulfilled" ? localAppsResult.value : [];
      const customerDrafts = draftsResult.status === "fulfilled" ? draftsResult.value : [];
      let remoteApps: Application[] = [];
      let remoteError: string | null = null;

      if (remoteResult.status === "fulfilled") {
        remoteApps = remoteResult.value;
      } else {
        remoteError = getErrorMessage(remoteResult.reason) || null;
        logger.warn("[ApplicationStore] Remote applications request failed", { error: remoteError || undefined });
      }

      const mergedMap = new Map<string, Application>();

      const getAppLookupKeys = (app: Application): string[] => [
        app.id,
        app.formData?.arn ? String(app.formData.arn).trim() : "",
        app.formData?.gstId ? String(app.formData.gstId).trim() : "",
        app.formData?.createdGstId ? String(app.formData.createdGstId).trim() : "",
        app.formData?.applicationId ? String(app.formData.applicationId).trim() : "",
      ].filter(Boolean);

      const findExistingKey = (app: Application): string | null => {
        const appKeys = getAppLookupKeys(app);
        const match = Array.from(mergedMap.entries()).find(([key, existing]) => {
          if (appKeys.includes(key)) return true;
          const existingKeys = getAppLookupKeys(existing);
          return appKeys.some((k) => existingKeys.includes(k));
        });
        return match ? match[0] : null;
      };

      localApps.forEach((app) => {
        const matchedKey = findExistingKey(app);
        if (matchedKey) {
          mergedMap.set(matchedKey, { ...mergedMap.get(matchedKey)!, ...app });
        } else {
          mergedMap.set(app.id, app);
        }
      });

      remoteApps.forEach((app) => {
        const matchedKey = findExistingKey(app);
        if (matchedKey) {
          mergedMap.set(matchedKey, { ...mergedMap.get(matchedKey)!, ...app });
        } else {
          mergedMap.set(app.id, app);
        }
      });

      const submittedServiceIds = new Set(
        Array.from(mergedMap.values())
          .filter((a) => a.status !== "Draft")
          .map((a) => a.serviceId)
      );

      const draftApplications: Application[] = customerDrafts
        .map((draft) => draftToApplication(draft as Record<string, unknown>, cleanMobile))
        .filter((draftApp) => !submittedServiceIds.has(draftApp.serviceId));

      const combinedApps = [...Array.from(mergedMap.values()), ...draftApplications];
      set({
        applications: combinedApps,
        isLoading: false,
        error: combinedApps.length > 0 ? null : remoteError,
      });
    } catch (err: unknown) {
      const localApps = await getPersistedApplications(cleanMobile);
      const customerDrafts = await getCustomerDrafts(cleanMobile).catch(() => []);
      const draftApplications = customerDrafts.map((draft) =>
        draftToApplication(draft as Record<string, unknown>, cleanMobile),
      );
      const fallbackApps = [...localApps, ...draftApplications];
      const errMsg = err instanceof Error ? err.message : "Failed to load applications. Please try again.";
      set({
        applications: fallbackApps,
        isLoading: false,
        error: fallbackApps.length > 0 ? null : errMsg,
      });
    }
  },

  createApplication: (
    serviceId,
    serviceName,
    category,
    formData,
    requiredDocs,
    paymentAmount,
    initialPaymentStatus,
    skipNotification,
    customId,
  ) => {
    const rawFormData = (formData || {}) as Record<string, unknown>;
    const realId =
      (customId ? String(customId).trim() : "") ||
      (rawFormData.arn ? String(rawFormData.arn).trim() : "") ||
      (rawFormData.gstId ? String(rawFormData.gstId).trim() : "") ||
      (rawFormData.createdGstId ? String(rawFormData.createdGstId).trim() : "") ||
      (rawFormData.applicationId ? String(rawFormData.applicationId).trim() : "") ||
      (rawFormData.referenceId ? String(rawFormData.referenceId).trim() : "");

    const appId: string =
      realId ||
      `${category.substring(0, 4).toUpperCase()}-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const newApp: Application = {
      id: appId,
      serviceId,
      serviceName,
      category,
      status: "Submitted",
      progress: 20,
      assignedExecutive: "",
      paymentAmount,
      paymentStatus:
        initialPaymentStatus || (paymentAmount > 0 ? "Pending" : "Paid"),
      createdAt: new Date().toISOString().split("T")[0],
      formData: {
        ...formData,
        applicationId: appId,
        submissionDate: (formData as any)?.submissionDate || new Date().toISOString().split("T")[0],
      },
      documents: requiredDocs.map((doc) =>
        typeof doc === "string"
          ? { name: doc, status: "Pending" }
          : {
              name: doc.name,
              status: doc.status || "Pending",
              fileUri: doc.fileUri,
            },
      ),
      timeline: getServiceTimeline(serviceId),
      chatHistory: [],
    };

    set((state) => {
      const remainingApps = state.applications.filter(
        (a) =>
          !(a.status === "Draft" && a.serviceId === serviceId) &&
          a.id !== appId &&
          !(a.formData?.arn && a.formData.arn === appId) &&
          !(a.formData?.gstId && a.formData.gstId === appId) &&
          !(a.formData?.applicationId && a.formData.applicationId === appId),
      );
      const nextApps = [newApp, ...remainingApps];
      savePersistedApplications(getActiveCustomerMobile(), nextApps);
      return { applications: nextApps };
    });

    const cleanMobile = getActiveCustomerMobile();
    if (cleanMobile) removeDraftRecord(cleanMobile, serviceId);

    applicationService.createApplication(newApp).catch((err) => {
      logger.debug("[ApplicationStore] Backend application persistence note", { error: getErrorMessage(err) });
    });

    if (!skipNotification) {
      notificationService.notifyApplicationSubmitted(serviceName, appId);
    }

    return appId;
  },

  addApplication: (newApp) => {
    set((state) => {
      const remaining = state.applications.filter(
        (a) =>
          a.id !== newApp.id &&
          !(newApp.formData?.applicationId && a.id === newApp.formData.applicationId) &&
          !(newApp.formData?.arn && a.formData?.arn === newApp.formData.arn) &&
          !(newApp.formData?.gstId && a.formData?.gstId === newApp.formData.gstId),
      );
      const nextApps = [newApp, ...remaining];
      savePersistedApplications(getActiveCustomerMobile(), nextApps);
      return { applications: nextApps };
    });
    applicationService.createApplication(newApp).catch((err) => {
      logger.debug("[ApplicationStore] Backend persistence note", { error: getErrorMessage(err) });
    });
  },

  uploadDocument: (appId, docName, fileUri) =>
    set((state) => {
      const updatedApplications = state.applications.map((app) => {
        if (app.id !== appId) return app;
        const newDocs = app.documents.map((doc) =>
          doc.name === docName ? { ...doc, status: "Uploaded" as const, fileUri } : doc,
        );
        const uploadedCount = newDocs.filter((d) => d.status === "Uploaded").length;
        const totalDocs = newDocs.length;
        const progress = Math.min(95, Math.round(20 + (uploadedCount / totalDocs) * 50));
        const updated = {
          ...app,
          documents: newDocs,
          progress,
          status: uploadedCount === totalDocs ? ("Verification" as const) : ("Document Collection" as const),
        };
        applicationService.updateApplication(updated).catch((err) => {
          logger.warn("[ApplicationStore] Failed to sync updated document to backend", { error: getErrorMessage(err) });
        });
        return updated;
      });
      savePersistedApplications(getActiveCustomerMobile(), updatedApplications);
      return { applications: updatedApplications };
    }),

  addChatMessage: (appId, sender, text) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender,
      text,
      timestamp: timeStamp(),
    };
    set((state) => {
      const updatedApps = state.applications.map((app) => {
        if (app.id !== appId) return app;
        const updated = { ...app, chatHistory: [...(app.chatHistory || []), newMessage] };
        applicationService.updateApplication(updated).catch((err) => {
          logger.warn("[ApplicationStore] Failed to sync chat message to backend", { error: getErrorMessage(err) });
        });
        return updated;
      });
      savePersistedApplications(getActiveCustomerMobile(), updatedApps);
      return { applications: updatedApps };
    });
  },

  payApplication: (appId) => {
    let paidAmount = 0;
    let paidServiceName = "";
    set((state) => {
      const updatedApps = state.applications.map((app) => {
        if (app.id !== appId) return app;
        paidAmount = app.paymentAmount;
        paidServiceName = app.serviceName;
        const newTimeline = app.timeline.map((step) =>
          step.title === "Verification" ? { ...step, status: "completed" as const } : step,
        );
        const updated = {
          ...app,
          paymentStatus: "Paid" as const,
          progress: Math.min(100, app.progress + 15),
          timeline: newTimeline,
        };
        applicationService.updateApplication(updated).catch((err) => {
          logger.warn("[ApplicationStore] Failed to update paid application on backend", { error: getErrorMessage(err) });
        });
        return updated;
      });
      savePersistedApplications(getActiveCustomerMobile(), updatedApps);
      return { applications: updatedApps };
    });
    if (paidAmount > 0 || paidServiceName) {
      notificationService.notifyPaymentSuccessful(paidAmount, paidServiceName);
    }
  },

  deleteApplication: (appId) => {
    const cleanMobile = getActiveCustomerMobile();
    if (appId.startsWith("DRAFT-")) {
      removeDraftRecord(cleanMobile, appId.replace("DRAFT-", "").toLowerCase());
    }
    set((state) => {
      const targetApp = state.applications.find((a) => a.id === appId);
      if (targetApp && (targetApp.status === "Draft" || targetApp.id.startsWith("DRAFT-"))) {
        removeDraftRecord(cleanMobile, targetApp.serviceId || appId.replace("DRAFT-", "").toLowerCase());
      }
      const remainingApps = state.applications.filter((a) => a.id !== appId);
      savePersistedApplications(cleanMobile, remainingApps);
      return {
        applications: remainingApps,
        selectedApplicationId: state.selectedApplicationId === appId ? null : state.selectedApplicationId,
      };
    });
  },
}));
