import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "@/api/services.api";
import { CreateServicePayload, UpdateServicePayload } from "@/types";

const SERVICES_KEY = ["services"];

export function useServices() {
  return useQuery({
    queryKey: SERVICES_KEY,
    queryFn: servicesApi.list,
  });
}

export function usePublicServices(businessSlug: string) {
  return useQuery({
    queryKey: ["services", "public", businessSlug],
    queryFn: () => servicesApi.listPublic(businessSlug),
    enabled: !!businessSlug,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateServicePayload) => servicesApi.create(payload),
    // invalidateQueries: le dice a React Query "esta data quedó vieja,
    // volvé a pedirla". Así la tabla se actualiza sola tras crear/editar/borrar,
    // sin manejar arrays a mano con setState.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES_KEY }),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateServicePayload }) =>
      servicesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES_KEY }),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES_KEY }),
  });
}
