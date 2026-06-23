import { useMemo } from "react";
import { useShifts } from "@/hooks/useShifts";
import { useServices } from "@/hooks/useServices";
import { useEmployees } from "@/hooks/useEmployees";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const TODAY = new Date().toISOString().slice(0, 10);

// Nota: estos KPIs se calculan en el front a partir de /shifts, /services
// y /employees. Si el volumen de turnos crece, conviene mover este cálculo
// a un endpoint propio del backend (ej. GET /dashboard/summary) para no
// traer todos los turnos al cliente solo para contarlos.
export function DashboardPage() {
  const { data: shifts, isLoading: loadingShifts } = useShifts();
  const { data: services, isLoading: loadingServices } = useServices();
  const { data: employees, isLoading: loadingEmployees } = useEmployees();

  const todayShifts = useMemo(
    () => shifts?.filter((s) => s.date === TODAY && s.status !== "CANCELLED") ?? [],
    [shifts]
  );
  const upcomingShifts = useMemo(
    () => shifts?.filter((s) => s.date > TODAY && s.status !== "CANCELLED") ?? [],
    [shifts]
  );
  const uniqueClients = useMemo(
    () => new Set(shifts?.map((s) => s.clientEmail)).size,
    [shifts]
  );

  const isLoading = loadingShifts || loadingServices || loadingEmployees;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const stats = [
    { label: "Turnos de hoy", value: todayShifts.length },
    { label: "Próximos turnos", value: upcomingShifts.length },
    { label: "Empleados", value: employees?.length ?? 0 },
    { label: "Servicios", value: services?.length ?? 0 },
    { label: "Clientes", value: uniqueClients },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Resumen</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Turnos de hoy</h2>
      {todayShifts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tenés turnos para hoy.</p>
      ) : (
        <div className="space-y-2">
          {todayShifts.map((shift) => (
            <Card key={shift.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{shift.clientName}</p>
                <p className="text-sm text-muted-foreground">{shift.startTime}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
