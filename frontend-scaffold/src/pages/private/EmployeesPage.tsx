import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";

import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "@/hooks/useEmployees";
import { useServices } from "@/hooks/useServices";
import { Employee } from "@/types";
import { employeeSchema, EmployeeFormValues } from "@/schemas/employee.schema";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/shared/Modal";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// Mismo patrón que ServicesPage (tabla + modal + RHF/Zod + mutations).
// La diferencia principal es el campo serviceIds: un multi-select de
// checkboxes para decidir qué servicios puede realizar cada empleado.
export function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const { data: services } = useServices();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [editing, setEditing] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EmployeeFormValues>({ resolver: zodResolver(employeeSchema) });

  function openCreateModal() {
    setEditing(null);
    reset({ name: "", email: "", serviceIds: [], active: true });
    setIsModalOpen(true);
  }

  function openEditModal(employee: Employee) {
    setEditing(employee);
    reset({ ...employee, email: employee.email ?? "" });
    setIsModalOpen(true);
  }

  async function onSubmit(values: EmployeeFormValues) {
    if (editing) {
      await updateEmployee.mutateAsync({ id: editing.id, payload: values });
    } else {
      await createEmployee.mutateAsync(values);
    }
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este empleado?")) return;
    await deleteEmployee.mutateAsync(id);
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Empleados</h1>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Nuevo empleado
        </Button>
      </div>

      {!employees || employees.length === 0 ? (
        <EmptyState
          title="Todavía no agregaste empleados"
          description="Agregá a las personas que van a atender turnos."
          action={<Button onClick={openCreateModal}>Agregar empleado</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {employees.map((employee) => (
            <div key={employee.id} className="flex items-center justify-between rounded-lg bg-background p-4 shadow-sm">
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
                <Badge variant={employee.active ? "success" : "default"} className="mt-1">
                  {employee.active ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(employee)} className="text-muted-foreground hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(employee.id)} className="text-muted-foreground hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Editar empleado" : "Nuevo empleado"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email (opcional)</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Servicios que puede realizar</Label>
            <Controller
              control={control}
              name="serviceIds"
              render={({ field }) => (
                <div className="space-y-1.5">
                  {(services ?? []).map((service) => {
                    const checked = field.value?.includes(service.id);
                    return (
                      <label key={service.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...(field.value ?? []), service.id]
                              : (field.value ?? []).filter((id) => id !== service.id);
                            field.onChange(next);
                          }}
                        />
                        {service.name}
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.serviceIds && (
              <p className="text-sm text-red-600">{errors.serviceIds.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("active")} />
            Empleado activo
          </label>

          <Button type="submit" className="w-full">
            {editing ? "Guardar cambios" : "Crear empleado"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
