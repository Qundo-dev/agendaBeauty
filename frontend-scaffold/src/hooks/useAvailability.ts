import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { availabilityApi } from "@/api/availability.api";
import { WeeklySchedule, AvailabilityBlock } from "@/types";

export function useWeeklySchedule(employeeId: string) {
  return useQuery({
    queryKey: ["availability", "weekly", employeeId],
    queryFn: () => availabilityApi.getWeeklySchedule(employeeId),
    enabled: !!employeeId,
  });
}

export function useSetWeeklySchedule(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schedule: Omit<WeeklySchedule, "id" | "employeeId">[]) =>
      availabilityApi.setWeeklySchedule(employeeId, schedule),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["availability", "weekly", employeeId] }),
  });
}

export function useAvailabilityBlocks(employeeId: string) {
  return useQuery({
    queryKey: ["availability", "blocks", employeeId],
    queryFn: () => availabilityApi.listBlocks(employeeId),
    enabled: !!employeeId,
  });
}

export function useCreateAvailabilityBlock(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<AvailabilityBlock, "id">) =>
      availabilityApi.createBlock(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["availability", "blocks", employeeId] }),
  });
}

export function useRemoveAvailabilityBlock(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => availabilityApi.removeBlock(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["availability", "blocks", employeeId] }),
  });
}
