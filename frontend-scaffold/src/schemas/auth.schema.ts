import { z } from "zod";

// Zod define la forma Y las reglas de validación en un solo lugar.
// React Hook Form usa este schema (vía @hookform/resolvers/zod) para
// validar en cada submit/blur sin que escribas los ifs a mano.
export const loginSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  businessName: z.string().min(2, "Ingresá el nombre de tu negocio"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;
