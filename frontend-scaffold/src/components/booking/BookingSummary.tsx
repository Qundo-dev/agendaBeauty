import { Service, Employee, TimeSlot } from "@/types";
import { formatCurrencyARS, formatDateLong } from "@/lib/utils";

interface Props {
  service: Service;
  employee: Employee;
  date: string;
  slot: TimeSlot;
}

// Resumen de la reserva antes de confirmar (último paso).
export function BookingSummary({ service, employee, date, slot }: Props) {
  return (
    <dl className="grid gap-2 rounded-lg border border-border bg-muted/40 p-4 text-sm">
      <Row label="Servicio" value={service.name} />
      <Row label="Profesional" value={employee.name} />
      <Row label="Fecha" value={formatDateLong(date)} />
      <Row label="Horario" value={slot.startTime} />
      <Row label="Precio" value={formatCurrencyARS(service.price)} />
    </dl>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
