import { useAuthContext } from "@/context/AuthContext";

// Wrapper fino sobre el context. Existe para que en los componentes
// siempre importes "hooks/useAuth" (consistencia), aunque por ahora
// solo delegue al context.
export function useAuth() {
  return useAuthContext();
}
