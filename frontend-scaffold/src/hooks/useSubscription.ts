import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "@/api/subscriptions.api";
import { PlanTier } from "@/types";

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: subscriptionsApi.getCurrent,
  });
}

export function useChangePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (plan: PlanTier) => subscriptionsApi.changePlan(plan),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subscription"] }),
  });
}
