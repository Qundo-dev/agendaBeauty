import { api } from "@/lib/axios";
import { Shift, CreateShiftPayload } from "@/types";

export const shiftsApi = {
  createPublic: (businessSlug: string, payload: CreateShiftPayload) =>
    api
      .post<Shift>(`/business/public/${businessSlug}/shifts`, payload)
      .then((r) => r.data),

  list: (params?: { from?: string; to?: string; employeeId?: number }) =>
    api.get<Shift[]>("/shifts", { params }).then((r) => r.data),

  createManual: (payload: CreateShiftPayload) =>
    api.post<Shift>("/shifts/manual", payload).then((r) => r.data),

  cancel: (id: number) =>
    api.patch<Shift>(`/shifts/${id}/cancel`).then((r) => r.data),

  reschedule: (id: number, startTime: string) =>
    api.patch<Shift>(`/shifts/${id}/reschedule`, { startTime }).then((r) => r.data),
};
