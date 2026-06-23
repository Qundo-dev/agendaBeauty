// El modelo Availability es por NEGOCIO, no por empleado (no hay employeeId
// en el schema). Tampoco existe un modelo de bloqueos/vacaciones todavía
// (si lo necesitás, es un model nuevo a agregar en el backend).
export interface WeeklySchedule {
  id: number;
  businessId: number;
  dayOfWeek: number; // 0 (domingo) a 6 (sábado)
  startTime: string; // "09:00"
  endTime: string; // "18:00"
}

export type CreateWeeklySchedulePayload = Omit<WeeklySchedule, "id" | "businessId">;

// Slot calculado por el backend para un día puntual (no es un model de Prisma).
export interface TimeSlot {
  startTime: string; // "10:30"
  endTime: string;
}
