import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyBusiness } from "@/hooks/useBusiness";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Scissors,
  Users,
  CalendarClock,
  CalendarDays,
  CreditCard,
  Store,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Resumen", icon: LayoutDashboard, end: true },
  { to: "/dashboard/shifts", label: "Turnos", icon: CalendarDays },
  { to: "/dashboard/services", label: "Servicios", icon: Scissors },
  { to: "/dashboard/employees", label: "Empleados", icon: Users },
  { to: "/dashboard/availability", label: "Disponibilidad", icon: CalendarClock },
  { to: "/dashboard/subscription", label: "Suscripción", icon: CreditCard },
  { to: "/dashboard/profile", label: "Mi negocio", icon: Store },
];

// Layout del panel privado: sidebar fija + contenido. Todas las páginas
// privadas (ServicesPage, ShiftsPage, etc.) se renderizan dentro del <Outlet />.
export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { data: business } = useMyBusiness();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="flex w-64 flex-col border-r border-border bg-background">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="truncate font-semibold">
            {business?.name ?? "Mi negocio"}
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-2 truncate px-3 text-xs text-muted-foreground">
            {user?.email}
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
