import { Service } from "@/types";
import { formatCurrencyARS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  services: Service[];
  selectedId?: string;
  onSelect: (service: Service) => void;
}

// Paso 1: el cliente final elige qué servicio quiere reservar.
export function ServiceList({ services, selectedId, onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onSelect(service)}
          className={cn(
            "rounded-lg border p-4 text-left transition-colors hover:border-primary",
            selectedId === service.id ? "border-primary ring-1 ring-primary" : "border-border"
          )}
        >
          <p className="font-medium">{service.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {service.durationMinutes} min · {formatCurrencyARS(service.price)}
          </p>
        </button>
      ))}
    </div>
  );
}
