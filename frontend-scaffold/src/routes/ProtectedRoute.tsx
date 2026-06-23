import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Envuelve las rutas privadas (dashboard). Si no hay usuario, redirige a /login.
// <Outlet /> renderiza la ruta hija que matchee (DashboardPage, ServicesPage, etc).
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
