import { api } from "@/lib/axios";
import { Business, UpdateBusinessPayload } from "@/types";

export const businessApi = {
  getPublicBySlug: (slug: string) =>
    api.get<Business>(`/business/public/${slug}`).then((r) => r.data),

  getMine: () => api.get<Business>("/business/me").then((r) => r.data),

  update: (payload: UpdateBusinessPayload) =>
    api.patch<Business>("/business/me", payload).then((r) => r.data),
};
