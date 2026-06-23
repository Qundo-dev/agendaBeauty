import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Para /login y /register: si ya hay un usuario logueado, lo mandamos
// directo al dashboard en vez de mostrarle el form de login otra vez.
export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
