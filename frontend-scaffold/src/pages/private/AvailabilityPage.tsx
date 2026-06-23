import { useEffect, useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import {
  useWeeklySchedule,
  useSetWeeklySchedule,
  useAvailabilityBlocks,
  useCreateAvailabilityBlock,
  useRemoveAvailabilityBlock,
} from "@/hooks/useAvailability";
import { WeeklySchedule } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Trash2 } from "lucide-react";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

interface DayRow {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

function buildDefaultRows(existing: WeeklySchedule[]): DayRow[] {
  return DAYS.map((_, dayOfWeek) => {
    const found = existing.find((d) => d.dayOfWeek === dayOfWeek);
    return {
      dayOfWeek,
      enabled: !!found,
      startTime: found?.startTime ?? "09:00",
      endTime: found?.endTime ?? "18:00",
    };
  });
}

// Configuración de disponibilidad por empleado: horario semanal recurrente
// + bloqueos puntuales (vacaciones, ausencias). El backend es quien debe
// usar esta info, junto con los turnos ya tomados, para calcular los
// slots libres que ve el cliente final en /agenda/:slug.
export function AvailabilityPage() {
  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  const [employeeId, setEmployeeId] = useState<string>("");

  useEffect(() => {
    if (!employeeId && employees && employees.length > 0) {
      setEmployeeId(employees[0].id);
    }
  }, [employees, employeeId]);

  const { data: weeklySchedule, isLoading: loadingSchedule } = useWeeklySchedule(employeeId);
  const setWeeklySchedule = useSetWeeklySchedule(employeeId);

  const { data: blocks } = useAvailabilityBlocks(employeeId);
  const createBlock = useCreateAvailabilityBlock(employeeId);
  const removeBlock = useRemoveAvailabilityBlock(employeeId);

  const [rows, setRows] = useState<DayRow[]>([]);
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    setRows(buildDefaultRows(weeklySchedule ?? []));
  }, [weeklySchedule]);

  function updateRow(dayOfWeek: number, patch: Partial<DayRow>) {
    setRows((prev) => prev.map((r) => (r.dayOfWeek === dayOfWeek ? { ...r, ...patch } : r)));
  }

  async function handleSaveSchedule() {
    const schedule = rows
      .filter((r) => r.enabled)
      .map((r) => ({ dayOfWeek: r.dayOfWeek, startTime: r.startTime, endTime: r.endTime }));
    await setWeeklySchedule.mutateAsync(schedule);
  }

  async function handleAddBlock() {
    if (!blockStart || !blockEnd) return;
    await createBlock.mutateAsync({
      employeeId,
      startDate: blockStart,
      endDate: blockEnd,
      reason: blockReason || undefined,
    });
    setBlockStart("");
    setBlockEnd("");
    setBlockReason("");
  }

  if (loadingEmployees) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Disponibilidad</h1>

      <div className="mb-6 max-w-xs space-y-1.5">
        <Label htmlFor="employee">Empleado</Label>
        <select
          id="employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
        >
          {(employees ?? []).map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Horario semanal</h2>
        {loadingSchedule ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.dayOfWeek} className="flex items-center gap-3">
                <label className="flex w-32 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    onChange={(e) => updateRow(row.dayOfWeek, { enabled: e.target.checked })}
                  />
                  {DAYS[row.dayOfWeek]}
                </label>
                <Input
                  type="time"
                  value={row.startTime}
                  disabled={!row.enabled}
                  onChange={(e) => updateRow(row.dayOfWeek, { startTime: e.target.value })}
                  className="w-32"
                />
                <span className="text-muted-foreground">a</span>
                <Input
                  type="time"
                  value={row.endTime}
                  disabled={!row.enabled}
                  onChange={(e) => updateRow(row.dayOfWeek, { endTime: e.target.value })}
                  className="w-32"
                />
              </div>
            ))}
            <Button onClick={handleSaveSchedule} disabled={setWeeklySchedule.isPending} className="mt-2">
              {setWeeklySchedule.isPending ? "Guardando..." : "Guardar horario"}
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">Bloqueos y vacaciones</h2>
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="blockStart">Desde</Label>
            <Input id="blockStart" type="date" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="blockEnd">Hasta</Label>
            <Input id="blockEnd" type="date" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="blockReason">Motivo (opcional)</Label>
            <Input id="blockReason" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Vacaciones" />
          </div>
          <Button onClick={handleAddBlock} disabled={createBlock.isPending}>
            Agregar
          </Button>
        </div>

        <div className="space-y-2">
          {(blocks ?? []).map((block) => (
            <div key={block.id} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm">
              <span>
                {block.startDate} → {block.endDate} {block.reason && `· ${block.reason}`}
              </span>
              <button onClick={() => removeBlock.mutate(block.id)} className="text-muted-foreground hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
