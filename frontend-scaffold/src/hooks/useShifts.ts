import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shiftsApi } from "@/api/shifts.api";
import { CreateShiftPayload } from "@/types";

const SHIFTS_KEY = ["shifts"];

export function useShifts(params?: { from?: string; to?: string; employeeId?: string }) {
  return useQuery({
    queryKey: [...SHIFTS_KEY, params],
    queryFn: () => shiftsApi.list(params),
  });
}

export function useCreatePublicShift(businessSlug: string) {
  return useMutation({
    mutationFn: (payload: CreateShiftPayload) =>
      shiftsApi.createPublic(businessSlug, payload),
  });
}

export function useCreateManualShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateShiftPayload) => shiftsApi.createManual(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIFTS_KEY }),
  });
}

export function useCancelShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shiftsApi.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIFTS_KEY }),
  });
}

export function useRescheduleShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { date: string; startTime: string } }) =>
      shiftsApi.reschedule(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIFTS_KEY }),
  });
}
