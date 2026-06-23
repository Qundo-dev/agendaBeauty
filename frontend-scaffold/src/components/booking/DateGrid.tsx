import { cn } from "@/lib/utils";

interface Props {
  selectedDate?: string;
  onSelect: (isoDate: string) => void;
  daysAhead?: number;
}

// Selector simple de fecha: próximos N días como botones (evita meter
// una librería de calendario completa solo para esto). Se puede
// reemplazar por el componente Calendar de shadcn/ui más adelante.
export function DateGrid({ selectedDate, onSelect, daysAhead = 14 }: Props) {
  const days = Array.from({ length: daysAhead }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {days.map((date) => {
        const iso = date.toISOString().slice(0, 10);
        const isSelected = selectedDate === iso;
        return (
          <button
            key={iso}
            onClick={() => onSelect(iso)}
            className={cn(
              "flex min-w-16 flex-col items-center rounded-lg border p-3 text-sm transition-colors hover:border-primary",
              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
            )}
          >
            <span className="text-xs uppercase opacity-80">
              {date.toLocaleDateString("es-AR", { weekday: "short" })}
            </span>
            <span className="font-medium">{date.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
