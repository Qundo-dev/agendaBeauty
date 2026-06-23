import { TimeSlot } from "@/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

interface Props {
  slots: TimeSlot[];
  selectedSlot?: TimeSlot;
  onSelect: (slot: TimeSlot) => void;
}

// Paso 3 (parte 2): horarios disponibles para el empleado+servicio+fecha
// elegidos. `slots` viene del hook useAvailableSlots, que ya descuenta
// turnos ocupados y bloqueos/vacaciones del lado del backend.
export function TimeSlotGrid({ slots, selectedSlot, onSelect }: Props) {
  if (slots.length === 0) {
    return (
      <EmptyState
        title="No hay horarios disponibles ese día"
        description="Probá elegir otra fecha."
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((slot) => {
        const isSelected = selectedSlot?.startTime === slot.startTime;
        return (
          <button
            key={slot.startTime}
            onClick={() => onSelect(slot)}
            className={cn(
              "rounded-md border px-4 py-2 text-sm transition-colors hover:border-primary",
              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
            )}
          >
            {slot.startTime}
          </button>
        );
      })}
    </div>
  );
}
