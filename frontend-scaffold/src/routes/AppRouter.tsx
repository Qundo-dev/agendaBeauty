import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { PublicLayout } from "@/layouts/PublicLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { LandingPage } from "@/pages/public/LandingPage";
import { LoginPage } from "@/pages/public/LoginPage";
import { RegisterPage } from "@/pages/public/RegisterPage";
import { BookingPage } from "@/pages/public/BookingPage";

import { DashboardPage } from "@/pages/private/DashboardPage";
import { ServicesPage } from "@/pages/private/ServicesPage";
import { EmployeesPage } from "@/pages/private/EmployeesPage";
import { AvailabilityPage } from "@/pages/private/AvailabilityPage";
import { ShiftsPage } from "@/pages/private/ShiftsPage";
import { SubscriptionPage } from "@/pages/private/SubscriptionPage";
import { ProfilePage } from "@/pages/private/ProfilePage";

/**
 * Mapa de rutas de toda la app. Tres grupos:
 * 1. Públicas "libres": landing y /agenda/:slug (cualquiera puede entrar)
 * 2. Públicas "solo si no estás logueado": login/register
 * 3. Privadas: todo el dashboard, protegido por ProtectedRoute
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agenda/:businessSlug" element={<BookingPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/services" element={<ServicesPage />} />
          <Route path="/dashboard/employees" element={<EmployeesPage />} />
          <Route path="/dashboard/availability" element={<AvailabilityPage />} />
          <Route path="/dashboard/shifts" element={<ShiftsPage />} />
          <Route path="/dashboard/subscription" element={<SubscriptionPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
