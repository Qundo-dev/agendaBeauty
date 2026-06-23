import { z } from "zod";

// Datos del cliente final en el último paso de la reserva pública.
export const bookingClientSchema = z.object({
  clientName: z.string().min(2, "Ingresá tu nombre"),
  clientEmail: z.string().email("Email inválido"),
  clientPhone: z.string().optional(),
});
export type BookingClientFormValues = z.infer<typeof bookingClientSchema>;
