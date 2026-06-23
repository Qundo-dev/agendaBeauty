import { api } from "@/lib/axios";
import { Service, CreateServicePayload, UpdateServicePayload } from "@/types";

export const servicesApi = {
  listPublic: (businessSlug: string) =>
    api
      .get<Service[]>(`/business/public/${businessSlug}/services`)
      .then((r) => r.data),

  list: () => api.get<Service[]>("/services").then((r) => r.data),

  create: (payload: CreateServicePayload) =>
    api.post<Service>("/services", payload).then((r) => r.data),

  update: (id: number, payload: UpdateServicePayload) =>
    api.patch<Service>(`/services/${id}`, payload).then((r) => r.data),

  remove: (id: number) => api.delete<void>(`/services/${id}`).then((r) => r.data),
};
