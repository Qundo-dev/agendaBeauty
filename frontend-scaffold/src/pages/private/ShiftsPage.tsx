import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, X, CalendarClock } from "lucide-react";

import { useShifts, useCreateManualShift, useCancelShift, useRescheduleShift } from "@/hooks/useShifts";
import { useServices } from "@/hooks/useServices";
import { useEmployees } from "@/hooks/useEmployees";
import { Shift, CreateShiftPayload, ShiftStatus } from "@/types";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/shared/Modal";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const STATUS_VARIANT: Record<ShiftStatus, "default" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger",
  COMPLETED: "default",
};

const TODAY = new Date().toISOString().slice(0, 10);

/**
 * Agenda del negocio: lista de turnos (no es un calendario visual tipo
 * grilla todavía -- eso se puede agregar después con una librería como
 * FullCalendar o el componente Calendar de shadcn, reusando este mismo
 * hook useShifts como fuente de datos).
 */
export function ShiftsPage() {
  const [from, setFrom] = useState(TODAY);
  const { data: shifts, isLoading } = useShifts({ from });
  const { data: services } = useServices();
  const { data: employees } = useEmployees();

  const createManualShift = useCreateManualShift();
  const cancelShift = useCancelShift();
  const rescheduleShift = useRescheduleShift();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reschedulingShift, setReschedulingShift] = useState<Shift | null>(null);

  const { register, handleSubmit, reset } = useForm<CreateShiftPayload>();

  function serviceName(id: string) {
    return services?.find((s) => s.id === id)?.name ?? "—";
  }
  function employeeName(id: string) {
    return employees?.find((e) => e.id === id)?.name ?? "—";
  }

  async function onCreateManual(values: CreateShiftPayload) {
    await createManualShift.mutateAsync(values);
    setIsModalOpen(false);
    reset();
  }

  async function handleCancel(id: string) {
    if (!confirm("¿Cancelar este turno?")) return;
    await cancelShift.mutateAsync(id);
  }

  async function handleReschedule(date: string, startTime: string) {
    if (!reschedulingShift) return;
    await rescheduleShift.mutateAsync({ id: reschedulingShift.id, payload: { date, startTime } });
    setReschedulingShift(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Turnos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Crear turno manual
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Label htmlFor="from">Desde</Label>
        <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-44" />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : !shifts || shifts.length === 0 ? (
        <EmptyState title="No hay turnos en este rango" icon={<CalendarClock />} />
      ) : (
        <div className="space-y-2">
          {shifts.map((shift) => (
            <div key={shift.id} className="flex items-center justify-between rounded-lg bg-background p-4 shadow-sm">
              <div>
                <p className="font-medium">
                  {shift.date} · {shift.startTime} — {serviceName(shift.serviceId)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {shift.clientName} · con {employeeName(shift.employeeId)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={STATUS_VARIANT[shift.status]}>{shift.status}</Badge>
                {shift.status !== "CANCELLED" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setReschedulingShift(shift)}>
                      Reagendar
                    </Button>
                    <button onClick={() => handleCancel(shift.id)} className="text-muted-foreground hover:text-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear turno manual">
        <form onSubmit={handleSubmit(onCreateManual)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="serviceId">Servicio</Label>
            <select id="serviceId" {...register("serviceId", { required: true })} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm">
              {(services ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="employeeId">Empleado</Label>
            <select id="employeeId" {...register("employeeId", { required: true })} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm">
              {(employees ?? []).map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" {...register("date", { required: true })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startTime">Horario</Label>
              <Input id="startTime" type="time" {...register("startTime", { required: true })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="clientName">Cliente</Label>
            <Input id="clientName" {...register("clientName", { required: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="clientEmail">Email del cliente</Label>
            <Input id="clientEmail" type="email" {...register("clientEmail", { required: true })} />
          </div>
          <Button type="submit" className="w-full" disabled={createManualShift.isPending}>
            {createManualShift.isPending ? "Creando..." : "Crear turno"}
          </Button>
        </form>
      </Modal>

      <Modal
        open={!!reschedulingShift}
        onClose={() => setReschedulingShift(null)}
        title="Reagendar turno"
      >
        <RescheduleForm onSubmit={handleReschedule} />
      </Modal>
    </div>
  );
}

function RescheduleForm({ onSubmit }: { onSubmit: (date: string, startTime: string) => void }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(date, startTime);
      }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="newDate">Nueva fecha</Label>
        <Input id="newDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="newTime">Nuevo horario</Label>
        <Input id="newTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">Confirmar nuevo horario</Button>
    </form>
  );
}
