import { Employee } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  employees: Employee[];
  selectedId?: string;
  onSelect: (employee: Employee) => void;
}

// Paso 2: el cliente elige con quién quiere atenderse.
export function EmployeeList({ employees, selectedId, onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {employees.map((employee) => (
        <button
          key={employee.id}
          onClick={() => onSelect(employee)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:border-primary",
            selectedId === employee.id ? "border-primary ring-1 ring-primary" : "border-border"
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {employee.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-medium">{employee.name}</span>
        </button>
      ))}
    </div>
  );
}
