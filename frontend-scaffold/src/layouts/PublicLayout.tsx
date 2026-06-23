import { Outlet } from "react-router-dom";

// Layout para landing, login, register y la página de reserva.
// Simple a propósito: el header/footer reales los vas a definir cuando
// trabajes el diseño visual de la landing.
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}
