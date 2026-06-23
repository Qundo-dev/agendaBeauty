// status es String en el schema (no un enum de Prisma), con estos valores
// por convención según el comentario del modelo: "pending" | "confirmed" | "cancelled".
export type ShiftStatus = "pending" | "confirmed" | "cancelled";

export interface Shift {
  id: number;
  businessId: number;
  serviceId: number;
  employeeId: number | null; // opcional en el schema
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: ShiftStatus;
  startTime: string; // DateTime ISO completo (no hay campo `date` separado)
  endTime: string; // DateTime ISO, lo calcula el backend a partir de service.time
  createdAt: string;
}

export interface CreateShiftPayload {
  serviceId: number;
  employeeId?: number;
  startTime: string; // ISO datetime; el backend calcula endTime con service.time
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}
