import { api } from "@/lib/axios";
import { Subscription, Plan } from "@/types";

export const subscriptionsApi = {
  getCurrent: () => api.get<Subscription>("/subscriptions/me").then((r) => r.data),

  // Planes disponibles (tabla Plan, definida por vos en el backend).
  listPlans: () => api.get<Plan[]>("/plans").then((r) => r.data),

  changePlan: (planId: number) =>
    api.post<Subscription>("/subscriptions/change-plan", { planId }).then((r) => r.data),

  getBillingPortalUrl: () =>
    api.get<{ url: string }>("/subscriptions/billing-portal").then((r) => r.data),
};
