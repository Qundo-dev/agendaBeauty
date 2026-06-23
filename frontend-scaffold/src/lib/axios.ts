import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * Instancia central de Axios.
 *
 * Por qué una instancia (y no axios.get directo en cada componente):
 * - Un solo lugar para baseURL, headers y manejo de errores.
 * - Interceptors: código que corre automáticamente ANTES de cada request
 *   (para inyectar el token) y DESPUÉS de cada response (para manejar 401).
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  withCredentials: false,
});

const TOKEN_KEY = "accessToken";

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// REQUEST interceptor: en cada request saliente, si hay token guardado,
// lo agrega como header Authorization: Bearer <token>.
// Esto evita tener que pasar el token a mano en cada llamada a la API.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE interceptor: si el backend responde 401 (token vencido/inválido),
// limpiamos el token y mandamos al usuario al login.
// Esto centraliza la lógica de "sesión expirada" en un solo lugar.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAccessToken();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
