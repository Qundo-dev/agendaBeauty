import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeesApi } from "@/api/employees.api";
import { CreateEmployeePayload, UpdateEmployeePayload } from "@/types";

const EMPLOYEES_KEY = ["employees"];

export function useEmployees() {
  return useQuery({
    queryKey: EMPLOYEES_KEY,
    queryFn: employeesApi.list,
  });
}

// Empleados que pueden realizar un servicio puntual (paso 3 del flujo de reserva)
export function usePublicEmployees(businessSlug: string, serviceId: string) {
  return useQuery({
    queryKey: ["employees", "public", businessSlug, serviceId],
    queryFn: () => employeesApi.listPublic(businessSlug, serviceId),
    enabled: !!businessSlug && !!serviceId,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeesApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY }),
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployeePayload }) =>
      employeesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY }),
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY }),
  });
}
