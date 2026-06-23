import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = ["Servicio", "Profesional", "Fecha y horario", "Confirmar"];

// Indicador visual del progreso dentro del flujo de reserva pública.
// currentStep es 0-indexed (0 = "Servicio").
export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((label, index) => {
        const isDone = index < currentStep;
        const isActive = index === currentStep;
        return (
          <li key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                isDone && "bg-primary text-primary-foreground",
                isActive && !isDone && "border-2 border-primary text-primary",
                !isDone && !isActive && "border border-border text-muted-foreground"
              )}
            >
              {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </div>
            <span
              className={cn(
                "hidden text-sm sm:inline",
                isActive ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <div className="h-px w-4 bg-border sm:w-8" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
