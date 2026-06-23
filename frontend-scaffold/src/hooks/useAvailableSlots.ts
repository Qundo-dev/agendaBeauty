import { useQuery } from "@tanstack/react-query";
import { availabilityApi } from "@/api/availability.api";

// El hook más importante del flujo público: dado un negocio + empleado +
// servicio + fecha, devuelve los horarios libres para mostrar como botones.
export function useAvailableSlots(params: {
  businessSlug: string;
  employeeId: string;
  serviceId: string;
  date: string;
}) {
  return useQuery({
    queryKey: ["availability", "slots", params],
    queryFn: () => availabilityApi.getAvailableSlots(params),
    enabled: !!(params.businessSlug && params.employeeId && params.serviceId && params.date),
  });
}
