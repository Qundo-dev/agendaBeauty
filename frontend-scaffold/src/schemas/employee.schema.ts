import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  serviceIds: z.array(z.string()).min(1, "Asigná al menos un servicio"),
  active: z.boolean().default(true),
});
export type EmployeeFormValues = z.infer<typeof employeeSchema>;
