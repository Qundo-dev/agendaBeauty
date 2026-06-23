import { api } from "@/lib/axios";
import { Employee, CreateEmployeePayload, UpdateEmployeePayload } from "@/types";

export const employeesApi = {
  // Sin relación empleado<->servicio en el schema: se listan todos los
  // empleados del negocio, sin filtrar por serviceId.
  listPublic: (businessSlug: string) =>
    api
      .get<Employee[]>(`/business/public/${businessSlug}/employees`)
      .then((r) => r.data),

  list: () => api.get<Employee[]>("/employees").then((r) => r.data),

  create: (payload: CreateEmployeePayload) =>
    api.post<Employee>("/employees", payload).then((r) => r.data),

  update: (id: number, payload: UpdateEmployeePayload) =>
    api.patch<Employee>(`/employees/${id}`, payload).then((r) => r.data),

  remove: (id: number) => api.delete<void>(`/employees/${id}`).then((r) => r.data),
};
