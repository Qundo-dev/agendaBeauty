import { QueryClient } from "@tanstack/react-query";

/**
 * Configuración global de React Query.
 *
 * staleTime: cuánto tiempo se considera "fresca" la data antes de
 * volver a pedirla al backend al re-montar un componente. 30s es un
 * buen default para un dashboard (evita refetch agresivo, pero no
 * muestra datos muy viejos).
 *
 * retry: 1 reintento ante error de red, no más (evita esperas largas
 * en pantallas de usuario final, como la página de reserva).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
