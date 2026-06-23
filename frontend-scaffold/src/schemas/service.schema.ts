import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().int().positive("Tiene que ser mayor a 0"),
  price: z.coerce.number().nonnegative("No puede ser negativo"),
  active: z.boolean().default(true),
});
export type ServiceFormValues = z.infer<typeof serviceSchema>;
