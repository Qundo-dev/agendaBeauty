import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { useServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/useServices";
import { Service } from "@/types";
import { serviceSchema, ServiceFormValues } from "@/schemas/service.schema";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/shared/Modal";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatCurrencyARS } from "@/lib/utils";

/**
 * CRUD completo de Servicios. Esta pantalla es la "plantilla de referencia"
 * para Empleados y cualquier otro recurso con el mismo patrón:
 * tabla + modal de crear/editar + RHF/Zod + mutations de React Query.
 */
export function ServicesPage() {
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({ resolver: zodResolver(serviceSchema) });

  function openCreateModal() {
    setEditingService(null);
    reset({ name: "", description: "", durationMinutes: 30, price: 0, active: true });
    setIsModalOpen(true);
  }

  function openEditModal(service: Service) {
    setEditingService(service);
    reset(service);
    setIsModalOpen(true);
  }

  async function onSubmit(values: ServiceFormValues) {
    if (editingService) {
      await updateService.mutateAsync({ id: editingService.id, payload: values });
    } else {
      await createService.mutateAsync(values);
    }
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este servicio?")) return;
    await deleteService.mutateAsync(id);
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
        <h1 className="text-2xl font-semibold">Servicios</h1>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Nuevo servicio
        </Button>
      </div>

      {!services || services.length === 0 ? (
        <EmptyState
          title="Todavía no tenés servicios"
          description="Creá tu primer servicio para empezar a recibir reservas."
          action={<Button onClick={openCreateModal}>Crear servicio</Button>}
        />
      ) : (
        <table className="w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="px-3">Nombre</th>
              <th className="px-3">Duración</th>
              <th className="px-3">Precio</th>
              <th className="px-3">Estado</th>
              <th className="px-3"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="rounded-lg bg-background shadow-sm">
                <td className="rounded-l-lg px-3 py-3 font-medium">{service.name}</td>
                <td className="px-3 py-3">{service.durationMinutes} min</td>
                <td className="px-3 py-3">{formatCurrencyARS(service.price)}</td>
                <td className="px-3 py-3">
                  <Badge variant={service.active ? "success" : "default"}>
                    {service.active ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="rounded-r-lg px-3 py-3 text-right">
                  <button
                    onClick={() => openEditModal(service)}
                    className="mr-2 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Editar servicio" : "Nuevo servicio"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" rows={2} {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="durationMinutes">Duración (min)</Label>
              <Input id="durationMinutes" type="number" {...register("durationMinutes")} />
              {errors.durationMinutes && (
                <p className="text-sm text-red-600">{errors.durationMinutes.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Precio ($)</Label>
              <Input id="price" type="number" {...register("price")} />
              {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("active")} />
            Servicio activo (visible para clientes)
          </label>

          <Button type="submit" className="w-full">
            {editingService ? "Guardar cambios" : "Crear servicio"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
