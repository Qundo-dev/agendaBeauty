import { api } from "@/lib/axios";
import { WeeklySchedule, CreateWeeklySchedulePayload, TimeSlot } from "@/types";

export const availabilityApi = {
  // Slots disponibles para un día puntual. employeeId es opcional porque
  // en el schema Shift.employeeId también es opcional.
  getAvailableSlots: (params: {
    businessSlug: string;
    serviceId: number;
    date: string; // "2026-06-23"
    employeeId?: number;
  }) =>
    api
      .get<TimeSlot[]>(
        `/business/public/${params.businessSlug}/availability/slots`,
        { params }
      )
      .then((r) => r.data),

  // Horario semanal: es del NEGOCIO, no de un empleado puntual.
  getWeeklySchedule: () =>
    api.get<WeeklySchedule[]>(`/availability/weekly`).then((r) => r.data),

  setWeeklySchedule: (schedule: CreateWeeklySchedulePayload[]) =>
    api.put<WeeklySchedule[]>(`/availability/weekly`, { schedule }).then((r) => r.data),

  // No existe todavía un model de bloqueos/vacaciones en el schema.
  // Si lo agregás en el backend, el patrón para sumarlo acá es igual
  // al de arriba (un endpoint REST + estas mismas funciones).
};
