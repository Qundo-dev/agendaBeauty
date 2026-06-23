import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "@/api/auth.api";
import { getAccessToken, setAccessToken, clearAccessToken } from "@/lib/axios";
import { User, LoginPayload, RegisterPayload } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean; // true mientras se valida el token al cargar la app
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Por qué Context y no React Query para el usuario logueado:
 * El usuario autenticado es "estado de cliente" que necesita TODA la app
 * (rutas protegidas, sidebar, etc.) de forma síncrona. React Query es
 * mejor para datos del servidor que se piden por pantalla (servicios,
 * turnos, etc.) y que conviene cachear/invalidar de forma granular.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar la app: si hay un token guardado, lo validamos pidiendo
  // el perfil (/auth/me). Esto permite mantener la sesión al refrescar
  // la página, sin guardar el objeto `user` completo en localStorage.
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => clearAccessToken())
      .finally(() => setIsLoading(false));
  }, []);

  async function login(payload: LoginPayload) {
    const response = await authApi.login(payload);
    setAccessToken(response.accessToken);
    setUser(response.user);
  }

  async function register(payload: RegisterPayload) {
    const response = await authApi.register(payload);
    setAccessToken(response.accessToken);
    setUser(response.user);
  }

  function logout() {
    clearAccessToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de <AuthProvider>");
  return ctx;
}
