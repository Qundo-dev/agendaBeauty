// El modelo Employee real solo tiene name (no email, avatarUrl, serviceIds
// ni active). No existe relación empleado<->servicio en el schema: cualquier
// empleado puede quedar asignado a cualquier turno, sin restricción por servicio.
export interface Employee {
  id: number;
  businessId: number;
  name: string;
  createdAt: string;
}

export type CreateEmployeePayload = Pick<Employee, "name">;
export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;
